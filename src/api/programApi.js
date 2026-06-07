import API from './axios';
export const getPrograms = () => API.get('/programs');
export const createProgram = (data) => API.post('/programs', data);
export const updateProgram = (id, data) => API.put(`/programs/${id}`, data);
export const deleteProgram = (id) => API.delete(`/programs/${id}`);