import { ArrowRightOutlined, HomeOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, Steps, notification } from 'antd';
import useForm from 'antd/es/form/hooks/useForm';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import forgotPassImg from '../assets/imgs/Forgot password-pana (3).png';
import wave from '../assets/imgs/wave.svg';
import axios from 'axios';

type EmailField = {
    email?: string;
};

export default function RecoverPasswordPage() {
    const [form] = useForm();
    const [api, contextHolder] = notification.useNotification({
        stack: { threshold: 3 },
    });

    const openNotification = () => {
        api['error']({
            message: 'Please finish all previous steps',
            duration: 2,
        });
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const onFinishEmail = async (values: EmailField) => {
        try {
            setIsSubmitting(true);
            document.body.style.cursor = 'wait';
            console.log(values)
            await axios.post(
                `${import.meta.env.VITE_REACT_APP_SERVER_URL}/auth/local/resetPassword`,
                values,
            )
            nextHandler()
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

    const backHandler = () => {
        setCurrentStep(currentStep - 1)
    }

    const nextHandler = () => {
        if (currentStep + 1 < steps.length) setCurrentStep(currentStep + 1)
    }

    const steps = [
        {
            title: "Email", content: (
                <div className='mt-4 w-2/3'>
                    <h1 className="uppercase font-semibold text-2xl text-center my-4">
                        Recover Password
                    </h1>
                    <p className='text-sm text-gray-500 text-center'>Please enter the email that is use for your account</p>
                    <Form
                        form={form}
                        className="mt-4 min-w-fit "
                        labelWrap
                        labelCol={{ span: 6 }}
                        labelAlign='left'
                        initialValues={{ remember: true }}
                        onFinish={onFinishEmail}
                        onFinishFailed={onFinishEmailFailed}
                        autoComplete="off"
                        rootClassName='flex flex-col items-center'
                    >
                        <Form.Item<EmailField>
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
                            className="w-full mb-4"
                        >
                            <Input type="text" placeholder="Enter your email" />
                        </Form.Item>

                        <Form.Item className='w-full mb-4'>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="flex justify-center items-center px-8 py-4 bg-indigo-500 rounded-full w-full"
                                loading={isSubmitting}
                            >
                                <span>Continue</span>
                                <ArrowRightOutlined className="text-sm flex justify-center items-center leading-none" />
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            )
        },
        {
            title: "Reset Password", content: (
                <div className='w-2/3 mt-4'>
                    <h1 className="uppercase font-semibold text-xl text-center my-4">
                        Reset Password
                    </h1>
                    <div>
                        <MailOutlined className='text-4xl' />
                    </div>
                    <div className='my-4 w-full overflow-hidden flex flex-col gap-4 text-gray-700 text-sm'>
                        <p>We've send a mail to</p>
                        <p className='font-semibold text-lg'>{form.getFieldValue('email') != "" ? form.getFieldValue('email') : "example@email.com"}</p>
                        <div>
                            <p>Please click the link in your email to activate your account. The link in the mail will expire in 5 minutes.</p>
                            <p> Don't forget to check your spam section!</p>
                        </div>
                        <p className=''>Didn't receive a mail? <span className='underline text-indigo-500 font-semibold hover:cursor-pointer'
                            onClick={() => {
                                onFinishEmail({ email: form.getFieldValue('email') })
                            }}>Resend</span></p>
                    </div>
                    <Button type="default" onClick={backHandler} className='rounded-full w-full'>Back</Button>
                </div>
            )
        },
    ]

    const items = steps.map((item) => ({ key: item.title, title: item.title }));
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
                    <p className=" mt-2 mb-4 text-sm text-center">Recover Your Password</p>
                    <img src={forgotPassImg} className="object-contain box-border px-8" />
                </div>
                {/* Right Section */}
                <div className="flex flex-col flex-1 justify-start items-center bg-white mt-4">
                    <div className='w-2/3'>
                        <Steps size='small' items={items} current={currentStep} className='mt-4' onChange={(step) => {
                            if (step > currentStep) {
                                openNotification()
                            } else {
                                setCurrentStep(step)
                            }
                        }} />
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
