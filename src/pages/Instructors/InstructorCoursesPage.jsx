import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getMyCourses } from '../../api/authApi';
import Spinner from '../../components/ui/Spinner';

const InstructorCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getMyCourses();
        setCourses(res.data);
      } catch (error) {
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">My Teaching Schedule</h2>
      <p className="text-slate-500 text-sm mb-6">Courses assigned to you this semester</p>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Code</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Course Name</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Section</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Room</th>
              <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Semester</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {courses.map((c) => (
              <tr key={c.teaching_id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6 text-sm font-medium text-indigo-600">{c.course_code}</td>
                <td className="py-4 px-6 text-sm text-slate-800 font-medium">{c.course_name}</td>
                <td className="py-4 px-6 text-sm text-slate-600">Section {c.section}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{c.room_number}</td>
                <td className="py-4 px-6 text-sm text-slate-600">{c.semester}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {courses.length === 0 && <p className="p-6 text-center text-slate-400 text-sm">No courses assigned yet.</p>}
      </div>
    </div>
  );
};

export default InstructorCoursesPage;