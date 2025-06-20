import axios from './axiosInstance';

export const createTag = (data) => axios.post('/feedback/tags', data);
export const getTags = () => axios.get('/feedback/tags');
export const addTagToFeedback = (feedbackId, tagId) => axios.post(`/feedback/${feedbackId}/tags/${tagId}`);
export const removeTagFromFeedback = (feedbackId, tagId) => axios.delete(`/feedback/${feedbackId}/tags/${tagId}`);
