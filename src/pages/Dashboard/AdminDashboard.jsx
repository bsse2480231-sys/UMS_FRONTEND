// import { HiOutlineUsers, HiOutlineAcademicCap, HiOutlineBookOpen, HiOutlineCurrencyDollar } from 'react-icons/hi';
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// const enrollmentData = [
//   { name: 'Fall 21', students: 400 }, { name: 'Spring 22', students: 600 },
//   { name: 'Fall 22', students: 800 }, { name: 'Spring 23', students: 750 },
//   { name: 'Fall 23', students: 950 }, { name: 'Spring 24', students: 1100 },
// ];

// const feeStatusData = [
//   { name: 'Paid', value: 2400 }, { name: 'Unpaid', value: 450 }, { name: 'Overdue', value: 150 },
// ];

// const COLORS = ['#10b981', '#3b82f6', '#ef4444'];

// const AdminDashboard = () => {
//   const stats = [
//     { name: 'Total Students', value: '1,245', icon: HiOutlineUsers, color: 'text-blue-600 bg-blue-50', trend: '+12%' },
//     { name: 'Total Instructors', value: '48', icon: HiOutlineAcademicCap, color: 'text-emerald-600 bg-emerald-50', trend: '+3%' },
//     { name: 'Active Courses', value: '124', icon: HiOutlineBookOpen, color: 'text-orange-600 bg-orange-50', trend: '+5%' },
//     { name: 'Revenue (Fees)', value: '$124,500', icon: HiOutlineCurrencyDollar, color: 'text-purple-600 bg-purple-50', trend: '+8%' },
//   ];

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-2xl font-bold text-slate-800">Admin Dashboard</h2>
//         <p className="text-slate-500 text-sm">University overview & analytics</p>
//       </div>

//       {/* Top Stat Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
//         {stats.map((stat) => (
//           <div key={stat.name} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
//             <div>
//               <p className="text-sm text-slate-500 font-medium">{stat.name}</p>
//               <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
//               <span className="text-xs text-emerald-500 font-semibold mt-2 inline-block">{stat.trend} from last sem</span>
//             </div>
//             <div className={`p-4 rounded-xl ${stat.color}`}>
//               <stat.icon className="w-6 h-6" />
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Area Chart - Enrollment Trends */}
//         <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
//           <h3 className="text-lg font-semibold text-slate-800 mb-4">Student Enrollment Trends</h3>
//           <div className="h-72 w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={enrollmentData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
//                 <defs>
//                   <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
//                     <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
//                   </linearGradient>
//                 </defs>
//                 <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
//                 <YAxis stroke="#94a3b8" fontSize={12} />
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//                 <Tooltip />
//                 <Area type="monotone" dataKey="students" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorUv)" />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Pie Chart - Fee Status */}
//         <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
//           <h3 className="text-lg font-semibold text-slate-800 mb-4">Fee Payment Status</h3>
//           <div className="h-72 w-full flex items-center justify-center">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie data={feeStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
//                   {feeStatusData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//           <div className="flex justify-center gap-4 mt-2">
//             {feeStatusData.map((entry, index) => (
//               <div key={entry.name} className="flex items-center gap-1.5 text-xs text-slate-600">
//                 <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }}></span>
//                 {entry.name}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Recent Activity / Upcoming */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
//             <h3 className="text-lg font-semibold text-slate-800 mb-4">Upcoming Exams</h3>
//             <div className="space-y-3">
//                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border-l-4 border-indigo-500">
//                  <div><p className="text-sm font-semibold text-slate-800">CS101 - Midterm</p><p className="text-xs text-slate-500">Room 101 | 09:00 AM</p></div>
//                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">Tomorrow</span>
//                </div>
//                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border-l-4 border-emerald-500">
//                  <div><p className="text-sm font-semibold text-slate-800">MTH201 - Calculus II</p><p className="text-xs text-slate-500">Room 205 | 02:00 PM</p></div>
//                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">In 3 days</span>
//                </div>
//             </div>
//          </div>
//          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
//             <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Notices</h3>
//             <div className="space-y-3">
//                <div className="p-3 bg-slate-50 rounded-lg">
//                  <p className="text-sm font-semibold text-slate-800">Library Hours Extended</p>
//                  <p className="text-xs text-slate-500 mt-1">The library will remain open until 10 PM during midterms.</p>
//                </div>
//                <div className="p-3 bg-slate-50 rounded-lg">
//                  <p className="text-sm font-semibold text-slate-800">Fee Payment Deadline</p>
//                  <p className="text-xs text-slate-500 mt-1">Last date to pay tuition fees without late charges is Oct 15th.</p>
//                </div>
//             </div>
//          </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
import { useState, useEffect } from 'react';
import { HiOutlineUsers, HiOutlineAcademicCap, HiOutlineBookOpen, HiOutlineClipboardList } from 'react-icons/hi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getDashboardStats } from '../../api/statsApi';
import { getExams } from '../../api/examApi';
import { getNotices } from '../../api/noticeApi';
import Spinner from '../../components/ui/Spinner';

const COLORS = ['#10b981', '#3b82f6', '#ef4444'];

// Mock historical data for the Area Chart (since DB doesn't track past months)
const enrollmentTrend = [
  { name: 'Fall 21', students: 400 }, { name: 'Spring 22', students: 600 },
  { name: 'Fall 22', students: 800 }, { name: 'Spring 23', students: 750 },
  { name: 'Fall 23', students: 950 }, { name: 'Spring 24', students: 1100 },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [exams, setExams] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await getDashboardStats();
        setStats(statsRes.data);
        
        const examRes = await getExams();
        setExams(examRes.data.slice(0, 2)); // Get latest 2 exams
        
        const noticeRes = await getNotices();
        setNotices(noticeRes.data.slice(0, 2)); // Get latest 2 notices
      } catch (error) {
        console.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !stats) return <Spinner />;

  const statCards = [
    { name: 'Total Students', value: stats.totalStudents, icon: HiOutlineUsers, color: 'text-blue-600 bg-blue-50' },
    { name: 'Total Instructors', value: stats.totalInstructors, icon: HiOutlineAcademicCap, color: 'text-emerald-600 bg-emerald-50' },
    { name: 'Active Courses', value: stats.totalCourses, icon: HiOutlineBookOpen, color: 'text-orange-600 bg-orange-50' },
    { name: 'Total Enrollments', value: stats.totalEnrollments, icon: HiOutlineClipboardList, color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Admin Dashboard</h2>
        <p className="text-slate-500 text-sm">University overview & analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.name}</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
            </div>
            <div className={`p-4 rounded-xl ${stat.color}`}><stat.icon className="w-6 h-6" /></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Student Enrollment Trends</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollmentTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs><linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} /><YAxis stroke="#94a3b8" fontSize={12} />
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><Tooltip />
                <Area type="monotone" dataKey="students" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorUv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Fee Payment Status</h3>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.feeStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {stats.feeStatus.map((entry, index) => ( <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} /> ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {stats.feeStatus.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }}></span> {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Upcoming Exams</h3>
            <div className="space-y-3">
              {exams.length === 0 && <p className="text-sm text-slate-400">No exams scheduled.</p>}
              {exams.map(e => (
                 <div key={e.exam_id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border-l-4 border-indigo-500">
                   <div><p className="text-sm font-semibold text-slate-800">{e.course_name}</p><p className="text-xs text-slate-500">{e.exam_type} | {new Date(e.exam_date).toLocaleDateString()}</p></div>
                 </div>
              ))}
            </div>
         </div>
         <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Notices</h3>
            <div className="space-y-3">
              {notices.length === 0 && <p className="text-sm text-slate-400">No notices posted.</p>}
              {notices.map(n => (
                 <div key={n.notice_id} className="p-3 bg-slate-50 rounded-lg">
                   <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                   <p className="text-xs text-slate-500 mt-1">{n.content.substring(0, 60)}...</p>
                 </div>
              ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;