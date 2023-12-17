import { Route, Routes } from 'react-router-dom';
import './locale/i18n';
import ActivateEmailPage from './pages/ActivateEmailPage';
import Navbar from './pages/Components/Navbar';
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';
import RecoverPasswordPage from './pages/RecoverPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ClassDetailsPage from './pages/Teacher/ClassDetailsPage';
import TeacherHomePage from './pages/Teacher/TeacherHomePage';
import UserProfilePage from './pages/UserProfilePage';
import StudentHomePage from './pages/Student/StudentHomePage';
import { ProtectedRoute } from './routes/ProtectedRoute';
import UnauthorizedPage from './pages/UnauthorizedPage';

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
        <Route path="/recover" element={<RecoverPasswordPage />} />
        <Route path="/resetPassword" element={<ResetPasswordPage />} />
        <Route path="/activateEmail" element={<ActivateEmailPage />} />
        {/* Teacher Routes */}
        <Route
          path="/teacher"
          element={<ProtectedRoute allowedRole="teacher" />}
        >
          <Route path="home" element={<TeacherHomePage />} />
          <Route path="class/:id" element={<ClassDetailsPage />} />
          <Route path="profile" element={<UserProfilePage />} />
        </Route>

        {/* Student Routes */}
        <Route
          path="/student"
          element={<ProtectedRoute allowedRole="student" />}
        >
          <Route path="home" element={<StudentHomePage />} />
        </Route>

        {/* Error */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
