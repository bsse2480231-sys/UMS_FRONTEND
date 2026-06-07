import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { fetchInstructorCourses, getCourseStudents, submitGrades } from '../../api/instructorApi';
import Spinner from '../../components/ui/Spinner';

const gradeOptions = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F', 'I', 'W'];

const EnterGradesPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
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
      setStudents(res.data);
    } catch { toast.error('Failed to load students'); }
    finally { setLoading(false); }
  };

  const handleGradeChange = (enrollmentId, grade) => {
    setStudents(students.map(s => s.enrollment_id === enrollmentId ? { ...s, grade } : s));
  };

  const handleSubmit = async () => {
    const records = students.map(s => ({ enrollment_id: s.enrollment_id, grade: s.grade || null }));
    
    Swal.fire({ title: 'Submit Grades?', icon: 'info', showCancelButton: true, confirmButtonText: 'Yes, save!' })
    .then(async (result) => {
      if (result.isConfirmed) {
        try {
          await submitGrades({ records });
          toast.success('Grades saved successfully!');
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to save grades');
        }
      }
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Enter Grades</h2>
      <p className="text-slate-500 text-sm mb-6">Update student grades for your courses</p>

      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-6">
        <label className="block text-sm font-medium text-slate-600 mb-1">Select Course</label>
        <select value={selectedCourse} onChange={handleCourseChange} className="w-full md:w-1/3 px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-300 focus:outline-none">
          <option value="">-- Choose Course --</option>
          {courses.map(c => <option key={c.teaching_id} value={c.course_id}>{c.course_code} - {c.course_name}</option>)}
        </select>
      </div>

      {loading ? <Spinner /> : students.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Student ID</th>
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Name</th>
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Current Grade</th>
                <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Assign Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map((s) => (
                <tr key={s.enrollment_id} className="hover:bg-slate-50">
                  <td className="py-4 px-6 text-sm font-medium text-slate-800">{s.student_id}</td>
                  <td className="py-4 px-6 text-sm text-slate-600">{s.first_name} {s.last_name}</td>
                  <td className="py-4 px-6 text-sm font-bold text-indigo-600">{s.grade || '-'}</td>
                  <td className="py-4 px-6">
                    <select 
                      value={s.grade || ''} 
                      onChange={(e) => handleGradeChange(s.enrollment_id, e.target.value)}
                      className="px-3 py-1.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                    >
                      <option value="">-- Select --</option>
                      {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 bg-slate-50 text-right">
            <button onClick={handleSubmit} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 text-sm">Save Grades</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnterGradesPage;