import axios from 'axios';
import { handleUnauthorized } from '../utils/authUtils';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://feedback-backend-system-production.up.railway.app/api',
});

instance.interceptors.request.use(config => {
  // Don't send token for login and register endpoints
  const isAuthEndpoint = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');
  
  if (!isAuthEndpoint) {
  const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return config;
});

// Response interceptor to handle 401 errors globally
instance.interceptors.response.use(
  (response) => {
    // If the request was successful, just return the response
    return response;
  },
  (error) => {
    // If we get a 401 Unauthorized error
    if (error.response?.status === 401) {
      // Handle unauthorized response
      handleUnauthorized();
    }
    
    // Always return the error so other error handlers can still process it
    return Promise.reject(error);
  }
);

export default instance;