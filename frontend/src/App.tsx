import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Route, Routes } from 'react-router-dom';
import './locale/i18n';
import ActivateEmailPage from './pages/ActivateEmailPage';
import ChooseRolePage from './pages/ChooseRolePage';
import Navbar from './pages/Components/Navbar';
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';
import RecoverPasswordPage from './pages/RecoverPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import SignUpTeacherPage from './pages/SignUpTeacherPage';
import GradeReviewDetailPage from './pages/Teacher/GradeReviewDetailPage';
import JoinClassByLink from './pages/JoinClassByLink';
import StudentClassDetailsPage from './pages/Student/StudentClassDetailsPage';
import StudentHomePage from './pages/Student/StudentHomePage';
import ClassDetailsPage from './pages/Teacher/ClassDetailsPage';
import GradeCompositionPage from './pages/Teacher/GradeCompositionPage';
import GradeManagementPage from './pages/Teacher/GradeManagementPage';
import { GradeReviewDetailProvider } from './pages/Teacher/GradeReviewDetailPage';
import { GradeReviewDetailProvider as StudentGradeReviewDetailProvider } from './pages/Student/GradeReviewDetailPage';
import TeacherHomePage from './pages/Teacher/TeacherHomePage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import UserProfilePage from './pages/UserProfilePage';
import { ProtectedRoute } from './routes/ProtectedRoute';
import JoinClassByEmail from './pages/JoinClassByEmail';
import StudentGradeBoardPage from './pages/Student/StudentGradeBoardPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ClassesManagementPage from './pages/Admin/ClassesManagementPage';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import StudentsManagementPage from './pages/Admin/StudentsManagementPage';
import AccountsManagementPage from './pages/Admin/AccountsManagementPage';

dayjs.extend(relativeTime);

export const queryClient = new QueryClient();

function App() {
  const { i18n } = useTranslation();
  useEffect(() => {
    const accessToken = localStorage.getItem('language');
    i18n.changeLanguage(accessToken ?? 'en');
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />

        {/* Authentication */}
        <Route path="/login" element={<SignInPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/register/teacher" element={<SignUpTeacherPage />} />
        <Route path="/recover" element={<RecoverPasswordPage />} />
        <Route path="/resetPassword" element={<ResetPasswordPage />} />
        <Route path="/activateEmail" element={<ActivateEmailPage />} />
        <Route path="/chooserole" element={<ChooseRolePage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        {/* Join Class By Link */}
        <Route path="/joinClass/:id" element={<JoinClassByLink />} />
        {/* Join Class By Email */}
        <Route path="/inviteJoinClass" element={<JoinClassByEmail />} />

        {/* Teacher Routes */}
        <Route
          path="/teacher"
          element={<ProtectedRoute allowedRole={'teacher'} />}
        >
          <Route path="home" element={<TeacherHomePage />} />
          <Route path="class/:id" element={<ClassDetailsPage />} />
          <Route
            path="class/:id/grademanagement"
            element={<GradeManagementPage />}
          />
          <Route
            path="class/:id/gradeReview/:gradeReviewId"
            element={<GradeReviewDetailProvider />}
          />
          <Route
            path="class/:id/grademanagement/:gradeCompositionId"
            element={<GradeCompositionPage />}
          />
        </Route>

        {/* Student Routes */}
        <Route
          path="/student"
          element={<ProtectedRoute allowedRole={'student'} />}
        >
          <Route path="home" element={<StudentHomePage />} />
          <Route path="class/:id" element={<StudentClassDetailsPage />} />
          <Route
            path="class/:id/gradeboard"
            element={<StudentGradeBoardPage />}
          />
          <Route
            path="class/:id/gradeReview/:gradeReviewId"
            element={<StudentGradeReviewDetailProvider />}
          />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRole={'admin'} />}>
          <Route path="home" element={<AdminDashboard />} />
          {/* Accounts Management */}
          <Route path="accounts" element={<AccountsManagementPage />} />

          {/* Classes Management */}
          <Route path="classes" element={<ClassesManagementPage />} />

          {/* Students Management */}
          <Route path="students" element={<StudentsManagementPage />} />
        </Route>

        {/* Error */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
