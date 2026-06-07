// import { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { toast } from 'react-toastify';
// import Swal from 'sweetalert2';
// import { HiOutlinePlusCircle, HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';
// import { getEnrollments, createEnrollment, updateEnrollment, deleteEnrollment } from '../../api/enrollmentApi';
// import { enrollmentSchema } from '../../validation/enrollmentSchema';
// import Modal from '../../components/ui/Modal';
// import Spinner from '../../components/ui/Spinner';

// const EnrollmentListPage = () => {
//   const [enrollments, setEnrollments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingEnroll, setEditingEnroll] = useState(null);

//   const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: yupResolver(enrollmentSchema) });

//   const fetchEnrollments = async () => {
//     try { setLoading(true); const res = await getEnrollments(); setEnrollments(res.data); } 
//     catch { toast.error('Failed to fetch'); } finally { setLoading(false); }
//   };

//   useEffect(() => { fetchEnrollments(); }, []);

//   const openCreateModal = () => { setEditingEnroll(null); reset({ enrollment_id: '', student_id: '', course_id: '', semester: '', grade: '', status: 'Enrolled' }); setIsModalOpen(true); };
//   const openEditModal = (e) => { setEditingEnroll(e); reset(e); setIsModalOpen(true); };

//   const onSubmit = async (data) => {
//     try {
//       if (editingEnroll) { await updateEnrollment(editingEnroll.enrollment_id, data); toast.success('Updated!'); }
//       else { await createEnrollment(data); toast.success('Created!'); }
//       setIsModalOpen(false); fetchEnrollments();
//     } catch (error) { toast.error(error.response?.data?.message || 'Error'); }
//   };

//   const handleDelete = async (id) => {
//     Swal.fire({ title: 'Are you sure?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete!' })
//     .then(async (result) => { if (result.isConfirmed) { await deleteEnrollment(id); toast.success('Deleted'); fetchEnrollments(); } });
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <div><h2 className="text-2xl font-bold text-slate-800">Enrollments</h2><p className="text-slate-500 text-sm mt-1">Course registrations</p></div>
//         <button onClick={openCreateModal} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 text-sm"><HiOutlinePlusCircle className="w-5 h-5" /> Enroll Student</button>
//       </div>

//       <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
//         <table className="w-full text-left">
//           <thead className="bg-slate-50 border-b border-slate-100">
//             <tr>
//               <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">ID</th>
//               <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Student</th>
//               <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Course</th>
//               <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Semester</th>
//               <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Grade</th>
//               <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Status</th>
//               <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-50">
//             {enrollments.map((e) => (
//               <tr key={e.enrollment_id} className="hover:bg-slate-50 transition-colors">
//                 <td className="py-4 px-6 text-sm font-medium text-slate-800">{e.enrollment_id}</td>
//                 <td className="py-4 px-6 text-sm text-slate-600">{e.student_first} {e.student_last} <span className="text-xs text-slate-400">({e.student_id})</span></td>
//                 <td className="py-4 px-6 text-sm text-slate-600">{e.course_name}</td>
//                 <td className="py-4 px-6 text-sm text-slate-600">{e.semester}</td>
//                 <td className="py-4 px-6 text-sm font-medium text-slate-800">{e.grade || '-'}</td>
//                 <td className="py-4 px-6">
//                   <span className={`px-2 py-1 text-xs rounded-full font-medium ${
//                     e.status === 'Completed' ? 'bg-green-100 text-green-700' : 
//                     e.status === 'Dropped' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
//                   }`}>{e.status}</span>
//                 </td>
//                 <td className="py-4 px-6 flex gap-2">
//                   <button onClick={() => openEditModal(e)} className="text-slate-400 hover:text-indigo-600"><HiOutlinePencil className="w-5 h-5" /></button>
//                   <button onClick={() => handleDelete(e.enrollment_id)} className="text-slate-400 hover:text-red-600"><HiOutlineTrash className="w-5 h-5" /></button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingEnroll ? "Edit Enrollment" : "Enroll Student"}>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div><label className="block text-sm font-medium text-slate-600 mb-1">Enrollment ID</label><input {...register('enrollment_id')} disabled={editingEnroll} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-slate-100" placeholder="ENR004" />{errors.enrollment_id && <p className="text-red-500 text-xs mt-1">{errors.enrollment_id.message}</p>}</div>
//           <div className="grid grid-cols-2 gap-4">
//             <div><label className="block text-sm font-medium text-slate-600 mb-1">Student ID</label><input {...register('student_id')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="STU001" />{errors.student_id && <p className="text-red-500 text-xs mt-1">{errors.student_id.message}</p>}</div>
//             <div><label className="block text-sm font-medium text-slate-600 mb-1">Course ID</label><input {...register('course_id')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="CRS001" />{errors.course_id && <p className="text-red-500 text-xs mt-1">{errors.course_id.message}</p>}</div>
//           </div>
//           <div><label className="block text-sm font-medium text-slate-600 mb-1">Semester</label><input {...register('semester')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="Fall 2024" />{errors.semester && <p className="text-red-500 text-xs mt-1">{errors.semester.message}</p>}</div>
//           <div className="grid grid-cols-2 gap-4">
//             <div><label className="block text-sm font-medium text-slate-600 mb-1">Grade</label><input {...register('grade')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="A, B+, C" /></div>
//             <div><label className="block text-sm font-medium text-slate-600 mb-1">Status</label>
//               <select {...register('status')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
//                 <option value="Enrolled">Enrolled</option>
//                 <option value="Completed">Completed</option>
//                 <option value="Dropped">Dropped</option>
//               </select>
//             </div>
//           </div>
//           <div className="pt-4 flex justify-end gap-2">
//             <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
//             <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">{isSubmitting ? 'Saving...' : (editingEnroll ? 'Update' : 'Create')}</button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default EnrollmentListPage;
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { HiOutlinePlusCircle, HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';
import { getEnrollments, createEnrollment, updateEnrollment, deleteEnrollment } from '../../api/enrollmentApi';
import { getStudents } from '../../api/studentApi';
import { getCourses } from '../../api/courseApi';
import { enrollmentSchema } from '../../validation/enrollmentSchema';
import Modal from '../../components/ui/Modal';
import SearchableSelect from '../../components/ui/SearchableSelect'; // NEW IMPORT
import Spinner from '../../components/ui/Spinner';

const EnrollmentListPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [studentOptions, setStudentOptions] = useState([]); 
  const [courses, setCourses] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEnroll, setEditingEnroll] = useState(null);

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting }, reset } = useForm({ resolver: yupResolver(enrollmentSchema) });

  const fetchEnrollments = async () => {
    try { setLoading(true); const res = await getEnrollments(); setEnrollments(res.data); } catch { toast.error('Failed to fetch'); } finally { setLoading(false); }
  };

  const fetchDropdownData = async () => {
    try {
      const stuRes = await getStudents(); 
      const options = stuRes.data.map(s => ({ value: s.student_id, label: `${s.student_id} - ${s.first_name} ${s.last_name}` }));
      setStudentOptions(options);

      const crsRes = await getCourses(); setCourses(crsRes.data);
    } catch { console.error('Failed to fetch dropdowns'); }
  };

  useEffect(() => { fetchEnrollments(); fetchDropdownData(); }, []);

  const openCreateModal = () => { setEditingEnroll(null); reset({ student_id: '', course_id: '', semester: '', grade: '', status: 'Enrolled' }); setIsModalOpen(true); };
  const openEditModal = (e) => { setEditingEnroll(e); reset(e); setIsModalOpen(true); };

  const onSubmit = async (data) => {
    try {
      if (editingEnroll) { await updateEnrollment(editingEnroll.enrollment_id, data); toast.success('Updated!'); }
      else { await createEnrollment(data); toast.success('Created!'); }
      setIsModalOpen(false); fetchEnrollments();
    } catch (error) { toast.error(error.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    Swal.fire({ title: 'Are you sure?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete!' })
    .then(async (result) => { if (result.isConfirmed) { await deleteEnrollment(id); toast.success('Deleted'); fetchEnrollments(); } });
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold text-slate-800">Enrollments</h2><p className="text-slate-500 text-sm mt-1">Course registrations</p></div>
        <button onClick={openCreateModal} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 text-sm"><HiOutlinePlusCircle className="w-5 h-5" /> Enroll Student</button>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">ID</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Student</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Course</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Semester</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Grade</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {enrollments.map((e) => (
              <tr key={e.enrollment_id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 text-sm font-medium text-slate-800">{e.enrollment_id}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{e.student_first} {e.student_last}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{e.course_name}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{e.semester}</td>
                <td className="py-4 px-6 text-sm font-medium text-slate-800">{e.grade || '-'}</td>
                <td className="py-4 px-6"><span className={`px-2 py-1 text-xs rounded-full font-medium ${e.status === 'Completed' ? 'bg-green-100 text-green-700' : e.status === 'Dropped' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{e.status}</span></td>
                <td className="py-4 px-6 flex gap-2">
                  <button onClick={() => openEditModal(e)} className="text-slate-400 hover:text-indigo-600"><HiOutlinePencil className="w-5 h-5" /></button>
                  <button onClick={() => handleDelete(e.enrollment_id)} className="text-slate-400 hover:text-red-600"><HiOutlineTrash className="w-5 h-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingEnroll ? "Edit Enrollment" : "Enroll Student"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* SEARCHABLE STUDENT ID DROPDOWN */}
          <SearchableSelect 
            options={studentOptions}
            value={watch('student_id')}
            onChange={(val) => setValue('student_id', val, { shouldValidate: true })}
            label="Student ID"
            placeholder="Type to search Student ID..."
            error={errors.student_id}
          />

          {/* REGULAR COURSE DROPDOWN */}
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

          <div><label className="block text-sm font-medium text-slate-600 mb-1">Semester</label><input {...register('semester')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="Fall 2024" />{errors.semester && <p className="text-red-500 text-xs mt-1">{errors.semester.message}</p>}</div>
          
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-600 mb-1">Grade</label><input {...register('grade')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="A, B+, C" /></div>
            <div><label className="block text-sm font-medium text-slate-600 mb-1">Status</label>
              <select {...register('status')} className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
                <option value="Enrolled">Enrolled</option><option value="Completed">Completed</option><option value="Dropped">Dropped</option>
              </select>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">{isSubmitting ? 'Saving...' : (editingEnroll ? 'Update' : 'Create')}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EnrollmentListPage;