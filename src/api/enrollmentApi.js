import API from './axios';
export const getEnrollments = () => API.get('/enrollments');
export const createEnrollment = (data) => API.post('/enrollments', data);
export const updateEnrollment = (id, data) => API.put(`/enrollments/${id}`, data);
export const deleteEnrollment = (id) => API.delete(`/enrollments/${id}`);