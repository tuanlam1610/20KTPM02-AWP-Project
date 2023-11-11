import { ArrowRightOutlined, LeftOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Spin } from 'antd';
import loginImg from '../assets/imgs/Login-amico.png';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import useForm from 'antd/es/form/hooks/useForm';

type FieldType = {
  fullname?: string;
  email?: string;
  dob?: string;
  password?: string;
  confirmPassword?: string;
};

export default function SignUpPage() {
  const [form] = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFinish = async (values: FieldType) => {
    setIsSubmitting(true);
    console.log('Success:', values);
    await new Promise((r) => setTimeout(r, 3000));
    setIsSubmitting(false);
    form.resetFields();
  };
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center ">
      <div className="flex flex-row w-7/12 h-2/3 rounded-xl border-2 border-gray-300 shadow-xl overflow-auto">
        {/* Right Section */}
        <div className="w-2/5 flex flex-col justify-start items-center bg-blue-200">
          <div className="w-full flex justify-start my-4">
            <Link to={'/'}>
              <Button className="ms-4 flex justify-center items-center border-gray-500">
                <LeftOutlined />
              </Button>
            </Link>
          </div>
          <h1 className="uppercase font-semibold text-xl text-center">
            HQL Application
          </h1>
          <p className=" mt-2 mb-4 text-sm text-center">Welcome to HQL</p>
          <img src={loginImg} className="object-contain box-border px-8" />
        </div>
        {/* Left Section */}
        <div className="flex flex-col flex-1 justify-center items-center">
          {isSubmitting && <Spin />}
          <h1 className="uppercase font-semibold text-xl text-center my-4">
            Sign Up
          </h1>
          <Form
            form={form}
            className="mt-4"
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              label="Fullname"
              name="fullname"
              rules={[
                { required: true, message: 'Please input your fullname!' },
              ]}
              className="ms-0"
            >
              <Input />
            </Form.Item>
            <Form.Item<FieldType>
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
              className="ms-0"
            >
              <Input />
            </Form.Item>
            <Form.Item<FieldType>
              label="Date Of Birth"
              name="dob"
              rules={[{ required: true, message: 'Please input your dob!' }]}
              className="ms-0"
            >
              <DatePicker />
            </Form.Item>

            <Form.Item<FieldType>
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item<FieldType>
              label="Confirm Password"
              name="confirmPassword"
              rules={[
                { required: true, message: 'Please confirm your password!' },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8 }}>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-blue-500 rounded-full px-8 flex justify-center items-center"
              >
                <span>Sign Up</span>
                <ArrowRightOutlined className="text-sm flex justify-center items-center leading-none" />
              </Button>
            </Form.Item>
          </Form>
          <p className="text-sm">
            Already have an account?{' '}
            <Link
              to={'/login'}
              className="underline font-semibold p-2 hover:text-blue-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
