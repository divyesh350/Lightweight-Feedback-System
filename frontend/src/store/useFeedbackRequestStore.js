import { create } from 'zustand';
import * as requestApi from '../api/requestApi';
import * as teamApi from '../api/teamApi';

export const useFeedbackRequestStore = create((set, get) => ({
  // State
  requestsMade: [],
  requestsReceived: [],
  managers: [], // List of available managers to request feedback from
  loading: {
    requestsMade: false,
    requestsReceived: false,
    managers: false,
    submitting: false,
  },
  error: null,

  // Actions
  loadRequestsMade: async () => {
    set({ loading: { ...get().loading, requestsMade: true }, error: null });
    try {
      const { data } = await requestApi.getRequestsMade();
      set({ 
        requestsMade: data, 
        loading: { ...get().loading, requestsMade: false } 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Failed to load requests made',
        loading: { ...get().loading, requestsMade: false } 
      });
    }
  },

  loadRequestsReceived: async () => {
    set({ loading: { ...get().loading, requestsReceived: true }, error: null });
    try {
      const { data } = await requestApi.getRequestsReceived();
      set({ 
        requestsReceived: data, 
        loading: { ...get().loading, requestsReceived: false } 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Failed to load requests received',
        loading: { ...get().loading, requestsReceived: false } 
      });
    }
  },

  loadManagers: async () => {
    set({ loading: { ...get().loading, managers: true }, error: null });
    try {
      // Try to get managers from the API
      const { data } = await teamApi.getManagers();
      set({ 
        managers: data, 
        loading: { ...get().loading, managers: false } 
      });
    } catch (error) {
      // If the API doesn't exist yet, fall back to mock data
      console.warn('Managers API not available, using mock data:', error.message);
      const mockManagers = [
        { id: 1, name: 'Sarah Johnson', email: 'sarah.johnson@company.com', role: 'manager' },
        { id: 2, name: 'Michael Chen', email: 'michael.chen@company.com', role: 'manager' },
        { id: 3, name: 'Emily Davis', email: 'emily.davis@company.com', role: 'manager' },
      ];
      set({ 
        managers: mockManagers, 
        loading: { ...get().loading, managers: false } 
      });
    }
  },

  createRequest: async (requestData) => {
    set({ loading: { ...get().loading, submitting: true }, error: null });
    try {
      const { data } = await requestApi.requestFeedback(requestData);
      // Add the new request to the requests made list
      set(state => ({
        requestsMade: [data, ...state.requestsMade],
        loading: { ...state.loading, submitting: false }
      }));
      return data;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Failed to create feedback request',
        loading: { ...get().loading, submitting: false } 
      });
      throw error;
    }
  },

  updateRequestStatus: async (requestId, status) => {
    set({ loading: { ...get().loading, submitting: true }, error: null });
    try {
      await requestApi.updateRequestStatus(requestId, status);
      // Update the request in the received list
      set(state => ({
        requestsReceived: state.requestsReceived.map(req => 
          req.id === requestId ? { ...req, status } : req
        ),
        loading: { ...state.loading, submitting: false }
      }));
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Failed to update request status',
        loading: { ...get().loading, submitting: false } 
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
})); 