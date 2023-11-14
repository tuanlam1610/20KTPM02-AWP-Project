import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, MenuProps } from 'antd';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../assets/imgs/Logo.png';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import axios from 'axios';
import { setUserInfo } from '../../redux/appSlice';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const pathName = location.pathname.replace('/', '');
  const userInfo = useAppSelector((state) => state.app.userInfo);
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Link to={'/profile'} className={`flex gap-4`}>
          <UserOutlined />
          <p>User Profile</p>
        </Link>
      ),
    },
    {
      key: '2',
      label: (
        <Link
          to={'/'}
          className={`flex gap-4`}
          onClick={() => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            dispatch(setUserInfo(undefined))
          }}
        >
          <LogoutOutlined />
          <p>Sign Out</p>
        </Link>
      ),
    },
  ];

  const getUserProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/users/getUserProfile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      console.log(res);
      dispatch(setUserInfo(res.data));
      console.log(userInfo)
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      dispatch(setUserInfo(undefined))
      navigate('/')
    }
  };

  useEffect(() => {
    if (!['', 'login', 'register'].includes(pathName)) {
      if (!localStorage.getItem('refreshToken')) navigate('/');
      else {
        if (!userInfo) {
          console.log("Get Profile")
          getUserProfile();
        }
      }
    }
  });

  return (
    <div className="flex items-center justify-between h-12 shadow-lg sticky">
      <Link to={'/'} className="flex h-full items-center gap-2 mx-4">
        <img
          src={Logo}
          alt="Logo"
          className="h-full object-contain box-border py-2"
        />
        <h1 className="uppercase font-semibold text-lg">Edu</h1>
      </Link>
      {pathName == '' && (
        <div className="flex gap-2 justify-between mx-4">
          <Link to={`login`}>
            <Button type="primary" className="bg-indigo-500 px-8 rounded-full">
              Sign In
            </Button>
          </Link>
        </div>
      )}
      {!['', 'login', 'register'].includes(pathName) && userInfo && (
        <Dropdown menu={{ items }} placement="bottomRight">
          <div className="flex gap-2 justify-between h-full">
            <div className="flex gap-3 items-center px-4 duration-300 cursor-pointer border-b-2 border-transparent hover:border-indigo-500">
              <p className="text-black text-sm">{userInfo.name}</p>
              <Avatar className="bg-indigo-500" icon={<UserOutlined />} />
            </div>
          </div>
        </Dropdown>
      )}
    </div>
  );
}
