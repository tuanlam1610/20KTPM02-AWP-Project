import { Provider } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import Navbar from './pages/Components/Navbar';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import { appStore } from './redux/store';
import UserProfilePage from './pages/UserProfilePage';

function App() {
  return (
    <Provider store={appStore}>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
      </Routes>
    </Provider>
  );
}

export default App;
