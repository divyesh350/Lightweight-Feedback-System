import { create } from 'zustand';
import * as peerFeedbackApi from '../api/peerFeedbackApi';

export const usePeerFeedbackStore = create((set, get) => ({
  feedbackGiven: [],
  feedbackReceived: [],
  loading: {
    given: false,
    received: false,
    submitting: false,
  },
  error: null,

  // Load feedback given by the current user
  loadFeedbackGiven: async () => {
    set({ loading: { ...get().loading, given: true }, error: null });
    try {
      const { data } = await peerFeedbackApi.getPeerFeedbackGiven();
      set({ feedbackGiven: data, loading: { ...get().loading, given: false } });
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Failed to load feedback given',
        loading: { ...get().loading, given: false },
      });
    }
  },

  // Load feedback received by the current user
  loadFeedbackReceived: async () => {
    set({ loading: { ...get().loading, received: true }, error: null });
    try {
      const { data } = await peerFeedbackApi.getPeerFeedbackReceived();
      set({ feedbackReceived: data, loading: { ...get().loading, received: false } });
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Failed to load feedback received',
        loading: { ...get().loading, received: false },
      });
    }
  },

  // Submit new peer feedback
  submitPeerFeedback: async (payload) => {
    set({ loading: { ...get().loading, submitting: true }, error: null });
    try {
      const { data } = await peerFeedbackApi.submitPeerFeedback(payload);
      // Optionally, refresh feedback given after submission
      await get().loadFeedbackGiven();
      set({ loading: { ...get().loading, submitting: false } });
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Failed to submit peer feedback',
        loading: { ...get().loading, submitting: false },
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
})); 