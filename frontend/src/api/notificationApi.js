import axios from './axiosInstance';

export const getNotifications = () => axios.get('/feedback/notifications');
export const markNotificationRead = (id) => axios.post(`/feedback/notifications/${id}/read`);
export const clearAllNotifications = () => axios.delete('/feedback/notifications/clear-all');
