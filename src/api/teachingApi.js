import API from './axios';
export const getTeachings = () => API.get('/teachings');
export const assignCourse = (data) => API.post('/teachings', data);
export const deleteTeaching = (id) => API.delete(`/teachings/${id}`);