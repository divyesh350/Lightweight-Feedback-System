import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
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

export default instance;