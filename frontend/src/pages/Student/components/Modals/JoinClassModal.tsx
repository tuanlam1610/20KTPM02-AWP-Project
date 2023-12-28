import { Button, Form, Input, Modal, Space, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import axios from 'axios';
import { useState } from 'react';
import { setClasses } from '../../../../redux/appSlice';
import { useAppDispatch, useAppSelector } from '../../../../redux/store';

export default function JoinClassModal() {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const userInfo = useAppSelector((state) => state.app.userInfo);
  const [form] = useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const showModal = () => {
    setOpen(true);
  };

  const fetchClassList = async () => {
    try {
      const studentId = userInfo?.studentId.id;
      const res = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_SERVER_URL
        }/students/${studentId}/getAllClassesOfstudent`,
      );
      console.log(res.data);
      dispatch(setClasses(res.data));
    } catch (err) {
      console.log(err);
    }
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    const values = await form.validateFields();
    form.resetFields();
    console.log('Submit Values: ', values);
    try {
      const studentId = userInfo?.studentId.id;
      console.log(
        `${
          import.meta.env.VITE_REACT_APP_SERVER_URL
        }/students/${studentId}/joinClassByCode`,
        { code: values.code },
      );
      const res = await axios.patch(
        `${
          import.meta.env.VITE_REACT_APP_SERVER_URL
        }/students/${studentId}/joinClassByCode`,
        values,
      );
      await fetchClassList();
      messageApi.open({
        type: 'success',
        content: 'Join Class Successfully',
        duration: 1,
      });
      setOpen(false);
      setConfirmLoading(false);
    } catch (err) {
      console.log(err);
      messageApi.open({
        type: 'error',
        content: `Join Class Failed`,
        duration: 1,
      });
      setOpen(false);
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  return (
    <>
      {contextHolder}
      <Button onClick={showModal}>Join Class</Button>
      <Modal
        title={
          <h1 className="text-2xl text-indigo-500 pb-4 mb-4 border-b-[1px] border-gray-300 uppercase">
            {`Join Class`}
          </h1>
        }
        centered
        footer={<></>}
        open={open}
        onOk={handleOk}
        okText="Confirm"
        okButtonProps={{ className: 'bg-indigo-500' }}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        styles={{
          header: {
            fontSize: 20,
          },
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label={<p className="">{`Join class by code`}</p>}
            rules={[
              {
                required: true,
                message: 'Please enter class code',
              },
            ]}
            name={'code'}
            className="w-full mb-4"
          >
            <Space.Compact className="w-full">
              <Input type="text" placeholder="Enter class code..." />
              <Button
                onClick={handleOk}
                className="bg-indigo-500 text-white hover:text-white"
              >
                Join
              </Button>
            </Space.Compact>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
