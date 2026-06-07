import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { HiOutlinePlusCircle, HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';
import { getClassrooms, createClassroom, updateClassroom, deleteClassroom } from '../../api/classroomApi';
import { classroomSchema } from '../../validation/classroomSchema';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';

const ClassroomListPage = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: yupResolver(classroomSchema) });

  const fetchClassrooms = async () => {
    try { setLoading(true); const res = await getClassrooms(); setClassrooms(res.data); } catch { toast.error('Failed to fetch'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchClassrooms(); }, []);

  const openCreateModal = () => { setEditingClass(null); reset({ room_number: '', building_name: '', capacity: '', type: '' }); setIsModalOpen(true); };
  const openEditModal = (c) => { setEditingClass(c); reset(c); setIsModalOpen(true); };

  const onSubmit = async (data) => {
    try {
      if (editingClass) { await updateClassroom(editingClass.classroom_id, data); toast.success('Updated!'); }
      else { await createClassroom(data); toast.success('Created!'); }
      setIsModalOpen(false); fetchClassrooms();
    } catch (error) { toast.error(error.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    Swal.fire({ title: 'Are you sure?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete!' })
    .then(async (result) => { if (result.isConfirmed) { await deleteClassroom(id); toast.success('Deleted'); fetchClassrooms(); } });
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold text-slate-800">Classrooms</h2><p className="text-slate-500 text-sm mt-1">Manage lecture halls and labs</p></div>
        <button onClick={openCreateModal} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 text-sm"><HiOutlinePlusCircle className="w-5 h-5" /> Add Classroom</button>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Room No.</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Building</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Capacity</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Type</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {classrooms.map((c) => (
              <tr key={c.classroom_id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 text-sm font-medium text-slate-800">{c.room_number}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{c.building_name}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{c.capacity}</td>
                <td className="py-4 px-6"><span className={`px-2 py-1 text-xs rounded-full font-medium ${c.type === 'Lab' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{c.type}</span></td>
                <td className="py-4 px-6 flex gap-2">
                  <button onClick={() => openEditModal(c)} className="text-slate-400 hover:text-indigo-600"><HiOutlinePencil className="w-5 h-5" /></button>
                  <button onClick={() => handleDelete(c.classroom_id)} className="text-slate-400 hover:text-red-600"><HiOutlineTrash className="w-5 h-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingClass ? "Edit Classroom" : "Add Classroom"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-600 mb-1">Room Number</label><input {...register('room_number')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />{errors.room_number && <p className="text-red-500 text-xs mt-1">{errors.room_number.message}</p>}</div>
            <div><label className="block text-sm font-medium text-slate-600 mb-1">Capacity</label><input {...register('capacity')} type="number" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />{errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity.message}</p>}</div>
          </div>
          <div><label className="block text-sm font-medium text-slate-600 mb-1">Building Name</label><input {...register('building_name')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />{errors.building_name && <p className="text-red-500 text-xs mt-1">{errors.building_name.message}</p>}</div>
          <div><label className="block text-sm font-medium text-slate-600 mb-1">Type</label>
            <select {...register('type')} className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
              <option value="Lecture Hall">Lecture Hall</option><option value="Lab">Lab</option><option value="Tutorial Room">Tutorial Room</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">{isSubmitting ? 'Saving...' : (editingClass ? 'Update' : 'Create')}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ClassroomListPage;