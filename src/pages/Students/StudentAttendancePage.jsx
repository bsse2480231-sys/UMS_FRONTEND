import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getMyAttendance } from '../../api/authApi';
import Spinner from '../../components/ui/Spinner';

const StudentAttendancePage = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMyAttendance();
        setAttendance(res.data);
      } catch (error) {
        toast.error('Failed to load attendance');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">My Attendance</h2>
      <p className="text-slate-500 text-sm mb-6">Your presence record for enrolled courses</p>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Date</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Course Code</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Course Name</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {attendance.map((a) => (
              <tr key={a.attendance_id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 text-sm text-slate-600">{new Date(a.date).toLocaleDateString()}</td>
                <td className="py-4 px-6 text-sm font-medium text-indigo-600">{a.course_code}</td>
                <td className="py-4 px-6 text-sm text-slate-800 font-medium">{a.course_name}</td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    a.status === 'Present' ? 'bg-green-100 text-green-700' : 
                    a.status === 'Absent' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>{a.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {attendance.length === 0 && <p className="p-6 text-center text-slate-400 text-sm">No attendance records found.</p>}
      </div>
    </div>
  );
};

export default StudentAttendancePage;