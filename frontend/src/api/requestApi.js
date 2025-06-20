import axios from './axiosInstance';

export const requestFeedback = (data) => axios.post('/feedback/request', data);
export const getRequestsMade = () => axios.get('/feedback/requests/made');
export const getRequestsReceived = () => axios.get('/feedback/requests/received');
export const updateRequestStatus = (id, status) => axios.patch(`/feedback/request/${id}/status?status=${status}`);
