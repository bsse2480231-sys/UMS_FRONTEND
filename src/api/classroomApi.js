import API from './axios';
export const getClassrooms = () => API.get('/classrooms');
export const createClassroom = (data) => API.post('/classrooms', data);
export const updateClassroom = (id, data) => API.put(`/classrooms/${id}`, data);
export const deleteClassroom = (id) => API.delete(`/classrooms/${id}`);