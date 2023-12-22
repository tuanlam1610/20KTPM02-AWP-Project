import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../redux/store';

export const ProtectedRoute = ({ allowedRole }) => {
  const { userInfo } = useAppSelector((state) => state.app);
  const location = useLocation();

  if (userInfo == undefined) {
    return <Navigate to={'/landing'} state={{ from: location }} replace />;
  } else {
    // If no specific role is required for this route, any authenticated user can access it
    if (allowedRole == null) {
      return <Navigate to={'/chooserole'} state={{ from: location }} replace />;
    }
    if (userInfo != allowedRole) {
      return (
        <Navigate to={'/unauthorized'} state={{ from: location }} replace />
      );
    }
  }
  return <Outlet />;
};
