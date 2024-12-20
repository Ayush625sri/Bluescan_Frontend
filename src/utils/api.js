// utils/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const pollutionAPI = {
  uploadImage: (formData) => api.post('/images/upload', formData),
  getAnalysis: (imageId) => api.get(`/analysis/${imageId}`),
  getPollutionData: (params) => api.get('/pollution-data', { params }),
  getHotspots: () => api.get('/hotspots'),
  exportReport: (format, data) => api.post(`/export/${format}`, data),
};

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  logout: () => api.post('/auth/logout'),
  resetPassword: (email) => api.post('/auth/reset-password', { email }),
  verifyToken: () => api.get('/auth/verify-token'),
};

export default api;