import API from './axios';
export const getDashboardStats = () => API.get('/stats');