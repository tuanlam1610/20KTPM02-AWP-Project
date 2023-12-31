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

  // const getUserProfile = async () => {
  //   try {
  //     const res = await axios.get(
  //       `${import.meta.env.VITE_REACT_APP_SERVER_URL}/users/getUserProfile`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  //         },
  //       },
  //     );
  //     console.log(res);
  //     dispatch(setUserInfo(res.data));
  //     console.log(userInfo);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // useEffect(() => {
  //   if (!userInfo) {
  //     getUserProfile();
  //   }
  // }, []);

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
