import API from './axios';

export const getNotices = () => API.get('/notices');
export const createNotice = (data) => API.post('/notices', data);
// export const updateNotice = (id, data) => API.put(`/notices/${id}`, data);
export const deleteNotice = (id) => API.delete(`/notices/${id}`);
