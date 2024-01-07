import { EditOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Tooltip,
  message,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../../redux/store';
import { setIsEditingGradeComposition } from '../../../../redux/appSlice';

export default function EditGradeCompositionModal(props: any) {
  const dispatch = useAppDispatch();
  const [studentGrade, setStudentGrade] = useState(
    props?.record || {
      id: '',
      studentId: '',
      name: '',
      grade: 0,
    },
  );
  const classId = props?.classId;
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const showModal = () => {
    setOpen(true);
    setStudentGrade(
      props?.record || {
        id: '',
        studentId: '',
        name: '',
        grade: 0,
      },
    );
    dispatch(setIsEditingGradeComposition(true));
  };

  const handleCancel = () => {
    dispatch(setIsEditingGradeComposition(false));
    setOpen(false);
    setConfirmLoading(false);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    const values = await form.validateFields();
    form.resetFields();
    console.log(values, studentGrade);
    try {
      const newGrade = {
        grade: values?.grade,
      };
      const result = await axios.patch(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/student-grades/${
          studentGrade.id
        }/updateOneStudentGrade/${classId}`,
        newGrade,
      );
      console.log(result);
      messageApi.open({
        type: 'success',
        content: 'Update student grade successfully',
        duration: 1,
      });
      handleCancel();
    } catch (err) {
      console.log(err);
      messageApi.open({
        type: 'error',
        content: 'Something wrong when update student grade',
        duration: 1,
      });
      handleCancel();
    }
  };
  return (
    <>
      {contextHolder}
      {/* Button */}
      <div className="flex justify-center">
        <Tooltip title={'Edit'}>
          <Button icon={<EditOutlined />} onClick={showModal} />
        </Tooltip>
      </div>
      {/* Modal */}
      <Modal
        title={
          <h1 className="text-2xl text-indigo-500 pb-4 mb-4 border-b-[1px] border-gray-300 uppercase">
            Update Student Grade
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
            initialValue={studentGrade.studentId}
            label="Student ID"
            name={'studentId'}
            className="w-full mb-4"
          >
            <Input type="text" disabled />
          </Form.Item>
          <Form.Item
            initialValue={studentGrade.name}
            label="Student Name"
            name={'name'}
            className="w-full mb-4"
          >
            <Input type="text" disabled />
          </Form.Item>
          <Form.Item
            initialValue={studentGrade.grade}
            label="Grade"
            name={'grade'}
            className="w-full mb-4"
          >
            <InputNumber
              min={0}
              max={10}
              className="w-full"
              onChange={(value) => console.log(value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
