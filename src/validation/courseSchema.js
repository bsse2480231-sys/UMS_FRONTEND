import * as yup from 'yup';
export const courseSchema = yup.object().shape({
  // course_id: yup.string().required('Required (e.g., CRS003)'),
  course_code: yup.string().required('Required (e.g., ME101)'),
  course_name: yup.string().required('Required'),
  credits: yup.number().positive().integer().required('Required'),
  description: yup.string().optional().nullable(),
  course_type: yup.string().optional().nullable(),
  program_id: yup.string().required('Required (e.g., PROG001)'),
});