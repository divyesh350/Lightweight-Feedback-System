import axios from './axiosInstance';

export const submitPeerFeedback = (data) => axios.post('/feedback/peer', data);
export const getPeerFeedbackGiven = () => axios.get('/feedback/peer/given');
export const getPeerFeedbackReceived = () => axios.get('/feedback/peer/received');
