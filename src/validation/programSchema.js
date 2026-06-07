import * as yup from 'yup';

export const programSchema = yup.object().shape({
  // program_id removed - auto generated
  program_name: yup.string().required('Program name is required'),
  degree_level: yup.string().required('Degree level is required'),
  duration_semesters: yup.number().positive().integer().required('Duration is required'),
  total_credits: yup.number().positive().integer().required('Total credits is required'),
  department_id: yup.string().required('Department is required'), // FK Dropdown
});