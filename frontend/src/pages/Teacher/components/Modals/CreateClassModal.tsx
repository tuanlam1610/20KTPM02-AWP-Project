import { Button, Form, Input, Modal, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../redux/store';
import { setClasses } from '../../../../redux/appSlice';
import axios from 'axios';

export default function CreateClassModal() {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.app.userInfo);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const showModal = () => {
    setOpen(true);
  };

  const fetchClassList = async () => {
    try {
      const teacherId = userInfo?.teacherId.id;
      const res = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_SERVER_URL
        }/teachers/${teacherId}/getAllClasses`,
      );
      dispatch(setClasses(res.data));
    } catch (err) {}
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    const values = await form.validateFields();
    form.resetFields();
    try {
      const teacherId = userInfo?.teacherId?.id;
      const classDetails = {
        name: values.name,
        code: values.code,
        invitationLink: values.code,
        description: values.description ? values.description : '',
        classOwnerId: teacherId,
        classTeachers: [teacherId],
      };
      const result = await axios.post(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/classes`,
        classDetails,
      );
      await fetchClassList();
      messageApi.open({
        type: 'success',
        content: 'Create class successfully',
        duration: 1,
      });
      setOpen(false);
      setConfirmLoading(false);
    } catch (err) {
      messageApi.open({
        type: 'error',
        content: 'Create class failed',
        duration: 1,
      });
      setOpen(false);
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      {contextHolder}
      <Button onClick={showModal}>Create New Class</Button>
      <Modal
        title={
          <h1 className="text-2xl text-indigo-500 pb-4 mb-4 border-b-[1px] border-gray-300 uppercase">
            Create New Class
          </h1>
        }
        centered
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
            label="Class Name"
            rules={[
              {
                required: true,
                message: 'Please enter class name!',
              },
            ]}
            name={'name'}
            className="w-full mb-4"
          >
            <Input type="text" placeholder="Enter class name" />
          </Form.Item>
          <Form.Item
            label="Class Code"
            rules={[
              {
                required: true,
                message: 'Please enter class code!',
              },
            ]}
            name={'code'}
            className="w-full mb-4"
          >
            <Input type="text" placeholder="Enter class code" />
          </Form.Item>
          <Form.Item
            label="Description"
            name={'description'}
            className="w-full mb-4"
          >
            <TextArea
              placeholder="Enter description for class"
              autoSize={{ minRows: 4, maxRows: 4 }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
