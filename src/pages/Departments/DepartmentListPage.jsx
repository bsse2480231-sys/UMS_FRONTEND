// import { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { toast } from 'react-toastify';
// import Swal from 'sweetalert2';
// import { HiOutlinePlusCircle, HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';
// import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../../api/departmentApi';
// import { departmentSchema } from '../../validation/departmentSchema';
// import Modal from '../../components/ui/Modal';
// import Spinner from '../../components/ui/Spinner';

// const DepartmentListPage = () => {
//   const [departments, setDepartments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingDept, setEditingDept] = useState(null);

//   const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: yupResolver(departmentSchema) });

//   const fetchDepts = async () => {
//     try { setLoading(true); const res = await getDepartments(); setDepartments(res.data); } 
//     catch { toast.error('Failed to fetch'); } finally { setLoading(false); }
//   };

//   useEffect(() => { fetchDepts(); }, []);

//   const openCreateModal = () => { setEditingDept(null); reset({ department_id: '', department_name: '', department_code: '', established_year: '', head_of_department: '' }); setIsModalOpen(true); };
//   const openEditModal = (dept) => { setEditingDept(dept); reset(dept); setIsModalOpen(true); };

//   const onSubmit = async (data) => {
//     try {
//       if (editingDept) { await updateDepartment(editingDept.department_id, data); toast.success('Updated!'); }
//       else { await createDepartment(data); toast.success('Created!'); }
//       setIsModalOpen(false); fetchDepts();
//     } catch (error) { toast.error(error.response?.data?.message || 'Error'); }
//   };

//   const handleDelete = async (id) => {
//     Swal.fire({ title: 'Are you sure?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete!' })
//     .then(async (result) => { if (result.isConfirmed) { await deleteDepartment(id); toast.success('Deleted'); fetchDepts(); } });
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <div><h2 className="text-2xl font-bold text-slate-800">Departments</h2><p className="text-slate-500 text-sm mt-1">Manage university departments</p></div>
//         <button onClick={openCreateModal} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 text-sm"><HiOutlinePlusCircle className="w-5 h-5" /> Add Dept</button>
//       </div>

//       <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
//         <table className="w-full text-left">
//           <thead className="bg-slate-50 border-b border-slate-100">
//             <tr>
//               <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">ID</th>
//               <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Name</th>
//               <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Code</th>
//               <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Est. Year</th>
//               <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">HOD</th>
//               <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-50">
//             {departments.map((d) => (
//               <tr key={d.department_id} className="hover:bg-slate-50 transition-colors">
//                 <td className="py-4 px-6 text-sm font-medium text-slate-800">{d.department_id}</td>
//                 <td className="py-4 px-6 text-sm text-slate-600">{d.department_name}</td>
//                 <td className="py-4 px-6 text-sm text-slate-600"><span className="bg-slate-100 px-2 py-1 rounded text-xs font-medium">{d.department_code}</span></td>
//                 <td className="py-4 px-6 text-sm text-slate-600">{d.established_year || 'N/A'}</td>
//                 <td className="py-4 px-6 text-sm text-slate-600">{d.head_of_department || 'N/A'}</td>
//                 <td className="py-4 px-6 flex gap-2">
//                   <button onClick={() => openEditModal(d)} className="text-slate-400 hover:text-indigo-600"><HiOutlinePencil className="w-5 h-5" /></button>
//                   <button onClick={() => handleDelete(d.department_id)} className="text-slate-400 hover:text-red-600"><HiOutlineTrash className="w-5 h-5" /></button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingDept ? "Edit Department" : "Add Department"}>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div><label className="block text-sm font-medium text-slate-600 mb-1">Dept ID</label><input {...register('department_id')} disabled={editingDept} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-slate-100" />{errors.department_id && <p className="text-red-500 text-xs mt-1">{errors.department_id.message}</p>}</div>
//           <div><label className="block text-sm font-medium text-slate-600 mb-1">Dept Name</label><input {...register('department_name')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />{errors.department_name && <p className="text-red-500 text-xs mt-1">{errors.department_name.message}</p>}</div>
//           <div><label className="block text-sm font-medium text-slate-600 mb-1">Dept Code</label><input {...register('department_code')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />{errors.department_code && <p className="text-red-500 text-xs mt-1">{errors.department_code.message}</p>}</div>
//           <div className="grid grid-cols-2 gap-4">
//             <div><label className="block text-sm font-medium text-slate-600 mb-1">Est. Year</label><input {...register('established_year')} type="number" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" /></div>
//             <div><label className="block text-sm font-medium text-slate-600 mb-1">HOD Name</label><input {...register('head_of_department')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" /></div>
//           </div>
//           <div className="pt-4 flex justify-end gap-2">
//             <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
//             <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">{isSubmitting ? 'Saving...' : (editingDept ? 'Update' : 'Create')}</button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default DepartmentListPage;
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { HiOutlinePlusCircle, HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../../api/departmentApi';
import { departmentSchema } from '../../validation/departmentSchema';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';

const DepartmentListPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: yupResolver(departmentSchema) });

  const fetchDepts = async () => {
    try { setLoading(true); const res = await getDepartments(); setDepartments(res.data); } catch { toast.error('Failed to fetch'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchDepts(); }, []);

  const openCreateModal = () => { setEditingDept(null); reset({ department_name: '', department_code: '', established_year: '', head_of_department: '' }); setIsModalOpen(true); };
  const openEditModal = (dept) => { setEditingDept(dept); reset(dept); setIsModalOpen(true); };

  const onSubmit = async (data) => {
    try {
      if (editingDept) { await updateDepartment(editingDept.department_id, data); toast.success('Updated!'); }
      else { await createDepartment(data); toast.success('Created!'); }
      setIsModalOpen(false); fetchDepts();
    } catch (error) { toast.error(error.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    Swal.fire({ title: 'Are you sure?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete!' })
    .then(async (result) => { if (result.isConfirmed) { await deleteDepartment(id); toast.success('Deleted'); fetchDepts(); } });
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold text-slate-800">Departments</h2><p className="text-slate-500 text-sm mt-1">Manage university departments</p></div>
        <button onClick={openCreateModal} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 text-sm"><HiOutlinePlusCircle className="w-5 h-5" /> Add Dept</button>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Name</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Code</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Est. Year</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">HOD</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {departments.map((d) => (
              <tr key={d.department_id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 text-sm text-slate-800 font-medium">{d.department_name}</td>
                <td className="py-4 px-6 text-sm text-slate-600"><span className="bg-slate-100 px-2 py-1 rounded text-xs font-medium">{d.department_code}</span></td>
                <td className="py-4 px-6 text-sm text-slate-600">{d.established_year || 'N/A'}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{d.head_of_department || 'N/A'}</td>
                <td className="py-4 px-6 flex gap-2">
                  <button onClick={() => openEditModal(d)} className="text-slate-400 hover:text-indigo-600"><HiOutlinePencil className="w-5 h-5" /></button>
                  <button onClick={() => handleDelete(d.department_id)} className="text-slate-400 hover:text-red-600"><HiOutlineTrash className="w-5 h-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingDept ? "Edit Department" : "Add Department"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-600 mb-1">Dept Name</label><input {...register('department_name')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />{errors.department_name && <p className="text-red-500 text-xs mt-1">{errors.department_name.message}</p>}</div>
          <div><label className="block text-sm font-medium text-slate-600 mb-1">Dept Code</label><input {...register('department_code')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />{errors.department_code && <p className="text-red-500 text-xs mt-1">{errors.department_code.message}</p>}</div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-600 mb-1">Est. Year</label><input {...register('established_year')} type="number" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" /></div>
            <div><label className="block text-sm font-medium text-slate-600 mb-1">HOD Name</label><input {...register('head_of_department')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" /></div>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">{isSubmitting ? 'Saving...' : (editingDept ? 'Update' : 'Create')}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DepartmentListPage;