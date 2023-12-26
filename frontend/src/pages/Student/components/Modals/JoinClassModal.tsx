import { Button, Form, Input, Modal, Space, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
import { CopyOutlined, UserAddOutlined } from '@ant-design/icons';

export default function JoinClassModal() {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);

    const values = await form.validateFields();
    form.resetFields();
    console.log('Submit Values: ', values);
    messageApi.open({
      type: 'success',
      content: (
        <span>
          Send invitation to
          <span className="font-semibold">{values.code}</span> successfully
        </span>
      ),
      duration: 1,
    });

    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 1000);
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
