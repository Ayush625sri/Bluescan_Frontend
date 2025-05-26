import axios from 'axios';
import EventEmitter from 'events';
export const eventEmitter = new EventEmitter();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
console.log(import.meta.env.VITE_API_BASE_URL)
// Constants
const AUTH_ERRORS = {
  UNAUTHORIZED: {
    HEADER: 'Session Expired',
    TEXT: 'Your session has expired. Please login again.'
  },
  ACCESS_DENIED: {
    HEADER: 'Access Denied',
    TEXT: 'You do not have permission to access this resource.'
  }
};

// Basic helper functions
const getAuthToken = () => {
  const token = localStorage.getItem("token");
  return token;
};

const getLogiToken = () => {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData)["logiToken"] : "";
};

// Create config object for requests
const createRequestConfig = (method, authRequired, logiRequired, socketId = null, params = null, responseType = 'json', contentType = 'application/json') => {
  const token = getAuthToken();
  const logiToken = logiRequired ? getLogiToken() : '';
  const authToken = authRequired ? `Bearer ${token}` : '';
  const socketValue = socketId ? { 'socket_id': token + '_' + socketId } : {};

  return {
    method,
    headers: {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Authorization': authToken,
      'logi_token': logiToken,
      'ngrok-skip-browser-warning': 'true',
      ...socketValue
    },
    params,
    responseType
  };
};

// Handle API errors
const handleApiError = (error, activeTab) => {
  if (error.response) {
    if (error.response.status === 401) {
      eventEmitter.emit(
        "showErrorPopup",
        AUTH_ERRORS.UNAUTHORIZED.HEADER,
        AUTH_ERRORS.UNAUTHORIZED.TEXT,
        true,
        "OK",
        activeTab
      );
    } else if (error.response.status === 403) {
      eventEmitter.emit(
        "showErrorPopup",
        AUTH_ERRORS.ACCESS_DENIED.HEADER,
        AUTH_ERRORS.ACCESS_DENIED.TEXT,
        true,
        "OK",
        activeTab
      );
    }
  }
  throw error;
};

// Create an axios instance with the base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
});

// Main API request functions
/**
 * Make a GET request
 * @param {string} url - The API endpoint
 * @param {Object} options - Request options
 * @param {string} options.params - URL params to append
 * @param {boolean} options.auth - Whether auth is required
 * @param {boolean} options.logi - Whether logi token is required
 * @param {Object} options.queryParams - Query parameters
 * @param {string} options.activeTab - Current active tab
 * @param {string} options.responseType - Response type (json, blob, etc)
 */
export const apiGet = async ({
  url,
  params = '',
  auth = true,
  logi = false,
  queryParams = null,
  activeTab = null,
  responseType = 'json'
}) => {
  const fullUrl = params ? `${url}${params}` : url;
  const config = createRequestConfig('get', auth, logi, null, queryParams, responseType);

  try {
    // Use the apiClient with the base URL
    const response = await apiClient.get(fullUrl, config);
    return response;
  } catch (error) {
    return handleApiError(error, activeTab);
  }
};

/**
 * Make a POST request
 * @param {string} url - The API endpoint
 * @param {Object} payload - Request body
 * @param {Object} options - Request options
 */
export const apiPost = async ({
  url,
  payload,
  params = '',
  auth = true,
  logi = false,
  socketId = null,
  socketHeaders = false,
  activeTab = null,
  signal = null
}) => {
  const fullUrl = params ? `${url}${params}` : url;
  const config = createRequestConfig('post', auth, logi, socketId, params);

  // Add socket headers if needed
  if (socketHeaders && typeof userId !== 'undefined') {
    config.headers.client_id = userId;
  }

  // Add abort signal if provided
  if (signal) {
    config.signal = signal;
  }

  try {
    // Use the apiClient with the base URL
    const response = await apiClient.post(fullUrl, payload, config);
    return response;
  } catch (error) {
    return handleApiError(error, activeTab);
  }
};

/**
 * Make a PUT request
 * @param {string} url - The API endpoint
 * @param {Object} payload - Request body
 * @param {Object} options - Request options
 */
export const apiPut = async ({
  url,
  payload,
  params = '',
  auth = true,
  logi = false,
  socketId = null,
  activeTab = null
}) => {
  const fullUrl = params ? `${url}${params}` : url;
  const config = createRequestConfig('put', auth, logi, socketId);

  try {
    // Use the apiClient with the base URL
    const response = await apiClient.put(fullUrl, payload, config);
    return response;
  } catch (error) {
    return handleApiError(error, activeTab);
  }
};

/**
 * Make a DELETE request
 * @param {string} url - The API endpoint
 * @param {Object} options - Request options
 */
export const apiDelete = async ({
  url,
  payload = null,
  params = '',
  auth = true,
  activeTab = null
}) => {
  const fullUrl = params ? `${url}${params}` : url;
  const config = createRequestConfig('delete', auth, false);

  if (payload) {
    config.data = payload;
  }

  try {
    // Use the apiClient with the base URL
    const response = await apiClient.delete(fullUrl, config);
    return response;
  } catch (error) {
    return handleApiError(error, activeTab);
  }
};

/**
 * Make a PATCH request
 * @param {string} url - The API endpoint
 * @param {Object} payload - Request body
 * @param {Object} options - Request options
 */
export const apiPatch = async ({
  url,
  payload,
  params = '',
  auth = true,
  socketId = null,
  activeTab = null
}) => {
  const fullUrl = params ? `${url}${params}` : url;
  const config = createRequestConfig('patch', auth, false, socketId);

  try {
    // Use the apiClient with the base URL
    const response = await apiClient.patch(fullUrl, payload, config);
    return response;
  } catch (error) {
    return handleApiError(error, activeTab);
  }
};

/**
 * Download blob/file data
 * @param {string} url - The API endpoint
 * @param {Object} options - Request options
 */
export const apiGetBlob = async ({
  url,
  params = '',
  auth = true,
  logi = false,
  queryParams = null,
  activeTab = null,
  contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
}) => {
  const fullUrl = params ? `${url}${params}` : url;
  const config = createRequestConfig('get', auth, logi, null, queryParams, 'blob', contentType);

  try {
    // Use the apiClient with the base URL
    const response = await apiClient.get(fullUrl, config);
    return response;
  } catch (error) {
    return handleApiError(error, activeTab);
  }
};

/**
 * Stream data from the API
 * @param {string} url - The API endpoint
 * @param {Object} options - Request options
 */
export const apiStream = async ({
  url,
  params = '',
  method = 'GET',
  auth = true,
  logi = false,
  queryParams = null,
  contentType = 'application/pdf'
}) => {
  const fullUrl = `${API_BASE_URL}${url}${params ? params : ''}`;
  const token = getAuthToken();
  const logiToken = logi ? getLogiToken() : '';
  const authToken = auth ? `Bearer ${token}` : '';

  const headers = {
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*',
    'Authorization': authToken,
    'logi_token': logiToken
  };

  return await fetch(fullUrl, {
    method,
    headers,
    params: queryParams
  });
};

// Authentication specific API functions
export const authApi = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   */
  register: (userData) => {
    return apiPost({
      url: '/auth/register', // Note: removed duplicate /api/v1 since it's in the base URL
      payload: userData,
      auth: false
    });
  },

  /**
   * Login a user
   * @param {Object} credentials - User login credentials
   */
  login: (credentials) => {
    // Convert to form-urlencoded format for OAuth compliance
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    return apiClient.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  },

  /**
   * Verify email with token
   * @param {string} token - Email verification token
   */
  verifyEmail: (token) => {
    return apiGet({
      url: `/auth/verify-email`,
      params: `?token=${token}`,  // Send token as URL parameter
      auth: false
    });
  },

  /**
   * Request password reset
   * @param {string} email - User email
   */
  forgotPassword: (email) => {
    return apiPost({
      url: '/auth/forgot-password', // Fixed path
      payload: { email },
      auth: false
    });
  },

  /**
   * Reset password with token
   * @param {string} token - Password reset token
   * @param {string} newPassword - New password
   */
  resetPassword: (token, newPassword) => {
    return apiPost({
      url: '/auth/reset-password', // Fixed path
      payload: { token, new_password: newPassword },
      auth: false
    });
  },

  /**
   * Handle Google OAuth login
   * @param {string} googleToken - Token from Google Auth
   */
  googleLogin: (googleToken) => {
    return apiPost({
      url: '/auth/google', // Fixed path
      payload: { token: googleToken },
      params: `?token=${googleToken}`,
      auth: false
    });
  },

  /**
   * Get user profile info
   */
  getProfile: () => {
    return apiGet({
      url: '/auth/me', // Fixed path
      auth: true
    });
  },

  /**
   * Logout user
   */
  logout: () => {
    return apiPost({
      url: '/auth/logout',
      auth: true
    });
  },

  /**
   * Resend verification email
   * @param {string} email - User email
   */
  resendVerification: (email) => {
    return apiPost({
      url: '/auth/resend-verification',
      payload: { email },
      auth: false
    });
  }
};

// Add to your api.js file

export const sessionApi = {
  /**
   * Get active and recent sessions
   */
  getActiveSessions: () => {
    return apiGet({
      url: '/session/active',
      auth: true
    });
  },

  /**
   * Request a new session with a device
   * @param {string} deviceId - Target device ID
   */
  requestSession: (deviceId) => {
    return apiPost({
      url: '/session/request',
      payload: { device_id: deviceId },
      auth: true
    });
  },

  /**
   * Respond to a session request
   * @param {string} sessionId - Session ID
   * @param {boolean} accepted - Whether the request was accepted
   */
  respondToSession: (sessionId, accepted) => {
    return apiPost({
      url: '/session/respond',
      payload: { session_id: sessionId, accepted },
      auth: true
    });
  },

  /**
   * End an active session
   * @param {string} sessionId - Session ID
   */
  endSession: (sessionId) => {
    return apiPost({
      url: `/session/${sessionId}/end`,
      auth: true
    });
  },

  /**
   * Upload an image from a session
   * @param {string} sessionId - Session ID
   * @param {File} imageFile - Image file to upload
   */
  uploadSessionImage: (sessionId, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    return apiPost({
      url: `/session/${sessionId}/images`,
      payload: formData,
      auth: true,
      contentType: 'multipart/form-data'
    });
  },

  /**
   * Get session images
   * @param {string} sessionId - Session ID
   */
  getSessionImages: (sessionId) => {
    return apiGet({
      url: `/session/${sessionId}/images`,
      auth: true
    });
  }
};

// Helper functions
export function createGuid() {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
}
