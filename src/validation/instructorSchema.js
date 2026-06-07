import * as yup from 'yup';

export const instructorSchema = yup.object().shape({
  // instructor_id: yup.string().required('Instructor ID is required'),
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Must be at least 6 characters'),
  specialization: yup.string().optional(),
  designation: yup.string().optional(),
  department_id: yup.string().required('Department ID is required'),
});