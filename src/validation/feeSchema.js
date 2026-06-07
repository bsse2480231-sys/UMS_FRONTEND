import * as yup from 'yup';
export const feeSchema = yup.object().shape({
  // fee_id: yup.string().required('Required'),
  student_id: yup.string().required('Required'),
  amount: yup.number().positive().required('Required'),
  fee_type: yup.string().required('Required'),
  due_date: yup.string().required('Required'),
  status: yup.string().required('Required'),
});