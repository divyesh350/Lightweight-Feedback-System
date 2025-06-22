import { useEffect, useRef } from 'react';

export const useDashboardRefresh = (refreshFunction, intervalMs = 30000) => {
  const intervalRef = useRef(null);

  useEffect(() => {
    // Initial load
    refreshFunction();

    // Set up interval for automatic refresh
    intervalRef.current = setInterval(() => {
      refreshFunction();
    }, intervalMs);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshFunction, intervalMs]);

  // Function to manually refresh
  const manualRefresh = () => {
    refreshFunction();
  };

  // Function to stop auto-refresh
  const stopAutoRefresh = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Function to start auto-refresh
  const startAutoRefresh = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        refreshFunction();
      }, intervalMs);
    }
  };

  return {
    manualRefresh,
    stopAutoRefresh,
    startAutoRefresh,
  };
}; 