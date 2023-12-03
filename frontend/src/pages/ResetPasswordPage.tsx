import { ArrowRightOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import useForm from 'antd/es/form/hooks/useForm';
import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import forgotPassImg from '../assets/imgs/Forgot password-pana (3).png';
import wave from '../assets/imgs/wave.svg';

type PasswordField = {
  password?: string;
  rePassword?: string;
};

export default function RecoverPasswordPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams()
  const token = params.get("token")
  console.log(token)
  const [form] = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinishPassword = async (values: PasswordField) => {
    try {
      setIsSubmitting(true);
      document.body.style.cursor = 'wait';
      if (values.password == values.rePassword) {
        console.log(values)
        await axios
          .post(
            `${import.meta.env.VITE_REACT_APP_SERVER_URL}/email-confirmation/confirm-password-reset`,
            { newPassword: values.password }, {
            params: {
              token: token
            }
          })
        form.resetFields();
        navigate('/login');
      }
      else {
        console.log("Not match")
      }
      setIsSubmitting(false);
      document.body.style.cursor = 'default';
    } catch (err) {
      console.log(err);
      setIsSubmitting(false);
      document.body.style.cursor = 'default';
    }
  };
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const onFinishPasswordFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center fixed">
      {/* Content */}
      <div className="flex flex-row w-7/12 h-2/3 rounded-xl bg-white border-2 border-gray-300 shadow-xl overflow-hidden">
        {/* Left Section */}
        <div className="w-2/5 flex flex-col justify-start items-center bg-indigo-400 text-white">
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
          <p className=" mt-2 mb-4 text-sm text-center">Recover Your Password</p>
          <img src={forgotPassImg} className="object-contain box-border px-8" />
        </div>
        {/* Right Section */}
        <div className="flex flex-col flex-1 justify-start items-center bg-white mt-4">
          <div className='mt-4 w-2/3 min-w-fit'>
            <h1 className="uppercase font-semibold text-xl text-center my-4">
              Reset Password
            </h1>
            <p className='text-sm text-gray-500 text-center'>Create new password for your account</p>
            <Form
              form={form}
              className="mt-4 w-full min-w-fit"
              labelWrap
              labelCol={{ span: 10 }}
              labelAlign='left'
              initialValues={{ remember: true }}
              onFinish={onFinishPassword}
              onFinishFailed={onFinishPasswordFailed}
              autoComplete="off"
              rootClassName='flex flex-col items-center'
            >
              <Form.Item<PasswordField>
                label="New Password"
                rules={[
                  { required: true, message: 'Please enter your password!' },
                ]}
                name={'password'}
                className='w-full mb-4'
              >
                <Input.Password placeholder="Enter your new password" />
              </Form.Item>

              <Form.Item<PasswordField>
                label="Confirm Password"
                rules={[
                  { required: true, message: 'Please enter your password!' },
                ]}
                name={'rePassword'}
                className='w-full mb-6'
              >
                <Input.Password placeholder="Enter your password again" />
              </Form.Item>

              <Form.Item className='w-full mb-2'>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="flex justify-center items-center px-8 py-4 mb-2 bg-indigo-500 rounded-full w-full"
                  loading={isSubmitting}
                >
                  <span>Confirm</span>
                  <ArrowRightOutlined className="text-sm flex justify-center items-center leading-none" />
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
      <img
        src={wave}
        className="absolute bottom-0 left-0 right-0 -z-20 w-screen overflow-hidden"
      />
    </div>
  )
}
