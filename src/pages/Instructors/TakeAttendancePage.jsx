import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { fetchInstructorCourses, getCourseStudents, submitAttendance } from '../../api/instructorApi';
import Spinner from '../../components/ui/Spinner';

const TakeAttendancePage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetchInstructorCourses();
        setCourses(res.data);
      } catch { toast.error('Failed to load courses'); }
    };
    fetchCourses();
  }, []);

  const handleCourseChange = async (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    if (!courseId) { setStudents([]); return; }

    setLoading(true);
    try {
      const res = await getCourseStudents(courseId);
      // Initialize attendance status as 'Present' by default
      const initialized = res.data.map(s => ({ ...s, attendanceStatus: 'Present' }));
      setStudents(initialized);
    } catch { toast.error('Failed to load students'); }
    finally { setLoading(false); }
  };

  const toggleAttendance = (studentId, status) => {
    setStudents(students.map(s => s.student_id === studentId ? { ...s, attendanceStatus: status } : s));
  };

  const handleSubmit = async () => {
    if (!selectedCourse || !date) return toast.error('Select course and date');
    
    const records = students.map(s => ({ student_id: s.student_id, status: s.attendanceStatus }));

    Swal.fire({ title: 'Submit Attendance?', icon: 'info', showCancelButton: true, confirmButtonText: 'Yes, submit!' })
    .then(async (result) => {
      if (result.isConfirmed) {
        try {
          await submitAttendance({ courseId: selectedCourse, date, records });
          toast.success('Attendance submitted successfully!');
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to submit');
        }
      }
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Take Attendance</h2>
      <p className="text-slate-500 text-sm mb-6">Mark attendance for your assigned courses</p>

      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-6 flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-600 mb-1">Select Course</label>
          <select value={selectedCourse} onChange={handleCourseChange} className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-300 focus:outline-none">
            <option value="">-- Choose Course --</option>
            {courses.map(c => <option key={c.teaching_id} value={c.course_id}>{c.course_code} - {c.course_name} (Sec {c.section})</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none" />
        </div>
      </div>

      {loading ? <Spinner /> : students.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Student ID</th>
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Name</th>
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map((s) => (
                <tr key={s.student_id} className="hover:bg-slate-50">
                  <td className="py-4 px-6 text-sm font-medium text-slate-800">{s.student_id}</td>
                  <td className="py-4 px-6 text-sm text-slate-600">{s.first_name} {s.last_name}</td>
                  <td className="py-4 px-6 flex gap-2">
                    <button 
                      onClick={() => toggleAttendance(s.student_id, 'Present')}
                      className={`px-3 py-1 text-xs rounded-full font-medium border ${s.attendanceStatus === 'Present' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-white text-slate-500 border-slate-200'}`}
                    >Present</button>
                    <button 
                      onClick={() => toggleAttendance(s.student_id, 'Absent')}
                      className={`px-3 py-1 text-xs rounded-full font-medium border ${s.attendanceStatus === 'Absent' ? 'bg-red-100 text-red-700 border-red-300' : 'bg-white text-slate-500 border-slate-200'}`}
                    >Absent</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 bg-slate-50 text-right">
            <button onClick={handleSubmit} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 text-sm">Submit Attendance</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeAttendancePage;