import * as yup from 'yup';

export const studentSchema = yup.object().shape({
  // student_id: yup.string().required('Student ID is required'),
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Must be at least 6 characters'), 
  phone: yup.string().optional(),
  current_semester: yup.number().positive().integer().required('Semester is required'),
  program_id: yup.string().required('Program ID is required'),
});