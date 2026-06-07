import * as yup from 'yup';
export const departmentSchema = yup.object().shape({
  // department_id: yup.string().required('Required (e.g., DEPT003)'),
  department_name: yup.string().required('Required'),
  department_code: yup.string().required('Required (e.g., ME)'),
  established_year: yup.number().positive().integer().optional().nullable(),
  head_of_department: yup.string().optional().nullable(),
});