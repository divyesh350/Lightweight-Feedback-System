import axios from './axiosInstance';

export const createFeedback = (data) => axios.post('/feedback', data);
export const getEmployeeFeedback = () => axios.get('/feedback/employee');
export const getManagerFeedback = () => axios.get('/feedback/manager');
export const updateFeedback = (id, data) => axios.patch(`/feedback/${id}`, data);
export const acknowledgeFeedback = (id) => axios.post(`/feedback/${id}/acknowledge`);
export const exportEmployeeFeedbackPDF = () => axios.get('/feedback/employee/pdf', { responseType: 'blob' });
