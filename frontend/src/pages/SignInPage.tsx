import { ArrowRightOutlined, FacebookOutlined, GoogleOutlined, HomeOutlined, MailOutlined } from '@ant-design/icons';
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

  const activateAccount = async (values: { email: string | undefined }) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/email-confirmation/resendVerification`,
        values,
      )
    } catch (err) {
      console.log(err)
    }
  }
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err.response.data.message);
      if (err.response.data.statusCode == 401 && err.response.data.message == "Email not confirmed") {
        await activateAccount({ email: values.email })
        setCurrentStep(1)
      }
      else openNotification();
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
      duration: 2,
    });
  };

  const steps = [
    {
      title: 'Fill In Information',
      content: (
        <div className="flex flex-col flex-1 justify-center items-center overflow-auto">
          {/* {isSubmitting && <Spin />} */}
          <h1 className="uppercase font-semibold text-2xl text-center my-4">
            Sign In
          </h1>
          <div className='w-2/3 min-w-fit flex justify-center'>
            <Button className='w-full mb-2 py-4 flex justify-center items-center gap-4 text-indigo-500 border-indigo-500 rounded-full'>
              <GoogleOutlined />
              <p className='w-1/2 flex'>Continue with Google</p>
            </Button>
          </div>
          <div className='w-2/3 min-w-fit flex justify-center'>
            <Button className='w-full py-4 flex justify-center items-center gap-4 text-indigo-500 border-indigo-500 rounded-full'>
              <FacebookOutlined />
              <p className='w-1/2 flex'>Continue with Facebook</p>
            </Button>
          </div>
          <p className='mt-4'>Or</p>
          <Form
            form={form}
            className="mt-4 w-2/3 min-w-fit"
            labelWrap
            labelCol={{ span: 8 }}
            labelAlign='left'
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            rootClassName='flex flex-col items-center'
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
              className='w-full mb-4'
            >
              <Input type="text" placeholder='example@email.com' />
            </Form.Item>

            <Form.Item<FieldType>
              label="Password"
              rules={[
                { required: true, message: 'Please enter your password!' },
              ]}
              name={'password'}
              className='w-full mb-2'
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <div className='w-full flex justify-between'>
              <Form.Item<FieldType>
                valuePropName="checked"
                name={'remember'}
                className='w-fit mb-6'
              >
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Link to={'/recover'} className="underline font-semibold p-2 hover:text-indigo-500">
                <p className="text-sm underline font-semibold">Forgot password?</p>
              </Link>
            </div>

            <Form.Item className='w-full mb-2'>
              <Button
                type="primary"
                htmlType="submit"
                className="flex justify-center items-center px-8 py-4 bg-indigo-500 rounded-full w-full"
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
        </div>),
    },
    {
      title: 'Email Verification',
      content: (
        <div className="flex flex-col flex-1 justify-center items-center overflow-auto">
          <div className='w-2/3'>
            <h1 className="uppercase font-semibold text-xl text-center my-4">
              Activate Account
            </h1>
            <div>
              <MailOutlined className='text-4xl' />
            </div>
            <div className='my-4 w-full overflow-hidden flex flex-col gap-4 text-gray-700 text-sm'>
              <p>We've send a mail to</p>
              <p className='font-semibold text-lg'>{form.getFieldValue('email') != "" ? form.getFieldValue('email') : "example@email.com"}</p>
              <div>
                <p >Please click the link in your email to activate your account. The link in the mail will expire in 5 minutes.</p>
                <p> Don't forget to check your spam section!</p>
              </div>
              <p className=''>Didn't receive a mail? <span className='underline text-indigo-500 font-semibold hover:cursor-pointer'>Resend</span></p>
            </div>
          </div>
        </div>

      ),
    },
  ];
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="h-screen w-screen flex justify-center items-center fixed">
      {contextHolder}
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
          <p className=" mt-2 mb-4 text-sm text-center">Welcome to HQL</p>
          <img src={loginImg} className="object-contain box-border px-8" />
        </div>
        {/* Right Section */}
        {steps[currentStep].content}
      </div>
      <img
        src={wave}
        className="absolute bottom-0 left-0 right-0 -z-20 w-screen overflow-hidden"
      />
    </div>
  );
}
