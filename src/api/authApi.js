import API from './axios';

export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const getMyCourses = () => API.get('/auth/me/courses'); 
export const getMyFees = () => API.get('/auth/me/fees');       
export const getMyAttendance = () => API.get('/auth/me/attendance'); 
export const getMyLibrary = () => API.get('/auth/me/library');       