import * as yup from 'yup';
export const noticeSchema = yup.object().shape({
  // notice_id: yup.string().required('Required'),
  title: yup.string().required('Required'),
  content: yup.string().required('Required'),
  target_audience: yup.string().required('Required'),
});