import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { isAuthenticated } from '../../utils/authUtils';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const navigate = useNavigate();
  const { user, role, loading } = useAuthStore();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate('/');
      return;
    }

    // If user data is not loaded yet, wait
    if (loading) {
      return;
    }

    // If user is not loaded but we have a token, try to fetch user data
    if (!user && isAuthenticated()) {
      // The fetchMe function will handle 401 errors automatically
      useAuthStore.getState().fetchMe();
      return;
    }

    // Check role requirement if specified
    if (requiredRole && role !== requiredRole) {
      navigate('/');
      return;
    }
  }, [navigate, user, role, loading, requiredRole]);

  // Show loading while checking authentication
  if (loading || (!user && isAuthenticated())) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, don't render children
  if (!isAuthenticated() || !user) {
    return null;
  }

  // If role is required and doesn't match, don't render children
  if (requiredRole && role !== requiredRole) {
    return null;
  }

  // Render children if all checks pass
  return <>{children}</>;
} 