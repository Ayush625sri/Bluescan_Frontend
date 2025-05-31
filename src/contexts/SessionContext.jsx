import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import webrtcService from '../utils/webrtcService';
import { sessionApi } from '../utils/api';
import toast from 'react-hot-toast';

const SessionContext = createContext(null);

export const SessionProvider = ({ children }) => {
  const { user } = useAuth();
  const [webSocket, setWebSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeDevices, setActiveDevices] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [activeSessions, setActiveSessions] = useState([]);
  const [endedSessions, setEndedSessions] = useState([]);
  const reconnectTimeoutRef = useRef(null);
  
  // Load session data from API
  const loadSessionData = async () => {
    try {
      const response = await sessionApi.getActiveSessions();
      const data = response.data;
      
      setPendingRequests(data.pending_requests || []);
      setActiveSessions(data.active_sessions || []);
      setEndedSessions(data.ended_sessions || []);
      
      // Set current active session if any
      if (data.active_sessions && data.active_sessions.length > 0) {
        setActiveSession(data.active_sessions[0]); // Take first active session
      }
    } catch (error) {
      console.error('Failed to load session data:', error);
    }
  };

  // WebSocket Connection Management
  const connectWebSocket = () => {
    if (!user || !user.id) return;
    
    const token = localStorage.getItem('token');
    if (!token) return;
    
    // Close existing connection
    if (webSocket) {
      webSocket.close();
    }
    
    const wsUrl = `ws://localhost:5000/api/v1/session/ws/${user.id}?token=${token}`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
      sendDeviceInfo(ws);
      loadSessionData(); // Load initial data
    };
    
    ws.onclose = (e) => {
      console.log('WebSocket closed:', e.code, e.reason);
      setConnected(false);
      
      // Attempt to reconnect
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      reconnectTimeoutRef.current = setTimeout(() => {
        connectWebSocket();
      }, 3000);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    ws.onmessage = (event) => {
      handleWebSocketMessage(event.data);
    };
    
    setWebSocket(ws);
  };
  
  const sendDeviceInfo = (ws) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    
    const deviceInfo = {
      device_name: `Web Browser (${navigator.userAgent.split(' ')[0]})`,
      device_type: 'web',
      device_id: generateDeviceId()
    };
    
    ws.send(JSON.stringify(deviceInfo));
  };
  
  const generateDeviceId = () => {
    const storedId = localStorage.getItem('device_id');
    if (storedId) return storedId;
    
    const newId = 'web_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('device_id', newId);
    return newId;
  };
  
  const handleWebSocketMessage = (data) => {
    try {
      const message = JSON.parse(data);
      
      switch (message.type) {
        case 'device_registered':
          console.log('Device registered successfully');
          break;
          
        case 'devices_list':
          setActiveDevices(message.devices || []);
          break;
          
        case 'session_request':
          // Add to pending requests with proper structure
          const newRequest = {
            request_id: message.request_id,
            session_id: message.session_id,
            from_user: {
              id: message.from_user_id,
              name: message.from_device_name || 'Unknown Device'
            },
            device_name: message.from_device_name,
            status: 'pending',
            created_at: new Date().toISOString()
          };
          
          setPendingRequests(prev => [...prev, newRequest]);
          
          // Show toast notification
          toast.custom((t) => (
            <div className="bg-white shadow-lg rounded-lg p-4 max-w-sm">
              <h3 className="font-bold mb-2">New Session Request</h3>
              <p className="text-gray-600 mb-3">
                {message.from_device_name || 'A device'} is requesting a live session
              </p>
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={() => {
                    respondToSession(message.request_id, false);
                    toast.dismiss(t.id);
                  }}
                  className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                >
                  Decline
                </button>
                <button 
                  onClick={() => {
                    respondToSession(message.request_id, true);
                    toast.dismiss(t.id);
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Accept
                </button>
              </div>
            </div>
          ), { duration: 10000 });
          break;
          
        case 'session_accepted':
          toast.success('Session request accepted');
          initializeWebRTCSession(message.session_id, message.target_user_id);
          break;
          
        case 'session_rejected':
          toast.error('Session request declined');
          break;
          
        case 'webrtc_signal':
          handleWebRTCSignal(message);
          break;
          
        case 'session_ended':
          endCurrentSession();
          toast.info('Session ended');
          break;
          
        default:
          console.log('Unhandled message type:', message.type);
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  };
  
  const handleWebRTCSignal = async (message) => {
    if (!activeSession) return;
    
    try {
      switch (message.signal_type) {
        case 'offer':
          const answer = await webrtcService.processOffer(message.signal);
          sendWebRTCSignal('answer', message.session_id, message.sender_id, answer);
          break;
          
        case 'answer':
          await webrtcService.processAnswer(message.signal);
          break;
          
        case 'ice_candidate':
          await webrtcService.addIceCandidate(message.signal);
          break;
          
        default:
          console.log('Unhandled signal type:', message.signal_type);
      }
    } catch (error) {
      console.error('Failed to handle WebRTC signal:', error);
    }
  };
  
  const sendWebRTCSignal = (signalType, sessionId, targetUserId, signal) => {
    if (!webSocket || webSocket.readyState !== WebSocket.OPEN) return;
    
    const message = {
      type: 'webrtc_signal',
      signal_type: signalType,
      session_id: sessionId,
      target_user_id: targetUserId,
      signal
    };
    
    webSocket.send(JSON.stringify(message));
  };
  
  const initializeWebRTCSession = async (sessionId, targetUserId) => {
    try {
      await webrtcService.initialize();
      
      webrtcService.setCallbacks({
        onIceCandidate: (candidate) => {
          sendWebRTCSignal('ice_candidate', sessionId, targetUserId, candidate);
        },
        onTrack: (stream) => {
          // Handle incoming stream
        },
        onDataChannelMessage: (data) => {
          // Handle incoming data channel messages
        },
        onConnectionStateChange: (state) => {
          console.log('WebRTC connection state:', state);
          if (state === 'disconnected' || state === 'failed' || state === 'closed') {
            endCurrentSession();
          }
        }
      });
      
      const localStream = await webrtcService.getUserMedia();
      const offer = await webrtcService.createOffer();
      sendWebRTCSignal('offer', sessionId, targetUserId, offer);
      
      setActiveSession({
        session_id: sessionId,
        targetUserId,
        startTime: new Date(),
        status: 'connecting'
      });
      
    } catch (error) {
      console.error('Failed to initialize WebRTC session:', error);
      toast.error('Failed to start video session');
    }
  };
  
  // Request a session with a device
  const requestSession = async (deviceId) => {
    try {
      const response = await sessionApi.requestSession(deviceId);
      toast.success('Session request sent');
      loadSessionData(); // Refresh data
      return response.data;
    } catch (error) {
      console.error('Failed to request session:', error);
      toast.error('Failed to request session');
      throw error;
    }
  };
  
  // Respond to a session request
  const respondToSession = async (requestId, accepted) => {
    try {
      await sessionApi.respondToSession(requestId, accepted);
      
      // Remove from pending requests
      setPendingRequests(prev => prev.filter(req => req.request_id !== requestId));
      
      if (accepted) {
        toast.success('Session accepted');
      } else {
        toast.info('Session declined');
      }
      
      loadSessionData(); // Refresh data
    } catch (error) {
      console.error('Failed to respond to session:', error);
      toast.error('Failed to process session response');
      throw error;
    }
  };
  
  // End current session
  const endCurrentSession = async (sessionId = null) => {
    try {
      const targetSessionId = sessionId || activeSession?.session_id;
      if (targetSessionId) {
        await sessionApi.endSession(targetSessionId);
        webrtcService.disconnect();
        
        if (!sessionId) {
          setActiveSession(null);
        }
        
        loadSessionData(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  };
  
  // Connect WebSocket when user changes
  useEffect(() => {
    if (user) {
      connectWebSocket();
    } else {
      if (webSocket) {
        webSocket.close();
        setWebSocket(null);
        setConnected(false);
      }
      
      webrtcService.disconnect();
      setActiveSession(null);
    }
    
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (webSocket) {
        webSocket.close();
      }
      
      webrtcService.disconnect();
    };
  }, [user]);
  
  const value = {
    connected,
    activeDevices,
    pendingRequests,
    activeSession,
    activeSessions,
    endedSessions,
    requestSession,
    respondToSession,
    endSession: endCurrentSession,
    webrtcService,
    loadSessionData
  };
  
  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};