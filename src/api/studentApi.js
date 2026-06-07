import API from './axios';

export const getStudents = () => API.get('/students');
export const createStudent = (data) => API.post('/students', data);
export const deleteStudent = (id) => API.delete(`/students/${id}`);
export const updateStudent = (id, data) => API.put(`/students/${id}`, data);