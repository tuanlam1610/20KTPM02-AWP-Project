import { Provider } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import Navbar from './pages/Components/Navbar';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import RecoverPasswordPage from './pages/RecoverPasswordPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import UserProfilePage from './pages/UserProfilePage';
import { appStore } from './redux/store';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ActivateEmailPage from './pages/ActivateEmailPage';

function App() {
  return (
    <Provider store={appStore}>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/recover" element={<RecoverPasswordPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path='/resetPassword' element={<ResetPasswordPage />} />
        <Route path='/activateEmail' element={<ActivateEmailPage />} />
      </Routes>
    </Provider>
  );
}

export default App;
