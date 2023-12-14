import { Button, Form, Input, Modal } from 'antd'
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react'

// type FieldType = {
//   name?: string;
//   description?: string;
// };

export default function CreateClassModal() {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = useForm();


  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);

    const values = await form.validateFields()
    form.resetFields()
    console.log("Submit Values: ", values)

    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  return (
    <>
      <Button onClick={showModal}>
        Create New Class
      </Button>
      <Modal
        title={<h1 className='text-2xl pb-2 mb-4 border-b-[1px] border-gray-300'>Create New Class</h1>}
        centered
        open={open}
        onOk={handleOk}
        okText="Confirm"
        okButtonProps={{ className: "bg-indigo-500" }}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        styles={{
          header: {
            fontSize: 20
          },
        }}>
        <Form form={form} layout='vertical'>
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
            label="Description"
            name={'description'}
            className="w-full mb-4"
          >
            <TextArea placeholder="Enter description for class" autoSize={{ minRows: 4, maxRows: 4 }} />
          </Form.Item>
        </Form>
      </Modal></>
  )
}
