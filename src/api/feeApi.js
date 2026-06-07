import API from './axios';

export const getFees = () => API.get('/fees');
export const createFee = (data) => API.post('/fees', data);
export const updateFee = (id, data) => API.put(`/fees/${id}`, data);
export const deleteFee = (id) => API.delete(`/fees/${id}`);
