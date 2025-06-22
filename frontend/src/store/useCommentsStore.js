import { create } from 'zustand';
import * as commentsApi from '../api/commentsApi';

export const useCommentsStore = create((set, get) => ({
  // State
  comments: {}, // { feedbackId: [comments] }
  loading: {
    get: false,
    create: false,
  },
  error: null,

  // Clear error
  clearError: () => set({ error: null }),

  // Get comments for a specific feedback
  getComments: async (feedbackId) => {
    set({ loading: { ...get().loading, get: true }, error: null });
    try {
      const { data } = await commentsApi.getFeedbackComments(feedbackId);
      set({ 
        comments: { ...get().comments, [feedbackId]: data },
        loading: { ...get().loading, get: false } 
      });
      return data;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Failed to load comments', 
        loading: { ...get().loading, get: false } 
      });
      throw error;
    }
  },

  // Create a new comment
  createComment: async (feedbackId, content) => {
    set({ loading: { ...get().loading, create: true }, error: null });
    try {
      const { data } = await commentsApi.createFeedbackComment(feedbackId, content);
      // Add the new comment to the existing comments for this feedback
      const currentComments = get().comments[feedbackId] || [];
      set({ 
        comments: { 
          ...get().comments, 
          [feedbackId]: [...currentComments, data] 
        },
        loading: { ...get().loading, create: false } 
      });
      return data;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Failed to create comment', 
        loading: { ...get().loading, create: false } 
      });
      throw error;
    }
  },

  // Get comments for a specific feedback (from state)
  getCommentsForFeedback: (feedbackId) => {
    return get().comments[feedbackId] || [];
  },

  // Clear comments for a specific feedback
  clearCommentsForFeedback: (feedbackId) => {
    const { [feedbackId]: removed, ...remainingComments } = get().comments;
    set({ comments: remainingComments });
  },

  // Clear all comments
  clearAllComments: () => {
    set({ comments: {} });
  },
})); 