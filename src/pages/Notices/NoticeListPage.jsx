// import { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { toast } from 'react-toastify';
// import Swal from 'sweetalert2';
// import { HiOutlinePlusCircle, HiOutlineTrash, HiOutlineSpeakerphone } from 'react-icons/hi';
// import { getNotices, createNotice, deleteNotice } from '../../api/noticeApi';
// import { noticeSchema } from '../../validation/noticeSchema';
// import Modal from '../../components/ui/Modal';
// import Spinner from '../../components/ui/Spinner';

// const NoticeListPage = () => {
//   const [notices, setNotices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: yupResolver(noticeSchema) });

//   const fetchNotices = async () => {
//     try { setLoading(true); const res = await getNotices(); setNotices(res.data); } 
//     catch { toast.error('Failed to fetch'); } finally { setLoading(false); }
//   };

//   useEffect(() => { fetchNotices(); }, []);

//   const openCreateModal = () => { reset({ notice_id: '', title: '', content: '', target_audience: 'All' }); setIsModalOpen(true); };

//   const onSubmit = async (data) => {
//     try {
//       await createNotice(data); toast.success('Notice Published!');
//       setIsModalOpen(false); fetchNotices();
//     } catch (error) { toast.error(error.response?.data?.message || 'Error'); }
//   };

//   const handleDelete = async (id) => {
//     Swal.fire({ title: 'Delete this notice?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete!' })
//     .then(async (result) => { if (result.isConfirmed) { await deleteNotice(id); toast.success('Deleted'); fetchNotices(); } });
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <div><h2 className="text-2xl font-bold text-slate-800">Notice Board</h2><p className="text-slate-500 text-sm mt-1">University announcements</p></div>
//         <button onClick={openCreateModal} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 text-sm"><HiOutlinePlusCircle className="w-5 h-5" /> Publish Notice</button>
//       </div>

//       <div className="space-y-4">
//         {notices.map((n) => (
//           <div key={n.notice_id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative">
//             <div className="flex items-start justify-between">
//               <div className="flex gap-4">
//                 <div className="p-3 bg-indigo-50 rounded-lg h-fit"><HiOutlineSpeakerphone className="w-6 h-6 text-indigo-600" /></div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-slate-800">{n.title}</h3>
//                   <p className="text-sm text-slate-600 mt-1">{n.content}</p>
//                   <div className="flex gap-4 mt-3 text-xs text-slate-400">
//                     <span>For: <span className="font-medium text-slate-500">{n.target_audience}</span></span>
//                     <span>Posted: <span className="font-medium text-slate-500">{new Date(n.posted_date).toLocaleDateString()}</span></span>
//                   </div>
//                 </div>
//               </div>
//               <button onClick={() => handleDelete(n.notice_id)} className="text-slate-300 hover:text-red-500 transition-colors"><HiOutlineTrash className="w-5 h-5" /></button>
//             </div>
//           </div>
//         ))}
//         {notices.length === 0 && <p className="text-center text-slate-400 py-8">No notices found.</p>}
//       </div>

//       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Publish New Notice">
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div><label className="block text-sm font-medium text-slate-600 mb-1">Notice ID</label><input {...register('notice_id')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="NOT002" />{errors.notice_id && <p className="text-red-500 text-xs mt-1">{errors.notice_id.message}</p>}</div>
//           <div><label className="block text-sm font-medium text-slate-600 mb-1">Title</label><input {...register('title')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />{errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}</div>
//           <div><label className="block text-sm font-medium text-slate-600 mb-1">Content</label><textarea {...register('content')} rows={4} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"></textarea>{errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}</div>
//           <div><label className="block text-sm font-medium text-slate-600 mb-1">Target Audience</label>
//             <select {...register('target_audience')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
//               <option value="All">All</option><option value="Students">Students</option><option value="Instructors">Instructors</option>
//             </select>
//           </div>
//           <div className="pt-4 flex justify-end gap-2">
//             <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
//             <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">{isSubmitting ? 'Publishing...' : 'Publish'}</button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default NoticeListPage;
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { HiOutlinePlusCircle, HiOutlineTrash, HiOutlineSpeakerphone } from 'react-icons/hi';
import { getNotices, createNotice, deleteNotice } from '../../api/noticeApi';
import { noticeSchema } from '../../validation/noticeSchema';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';

const NoticeListPage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: yupResolver(noticeSchema) });

  const fetchNotices = async () => {
    try { setLoading(true); const res = await getNotices(); setNotices(res.data); } 
    catch { toast.error('Failed to fetch'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchNotices(); }, []);

  const openCreateModal = () => { reset({ title: '', content: '', target_audience: 'All' }); setIsModalOpen(true); };

  const onSubmit = async (data) => {
    try {
      await createNotice(data); toast.success('Notice Published!');
      setIsModalOpen(false); fetchNotices();
    } catch (error) { toast.error(error.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    Swal.fire({ title: 'Delete this notice?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete!' })
    .then(async (result) => { if (result.isConfirmed) { await deleteNotice(id); toast.success('Deleted'); fetchNotices(); } });
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold text-slate-800">Notice Board</h2><p className="text-slate-500 text-sm mt-1">University announcements</p></div>
        <button onClick={openCreateModal} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 text-sm"><HiOutlinePlusCircle className="w-5 h-5" /> Publish Notice</button>
      </div>

      <div className="space-y-4">
        {notices.length === 0 && <div className="bg-white p-8 rounded-xl border border-slate-100 text-center text-slate-400">No notices found.</div>}
        {notices.map((n) => (
          <div key={n.notice_id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative group">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="p-3 bg-indigo-50 rounded-lg h-fit"><HiOutlineSpeakerphone className="w-6 h-6 text-indigo-600" /></div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{n.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{n.content}</p>
                  <div className="flex gap-4 mt-3 text-xs text-slate-400">
                    <span>For: <span className="font-medium text-slate-500">{n.target_audience}</span></span>
                    <span>Posted: <span className="font-medium text-slate-500">{new Date(n.posted_date).toLocaleDateString()}</span></span>
                  </div>
                </div>
              </div>
              <button onClick={() => handleDelete(n.notice_id)} className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><HiOutlineTrash className="w-5 h-5" /></button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Publish New Notice">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-600 mb-1">Title</label><input {...register('title')} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />{errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}</div>
          <div><label className="block text-sm font-medium text-slate-600 mb-1">Content</label><textarea {...register('content')} rows={4} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"></textarea>{errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}</div>
          <div><label className="block text-sm font-medium text-slate-600 mb-1">Target Audience</label>
            <select {...register('target_audience')} className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
              <option value="All">All</option><option value="Students">Students</option><option value="Instructors">Instructors</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">{isSubmitting ? 'Publishing...' : 'Publish'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default NoticeListPage;