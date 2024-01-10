import { ExclamationOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Form, InputNumber, Modal, Space, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../../redux/store';

export default function RequestGradeReviewModal({
  currentGrade,
  gradeCompositionId,
  studentGradeId,
}) {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const userInfo = useAppSelector((state) => state.app.userInfo);
  const [form] = useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const params = useParams();
  const classId: string = params.id ? params.id : '';

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    const values = await form.validateFields();
    form.resetFields();
    const expectedGrade = Math.min(10, Math.max(0, values.expectedGrade));
    try {
      const studentId = userInfo?.studentId.id;
      const body = {
        expectedGrade,
        explanation: values.explanation,
        status: 'Open',
        currentGrade,
        studentId,
        studentGradeId,
        classId,
        comment: [],
      };
      const res = await axios.post(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/grade-reviews/notify`,
        body,
      );
      messageApi.open({
        type: 'success',
        content: 'Successfully request a grade review',
        duration: 1,
      });
      setOpen(false);
      setConfirmLoading(false);
    } catch (err) {
      messageApi.open({
        type: 'error',
        content: `Request a grade review failed`,
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
      <Button
        size="small"
        shape="circle"
        icon={<ExclamationOutlined />}
        onClick={showModal}
      />
      <Modal
        title={
          <h1 className="text-2xl text-indigo-500 pb-4 mb-4 border-b-[1px] border-gray-300 uppercase">
            Request A Grade Review
          </h1>
        }
        centered
        footer={
          <Button
            htmlType="submit"
            icon={<PlusCircleOutlined />}
            onClick={handleOk}
          >
            Add
          </Button>
        }
        open={open}
        onOk={handleOk}
        okText="Confirm"
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
            label={<p className="">{`Your Expected Grade`}</p>}
            rules={[
              {
                required: true,
                message: 'Please enter class code',
              },
              {
                max: 10,
                min: 0,
                message:
                  'Expected Grade must be less or equal 10 and more or equal than 0',
              },
            ]}
            name={'expectedGrade'}
            className="w-full mb-4"
          >
            <Space.Compact className="w-full">
              <InputNumber min={0} max={10} placeholder="10" />
            </Space.Compact>
          </Form.Item>

          <Form.Item
            label={<p className="">{`Your Explanation`}</p>}
            rules={[
              {
                required: true,
                message: 'You have to explain about the review',
              },
            ]}
            name={'explanation'}
            className="w-full mb-4"
          >
            <Space.Compact className="w-full">
              <TextArea rows={4} placeholder="Your explanation..." />
            </Space.Compact>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
