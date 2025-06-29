import { create } from 'zustand';
import * as feedbackApi from '../api/feedbackApi';

export const useFeedbackStore = create((set) => ({
  feedbackList: [],
  loading: false,
  error: null,
  loadEmployeeFeedback: async () => {
    set({ loading: true });
    try {
      const { data } = await feedbackApi.getEmployeeFeedback();
      set({ feedbackList: data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.detail, loading: false });
    }
  },
  loadManagerFeedback: async () => {
    set({ loading: true });
    try {
      const { data } = await feedbackApi.getManagerFeedback();
      set({ feedbackList: data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.detail, loading: false });
    }
  },
  createFeedback: async (payload) => feedbackApi.createFeedback(payload),
  updateFeedback: async (id, payload) => feedbackApi.updateFeedback(id, payload),
  acknowledgeFeedback: async (id) => {
    try {
      await feedbackApi.acknowledgeFeedback(id);
      // Optimistically update the local state
      set((state) => ({
        feedbackList: state.feedbackList.map((fb) =>
          fb.id === id ? { ...fb, acknowledged: true } : fb
        ),
      }));
    } catch (error) {
      set({ error: error.response?.data?.detail });
    }
  },
  exportPDF: async () => feedbackApi.exportEmployeeFeedbackPDF(),
}));
