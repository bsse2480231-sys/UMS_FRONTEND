import { useState, useEffect } from 'react';
import { HiOutlineBookOpen, HiOutlineClipboardCheck, HiOutlineClock, HiOutlineCurrencyDollar } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats } from '../../api/statsApi';
import { getMyCourses } from '../../api/authApi';
import Spinner from '../../components/ui/Spinner';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await getDashboardStats();
        setStats(statsRes.data);
        const courseRes = await getMyCourses();
        setCourses(courseRes.data.filter(c => c.status === 'Enrolled').slice(0, 3));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !stats) return <Spinner />;

  const statCards = [
    { name: 'Current Semester', value: user?.current_semester || '1', icon: HiOutlineClock, color: 'text-blue-600 bg-blue-50' },
    { name: 'Enrolled Courses', value: stats.enrolledCourses, icon: HiOutlineBookOpen, color: 'text-emerald-600 bg-emerald-50' },
    { name: 'Attendance Rate', value: `${stats.attendanceRate}%`, icon: HiOutlineClipboardCheck, color: 'text-orange-600 bg-orange-50' },
    { name: 'Pending Fees', value: `$${stats.pendingFees}`, icon: HiOutlineCurrencyDollar, color: 'text-red-600 bg-red-50' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Student Dashboard</h2>
      <p className="text-slate-500 text-sm mb-6">Welcome back, {user?.first_name}! Here is your academic overview.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-lg ${stat.color} w-fit mb-4`}><stat.icon className="w-6 h-6" /></div>
            <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
            <p className="text-sm text-slate-500 mt-1">{stat.name}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Current Courses</h3>
        <div className="space-y-3">
          {courses.length === 0 && <p className="text-sm text-slate-400">No active enrollments.</p>}
          {courses.map(c => (
            <div key={c.enrollment_id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium text-slate-700">{c.course_code} - {c.course_name}</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">In Progress</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;