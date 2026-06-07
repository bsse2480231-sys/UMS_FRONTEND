import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { HiOutlinePlusCircle, HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../../api/courseApi';
import { courseSchema } from '../../validation/courseSchema';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import { getPrograms } from '../../api/programApi';


const CourseListPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [programs, setPrograms] = useState([]);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: yupResolver(courseSchema) });

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const res = await getPrograms();
        setPrograms(res.data);
      } catch (error) {
        console.error('Failed to fetch programs');
      }
    };
    fetchDropdownData();
  }, []);

  const fetchCourses = async () => {
    try { setLoading(true); const res = await getCourses(); setCourses(res.data); }
    catch { toast.error('Failed to fetch'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchCourses(); }, []);

  // const openCreateModal = () => { setEditingCourse(null); reset({ course_id: '', course_code: '', course_name: '', credits: '', description: '', course_type: '', program_id: '' }); setIsModalOpen(true); };
  const openCreateModal = () => { setEditingCourse(null); reset({ course_code: '', course_name: '', credits: '', description: '', course_type: '', program_id: '' }); setIsModalOpen(true); };
  const openEditModal = (c) => { setEditingCourse(c); reset(c); setIsModalOpen(true); };

  const onSubmit = async (data) => {
    try {
      if (editingCourse) { await updateCourse(editingCourse.course_id, data); toast.success('Updated!'); }
      else { await createCourse(data); toast.success('Created!'); }
      setIsModalOpen(false); fetchCourses();
    } catch (error) { toast.error(error.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    Swal.fire({ title: 'Are you sure?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete!' })
      .then(async (result) => { if (result.isConfirmed) { await deleteCourse(id); toast.success('Deleted'); fetchCourses(); } });
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold text-slate-800">Courses</h2><p className="text-slate-500 text-sm mt-1">Manage university courses</p></div>
        <button onClick={openCreateModal} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 text-sm"><HiOutlinePlusCircle className="w-5 h-5" /> Add Course</button>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Code</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Name</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Credits</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Type</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Program</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {courses.map((c) => (
              <tr key={c.course_id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 text-sm font-medium text-slate-800"><span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-medium">{c.course_code}</span></td>
                <td className="py-4 px-6 text-sm text-slate-600">{c.course_name}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{c.credits}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{c.course_type || 'N/A'}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{c.program_id}</td>
                <td className="py-4 px-6 flex gap-2">
                  <button onClick={() => openEditModal(c)} className="text-slate-400 hover:text-indigo-600"><HiOutlinePencil className="w-5 h-5" /></button>
                  <button onClick={() => handleDelete(c.course_id)} className="text-slate-400 hover:text-red-600"><HiOutlineTrash className="w-5 h-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCourse ? "Edit Course" : "Add Course"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* <div><label className="block text-sm font-medium text-slate-600 mb-1">Course ID</label><input {...register('course_id')} disabled={editingCourse} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-slate-100" placeholder="CRS003" />{errors.course_id && <p className="text-red-500 text-xs mt-1">{errors.course_id.message}</p>}</div> */}
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-600 mb-1">Course Code</label><input {...register('course_code')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="ME101" />{errors.course_code && <p className="text-red-500 text-xs mt-1">{errors.course_code.message}</p>}</div>
            <div><label className="block text-sm font-medium text-slate-600 mb-1">Credits</label><input {...register('credits')} type="number" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />{errors.credits && <p className="text-red-500 text-xs mt-1">{errors.credits.message}</p>}</div>
          </div>
          <div><label className="block text-sm font-medium text-slate-600 mb-1">Course Name</label><input {...register('course_name')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />{errors.course_name && <p className="text-red-500 text-xs mt-1">{errors.course_name.message}</p>}</div>
          <div><label className="block text-sm font-medium text-slate-600 mb-1">Description</label><textarea {...register('description')} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"></textarea></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-600 mb-1">Type</label><input {...register('course_type')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="Core/Elective" /></div>
            {/* <div><label className="block text-sm font-medium text-slate-600 mb-1">Program ID</label><input {...register('program_id')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="PROG001" />{errors.program_id && <p className="text-red-500 text-xs mt-1">{errors.program_id.message}</p>}</div> */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Program</label>
              <select {...register('program_id')} className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
                <option value="">-- Select Program --</option>
                {programs.map((p) => (
                  <option key={p.program_id} value={p.program_id}>{p.program_name}</option>
                ))}
              </select>
              {errors.program_id && <p className="text-red-500 text-xs mt-1">{errors.program_id.message}</p>}
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">{isSubmitting ? 'Saving...' : (editingCourse ? 'Update' : 'Create')}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CourseListPage;