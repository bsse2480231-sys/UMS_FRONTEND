// import { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { toast } from 'react-toastify';
// import Swal from 'sweetalert2';
// import { HiOutlinePlusCircle, HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';
// import { getInstructors, createInstructor, updateInstructor, deleteInstructor } from '../../api/instructorApi';
// import { instructorSchema } from '../../validation/instructorSchema';
// import Modal from '../../components/ui/Modal';
// import Spinner from '../../components/ui/Spinner';

// const InstructorListPage = () => {
//   const [instructors, setInstructors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingInstructor, setEditingInstructor] = useState(null);

//   const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
//     resolver: yupResolver(instructorSchema),
//   });

//   const fetchInstructors = async () => {
//     try {
//       setLoading(true);
//       const res = await getInstructors();
//       setInstructors(res.data);
//     } catch (error) {
//       toast.error('Failed to fetch instructors');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchInstructors(); }, []);

//   const openCreateModal = () => {
//     setEditingInstructor(null);
//     reset({ instructor_id: '', first_name: '', last_name: '', email: '', password: '', specialization: '', designation: '', department_id: '' });
//     setIsModalOpen(true);
//   };

//   const openEditModal = (inst) => {
//     setEditingInstructor(inst);
//     reset({ ...inst, password: '' });
//     setIsModalOpen(true);
//   };

//   const onSubmit = async (data) => {
//     try {
//       if (editingInstructor) {
//         if (!data.password) delete data.password;
//         await updateInstructor(editingInstructor.instructor_id, data);
//         toast.success('Instructor updated successfully!');
//       } else {
//         await createInstructor(data);
//         toast.success('Instructor created successfully!');
//       }
//       setIsModalOpen(false);
//       fetchInstructors();
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to save instructor');
//     }
//   };

//   const handleDelete = async (id) => {
//     Swal.fire({
//       title: 'Are you sure?', text: "You won't be able to revert this!", icon: 'warning',
//       showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Yes, delete it!'
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try { await deleteInstructor(id); toast.success('Instructor deleted'); fetchInstructors(); } 
//         catch (error) { toast.error('Failed to delete instructor'); }
//       }
//     });
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-slate-800">Instructors</h2>
//           <p className="text-slate-500 text-sm mt-1">Manage university faculty</p>
//         </div>
//         <button onClick={openCreateModal} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm">
//           <HiOutlinePlusCircle className="w-5 h-5" /> Add Instructor
//         </button>
//       </div>

//       <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
//         <table className="w-full text-left">
//           <thead className="bg-slate-50 border-b border-slate-100">
//             <tr>
//               <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">ID</th>
//               <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Name</th>
//               <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Email</th>
//               <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Specialization</th>
//               <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Designation</th>
//               <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-50">
//             {instructors.map((inst) => (
//               <tr key={inst.instructor_id} className="hover:bg-slate-50 transition-colors">
//                 <td className="py-4 px-6 text-sm font-medium text-slate-800">{inst.instructor_id}</td>
//                 <td className="py-4 px-6 text-sm text-slate-600">{inst.first_name} {inst.last_name}</td>
//                 <td className="py-4 px-6 text-sm text-slate-600">{inst.email}</td>
//                 <td className="py-4 px-6 text-sm text-slate-600">{inst.specialization || 'N/A'}</td>
//                 <td className="py-4 px-6 text-sm text-slate-600">{inst.designation || 'N/A'}</td>
//                 <td className="py-4 px-6 flex gap-2">
//                   <button onClick={() => openEditModal(inst)} className="text-slate-400 hover:text-indigo-600"><HiOutlinePencil className="w-5 h-5" /></button>
//                   <button onClick={() => handleDelete(inst.instructor_id)} className="text-slate-400 hover:text-red-600"><HiOutlineTrash className="w-5 h-5" /></button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingInstructor ? "Edit Instructor" : "Add New Instructor"}>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//            <div>
//              <label className="block text-sm font-medium text-slate-600 mb-1">Instructor ID</label>
//              <input {...register('instructor_id')} disabled={editingInstructor} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-slate-100" placeholder="INS002" />
//              {errors.instructor_id && <p className="text-red-500 text-xs mt-1">{errors.instructor_id.message}</p>}
//            </div>
//            <div className="grid grid-cols-2 gap-4">
//              <div>
//                <label className="block text-sm font-medium text-slate-600 mb-1">First Name</label>
//                <input {...register('first_name')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
//                {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
//              </div>
//              <div>
//                <label className="block text-sm font-medium text-slate-600 mb-1">Last Name</label>
//                <input {...register('last_name')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
//                {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
//              </div>
//            </div>
//            <div>
//              <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
//              <input {...register('email')} type="email" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
//              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
//            </div>
//            <div>
//              <label className="block text-sm font-medium text-slate-600 mb-1">Password {editingInstructor && "(Leave blank to keep unchanged)"}</label>
//              <input {...register('password')} type="password" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
//              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
//            </div>
//            <div className="grid grid-cols-2 gap-4">
//              <div>
//                <label className="block text-sm font-medium text-slate-600 mb-1">Specialization</label>
//                <input {...register('specialization')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
//              </div>
//              <div>
//                <label className="block text-sm font-medium text-slate-600 mb-1">Designation</label>
//                <input {...register('designation')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
//              </div>
//            </div>
//            <div>
//              <label className="block text-sm font-medium text-slate-600 mb-1">Department ID</label>
//              <input {...register('department_id')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="DEPT001" />
//              {errors.department_id && <p className="text-red-500 text-xs mt-1">{errors.department_id.message}</p>}
//            </div>
//            <div className="pt-4 flex justify-end gap-2">
//              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
//              <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
//                {isSubmitting ? 'Saving...' : (editingInstructor ? 'Update' : 'Create')}
//              </button>
//            </div>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default InstructorListPage;
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { HiOutlinePlusCircle, HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';
import { getInstructors, createInstructor, updateInstructor, deleteInstructor } from '../../api/instructorApi';
import { getDepartments } from '../../api/departmentApi'; // FK Data
import { instructorSchema } from '../../validation/instructorSchema';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';

const InstructorListPage = () => {
  const [instructors, setInstructors] = useState([]);
  const [departments, setDepartments] = useState([]); // For Dropdown
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(instructorSchema),
  });

  const fetchInstructors = async () => {
    try { setLoading(true); const res = await getInstructors(); setInstructors(res.data); } 
    catch { toast.error('Failed to fetch instructors'); } finally { setLoading(false); }
  };

  const fetchDropdownData = async () => {
    try { const res = await getDepartments(); setDepartments(res.data); } 
    catch { console.error('Failed to fetch departments'); }
  };

  useEffect(() => { fetchInstructors(); fetchDropdownData(); }, []);

  const openCreateModal = () => {
    setEditingInstructor(null);
    reset({ first_name: '', last_name: '', email: '', password: '', specialization: '', designation: '', department_id: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (inst) => { setEditingInstructor(inst); reset(inst); setIsModalOpen(true); };

  const onSubmit = async (data) => {
    try {
      if (editingInstructor) {
        if (!data.password) delete data.password;
        await updateInstructor(editingInstructor.instructor_id, data);
        toast.success('Instructor updated successfully!');
      } else {
        await createInstructor(data);
        toast.success('Instructor created successfully!');
      }
      setIsModalOpen(false); fetchInstructors();
    } catch (error) { toast.error(error.response?.data?.message || 'Failed to save instructor'); }
  };

  const handleDelete = async (id) => {
    Swal.fire({ title: 'Are you sure?', text: "You won't be able to revert this!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'Yes, delete it!' })
    .then(async (result) => {
      if (result.isConfirmed) {
        try { await deleteInstructor(id); toast.success('Instructor deleted'); fetchInstructors(); } catch (error) { toast.error('Failed to delete instructor'); }
      }
    });
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold text-slate-800">Instructors</h2><p className="text-slate-500 text-sm mt-1">Manage university faculty</p></div>
        <button onClick={openCreateModal} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm"><HiOutlinePlusCircle className="w-5 h-5" /> Add Instructor</button>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">ID</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Name</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Email</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Specialization</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Designation</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {instructors.map((inst) => (
              <tr key={inst.instructor_id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 text-sm font-medium text-slate-800">{inst.instructor_id}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{inst.first_name} {inst.last_name}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{inst.email}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{inst.specialization || 'N/A'}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{inst.designation || 'N/A'}</td>
                <td className="py-4 px-6 flex gap-2">
                  <button onClick={() => openEditModal(inst)} className="text-slate-400 hover:text-indigo-600"><HiOutlinePencil className="w-5 h-5" /></button>
                  <button onClick={() => handleDelete(inst.instructor_id)} className="text-slate-400 hover:text-red-600"><HiOutlineTrash className="w-5 h-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingInstructor ? "Edit Instructor" : "Add New Instructor"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
           <div className="grid grid-cols-2 gap-4">
             <div><label className="block text-sm font-medium text-slate-600 mb-1">First Name</label><input {...register('first_name')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />{errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}</div>
             <div><label className="block text-sm font-medium text-slate-600 mb-1">Last Name</label><input {...register('last_name')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />{errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}</div>
           </div>
           <div><label className="block text-sm font-medium text-slate-600 mb-1">Email</label><input {...register('email')} type="email" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />{errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}</div>
           <div><label className="block text-sm font-medium text-slate-600 mb-1">Password {editingInstructor && "(Leave blank to keep unchanged)"}</label><input {...register('password')} type="password" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />{errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}</div>
           <div className="grid grid-cols-2 gap-4">
             <div><label className="block text-sm font-medium text-slate-600 mb-1">Specialization</label><input {...register('specialization')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" /></div>
             <div><label className="block text-sm font-medium text-slate-600 mb-1">Designation</label>
               <select {...register('designation')} className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
                 <option value="">-- Select --</option>
                 <option value="Lecturer">Lecturer</option>
                 <option value="Asst Professor">Asst Professor</option>
                 <option value="Assoc Professor">Assoc Professor</option>
                 <option value="Professor">Professor</option>
               </select>
             </div>
           </div>
           
           {/* FK DROPDOWN FOR DEPARTMENT */}
           <div>
             <label className="block text-sm font-medium text-slate-600 mb-1">Department</label>
             <select {...register('department_id')} className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
               <option value="">-- Select Department --</option>
               {departments.map((d) => (
                 <option key={d.department_id} value={d.department_id}>{d.department_name}</option>
               ))}
             </select>
             {errors.department_id && <p className="text-red-500 text-xs mt-1">{errors.department_id.message}</p>}
           </div>

           <div className="pt-4 flex justify-end gap-2">
             <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
             <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">{isSubmitting ? 'Saving...' : (editingInstructor ? 'Update' : 'Create')}</button>
           </div>
        </form>
      </Modal>
    </div>
  );
};

export default InstructorListPage;