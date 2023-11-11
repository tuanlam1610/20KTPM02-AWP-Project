import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, DatePicker, Form, Input, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import { useState } from "react";

type FieldType = {
    fullname?: string;
    email?: string;
    dob?: string;
};

export default function UserProfilePage() {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [form] = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const userDefault: FieldType = {
        fullname: "Quang Nguyen",
        email: "nnquang20@clc.fitus.edu.vn",
        dob: "17/09/2002"
    }

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
        <div className="flex justify-center h-[80vh] mt-8">
            <div className="w-1/2 rounded-xl shadow-2xl border-2 border-gray-300 overflow-hidden">
                <div className="flex flex-col justify-center items-center h-1/4 min-h-fit bg-[url('https://media.sproutsocial.com/uploads/1c_facebook-cover-photo_clean@2x.png')] ">
                    <Avatar size={64} icon={<UserOutlined />} className='bg-indigo-500' />
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
                    <Form.Item<FieldType>
                        label="Fullname"
                        name="fullname"
                        initialValue={userDefault.fullname}
                        rules={[
                            { required: true, message: 'Please input your fullname!' },
                        ]}
                        className="ms-0"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Email"
                        initialValue={userDefault.email}
                        rules={[{ required: true, message: 'Please input your email!' }]}
                        name={'email'}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Date Of Birth"
                        name="dob"
                        initialValue={dayjs(userDefault.dob, "DD/MM/YYYY")}
                        rules={[{ required: true, message: 'Please input your dob!' }]}
                        className="ms-0"
                    >
                        <DatePicker format={"DD/MM/YYYY"} />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 9 }} >
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
                                onClick={() => { setIsEditing(!isEditing) }}
                            >
                                <span>Cancel</span>
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
                {isSubmitting && <Spin />}
            </div>
        </div>
    )
}
