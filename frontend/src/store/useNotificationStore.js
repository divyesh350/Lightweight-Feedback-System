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
      // Refresh the notifications list
      await get().fetchNotifications();
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Failed to mark notification as read'
      });
    }
  },

  getUnreadCount: () => {
    return get().notifications.filter(n => !n.is_read).length;
  }
})); 