import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { useEffect } from 'react';
import axios from 'axios';
import { setUserInfo } from '../redux/appSlice';

export const ProtectedRoute = ({ allowedRole }) => {
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((state) => state.app);
  const location = useLocation();
  const accessToken = localStorage.getItem('accessToken');

  if (userInfo == undefined) {
    if (!accessToken)
      return <Navigate to={'/landing'} state={{ from: location }} replace />;
  } else {
    if (userInfo.roles[0] != allowedRole) {
      return (
        <Navigate to={'/unauthorized'} state={{ from: location }} replace />
      );
    }
  }
  return <Outlet />;
};
