import { ArrowRightOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Steps } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import forgotPassImg from '../assets/imgs/Forgot password-pana (3).png';
import wave from '../assets/imgs/wave.svg';
import useForm from 'antd/es/form/hooks/useForm';

type EmailField = {
    email?: string;
};

type PasswordField = {
    password?: string;
    rePassword?: string;
};

export default function RecoverPasswordPage() {
    const navigate = useNavigate();
    const [form] = useForm();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const onFinishEmail = async (values: EmailField) => {
        try {
            setIsSubmitting(true);
            document.body.style.cursor = 'wait';
            console.log(values)
            nextHandler()
            // const signInResult = await axios.post(
            //     `${import.meta.env.VITE_REACT_APP_SERVER_URL}/auth/local/signin`,
            //     values,
            // );
            // localStorage.setItem('refreshToken', signInResult.data.refreshToken);
            // localStorage.setItem('accessToken', signInResult.data.accessToken);
            // navigate('/home');
            setIsSubmitting(false);
            document.body.style.cursor = 'default';
        } catch (err) {
            console.log(err);
            setIsSubmitting(false);
            document.body.style.cursor = 'default';
        }
    };
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const onFinishEmailFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const onFinishPassword = async (values: PasswordField) => {
        try {
            setIsSubmitting(true);
            document.body.style.cursor = 'wait';
            console.log(values)
            navigate('/')
            // const signInResult = await axios.post(
            //     `${import.meta.env.VITE_REACT_APP_SERVER_URL}/auth/local/signin`,
            //     values,
            // );
            // localStorage.setItem('refreshToken', signInResult.data.refreshToken);
            // localStorage.setItem('accessToken', signInResult.data.accessToken);
            // navigate('/home');
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

    const backHandler = () => {
        setCurrentStep(currentStep - 1)
    }

    const nextHandler = () => {
        setCurrentStep(currentStep + 1)
    }

    const steps = [
        {
            title: "Email", content: (
                <div className='mt-4'>
                    <h1 className="uppercase font-semibold text-2xl text-center my-4">
                        Recover Password
                    </h1>
                    <p className='text-sm text-gray-500'>Please enter the email that is use for your account</p>
                    <Form
                        form={form}
                        className="mt-4"
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinishEmail}
                        onFinishFailed={onFinishEmailFailed}
                        autoComplete="off"
                    >
                        <Form.Item<EmailField>
                            label="Email"
                            rules={[
                                {
                                    required: false,
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

                        <Form.Item wrapperCol={{ offset: 8 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="bg-indigo-500 rounded-full px-8 flex justify-center items-center"
                                loading={isSubmitting}
                            >
                                <span>Continue</span>
                                <ArrowRightOutlined className="text-sm flex justify-center items-center leading-none" />
                            </Button>
                        </Form.Item>
                    </Form>
                    {/* <p className="text-sm">
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
                    </Link> */}

                </div>
            )
        },
        {
            title: "Verify Email", content: (
                <div className='mt-4'>
                    <h1 className="uppercase font-semibold text-xl text-center my-4">
                        Email Verification
                    </h1>
                    <p className='text-gray-700 text-sm'>Please enter 6 digital code send to <span className='font-semibold'>example@email.com</span></p>
                    <p className='text-gray-700 text-sm'>Don't forget to check your spam section</p>
                    <InputNumber addonBefore="OTP Code: " placeholder='Enter OTP Code' controls={false} className='my-8' />
                    <p className='text-gray-700 text-sm'>Didn't receive the code? <span className='underline text-indigo-500 font-semibold hover:cursor-pointer'>Resend</span></p>
                    <div className='flex gap-2 justify-center items-center'>
                        <Button type="text" onClick={backHandler}>Back</Button>
                        <Button className='flex justify-center items-center my-4 px-4 py-2 bg-indigo-500 text-white hover:bg-white' onClick={() => {
                            nextHandler()
                        }}>Verify Code</Button>
                    </div>
                </div>
            )
        },
        {
            title: "Reset Password", content: (
                <div className='mt-4'>
                    <h1 className="uppercase font-semibold text-2xl text-center my-4">
                        Reset Password
                    </h1>
                    <p className='text-sm text-gray-500'>Create new password for your account</p>
                    <Form
                        form={form}
                        className="mt-4"
                        name="basic"
                        labelCol={{ span: 10 }}
                        wrapperCol={{ span: 16 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinishPassword}
                        onFinishFailed={onFinishPasswordFailed}
                        autoComplete="off"
                    >
                        <Form.Item<PasswordField>
                            label="New Password"
                            rules={[
                                { required: false, message: 'Please enter your password!' },
                            ]}
                            name={'password'}
                        >
                            <Input.Password placeholder="Enter your new password" />
                        </Form.Item>

                        <Form.Item<PasswordField>
                            label="Confirm Password"
                            rules={[
                                { required: false, message: 'Please enter your password!' },
                            ]}
                            name={'rePassword'}
                        >
                            <Input.Password placeholder="Enter your password again" />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 8 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="bg-indigo-500 rounded-full px-8 flex justify-center items-center"
                                loading={isSubmitting}
                            >
                                <span>Confirm</span>
                                <ArrowRightOutlined className="text-sm flex justify-center items-center leading-none" />
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            )
        }]

    const items = steps.map((item) => ({ key: item.title, title: item.title }));
    const [currentStep, setCurrentStep] = useState(0);


    return (
        <div className="h-screen w-screen flex justify-center items-center fixed">
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
                    <p className=" mt-2 mb-4 text-sm text-center">Recover Your Password</p>
                    <img src={forgotPassImg} className="object-contain box-border px-8" />
                </div>
                {/* Right Section */}
                <div className="flex flex-col flex-1 justify-start items-center bg-white mt-4">
                    <div className='w-full px-8'>
                        <Steps size='small' items={items} current={currentStep} className='mt-4' />
                    </div>
                    {steps[currentStep].content}
                </div>
            </div>
            <img
                src={wave}
                className="absolute bottom-0 left-0 right-0 -z-20 w-screen overflow-hidden"
            />
        </div>
    )
}
