import axios from './axiosInstance';

export const login = (data) => axios.post('/auth/login', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
export const register = (data) => axios.post('/auth/register', data);
export const getMe = () => axios.get('/users/me');