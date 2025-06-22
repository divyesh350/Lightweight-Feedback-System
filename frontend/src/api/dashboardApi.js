import axios from './axiosInstance';

// Manager Dashboard APIs
export const getManagerOverview = () => axios.get('/dashboard/manager/overview');
export const getManagerSentimentTrends = () => axios.get('/dashboard/manager/sentiment_trends');
export const getTeamMembers = () => axios.get('/users/team');
export const getManagerFeedback = () => axios.get('/feedback/manager');
export const getFeedbackRequests = () => axios.get('/feedback/requests/received');
export const updateRequestStatus = (requestId, status) => axios.patch(`/feedback/request/${requestId}/status?status=${status}`); 