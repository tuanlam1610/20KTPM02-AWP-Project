import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Dropdown,
  Form,
  Input,
  MenuProps,
  Modal,
  Select,
  Space,
  message,
} from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../assets/imgs/Logo.png';
import { setUserInfo } from '../../redux/appSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'antd/es/form/Form';

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
        <Link to={`/profile`} className={`flex gap-4`}>
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
            dispatch(setUserInfo(undefined));
          }}
        >
          <LogoutOutlined />
          <p>Sign Out</p>
        </Link>
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const getUserProfile = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/users/getUserProfile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
      );
      console.log(res);
      dispatch(setUserInfo(res.data));
      if (res.data.roles[0] == 'student' && !res.data.studentId) {
        console.log('Show');
        showModal();
      }
      console.log(userInfo);
    } catch (error) {
      console.log(error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      dispatch(setUserInfo(undefined));
      navigate('/');
    }
  };

  useEffect(() => {
    console.log(
      'effect',
      !userInfo?.studentId,
      userInfo?.roles[0] == 'student',
    );
    const accessToken = localStorage.getItem('accessToken');
    if (!userInfo) {
      if (accessToken) {
        getUserProfile();
      }
    } else if (!userInfo.studentId && userInfo.roles[0] == 'student') {
      if (accessToken) {
        console.log('Recheck');
        getUserProfile();
      }
    }
  }, [open]);

  const showModal = () => {
    console.log('Show');
    setOpen(true);
  };
  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
    messageApi.open({
      type: 'warning',
      content: 'Please map your account with your Student ID to continue.',
      duration: 3,
    });
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      const values = await form.validateFields();
      form.resetFields();
      console.log('Submit Values: ', values);
      const url = `${import.meta.env.VITE_REACT_APP_SERVER_URL}/students/${
        values.studentId
      }/mapStudentToUser`;
      const res = await axios.patch(url, {
        userId: userInfo?.id,
      });
      console.log(res);
      messageApi.open({
        type: 'success',
        content: 'Student account mapped successfully',
        duration: 1,
      });
      setConfirmLoading(false);
      setOpen(false);
    } catch (error) {
      console.log(error);
      messageApi.open({
        type: 'error',
        content: 'Failed to map student account',
        duration: 1,
      });
      setConfirmLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between h-12 shadow-lg">
      {contextHolder}
      <Link
        to={!userInfo ? '/' : `${userInfo.roles[0]}/home`}
        className="flex h-full items-center gap-2 mx-4"
      >
        <img
          src={Logo}
          alt="Logo"
          className="h-full object-contain box-border py-2"
        />
        <h1 className="uppercase font-semibold text-lg">Edu</h1>
      </Link>
      {['', 'landing'].includes(pathName) && (
        <div className="flex gap-2 justify-between mx-4">
          <Link to={`login`}>
            <Button type="primary" className="bg-indigo-500 px-8 rounded-full">
              Sign In
            </Button>
          </Link>
        </div>
      )}
      {!['', 'login', 'register', 'landing', '/'].includes(pathName) &&
        userInfo && (
          <Dropdown menu={{ items }} placement="bottomRight">
            <div className="flex gap-2 justify-between h-full">
              <div className="flex gap-3 items-center px-4 duration-300 cursor-pointer border-b-2 border-transparent hover:border-indigo-500">
                <p className="text-black text-sm">{userInfo.name}</p>
                <Avatar className="bg-indigo-500" icon={<UserOutlined />} />
              </div>
            </div>
          </Dropdown>
        )}
      <Modal
        title={
          <h1 className="text-2xl text-indigo-500 pb-4 mb-4 border-b-[1px] border-gray-300 uppercase">
            {`Student Account Mapping:`}
          </h1>
        }
        centered
        open={open}
        onOk={handleOk}
        okText="Confirm"
        okButtonProps={{ className: 'bg-indigo-500' }}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        styles={{
          header: {
            fontSize: 20,
          },
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label={<p className="">{'Student ID:'}</p>}
            rules={[
              {
                required: true,
                message: 'Please choose student id to map with.',
              },
            ]}
            name={'studentId'}
            className="w-full mb-4"
          >
            <Select
              style={{ width: 120 }}
              onChange={(value) => {
                console.log(value);
              }}
              options={[
                { value: '20127297', label: '20127297' },
                { value: '20127677', label: '20127677' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
