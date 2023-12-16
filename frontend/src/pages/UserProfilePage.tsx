import { EditOutlined, LeftOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, DatePicker, Form, Input, Spin } from 'antd';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { User } from '../interface';
import axios from 'axios';
import { setUserInfo } from '../redux/appSlice';
import wave from '../assets/imgs/wave.svg';
import { useNavigate } from 'react-router-dom';

export default function UserProfilePage() {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [form] = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userInfo = useAppSelector((state) => state.app.userInfo);
  const navigate = useNavigate();

  const handleBackButton = () => {
    navigate(-1);
  };

  const onFinish = async (values: Omit<User, 'Id'>) => {
    try {
      setIsSubmitting(true);
      document.body.style.cursor = 'wait';
      values = { ...values, dob: dayjs(values.dob).toDate().toISOString() };
      const res = await axios.patch(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/users/${userInfo?.id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
      );
      dispatch(setUserInfo(res.data));
      setIsSubmitting(false);
      setIsEditing(false);
      document.body.style.cursor = 'default';
    } catch (err) {
      console.log(err);
      setIsSubmitting(false);
      setIsEditing(false);
      document.body.style.cursor = 'default';
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div className="flex justify-center h-[80vh] mt-8">
      <Button
        className="absolute top-16 left-4"
        icon={<LeftOutlined />}
        onClick={handleBackButton}
      >
        Back
      </Button>
      <div className="w-1/2 rounded-xl shadow-2xl bg-white border-2 border-gray-300 overflow-hidden">
        <div className="flex flex-col justify-center items-center h-1/4 min-h-fit bg-[url('https://media.sproutsocial.com/uploads/1c_facebook-cover-photo_clean@2x.png')] ">
          <Avatar size={64} icon={<UserOutlined />} className="bg-indigo-500" />
          <Button
            className=" bg-white rounded-full flex gap-2 justify-center items-center px-6 py-2 mt-4 disabled:bg-gray-200"
            disabled={isEditing}
            onClick={() => setIsEditing(!isEditing)}
          >
            <EditOutlined />
            <p>Edit Profile</p>
          </Button>
        </div>
        <Form
          form={form}
          className="mt-4"
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          disabled={!isEditing}
        >
          <Form.Item<Omit<User, 'Id'>>
            label="Fullname"
            name="name"
            initialValue={userInfo?.name}
            rules={[
              {
                required: true,
                message: 'Please enter your name!',
              },
            ]}
            className="ms-0"
          >
            <Input />
          </Form.Item>
          <Form.Item<Omit<User, 'Id'>>
            label="Email"
            initialValue={userInfo?.email}
            rules={[
              {
                required: true,
                message: 'Please enter your email!',
              },
            ]}
            name={'email'}
          >
            <Input />
          </Form.Item>
          <Form.Item<Omit<User, 'Id'>>
            label="Date Of Birth"
            name="dob"
            initialValue={dayjs(userInfo?.dob, 'YYYY-MM-DD')}
            rules={[
              {
                required: true,
                message: 'Please enter your dob!',
              },
            ]}
            className="ms-0"
          >
            <DatePicker format={'DD/MM/YYYY'} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 9 }}>
            <div className="flex gap-4">
              <Button
                type="primary"
                htmlType="submit"
                className="bg-blue-500 rounded-full px-8 flex justify-center items-center"
              >
                <span>Save</span>
              </Button>
              <Button
                className="border-gray-400 rounded-full px-8 flex justify-center items-center hover:bg-white "
                onClick={() => {
                  setIsEditing(!isEditing);
                }}
              >
                <span>Cancel</span>
              </Button>
            </div>
          </Form.Item>
        </Form>
        {isSubmitting && <Spin className="flex justify-center items-center" />}
      </div>
      <img
        src={wave}
        className="absolute bottom-0 left-0 right-0 -z-20 w-screen overflow-hidden"
      />
    </div>
  );
}
