import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import LoginPage from '../pages/Auth/LoginPage';
import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '../components/layout/AdminLayout';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import StudentListPage from '../pages/Students/StudentListPage';
import InstructorListPage from '../pages/Instructors/InstructorListPage';
import DepartmentListPage from '../pages/Departments/DepartmentListPage';
import CourseListPage from '../pages/Courses/CourseListPage';
import ClassroomListPage from '../pages/Classrooms/ClassroomListPage';
import EnrollmentListPage from '../pages/Enrollments/EnrollmentListPage';
import FeeListPage from '../pages/Fees/FeeListPage';
import ExamListPage from '../pages/Exams/ExamListPage';
import NoticeListPage from '../pages/Notices/NoticeListPage';
import ProfilePage from '../pages/Profile/ProfilePage';
import StudentCoursesPage from '../pages/Students/StudentCoursesPage';
import StudentFeesPage from '../pages/Students/StudentFeesPage';
import InstructorCoursesPage from '../pages/Instructors/InstructorCoursesPage';
import NoticeBoardPage from '../pages/Notices/NoticeBoardPage';
import StudentAttendancePage from '../pages/Students/StudentAttendancePage';
import StudentLibraryPage from '../pages/Students/StudentLibraryPage';
import TakeAttendancePage from '../pages/Instructors/TakeAttendancePage';
import EnterGradesPage from '../pages/Instructors/EnterGradesPage';
import ProgramListPage from '../pages/Programs/ProgramListPage';
import TeachingListPage from '../pages/Teachings/TeachingListPage';


const AppRouter = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Protected Routes wrapped in AdminLayout */}
                    <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="students" element={<StudentListPage />} />
                        <Route path="instructors" element={<InstructorListPage />} />
                        <Route path="departments" element={<DepartmentListPage />} />
                        <Route path="courses" element={<CourseListPage />} />
                        <Route path="classrooms" element={<ClassroomListPage />} />
                        <Route path="enrollments" element={<EnrollmentListPage />} />
                        <Route path="fees" element={<FeeListPage />} />
                        <Route path="exams" element={<ExamListPage />} />
                        <Route path="notices" element={<NoticeListPage />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="my-courses" element={<StudentCoursesPage />} /> {/* Or InstructorCoursesPage based on role later, but both work with the same endpoint logic */}
                        <Route path="my-fees" element={<StudentFeesPage />} />
                        <Route path="notices" element={<NoticeBoardPage />} />
                        <Route path="my-attendance" element={<StudentAttendancePage />} />
                        <Route path="my-library" element={<StudentLibraryPage />} />
                        <Route path="take-attendance" element={<TakeAttendancePage />} />
                        <Route path="enter-grades" element={<EnterGradesPage />} />
                        <Route path="programs" element={<ProgramListPage />} />
                        <Route path="teachings" element={<TeachingListPage />} />
                        {/* We will add /students and /instructors routes here later */}
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default AppRouter;