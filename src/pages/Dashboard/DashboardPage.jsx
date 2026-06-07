import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/ui/Spinner';
import AdminDashboard from './AdminDashboard';
import StudentDashboard from './StudentDashboard';
import InstructorDashboard from './InstructorDashboard';

const DashboardPage = () => {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;

  // Render dashboard based on role
  switch (user?.role) {
    case 'Admin':
      return <AdminDashboard />;
    case 'Student':
      return <StudentDashboard />;
    case 'Instructor':
      return <InstructorDashboard />;
    default:
      return <div className="p-8 text-red-500">Error: Unknown User Role</div>;
  }
};

export default DashboardPage;