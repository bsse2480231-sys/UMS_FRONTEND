import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { HiOutlinePlusCircle, HiOutlineTrash } from 'react-icons/hi';
import { getTeachings, assignCourse, deleteTeaching } from '../../api/teachingApi';
import { getInstructors } from '../../api/instructorApi';
import { getCourses } from '../../api/courseApi';
import { getClassrooms } from '../../api/classroomApi';
import { teachingSchema } from '../../validation/teachingSchema';
import Modal from '../../components/ui/Modal';
import SearchableSelect from '../../components/ui/SearchableSelect';
import Spinner from '../../components/ui/Spinner';

const TeachingListPage = () => {
  const [teachings, setTeachings] = useState([]);
  const [instructorOptions, setInstructorOptions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting }, reset } = useForm({ resolver: yupResolver(teachingSchema) });

  const fetchTeachings = async () => {
    try { setLoading(true); const res = await getTeachings(); setTeachings(res.data); } catch { toast.error('Failed to fetch assignments'); } finally { setLoading(false); }
  };

  const fetchDropdownData = async () => {
    try {
      const instRes = await getInstructors(); 
      const options = instRes.data.map(i => ({ value: i.instructor_id, label: `${i.instructor_id} - ${i.first_name} ${i.last_name}` }));
      setInstructorOptions(options);

      const crsRes = await getCourses(); setCourses(crsRes.data);
      const roomRes = await getClassrooms(); setClassrooms(roomRes.data);
    } catch { console.error('Failed to fetch dropdowns'); }
  };

  useEffect(() => { fetchTeachings(); fetchDropdownData(); }, []);

  const openCreateModal = () => { reset({ instructor_id: '', course_id: '', semester: '', section: '', classroom_id: '' }); setIsModalOpen(true); };

  const onSubmit = async (data) => {
    try {
      await assignCourse(data); toast.success('Course assigned successfully!');
      setIsModalOpen(false); fetchTeachings();
    } catch (error) { toast.error(error.response?.data?.message || 'Error assigning course'); }
  };

  const handleDelete = async (id) => {
    Swal.fire({ title: 'Remove this assignment?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, remove!' })
    .then(async (result) => { if (result.isConfirmed) { await deleteTeaching(id); toast.success('Removed'); fetchTeachings(); } });
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold text-slate-800">Course Assignments</h2><p className="text-slate-500 text-sm mt-1">Assign courses to instructors for the semester</p></div>
        <button onClick={openCreateModal} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 text-sm"><HiOutlinePlusCircle className="w-5 h-5" /> Assign Course</button>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Instructor</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Course</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Section</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Room</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Semester</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {teachings.map((t) => (
              <tr key={t.teaching_id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 text-sm text-slate-800 font-medium">{t.inst_first} {t.inst_last} <span className="text-xs text-slate-400">({t.instructor_id})</span></td>
                <td className="py-4 px-6 text-sm text-slate-600">{t.course_name} ({t.course_code})</td>
                <td className="py-4 px-6 text-sm text-slate-600">Section {t.section}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{t.room_number}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{t.semester}</td>
                <td className="py-4 px-6">
                  <button onClick={() => handleDelete(t.teaching_id)} className="text-slate-400 hover:text-red-600"><HiOutlineTrash className="w-5 h-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Assign Course to Instructor">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* SEARCHABLE INSTRUCTOR ID DROPDOWN */}
          <SearchableSelect 
            options={instructorOptions}
            value={watch('instructor_id')}
            onChange={(val) => setValue('instructor_id', val, { shouldValidate: true })}
            label="Instructor ID"
            placeholder="Type to search Instructor ID..."
            error={errors.instructor_id}
          />

          {/* COURSE DROPDOWN */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Course Name</label>
            <select {...register('course_id')} className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
              <option value="">-- Select Course --</option>
              {courses.map((c) => (
                <option key={c.course_id} value={c.course_id}>{c.course_name} ({c.course_code})</option>
              ))}
            </select>
            {errors.course_id && <p className="text-red-500 text-xs mt-1">{errors.course_id.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-600 mb-1">Section</label>
              <select {...register('section')} className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
                <option value="A">Section A</option><option value="B">Section B</option><option value="C">Section C</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-slate-600 mb-1">Semester</label><input {...register('semester')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="Fall 2024" />{errors.semester && <p className="text-red-500 text-xs mt-1">{errors.semester.message}</p>}</div>
          </div>

          {/* CLASSROOM DROPDOWN */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Classroom / Room</label>
            <select {...register('classroom_id')} className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
              <option value="">-- Select Room --</option>
              {classrooms.map((cl) => (
                <option key={cl.classroom_id} value={cl.classroom_id}>{cl.room_number} - {cl.building_name}</option>
              ))}
            </select>
            {errors.classroom_id && <p className="text-red-500 text-xs mt-1">{errors.classroom_id.message}</p>}
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">{isSubmitting ? 'Assigning...' : 'Assign Course'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeachingListPage;