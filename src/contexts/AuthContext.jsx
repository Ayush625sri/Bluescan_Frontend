import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionConnection, setSessionConnection] = useState(null);
  const [sessionState, setSessionState] = useState({
    active: false,
    devices: [],
    pendingRequests: []
  });
  const [webSocketState, setWebSocketState] = useState({
    connected: false,
    reconnecting: false,
    reconnectAttempts: 0
  });



useEffect(() => {
  const checkAuthStatus = async () => {
    console.log("Running useEffect");
    try {
      setLoading(true);
      
      // Try to get token from localStorage first
      let token = localStorage.getItem('token');
      
      // If not in localStorage, try to get from cookie
      if (!token) {
        token = getCookieToken();
        
        // If found in cookie but not in localStorage, restore it
        if (token) {
          localStorage.setItem('token', token);
        }
      }
      
      console.log("token:", token);
      
      if (!token) {
        // No token found anywhere
        setUser(null);
        setLoading(false);
        return;
      }
      
      try {
        // Validate token and get user data
        const response = await authApi.getProfile();
        
        if (response.data && response.data.user) {
          setUser(response.data.user);
          
          // Ensure cookie is set (in case it was only in localStorage)
          setCookieToken(token);
        } else {
          // Invalid response structure
          clearAuthData();
          setUser(null);
        }
      } catch (error) {
        console.error("Auth verification error:", error);
        
        // Check if it's an authentication error
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          clearAuthData();
          setError('Session expired. Please login again.');
        }
        
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };
  
  checkAuthStatus();
}, []);

// Function to get token from cookie
const getCookieToken = () => {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    // Check if this cookie is our auth token
    if (cookie.startsWith('auth_token=')) {
      return cookie.substring('auth_token='.length, cookie.length);
    }
  }
  return null;
};

// Function to clear all auth data
const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userData');
  localStorage.removeItem('token_type');
  document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

  const login = async (credentials, navigate) => {
    setLoading(true);
    try {
      console.log("Attempting login with:", credentials.email);
      localStorage.removeItem('bluescan_session_data')
      const response = await authApi.login(credentials);
      console.log("Login response:", response.data);

      // Store token in localStorage
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('token_type', response.data.token_type);

      // Also set a cookie for better persistence
      setCookieToken(response.data.access_token);

      // Now fetch the user profile
      const userResponse = await authApi.getProfile();
      console.log("User profile response:", userResponse.data);

      // Store userData with token
      const userData = {
        ...userResponse.data,
        _token: response.data.access_token
      };

      localStorage.setItem('userData', JSON.stringify(userData));

      // Set user from the profile response
      setUser(userResponse.data);

      // Show success toast
      toast.success('Successfully logged in!');

      // Redirect to dashboard after successful login
      if (navigate) {
        console.log("Navigating to dashboard");
        navigate('/sessions');
      }

      return userResponse.data;
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.detail || 'Login failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Function to set token in cookie
  const setCookieToken = (token) => {
    // Set cookie to expire in 7 days (or match your token expiration)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);

    // Set the cookie with path and expiration
    document.cookie = `auth_token=${token}; path=/; expires=${expirationDate.toUTCString()}; SameSite=Lax`;
  };

  // Signup function
  const signup = async (userData, navigate) => {
    setLoading(true);
    try {
      const response = await authApi.register(userData);

      // Store email for verification page
      localStorage.setItem('pendingVerificationEmail', userData.email);

      // Show success toast
      toast.success('Registration successful! Please verify your email.');

      // Redirect to verification required page
      if (navigate) {
        navigate('/verification-required');
      }

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Registration failed. Please try again.';
      setError(errorMessage);

      // Show error toast
      toast.error(errorMessage);

      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Google login function
  const googleLogin = async (token, navigate) => {
    setLoading(true);
    try {
      const response = await authApi.googleLogin(token);

      // Store token
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('token_type', response.data.token_type);

      // Get user profile
      const userResponse = await authApi.getProfile();

      // Store user data
      const userData = {
        ...userResponse.data,
        _token: response.data.access_token
      };

      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userResponse.data);

      toast.success('Successfully logged in with Google!');

      if (navigate) {
        navigate('/dashboard');
      }

      return userResponse.data;
    } catch (error) {
      console.error("Google login error:", error);
      const errorMessage = error.response?.data?.detail || 'Google login failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  // Logout function
const logout = async (navigate) => {
  try {
    // Your existing logout API call if any
    toast.success('Successfully logged out!');
  } catch (error) {
    console.error('Logout error:', error);
    toast.error('Error during logout. You were still logged out locally.');
  } finally {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('userData');
    localStorage.removeItem('token_type');
    
    // Clear the cookie
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    setUser(null);
    
    // Redirect to login page
    if (navigate) {
      navigate('/login');
    }
  }
};
  // Check if token is expired
  const isTokenExpired = () => {
    const expiration = localStorage.getItem('tokenExpiration');
    if (!expiration) return false;

    return new Date(expiration) <= new Date();
  };

  const establishSessionConnection = (userId, token) => {
    try {
      const wsUrl = `ws://localhost:5000/api/v1/session/ws/${userId}?token=${token}`;
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log('WebSocket connection established');
        // Send device info
        const deviceInfo = {
          device_name: `Web Browser (${navigator.userAgent.split(' ')[0]})`,
          device_type: 'web',
          device_id: generateDeviceId()
        };
        socket.send(JSON.stringify(deviceInfo));
        setSessionState(prev => ({ ...prev, active: true }));
      };

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleWebSocketMessage(message);
      };

      socket.onclose = () => {
        console.log('WebSocket connection closed');
        setSessionState(prev => ({ ...prev, active: false }));
      };

      setSessionConnection(socket);
    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
    }
  };

  const establishWebSocketConnection = (userId) => {
    const token = localStorage.getItem('token');
    if (!token || !userId) return;

    // Close existing connection if any
    if (sessionConnection) {
      sessionConnection.close();
    }

    try {
      const wsUrl = `ws://localhost:5000/api/v1/session/ws/${userId}?token=${token}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connection established');
        setWebSocketState({
          connected: true,
          reconnecting: false,
          reconnectAttempts: 0
        });

        // Send device info
        sendDeviceInfo(ws);
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed', event.code, event.reason);
        setWebSocketState(prev => ({
          connected: false,
          reconnecting: true,
          reconnectAttempts: prev.reconnectAttempts + 1
        }));

        // Attempt to reconnect if not a clean close
        if (event.code !== 1000) {
          setTimeout(() => {
            if (user) {
              establishWebSocketConnection(user.id);
            }
          }, 3000);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleWebSocketMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      setSessionConnection(ws);
    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
    }
  };

  // Send device info when connection is established
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

  // Handle incoming WebSocket messages
  const handleWebSocketMessage = (message) => {
    switch (message.type) {
      case 'session_request':
        // Handle incoming session request
        setSessionState(prev => ({
          ...prev,
          pendingRequests: [...prev.pendingRequests, message]
        }));
        // Show notification to user
        toast.custom((t) => (
          <div className="bg-white p-4 shadow-lg rounded-lg">
            <h3 className="font-bold">New Session Request</h3>
            <p>Mobile device is requesting a live session</p>
            <div className="mt-2 flex space-x-2">
              <button
                className="px-3 py-1 bg-green-500 text-white rounded"
                onClick={() => respondToSessionRequest(message.session_id, true)}
              >
                Accept
              </button>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded"
                onClick={() => respondToSessionRequest(message.session_id, false)}
              >
                Reject
              </button>
            </div>
          </div>
        ));
        break;

      case 'devices_list':
        // Update list of linked devices
        setSessionState(prev => ({
          ...prev,
          devices: message.devices
        }));
        break;

      case 'webrtc_signal':
        // Handle WebRTC signaling
        if (message.signal_type === 'offer') {
          // Process offer and create answer
          handleWebRTCOffer(message);
        } else if (message.signal_type === 'ice_candidate') {
          // Add ICE candidate
          addIceCandidate(message.signal);
        }
        break;

      default:
        console.log('Unhandled message type:', message.type);
    }
  };

  // Generate a unique device ID or retrieve existing one
  const generateDeviceId = () => {
    const storedId = localStorage.getItem('device_id');
    if (storedId) return storedId;

    const newId = 'web_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('device_id', newId);
    return newId;
  };

  // Auth context value
  const value = {
    user,
    loading,
    error,
    login,
    signup,
    googleLogin,
    logout,
    isAuthenticated: !!user,
    isTokenExpired,
    sessionState,
    establishSessionConnection,
    requestSession: (userId) => {
      if (!sessionConnection) return;

      sessionConnection.send(JSON.stringify({
        type: 'session_request',
        target_user_id: userId
      }));
    },
    respondToSessionRequest: (sessionId, accepted) => {
      if (!sessionConnection) return;

      sessionConnection.send(JSON.stringify({
        type: 'session_response',
        session_id: sessionId,
        accepted
      }));

      // Remove from pending requests
      setSessionState(prev => ({
        ...prev,
        pendingRequests: prev.pendingRequests.filter(req => req.session_id !== sessionId)
      }));
    },
    endSession: (sessionId) => {
      if (!sessionConnection) return;

      sessionConnection.send(JSON.stringify({
        type: 'end_session',
        session_id: sessionId
      }));
    }
  };


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );

};

// Hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

