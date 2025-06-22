import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

/**
 * Handle unauthorized responses (401 errors)
 * This function clears auth data and redirects to home page
 */
export const handleUnauthorized = () => {
  const authStore = useAuthStore.getState();
  
  // Clear all auth data
  localStorage.removeItem('access_token');
  authStore.logout();
  
  // Show toast notification
  toast.error('Session expired. Please login again.');
  
  // Redirect to home page
  if (window.location.pathname !== '/') {
    window.location.href = '/';
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  return !!token;
};

/**
 * Get current auth token
 */
export const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

/**
 * Clear auth data without redirect
 */
export const clearAuthData = () => {
  localStorage.removeItem('access_token');
  const authStore = useAuthStore.getState();
  authStore.logout();
}; 