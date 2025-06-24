import axios from './axiosInstance';

// Team Management APIs
export const getTeamMembers = () => axios.get('/users/team');
export const getAvailableEmployees = () => axios.get('/users/available-employees');
export const addTeamMember = (employeeId) => axios.post('/users/team/add', { employee_id: employeeId });
export const removeTeamMember = (employeeId) => axios.delete(`/users/team/remove/${employeeId}`); 
export const getManagers = () => axios.get('/users/managers');
export const getAllUsers = () => axios.get('/users/all');