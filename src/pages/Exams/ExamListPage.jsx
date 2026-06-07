import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { HiOutlinePlusCircle, HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';
import { getExams, createExam, updateExam, deleteExam } from '../../api/examApi';
import { getCourses } from '../../api/courseApi'; 
import { getClassrooms } from '../../api/classroomApi';
import { examSchema } from '../../validation/examSchema';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';

const ExamListPage = () => {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: yupResolver(examSchema) });

  const fetchExams = async () => {
    try { setLoading(true); const res = await getExams(); setExams(res.data); } catch { toast.error('Failed to fetch'); } finally { setLoading(false); }
  };

  const fetchDropdownData = async () => {
    try {
      const crsRes = await getCourses(); setCourses(crsRes.data);
      const roomRes = await getClassrooms(); setClassrooms(roomRes.data);
    } catch { console.error('Failed to fetch dropdowns'); }
  };

  useEffect(() => { fetchExams(); fetchDropdownData(); }, []);

  const openCreateModal = () => { setEditingExam(null); reset({ course_id: '', exam_type: '', exam_date: '', total_marks: '', classroom_id: '' }); setIsModalOpen(true); };
  const openEditModal = (e) => { setEditingExam(e); reset(e); setIsModalOpen(true); };

  const onSubmit = async (data) => {
    try {
      if (editingExam) { await updateExam(editingExam.exam_id, data); toast.success('Updated!'); }
      else { await createExam(data); toast.success('Created!'); }
      setIsModalOpen(false); fetchExams();
    } catch (error) { toast.error(error.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    Swal.fire({ title: 'Are you sure?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete!' })
    .then(async (result) => { if (result.isConfirmed) { await deleteExam(id); toast.success('Deleted'); fetchExams(); } });
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold text-slate-800">Examination Schedule</h2><p className="text-slate-500 text-sm mt-1">Manage midterms, finals, and quizzes</p></div>
        <button onClick={openCreateModal} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 text-sm"><HiOutlinePlusCircle className="w-5 h-5" /> Schedule Exam</button>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">ID</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Course</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Type</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Date</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Total Marks</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Room</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {exams.map((e) => (
              <tr key={e.exam_id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 text-sm font-medium text-slate-800">{e.exam_id}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{e.course_name}</td>
                <td className="py-4 px-6"><span className={`px-2 py-1 text-xs rounded-full font-medium ${e.exam_type === 'Final' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{e.exam_type}</span></td>
                <td className="py-4 px-6 text-sm text-slate-600">{new Date(e.exam_date).toLocaleDateString()}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{e.total_marks}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{e.classroom_id}</td>
                <td className="py-4 px-6 flex gap-2">
                  <button onClick={() => openEditModal(e)} className="text-slate-400 hover:text-indigo-600"><HiOutlinePencil className="w-5 h-5" /></button>
                  <button onClick={() => handleDelete(e.exam_id)} className="text-slate-400 hover:text-red-600"><HiOutlineTrash className="w-5 h-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingExam ? "Edit Exam" : "Schedule Exam"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* COURSE DROPDOWN (BY NAME) */}
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
            <div><label className="block text-sm font-medium text-slate-600 mb-1">Exam Type</label>
              <select {...register('exam_type')} className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
                <option value="Midterm">Midterm</option><option value="Final">Final</option><option value="Quiz">Quiz</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-slate-600 mb-1">Total Marks</label><input {...register('total_marks')} type="number" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />{errors.total_marks && <p className="text-red-500 text-xs mt-1">{errors.total_marks.message}</p>}</div>
          </div>
          
          <div><label className="block text-sm font-medium text-slate-600 mb-1">Exam Date</label><input {...register('exam_date')} type="date" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />{errors.exam_date && <p className="text-red-500 text-xs mt-1">{errors.exam_date.message}</p>}</div>
          
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
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">{isSubmitting ? 'Saving...' : (editingExam ? 'Update' : 'Create')}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ExamListPage;