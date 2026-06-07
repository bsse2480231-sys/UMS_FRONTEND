import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { HiOutlineSpeakerphone } from 'react-icons/hi';
import { getNotices } from '../../api/noticeApi'; // Re-use the existing API
import Spinner from '../../components/ui/Spinner';

const NoticeBoardPage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await getNotices(); // The backend now returns filtered data based on JWT token
        setNotices(res.data);
      } catch (error) {
        toast.error('Failed to load notices');
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Notice Board</h2>
      <p className="text-slate-500 text-sm mb-6">Official university announcements</p>

      <div className="space-y-4">
        {notices.length === 0 && (
          <div className="bg-white p-8 rounded-xl border border-slate-100 text-center text-slate-400">
            No notices available right now.
          </div>
        )}
        {notices.map((n) => (
          <div key={n.notice_id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-50 rounded-lg h-fit"><HiOutlineSpeakerphone className="w-6 h-6 text-indigo-600" /></div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-800">{n.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{n.content}</p>
                <div className="flex gap-4 mt-3 text-xs text-slate-400">
                  <span>For: <span className="font-medium text-slate-500">{n.target_audience}</span></span>
                  <span>Posted: <span className="font-medium text-slate-500">{new Date(n.posted_date).toLocaleDateString()}</span></span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticeBoardPage;