import { ArrowRightOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, InputNumber, Steps } from 'antd';
import useForm from 'antd/es/form/hooks/useForm';
import axios from 'axios';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import signUpImg from '../assets/imgs/Sign up-amico.png';
import wave from '../assets/imgs/wave.svg';

type FieldType = {
  name?: string;
  email?: string;
  dob?: string;
  password?: string;
  confirmPassword?: string;
};

export default function SignUpPage() {


  const [form] = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const backHandler = () => {
    setCurrentStep(0)
  }

  const onFinish = async (values: FieldType) => {
    console.log(currentStep)
    setCurrentStep(1)
    setIsSubmitting(true);
    document.body.style.cursor = 'wait';
    console.log('Success:', values);
    setIsSubmitting(false);
    document.body.style.cursor = 'default';
    values = { ...values, dob: dayjs(values.dob).toDate().toISOString() };
    console.log(values);
    form.resetFields();
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/auth/local/signup`,
        values,
      )
      .then((res) => {
        console.log(res);
        console.log(res.data);
        // localStorage.setItem('refreshToken', res.data.refreshToken);
        // localStorage.setItem('accessToken', res.data.accessToken);
        form.resetFields();
        // navigate('/home');
      })
      .catch((err) => console.log(err));
  };
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const steps = [
    {
      title: 'Fill In Information',
      content: (<div>
        <h1 className="uppercase font-semibold text-xl text-center my-4">
          Sign Up
        </h1>
        <Form
          form={form}
          className="mt-4 w-2/3 min-w-fit"
          labelWrap
          labelCol={{ span: 10 }}
          labelAlign='left'
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          rootClassName='flex flex-col items-center'
        >
          <Form.Item<FieldType>
            label="Fullname"
            name="name"
            rules={[
              { required: true, message: 'Please input your fullname!' },
            ]}
            className="w-full mb-4"
          >
            <Input type='text' placeholder='Enter your name' />
          </Form.Item>
          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
            className="w-full mb-4"
          >
            <Input type='text' placeholder='example@email.com' />
          </Form.Item>
          <Form.Item<FieldType>
            label="Date Of Birth"
            name="dob"
            rules={[{ required: true, message: 'Please input your dob!' }]}
            className="w-full mb-4"
          >
            <DatePicker format={'DD/MM/YYYY'} className='w-full' />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
            ]}
            className="w-full mb-4"
          >
            <Input.Password />
          </Form.Item>
          <Form.Item<FieldType>
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              { required: true, message: 'Please confirm your password!' },
            ]}
            className="w-full mb-6"
          >
            <Input.Password />
          </Form.Item>

          <Form.Item className="w-full mb-2">
            <Button
              type="primary"
              htmlType="submit"
              className="flex justify-center items-center px-8 py-4 bg-indigo-500 rounded-full w-full"
              loading={isSubmitting}
            >
              <span>Sign Up</span>
              <ArrowRightOutlined className="text-sm flex justify-center items-center leading-none" />
            </Button>
          </Form.Item>
        </Form>
        <p className="text-sm flex justify-center items-center">
          Already have an account?
          <Link
            to={'/login'}
            className="underline font-semibold p-2 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </p>
      </div>),
    },
    {
      title: 'Email Verification',
      content: (
        <div className='w-2/3 min-w-fit'>
          <h1 className="uppercase font-semibold text-xl text-center my-4">
            Email Verification
          </h1>
          <div className='mt-4'>
            <p className='text-gray-700 text-sm'>Please enter 6 digital code send to <span className='font-semibold'>example@email.com</span></p>
            <p className='text-gray-700 text-sm'>Don't forget to check your spam section</p>
          </div>
          <InputNumber addonBefore="OTP Code: " placeholder='Enter OTP Code' controls={false} className='mt-8 mb-4 w-full' />
          <p className='text-gray-700 text-sm mb-6'>Didn't receive the code? <span className='underline text-indigo-500 font-semibold hover:cursor-pointer'>Resend</span></p>
          <div className='flex flex-col gap-2 justify-center items-center w-full mb-4'>
            <Button className='flex justify-center items-center rounded-full w-full px-6 py-2 bg-indigo-500 text-white hover:bg-white' onClick={() => {
              navigate(
                '/'
              )
            }}>Verify Code</Button>
            <Button type="default" onClick={backHandler} className='rounded-full w-full'>Back</Button>
          </div>
          <p className=" text-sm flex justify-center items-center">
            Already have an account?{' '}
            <Link
              to={'/login'}
              className="underline font-semibold p-2 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      ),
    },
  ];
  const items = steps.map((item) => ({ key: item.title, title: item.title }));
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="h-screen w-screen flex justify-center items-center overflow-hidden fixed">
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
          <p className=" mt-2 mb-4 text-sm text-center">Join With Us Now</p>
          <img src={signUpImg} className="object-contain box-border px-8" />
        </div>
        {/* Right Section */}
        <div className="flex flex-col flex-1 justify-start items-center bg-white mt-4">
          <div className='w-full px-12'>
            <Steps items={items} current={currentStep} size='small' className='mt-4' />
          </div>
          {steps[currentStep].content}
        </div>
      </div>
      <img
        src={wave}
        className="absolute bottom-0 left-0 right-0 -z-20 w-screen overflow-hidden "
      />
    </div>
  );
}
