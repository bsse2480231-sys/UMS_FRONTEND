import * as yup from 'yup';
export const enrollmentSchema = yup.object().shape({
  // enrollment_id: yup.string().required('Required (e.g., ENR004)'),
  student_id: yup.string().required('Required'),
  course_id: yup.string().required('Required'),
  semester: yup.string().required('Required (e.g., Fall 2024)'),
  grade: yup.string().optional().nullable(),
  status: yup.string().required('Required'),
});