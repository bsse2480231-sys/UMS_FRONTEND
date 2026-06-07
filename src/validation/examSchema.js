import * as yup from 'yup';
export const examSchema = yup.object().shape({
  // exam_id: yup.string().required('Required'),
  course_id: yup.string().required('Required'),
  exam_type: yup.string().required('Required'),
  exam_date: yup.string().required('Required'),
  total_marks: yup.number().positive().integer().required('Required'),
  classroom_id: yup.string().required('Required'),
});