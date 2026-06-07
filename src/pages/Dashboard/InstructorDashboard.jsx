import { useState, useEffect } from 'react';
import { HiOutlinePresentationChartLine, HiOutlineUsers } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats } from '../../api/statsApi';
import { getMyCourses } from '../../api/authApi';
import Spinner from '../../components/ui/Spinner';

const InstructorDashboard = () => {
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
        setCourses(courseRes.data.slice(0, 3));
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
    { name: 'My Courses', value: stats.myCourses, icon: HiOutlinePresentationChartLine, color: 'text-blue-600 bg-blue-50' },
    { name: 'Total Students', value: stats.totalStudents, icon: HiOutlineUsers, color: 'text-emerald-600 bg-emerald-50' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Instructor Dashboard</h2>
      <p className="text-slate-500 text-sm mb-6">Welcome back, Prof. {user?.last_name}! Prepare for your classes.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-lg ${stat.color} w-fit mb-4`}><stat.icon className="w-6 h-6" /></div>
            <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
            <p className="text-sm text-slate-500 mt-1">{stat.name}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">My Teaching Schedule</h3>
        <div className="space-y-3">
          {courses.length === 0 && <p className="text-sm text-slate-400">No courses assigned.</p>}
          {courses.map(c => (
            <div key={c.teaching_id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border-l-4 border-indigo-500">
              <div>
                <p className="text-sm font-semibold text-slate-800">{c.course_code} - {c.course_name}</p>
                <p className="text-xs text-slate-500">Section {c.section} | Room {c.room_number}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;