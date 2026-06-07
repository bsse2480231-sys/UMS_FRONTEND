import API from './axios';
import { getMyCourses } from './authApi';

export const getInstructors = () => API.get('/instructors');
export const createInstructor = (data) => API.post('/instructors', data);
export const updateInstructor = (id, data) => API.put(`/instructors/${id}`, data);
export const deleteInstructor = (id) => API.delete(`/instructors/${id}`);

export const fetchInstructorCourses = getMyCourses; 
export const getCourseStudents = (courseId) => API.get(`/instructors/course/${courseId}/students`);
export const submitAttendance = (data) => API.post('/instructors/attendance', data);
export const submitGrades = (data) => API.put('/instructors/grades', data);