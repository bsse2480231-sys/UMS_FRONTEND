import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    HiOutlineHome, HiOutlineUsers, HiOutlineAcademicCap,
    HiOutlineBookOpen, HiOutlineClipboardList, HiOutlineLogout,
    HiOutlineOfficeBuilding, HiOutlineLocationMarker, HiOutlineCurrencyDollar,
    HiOutlineCalendar, HiOutlineSpeakerphone, HiOutlineCheckCircle,HiOutlineViewList // <-- Changed Here
} from 'react-icons/hi';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Role-based navigation
    const navItems = {
        Admin: [
            { name: 'Dashboard', icon: HiOutlineHome, path: '/dashboard' },
            { name: 'Students', icon: HiOutlineUsers, path: '/students' },
            { name: 'Instructors', icon: HiOutlineAcademicCap, path: '/instructors' },
            { name: 'Courses', icon: HiOutlineBookOpen, path: '/courses' },
            { name: 'Departments', icon: HiOutlineOfficeBuilding, path: '/departments' },
            { name: 'Classrooms', icon: HiOutlineLocationMarker, path: '/classrooms' },
            { name: 'Enrollments', icon: HiOutlineClipboardList, path: '/enrollments' },
            { name: 'Programs', icon: HiOutlineViewList, path: '/programs' },
            { name: 'Fees', icon: HiOutlineCurrencyDollar, path: '/fees' },
            { name: 'Course Assignments', icon: HiOutlineClipboardList, path: '/teachings' },
            { name: 'Exams', icon: HiOutlineCalendar, path: '/exams' },
            //   { name: 'Notices', icon: HiOutlineMegaphone, path: '/notices' },
            { name: 'Notices', icon: HiOutlineSpeakerphone, path: '/notices' },
        ],
        Instructor: [
            { name: 'Dashboard', icon: HiOutlineHome, path: '/dashboard' },
            { name: 'My Courses', icon: HiOutlineBookOpen, path: '/my-courses' },
            { name: 'Attendance', icon: HiOutlineCheckCircle, path: '/take-attendance' },
            { name: 'Grades', icon: HiOutlineClipboardList, path: '/enter-grades' },
            { name: 'Notice Board', icon: HiOutlineSpeakerphone, path: '/notices' },
            { name: 'Profile', icon: HiOutlineUsers, path: '/profile' },
        ],
        Student: [
            { name: 'Dashboard', icon: HiOutlineHome, path: '/dashboard' },
            { name: 'My Courses', icon: HiOutlineBookOpen, path: '/my-courses' },
            { name: 'Attendance', icon: HiOutlineCheckCircle, path: '/my-attendance' },
            { name: 'Fees', icon: HiOutlineCurrencyDollar, path: '/my-fees' },
            { name: 'Notice Board', icon: HiOutlineSpeakerphone, path: '/notices' },
            { name: 'Library', icon: HiOutlineBookOpen, path: '/my-library' },
            { name: 'Profile', icon: HiOutlineUsers, path: '/profile' },
        ]
    };

    const items = navItems[user?.role] || [];

    return (
        <div className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col shadow-sm">
            <div className="p-6 border-b border-slate-100">
                <h1 className="text-xl font-bold text-indigo-600 tracking-wide">UniPortal</h1>
                <p className="text-xs text-slate-400 mt-1 uppercase">{user?.role} Panel</p>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {items.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                    <HiOutlineLogout className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;