import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { HiOutlinePlusCircle, HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';
import { getStudents, createStudent, updateStudent, deleteStudent } from '../../api/studentApi';
import { studentSchema } from '../../validation/studentSchema';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import { getPrograms } from '../../api/programApi';

const StudentListPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null); // null = Create Mode, Object = Edit Mode
  const [programs, setPrograms] = useState([]);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: yupResolver(studentSchema),
  });

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

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await getStudents();
      setStudents(res.data);
    } catch (error) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const openCreateModal = () => {
    setEditingStudent(null);
    // reset({ student_id: '', first_name: '', last_name: '', email: '', password: '', phone: '', current_semester: '', program_id: '' });
    reset({ first_name: '', last_name: '', email: '', password: '', phone: '', current_semester: '', program_id: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    reset({ ...student, password: '' }); // Populate form, but leave password empty
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editingStudent) {
        // If editing, and password is left blank, remove it from payload so backend doesn't update it
        if (!data.password) delete data.password;
        await updateStudent(editingStudent.student_id, data);
        toast.success('Student updated successfully!');
      } else {
        await createStudent(data);
        toast.success('Student created successfully!');
      }
      setIsModalOpen(false);
      fetchStudents(); // Refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save student');
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteStudent(id);
          toast.success('Student deleted');
          fetchStudents();
        } catch (error) {
          toast.error('Failed to delete student');
        }
      }
    });
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Students</h2>
          <p className="text-slate-500 text-sm mt-1">Manage all university students</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm"
        >
          <HiOutlinePlusCircle className="w-5 h-5" />
          Add Student
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">ID</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Name</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Email</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Phone</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Semester</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {students.map((stu) => (
              <tr key={stu.student_id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 text-sm font-medium text-slate-800">{stu.student_id}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{stu.first_name} {stu.last_name}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{stu.email}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{stu.phone || 'N/A'}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{stu.current_semester}</td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${stu.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {stu.status}
                  </span>
                </td>
                <td className="py-4 px-6 flex gap-2">
                  <button onClick={() => openEditModal(stu)} className="text-slate-400 hover:text-indigo-600 transition-colors">
                    <HiOutlinePencil className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(stu.student_id)} className="text-slate-400 hover:text-red-600 transition-colors">
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {students.length === 0 && <p className="p-6 text-center text-slate-400 text-sm">No students found.</p>}
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingStudent ? "Edit Student" : "Add New Student"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Student ID</label>
            <input {...register('student_id')} disabled={editingStudent} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-slate-100" placeholder="STU003" />
            {errors.student_id && <p className="text-red-500 text-xs mt-1">{errors.student_id.message}</p>}
          </div> */}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">First Name</label>
              <input {...register('first_name')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Last Name</label>
              <input {...register('last_name')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
            <input {...register('email')} type="email" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Password {editingStudent && "(Leave blank to keep unchanged)"}</label>
            <input {...register('password')} type="password" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/* ADDED PHONE FIELD HERE */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Phone</label>
            <input {...register('phone')} type="text" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="e.g. 1234567890" />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Semester</label>
              <input {...register('current_semester')} type="number" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              {errors.current_semester && <p className="text-red-500 text-xs mt-1">{errors.current_semester.message}</p>}
            </div>
            {/* <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Program ID</label>
              <input {...register('program_id')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="PROG001" />
              {errors.program_id && <p className="text-red-500 text-xs mt-1">{errors.program_id.message}</p>}
            </div> */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Program</label>
              <select
                {...register('program_id')}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
              >
                <option value="">-- Select Program --</option>
                {programs.map((prog) => (
                  <option key={prog.program_id} value={prog.program_id}>
                    {prog.program_name} {/* Shows Name, submits program_id */}
                  </option>
                ))}
              </select>
              {errors.program_id && <p className="text-red-500 text-xs mt-1">{errors.program_id.message}</p>}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
              {isSubmitting ? 'Saving...' : (editingStudent ? 'Update Student' : 'Create Student')}
            </button>
          </div>
        </form>
      </Modal>
    </div >
  );
};

export default StudentListPage;