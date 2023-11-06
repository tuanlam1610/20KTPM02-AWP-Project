import { Divider, Button, Checkbox, Form, Input } from 'antd'
import loginImg from '../assets/imgs/Login-amico.png'

export default function LoginView() {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const onFinish = (values: any) => {
        console.log('Success:', values);
    };
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    type FieldType = {
        username?: string;
        password?: string;
        remember?: string;
    };
    return (
        <div className='h-screen w-screen flex justify-center items-center '>
            <div className='flex flex-row w-7/12 h-2/3 rounded-xl border-2 border-gray-400'>
                {/* Right Section */}
                <div className='w-2/5 rounded-s-xl flex flex-col justify-center items-stretch'>
                    <h1 className='uppercase font-semibold text-xl text-center my-4'>Sign In</h1>
                    <img src={loginImg} className='object-contain box-border px-8' />
                </div>
                <Divider type="vertical" className='bg-black h-full' />
                {/* Left Section */}
                <div className='flex-1 justify-center items-center '>
                    <Form className='mt-32'
                        name="basic"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item<FieldType>
                            label="Username"
                            name="username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item<FieldType>
                            name="remember"
                            valuePropName="checked"
                            wrapperCol={{ offset: 8, span: 16 }}
                        >
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button type="primary" htmlType="submit" ghost>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>

            </div>
        </div>
    )
}
