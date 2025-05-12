import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Validate token and get user data
          const response = await authApi.getProfile();
          setUser(response.data.user);
        }
      } catch (error) {
        // Clear invalid token
        localStorage.removeItem('token');
        setError('Session expired. Please login again.');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (credentials, navigate) => {
    setLoading(true);
    try {
      console.log("Attempting login with:", credentials.email);
      const response = await authApi.login(credentials);
      console.log("Login response:", response.data);
      
      // Store token
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('token_type', response.data.token_type);
      
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
        navigate('/dashboard');
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
     
      toast.success('Successfully logged out!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout. You were still logged out locally.');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiration');
      localStorage.removeItem('userData');
      localStorage.removeItem('token_type');
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
    isTokenExpired
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