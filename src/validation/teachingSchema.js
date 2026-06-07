import * as yup from 'yup';
export const teachingSchema = yup.object().shape({
  instructor_id: yup.string().required('Instructor is required'),
  course_id: yup.string().required('Course is required'),
  semester: yup.string().required('Semester is required'),
  section: yup.string().required('Section is required'),
  classroom_id: yup.string().required('Classroom is required'),
});