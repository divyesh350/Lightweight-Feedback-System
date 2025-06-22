import axios from './axiosInstance';

// Comments APIs
export const getFeedbackComments = (feedbackId) => axios.get(`/feedback/${feedbackId}/comments`);
export const createFeedbackComment = (feedbackId, content) => axios.post(`/feedback/${feedbackId}/comments`, { content }); 