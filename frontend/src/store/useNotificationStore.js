import { create } from 'zustand';
import * as notificationApi from '../api/notificationApi';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  loading: false,
  error: null,

  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await notificationApi.getNotifications();
      set({ notifications: data, loading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Failed to fetch notifications', 
        loading: false 
      });
    }
  },

  markAsRead: async (id) => {
    try {
      await notificationApi.markNotificationRead(id);
      // Update local state instead of re-fetching for a faster UI update
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      }));
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Failed to mark notification as read'
      });
    }
  },

  clearAll: async () => {
    try {
      await notificationApi.clearAllNotifications();
      set({ notifications: [] });
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Failed to clear notifications'
      });
    }
  },

  getUnreadCount: () => {
    return get().notifications.filter(n => !n.read).length;
  }
})); 