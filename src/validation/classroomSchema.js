import * as yup from 'yup';
export const classroomSchema = yup.object().shape({
  // classroom_id: yup.string().required('Required (e.g., ROOM003)'),
  room_number: yup.string().required('Required'),
  building_name: yup.string().required('Required'),
  capacity: yup.number().positive().integer().required('Required'),
  type: yup.string().required('Required (Lecture Hall, Lab)'),
});