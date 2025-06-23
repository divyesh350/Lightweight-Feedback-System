import { create } from 'zustand';
import * as dashboardApi from '../api/dashboardApi';
import * as feedbackApi from '../api/feedbackApi';

export const useManagerDashboardStore = create((set, get) => ({
  // State
  overview: null,
  sentimentTrends: [],
  teamMembers: [],
  recentFeedback: [],
  feedbackRequests: [],
  teamMemberStats: {},
  loading: {
    overview: false,
    trends: false,
    team: false,
    feedback: false,
    requests: false,
    memberStats: false,
  },
  error: null,

  // Clear error
  clearError: () => set({ error: null }),

  // Load manager overview data
  loadOverview: async () => {
    set({ loading: { ...get().loading, overview: true }, error: null });
    try {
      const { data } = await dashboardApi.getManagerOverview();
      set({ 
        overview: data, 
        loading: { ...get().loading, overview: false } 
      });
      return data;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Failed to load overview', 
        loading: { ...get().loading, overview: false } 
      });
      throw error;
    }
  },

  // Load sentiment trends
  loadSentimentTrends: async () => {
    set({ loading: { ...get().loading, trends: true }, error: null });
    try {
      const { data } = await dashboardApi.getManagerSentimentTrends();
      set({ 
        sentimentTrends: data, 
        loading: { ...get().loading, trends: false } 
      });
      return data;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Failed to load sentiment trends', 
        loading: { ...get().loading, trends: false } 
      });
      throw error;
    }
  },

  // Load team members
  loadTeamMembers: async () => {
    set({ loading: { ...get().loading, team: true }, error: null });
    try {
      const { data } = await dashboardApi.getTeamMembers();
      set({ 
        teamMembers: data, 
        loading: { ...get().loading, team: false } 
      });
      return data;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Failed to load team members', 
        loading: { ...get().loading, team: false } 
      });
      throw error;
    }
  },

  // Load stats for a specific team member
  loadTeamMemberStats: async (memberId) => {
    set({ loading: { ...get().loading, memberStats: true }, error: null });
    try {
      const { data } = await dashboardApi.getTeamMemberStats(memberId);
      set((state) => ({
        teamMemberStats: {
          ...state.teamMemberStats,
          [memberId]: data,
        },
        loading: { ...get().loading, memberStats: false },
      }));
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.detail || `Failed to load stats for member ${memberId}`,
        loading: { ...get().loading, memberStats: false },
      });
      throw error;
    }
  },

  // Load recent feedback
  loadRecentFeedback: async () => {
    set({ loading: { ...get().loading, feedback: true }, error: null });
    try {
      const { data } = await dashboardApi.getManagerFeedback();
      set({ 
        recentFeedback: data, 
        loading: { ...get().loading, feedback: false } 
      });
      return data;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Failed to load feedback', 
        loading: { ...get().loading, feedback: false } 
      });
      throw error;
    }
  },

  // Load feedback requests
  loadFeedbackRequests: async () => {
    set({ loading: { ...get().loading, requests: true }, error: null });
    try {
      const { data } = await dashboardApi.getFeedbackRequests();
      set({ 
        feedbackRequests: data, 
        loading: { ...get().loading, requests: false } 
      });
      return data;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Failed to load feedback requests', 
        loading: { ...get().loading, requests: false } 
      });
      throw error;
    }
  },

  // Update request status
  updateRequestStatus: async (requestId, status) => {
    try {
      const { data } = await dashboardApi.updateRequestStatus(requestId, status);
      // Refresh requests after update
      await get().loadFeedbackRequests();
      return data;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Failed to update request status' 
      });
      throw error;
    }
  },

  // Create new feedback
  createFeedback: async (payload) => {
    try {
      const { data } = await feedbackApi.createFeedback(payload);
      // Refresh feedback after creation
      await get().loadRecentFeedback();
      return data;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Failed to create feedback' 
      });
      throw error;
    }
  },

  // Update feedback
  updateFeedback: async (id, payload) => {
    try {
      const { data } = await feedbackApi.updateFeedback(id, payload);
      // Refresh feedback after update
      await get().loadRecentFeedback();
      return data;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Failed to update feedback' 
      });
      throw error;
    }
  },

  // Load all dashboard data
  loadAllDashboardData: async () => {
    try {
      await Promise.all([
        get().loadOverview(),
        get().loadSentimentTrends(),
        get().loadTeamMembers(),
        get().loadRecentFeedback(),
        get().loadFeedbackRequests(),
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  },

  // Get computed stats for dashboard
  getDashboardStats: () => {
    const { overview, recentFeedback, teamMembers, feedbackRequests } = get();
    
    if (!overview) return null;

    return {
      totalFeedback: overview.total_feedback || 0,
      positiveSentiment: overview.positive_percentage || 0,
      pendingReviews: Array.isArray(feedbackRequests) ? feedbackRequests.filter(req => req.status === 'pending').length : 0,
      teamMembers: Array.isArray(teamMembers) ? teamMembers.length : 0,
      recentFeedbackCount: Array.isArray(recentFeedback) ? recentFeedback.length : 0,
    };
  },

  // Get sentiment data for charts
  getSentimentData: () => {
    const { overview } = get();
    
    if (!overview) return [];

    return [
      { name: 'Positive', value: overview.positive_percentage || 0 },
      { name: 'Neutral', value: overview.neutral_percentage || 0 },
      { name: 'Negative', value: overview.negative_percentage || 0 },
    ];
  },
})); 