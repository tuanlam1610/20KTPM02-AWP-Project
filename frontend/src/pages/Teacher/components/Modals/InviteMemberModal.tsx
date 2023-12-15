import { Button, Form, Input, Modal, Space, message } from 'antd'
import { useForm } from 'antd/es/form/Form';
import { useState } from 'react'
import { UserAddOutlined } from '@ant-design/icons';


export default function InviteMemberModal() {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);

    const values = await form.validateFields()
    form.resetFields()
    console.log("Submit Values: ", values)
    messageApi.open({
      type: 'success',
      content: (<span>Send invitation to <span className='font-semibold'>{values.email}</span> successfully</span>),
      duration: 1
    });

    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 1000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    form.resetFields()
    setOpen(false);
  };

  return (
    <>
      {contextHolder}
      <Button onClick={showModal} icon={<UserAddOutlined />}>
        Invite
      </Button>
      <Modal
        title={<h1 className='text-2xl text-indigo-500 pb-4 mb-4 border-b-[1px] border-gray-300 uppercase'>Invite Member</h1>}
        centered
        footer={<></>}
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
            label={<p className=''>Invite new member by email:</p>}
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
            <Space.Compact className='w-full'>
              <Input type="text" placeholder="example@email.com" />
              <Button onClick={handleOk} className='bg-indigo-500 text-white hover:text-white'>Invite</Button>
            </Space.Compact>
          </Form.Item>
        </Form>
        <p className='text-center text-lg font-semibold border-b-[1px] border-b-black leading-[0.1em] my-8'><span className='bg-white p-2'>Or</span></p>
        <p className='mb-2'>Send invite to use the link below:</p>
        <Input readOnly value={"https://www.edulingo/class01/invitationlink-fwienfwef"} />
      </Modal></>
  )
}