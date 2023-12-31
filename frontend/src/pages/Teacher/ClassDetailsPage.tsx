import { CopyOutlined, LeftOutlined } from '@ant-design/icons';
import { Button, Tabs, TabsProps, message } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { reset } from '../../redux/classDetailSlice';
import { getGradeComposition } from '../../redux/classDetailThunks';
import { useAppDispatch } from '../../redux/store';
import ClassDetailsTabView from './components/TabViews/ClassDetailsTabView';
import ClassMemberTabView from './components/TabViews/ClassMemberTabView';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const classId: string = params.id ? params.id : '';
  const [classDetails, setClassDetails] = useState({
    name: '',
    description: '',
    code: '',
  });
  const navigate = useNavigate();

  const handleCopyClassId = () => {
    navigator.clipboard.writeText(classDetails.code);
    messageApi.open({
      type: 'success',
      content: 'Class code copied to clipboard',
      duration: 1,
    });
  };

  const handleBackButton = () => {
    navigate(-1);
  };

  const tabItems: TabsProps['items'] = [
    {
      key: 'details',
      label: 'Class Details',
      children: <ClassDetailsTabView />,
    },
    {
      key: 'members',
      label: 'Members',
      children: <ClassMemberTabView />,
    },
  ];

  const fetchClassDetails = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/classes/${classId}`,
      );
      setClassDetails(res.data);
    } catch (err) {}
  };

  useEffect(() => {
    dispatch(reset());
    fetchClassDetails();
    dispatch(getGradeComposition({ id: classId }));
  }, [classId]);

  return (
    <div className="flex flex-col">
      {contextHolder}
      {/* Content */}
      <div className="flex flex-col mx-8 my-4 gap-4">
        <div className="">
          <Button icon={<LeftOutlined />} onClick={handleBackButton}>
            Back
          </Button>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-4xl font-semibold">{classDetails?.name}</p>
          {/* Class Code & Invite Section */}
          <div className="flex justify-between items-center gap-4">
            {/* Class Code */}
            <div className="flex flex-col border-[1px] border-gray-400 rounded-lg overflow-hidden">
              <div className="py-1 px-6 bg-indigo-500 text-white flex justify-center">
                <p>Class Code:</p>
              </div>
              <div className="flex justify-between items-center py-1 px-4">
                <p>{classDetails?.code}</p>
                <Button
                  icon={<CopyOutlined />}
                  size="small"
                  className="text-gray-400"
                  onClick={() => {
                    handleCopyClassId();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <p className="text-gray-500 italic mb-4">{classDetails?.description}</p>

        <Tabs defaultActiveKey="1" items={tabItems} />
      </div>
    </div>
  );
}
