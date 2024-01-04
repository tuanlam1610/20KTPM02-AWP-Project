import { DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Select, Tooltip, notification } from 'antd';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import {
  deleteGradeComposition,
  updateGradeComposition,
} from '../../redux/classDetailThunks';

export default function GradeItem({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const params = useParams();
  const classId: string = params.id ? params.id : '';
  const grade = useAppSelector((state) => state.class.gradeCompositionMap[id]);
  const gradeCompositionMap = useAppSelector(
    (state) => state.class.gradeCompositionMap,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');

  const showModal = () => {
    setIsModalOpen(true);
    setSelectedValue('');
  };

  const handleChange = (value: string) => {
    setSelectedValue(value);
  };

  const [api, contextHolder] = notification.useNotification({
    stack: { threshold: 3 },
  });
  const openNotification = (message: string, description: string) => {
    api['error']({
      message: message,
      description: description,
      duration: 2,
    });
  };

  const handleOk = () => {
    if (selectedValue !== '') {
      console.log(selectedValue);
      dispatch(deleteGradeComposition({ gradeId: id }));
      dispatch(
        updateGradeComposition({
          gradeId: selectedValue,
          body: {
            percentage:
              gradeCompositionMap[selectedValue].percentage + grade.percentage,
          },
        }),
      );
      setIsModalOpen(false);
    } else {
      openNotification('You have to select a grade', '');
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedValue('');
  };

  return (
    <div key={grade.id} className="flex gap-2 items-center">
      {contextHolder}
      <div
        className={`flex justify-between items-center w-2/3 border bg-slate-100 pl-4 pr-2 py-2 rounded-md cursor-pointer hover:bg-slate-200`}
      >
        {grade.name}
        <div className="bg-white px-4 py-2 rounded mr-4">
          {grade.percentage}%
        </div>
      </div>
      {!grade.isFinalized && (
        <>
          <Tooltip title="Remove">
            <Button
              shape="circle"
              size="small"
              icon={<DeleteOutlined />}
              danger
              onClick={() => setIsModalOpen(true)}
            />
          </Tooltip>
          <Modal
            title={'Delete Grade Composition'}
            open={isModalOpen}
            centered
            onCancel={handleCancel}
            footer={
              <div>
                <Button key="back" onClick={handleCancel}>
                  Back
                </Button>
                <Button key="submit" onClick={handleOk} danger>
                  Delete
                </Button>
              </div>
            }
          >
            <div>
              <div className="flex gap-2 mb-2">
                <p>Grade</p>
                <Tooltip
                  mouseEnterDelay={0.5}
                  title="Choose the grade composition to inherit the percentage"
                >
                  <InfoCircleOutlined />
                </Tooltip>
              </div>

              <Select
                style={{ width: '200px' }}
                value={selectedValue}
                onChange={handleChange}
                options={Object.values(gradeCompositionMap)
                  .filter((g) => g.id !== id && !g.isFinalized)
                  .map((g) => {
                    return {
                      value: g.id,
                      label: g.name,
                    };
                  })}
              />
            </div>
          </Modal>
        </>
      )}
    </div>
  );
}
