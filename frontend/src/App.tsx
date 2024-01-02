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
import StudentClassDetailsPage from './pages/Student/StudentClassDetailsPage';
import StudentHomePage from './pages/Student/StudentHomePage';
import ClassDetailsPage from './pages/Teacher/ClassDetailsPage';
import GradeCompositionPage from './pages/Teacher/GradeCompositionPage';
import GradeManagementPage from './pages/Teacher/GradeManagementPage';
import { GradeReviewDetailProvider } from './pages/Teacher/GradeReviewDetailPage';
import TeacherHomePage from './pages/Teacher/TeacherHomePage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import UserProfilePage from './pages/UserProfilePage';

dayjs.extend(relativeTime);

function App() {
  return (
    <>
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
        </Route>

        {/* Error */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
