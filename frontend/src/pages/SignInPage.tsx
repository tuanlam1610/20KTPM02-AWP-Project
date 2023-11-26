import { ArrowRightOutlined, FacebookOutlined, GoogleOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, notification } from 'antd';
import useForm from 'antd/es/form/hooks/useForm';
import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import loginImg from '../assets/imgs/Login-amico.png';
import wave from '../assets/imgs/wave.svg';

type FieldType = {
  email?: string;
  password?: string;
  remember?: string;
};

export default function SignInPage() {
  const navigate = useNavigate();
  const [form] = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const onFinish = async (values: FieldType) => {
    try {
      setIsSubmitting(true);
      document.body.style.cursor = 'wait';
      const signInResult = await axios.post(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/auth/local/signin`,
        values,
      );
      localStorage.setItem('refreshToken', signInResult.data.refreshToken);
      localStorage.setItem('accessToken', signInResult.data.accessToken);
      navigate('/home');
      setIsSubmitting(false);
      document.body.style.cursor = 'default';
    } catch (err) {
      console.log(err);
      openNotification();
      setIsSubmitting(false);
      document.body.style.cursor = 'default';
    }
  };
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const [api, contextHolder] = notification.useNotification({
    stack: { threshold: 3 },
  });

  const openNotification = () => {
    api['error']({
      message: 'Sign In Failed',
      description:
        'The email and password you entered did not match our records. Please double-check and try again.',
      duration: null,
    });
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center fixed">
      {contextHolder}
      {/* Content */}
      <div className="flex flex-row w-7/12 h-2/3 rounded-xl bg-white border-2 border-gray-300 shadow-xl overflow-hidden">
        {/* Left Section */}
        <div className="w-2/5 flex flex-col justify-start items-center bg-indigo-500 text-white">
          <div className="w-full flex justify-start my-4">
            <Link to={'/'}>
              <Button className="ms-4 flex justify-center items-center border-white text-indigo-500 bg-white">
                <HomeOutlined />
              </Button>
            </Link>
          </div>
          <h1 className="uppercase font-semibold text-xl text-center">
            HQL Application
          </h1>
          <p className=" mt-2 mb-4 text-sm text-center">Welcome to HQL</p>
          <img src={loginImg} className="object-contain box-border px-8" />
        </div>
        {/* Right Section */}
        <div className="flex flex-col flex-1 justify-center items-center">
          {/* {isSubmitting && <Spin />} */}
          <h1 className="uppercase font-semibold text-2xl text-center my-4">
            Sign In
          </h1>
          <div className='w-2/3 flex justify-center'>
            <Button className='w-full mb-4 py-4 flex justify-center items-center gap-4 text-indigo-500 font-medium border-indigo-500'>
              <GoogleOutlined />
              <p>Continue with Google</p>
            </Button>
          </div>
          <div className='w-2/3 flex justify-center'>
            <Button className='w-full py-4 flex justify-center items-center gap-4 text-indigo-500 font-medium border-indigo-500'>
              <FacebookOutlined />
              <p>Continue with Facebook</p>
            </Button>
          </div>
          <p className='mt-4'>Or</p>
          <p className='text-sm text-gray-500'>Sign In With Email</p>
          <Form
            form={form}
            className="mt-4"
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              label="Email"
              rules={[
                {
                  required: true,
                  message: 'Please enter your email!',
                },
                {
                  pattern: RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i),
                  message: 'Invalid email. Example: example@email.com',
                },
              ]}
              name={'email'}
            >
              <Input type="text" placeholder="Enter your email" />
            </Form.Item>

            <Form.Item<FieldType>
              label="Password"
              rules={[
                { required: true, message: 'Please enter your password!' },
              ]}
              name={'password'}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Form.Item<FieldType>
              valuePropName="checked"
              wrapperCol={{ offset: 8, span: 16 }}
              name={'remember'}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8 }}>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-indigo-500 rounded-full px-8 flex justify-center items-center"
                loading={isSubmitting}
              >
                <span>Sign In</span>
                <ArrowRightOutlined className="text-sm flex justify-center items-center leading-none" />
              </Button>
            </Form.Item>
          </Form>
          <p className="text-sm">
            Don't have an account?{' '}
            <Link
              to={'/register'}
              className="underline font-semibold p-2 hover:text-indigo-500"
            >
              Sign up
            </Link>
          </p>
          <Link to={'/recover'} className="underline font-semibold p-2 hover:text-indigo-500">
            <p className="text-sm underline font-semibold">Forgot password?</p>
          </Link>
        </div>
      </div>
      <img
        src={wave}
        className="absolute bottom-0 left-0 right-0 -z-20 w-screen overflow-hidden"
      />
    </div>
  );
}
