import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { HiOutlinePlusCircle, HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';
import { getFees, createFee, updateFee, deleteFee } from '../../api/feeApi';
import { getStudents } from '../../api/studentApi';
import { feeSchema } from '../../validation/feeSchema';
import Modal from '../../components/ui/Modal';
import SearchableSelect from '../../components/ui/SearchableSelect'; 
import Spinner from '../../components/ui/Spinner';

const FeeListPage = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]); 
  const [studentOptions, setStudentOptions] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState(null);

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting }, reset } = useForm({ resolver: yupResolver(feeSchema) });

  const fetchFees = async () => {
    try { setLoading(true); const res = await getFees(); setFees(res.data); } catch { toast.error('Failed to fetch fees'); } finally { setLoading(false); }
  };

  const fetchDropdownData = async () => {
    try {
      const res = await getStudents(); 
      setStudents(res.data);
      const options = res.data.map(s => ({ value: s.student_id, label: `${s.student_id} - ${s.first_name} ${s.last_name}` }));
      setStudentOptions(options);
    } catch { console.error('Failed to fetch students'); }
  };

  useEffect(() => { fetchFees(); fetchDropdownData(); }, []);

  const openCreateModal = () => { 
    setEditingFee(null); 
    reset({ student_id: '', amount: '', fee_type: '', due_date: '', status: 'Unpaid' }); 
    setIsModalOpen(true); 
  };
  
  const openEditModal = (f) => { setEditingFee(f); reset(f); setIsModalOpen(true); };

  const onSubmit = async (data) => {
    try {
      if (editingFee) { await updateFee(editingFee.fee_id, data); toast.success('Fee Updated!'); }
      else { await createFee(data); toast.success('Fee Created!'); }
      setIsModalOpen(false); fetchFees();
    } catch (error) { toast.error(error.response?.data?.message || 'Error saving fee'); }
  };

  const handleDelete = async (id) => {
    Swal.fire({ title: 'Delete this fee record?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete!' })
    .then(async (result) => { if (result.isConfirmed) { await deleteFee(id); toast.success('Deleted'); fetchFees(); } });
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold text-slate-800">Fee Management</h2><p className="text-slate-500 text-sm mt-1">Track student payments</p></div>
        <button onClick={openCreateModal} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 text-sm"><HiOutlinePlusCircle className="w-5 h-5" /> Add Fee</button>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">ID</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Student</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Type</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Amount</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Due Date</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {fees.map((f) => (
              <tr key={f.fee_id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 text-sm font-medium text-slate-800">{f.fee_id}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{f.student_first} {f.student_last} <span className="text-xs text-slate-400">({f.student_id})</span></td>
                <td className="py-4 px-6 text-sm text-slate-600">{f.fee_type}</td>
                <td className="py-4 px-6 text-sm font-semibold text-slate-800">${f.amount}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{new Date(f.due_date).toLocaleDateString()}</td>
                <td className="py-4 px-6"><span className={`px-2 py-1 text-xs rounded-full font-medium ${f.status === 'Paid' ? 'bg-green-100 text-green-700' : f.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{f.status}</span></td>
                <td className="py-4 px-6 flex gap-2">
                  <button onClick={() => openEditModal(f)} className="text-slate-400 hover:text-indigo-600"><HiOutlinePencil className="w-5 h-5" /></button>
                  <button onClick={() => handleDelete(f.fee_id)} className="text-slate-400 hover:text-red-600"><HiOutlineTrash className="w-5 h-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingFee ? "Edit Fee" : "Add Fee"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* SEARCHABLE STUDENT ID DROPDOWN */}
          <SearchableSelect 
            options={studentOptions}
            value={watch('student_id')} // Bind to RHF state
            onChange={(val) => setValue('student_id', val, { shouldValidate: true })} // Update RHF state
            label="Student ID"
            placeholder="Type to search Student ID..."
            error={errors.student_id}
          />

          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-600 mb-1">Amount ($)</label><input {...register('amount')} type="number" step="0.01" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />{errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}</div>
            <div><label className="block text-sm font-medium text-slate-600 mb-1">Type</label>
              <select {...register('fee_type')} className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
                <option value="Tuition">Tuition</option><option value="Lab">Lab</option><option value="Library">Library</option><option value="Exam">Exam</option>
              </select>
            </div>
          </div>
          <div><label className="block text-sm font-medium text-slate-600 mb-1">Due Date</label><input {...register('due_date')} type="date" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />{errors.due_date && <p className="text-red-500 text-xs mt-1">{errors.due_date.message}</p>}</div>
          <div><label className="block text-sm font-medium text-slate-600 mb-1">Status</label>
            <select {...register('status')} className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
              <option value="Unpaid">Unpaid</option><option value="Paid">Paid</option><option value="Overdue">Overdue</option>
            </select>
          </div>
          
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">{isSubmitting ? 'Saving...' : (editingFee ? 'Update' : 'Create')}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FeeListPage;