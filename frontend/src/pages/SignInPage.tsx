import { ArrowRightOutlined, LeftOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import useForm from 'antd/es/form/hooks/useForm';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import loginImg from '../assets/imgs/Login-amico.png';

type FieldType = {
  email?: string;
  password?: string;
  remember?: string;
};

export default function SignInPage() {
  const navigate = useNavigate()
  const [form] = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const onFinish = async (values: FieldType) => {
    setIsSubmitting(true);
    document.body.style.cursor = 'wait'
    console.log('Success:', values);
    await new Promise((r) => setTimeout(r, 3000));
    setIsSubmitting(false);
    document.body.style.cursor = 'default'
    form.resetFields();
    navigate('/home')
  };
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      {/* Content */}
      <div className="flex flex-row w-7/12 h-2/3 rounded-xl border-2 border-gray-300 shadow-xl overflow-auto">
        {/* Left Section */}
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
        {/* Right Section */}
        <div className="flex flex-col flex-1 justify-center items-center">
          {/* {isSubmitting && <Spin />} */}
          <h1 className="uppercase font-semibold text-2xl text-center my-4">
            Sign In
          </h1>
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
              rules={[{ required: true, message: 'Please input your email!' }]}
              name={'email'}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Password"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
              name={'password'}
            >
              <Input.Password />
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
                className="bg-blue-500 rounded-full px-8 flex justify-center items-center"
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
              className="underline font-semibold p-2 hover:text-blue-500"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
