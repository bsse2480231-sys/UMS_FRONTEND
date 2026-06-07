import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { HiOutlinePlusCircle, HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';
import { getPrograms, createProgram, updateProgram, deleteProgram } from '../../api/programApi';
import { getDepartments } from '../../api/departmentApi'; 
import { programSchema } from '../../validation/programSchema';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';

const ProgramListPage = () => {
  const [programs, setPrograms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(programSchema),
  });

  const fetchPrograms = async () => {
    try { setLoading(true); const res = await getPrograms(); setPrograms(res.data); } 
    catch { toast.error('Failed to fetch programs'); } finally { setLoading(false); }
  };

  // Fetch Departments for the Dropdown
  const fetchDropdownData = async () => {
    try {
      const res = await getDepartments();
      setDepartments(res.data);
    } catch { console.error('Failed to fetch departments'); }
  };

  useEffect(() => {
    fetchPrograms();
    fetchDropdownData();
  }, []);

  const openCreateModal = () => {
    setEditingProgram(null);
    reset({ program_name: '', degree_level: '', duration_semesters: '', total_credits: '', department_id: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (prog) => {
    setEditingProgram(prog);
    reset(prog);
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editingProgram) {
        await updateProgram(editingProgram.program_id, data);
        toast.success('Program updated!');
      } else {
        await createProgram(data);
        toast.success('Program created!');
      }
      setIsModalOpen(false);
      fetchPrograms();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving program');
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({ title: 'Are you sure?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete!' })
    .then(async (result) => {
      if (result.isConfirmed) {
        try { await deleteProgram(id); toast.success('Deleted'); fetchPrograms(); } 
        catch (error) { toast.error('Failed to delete'); }
      }
    });
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Programs</h2>
          <p className="text-slate-500 text-sm mt-1">Manage degree programs offered by departments</p>
        </div>
        <button onClick={openCreateModal} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 text-sm">
          <HiOutlinePlusCircle className="w-5 h-5" /> Add Program
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Program Name</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Degree</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Duration</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Credits</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Department</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {programs.map((p) => (
              <tr key={p.program_id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 text-sm font-medium text-slate-800">{p.program_name}</td>
                <td className="py-4 px-6 text-sm text-slate-600">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    p.degree_level === 'Bachelors' ? 'bg-blue-100 text-blue-700' : 
                    p.degree_level === 'Masters' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                  }`}>{p.degree_level}</span>
                </td>
                <td className="py-4 px-6 text-sm text-slate-600">{p.duration_semesters} Semesters</td>
                <td className="py-4 px-6 text-sm text-slate-600">{p.total_credits}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{p.department_name}</td> {/* Shows Name, not ID */}
                <td className="py-4 px-6 flex gap-2">
                  <button onClick={() => openEditModal(p)} className="text-slate-400 hover:text-indigo-600"><HiOutlinePencil className="w-5 h-5" /></button>
                  <button onClick={() => handleDelete(p.program_id)} className="text-slate-400 hover:text-red-600"><HiOutlineTrash className="w-5 h-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProgram ? "Edit Program" : "Add New Program"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Program Name</label>
            <input {...register('program_name')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="e.g. BSc in Computer Science" />
            {errors.program_name && <p className="text-red-500 text-xs mt-1">{errors.program_name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Degree Level</label>
              <select {...register('degree_level')} className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
                <option value="">-- Select --</option>
                <option value="Bachelors">Bachelors</option>
                <option value="Masters">Masters</option>
                <option value="PhD">PhD</option>
                <option value="Diploma">Diploma</option>
              </select>
              {errors.degree_level && <p className="text-red-500 text-xs mt-1">{errors.degree_level.message}</p>}
            </div>
            
            {/* FK DROPDOWN FOR DEPARTMENT */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Department</label>
              <select {...register('department_id')} className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
                <option value="">-- Select Dept --</option>
                {departments.map((d) => (
                  <option key={d.department_id} value={d.department_id}>
                    {d.department_name} {/* Shows Name, submits ID */}
                  </option>
                ))}
              </select>
              {errors.department_id && <p className="text-red-500 text-xs mt-1">{errors.department_id.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Duration (Semesters)</label>
              <input {...register('duration_semesters')} type="number" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              {errors.duration_semesters && <p className="text-red-500 text-xs mt-1">{errors.duration_semesters.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Total Credits</label>
              <input {...register('total_credits')} type="number" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              {errors.total_credits && <p className="text-red-500 text-xs mt-1">{errors.total_credits.message}</p>}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {isSubmitting ? 'Saving...' : (editingProgram ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProgramListPage;