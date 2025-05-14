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
  const reconnectTimeoutRef = useRef(null);
  
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
      type: 'device_info',
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
        case 'devices_list':
          setActiveDevices(message.devices || []);
          break;
          
        case 'session_request':
          // Add to pending requests
          setPendingRequests(prev => [...prev, message]);
          
          // Show toast notification
          toast.custom((t) => (
            <div className="bg-white shadow-lg rounded-lg p-4 max-w-sm">
              <h3 className="font-bold mb-2">New Session Request</h3>
              <p className="text-gray-600 mb-3">
                {message.device_name || 'A device'} is requesting a live session
              </p>
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={() => {
                    respondToSession(message.session_id, false);
                    toast.dismiss(t.id);
                  }}
                  className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                >
                  Decline
                </button>
                <button 
                  onClick={() => {
                    respondToSession(message.session_id, true);
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
          // Notify that session was accepted
          toast.success('Session request accepted');
          
          // Initialize WebRTC connection
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
          // Process offer and create answer
          const answer = await webrtcService.processOffer(message.signal);
          sendWebRTCSignal('answer', message.session_id, message.sender_id, answer);
          break;
          
        case 'answer':
          // Process answer
          await webrtcService.processAnswer(message.signal);
          break;
          
        case 'ice_candidate':
          // Add ICE candidate
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
  
  // Initialize WebRTC for a session
  const initializeWebRTCSession = async (sessionId, targetUserId) => {
    try {
      // Initialize WebRTC service
      await webrtcService.initialize();
      
      // Set up callbacks
      webrtcService.setCallbacks({
        onIceCandidate: (candidate) => {
          sendWebRTCSignal('ice_candidate', sessionId, targetUserId, candidate);
        },
        onTrack: (stream) => {
          // Handle incoming stream (will be managed by the LiveSession component)
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
      
      // Get local media stream
      const localStream = await webrtcService.getUserMedia();
      
      // Create and send offer
      const offer = await webrtcService.createOffer();
      sendWebRTCSignal('offer', sessionId, targetUserId, offer);
      
      // Set active session
      setActiveSession({
        id: sessionId,
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
      
      // The session will be established when the other device accepts
      return response.data;
    } catch (error) {
      console.error('Failed to request session:', error);
      toast.error('Failed to request session');
      throw error;
    }
  };
  
  // Respond to a session request
  const respondToSession = async (sessionId, accepted) => {
    try {
      await sessionApi.respondToSession(sessionId, accepted);
      
      // Remove from pending requests
      setPendingRequests(prev => prev.filter(req => req.session_id !== sessionId));
      
      if (accepted) {
        // Session will be initialized when WebRTC signals are exchanged
        toast.success('Session accepted');
      } else {
        toast.info('Session declined');
      }
    } catch (error) {
      console.error('Failed to respond to session:', error);
      toast.error('Failed to process session response');
      throw error;
    }
  };
  
  // End current session
  const endCurrentSession = async () => {
    try {
      if (activeSession) {
        // Notify server
        await sessionApi.endSession(activeSession.id);
        
        // Clean up WebRTC
        webrtcService.disconnect();
        
        // Update state
        setActiveSession(null);
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
      // Disconnect if user logs out
      if (webSocket) {
        webSocket.close();
        setWebSocket(null);
        setConnected(false);
      }
      
      // Clean up WebRTC
      webrtcService.disconnect();
      setActiveSession(null);
    }
    
    // Cleanup on unmount
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
  
  // Context value
  const value = {
    connected,
    activeDevices,
    pendingRequests,
    activeSession,
    requestSession,
    respondToSession,
    endSession: endCurrentSession,
    webrtcService
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