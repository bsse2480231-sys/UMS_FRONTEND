import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) return null;

  const details = [
    { label: 'ID', value: user.student_id || user.instructor_id || user.admin_id },
    { label: 'First Name', value: user.first_name },
    { label: 'Last Name', value: user.last_name },
    { label: 'Email', value: user.email },
    { label: 'Role', value: user.role },
  ];

  // Role specific fields
  if (user.role === 'Student') {
    details.push(
      { label: 'Program ID', value: user.program_id },
      { label: 'Current Semester', value: user.current_semester },
      { label: 'Status', value: user.status }
    );
  } else if (user.role === 'Instructor') {
    details.push(
      { label: 'Specialization', value: user.specialization },
      { label: 'Designation', value: user.designation },
      { label: 'Department ID', value: user.department_id }
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">My Profile</h2>
      <p className="text-slate-500 text-sm mb-6">Your personal university details</p>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32"></div>
        <div className="px-6 pb-6">
          <div className="flex items-end space-x-4 -mt-10">
            <div className="w-20 h-20 bg-white border-4 border-white rounded-xl shadow-md flex items-center justify-center text-2xl font-bold text-indigo-600">
              {user.first_name?.[0]}{user.last_name?.[0]}
            </div>
            <div className="pb-1">
              <h3 className="text-xl font-bold text-slate-800">{user.first_name} {user.last_name}</h3>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {details.map((detail) => (
              <div key={detail.label} className="border-b border-slate-100 pb-3">
                <p className="text-xs text-slate-400 font-medium uppercase">{detail.label}</p>
                <p className="text-sm font-semibold text-slate-700 mt-1">{detail.value || 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;