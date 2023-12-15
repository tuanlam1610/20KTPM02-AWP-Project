import { CopyOutlined, LeftOutlined } from '@ant-design/icons';
import { Button, Tabs, TabsProps } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../redux/store';
import InviteMemberModal from './components/Modals/InviteMemberModal';
import ClassDetailsTabView from './components/TabViews/ClassDetailsTabView';
import ClassMemberTabView from './components/TabViews/ClassMemberTabView';

export default function HomePage() {
  const params = useParams()
  console.log(params)
  const classId: number = params.id ? Number(params.id) : 0
  const classes = useAppSelector((state) => state.teacher.classes)
  const classDetails = classes[classId]
  const navigate = useNavigate()

  const handleCopyClassId = () => {
    console.log("Copied Class Id")
    navigator.clipboard.writeText(`000${classId}`)
  }

  const handleBackButton = () => {
    navigate(-1)
  }

  const tabItems: TabsProps['items'] = [
    {
      key: 'details',
      label: 'Class Details',
      children: <ClassDetailsTabView />
    },
    {
      key: 'members',
      label: "Members",
      children: <ClassMemberTabView />
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Content */}
      <div className="flex flex-col mx-8 my-8 gap-4">
        <div className=''>
          <Button icon={<LeftOutlined />} onClick={handleBackButton}>Back</Button>
        </div>
        <div className='flex justify-between items-center'>
          <p className="text-4xl font-semibold">{classDetails.name}</p>
          {/* Class Code & Invite Section */}
          <div className='flex justify-between items-center gap-4'>
            {/* Class Code */}
            <div className='flex flex-col border-[1px] border-gray-400 rounded-lg overflow-hidden'>
              <div className='py-1 px-6 bg-indigo-500 text-white flex justify-center'>
                <p>Class Code:</p>
              </div>
              <div className='flex justify-between items-center py-1 px-4'>
                <p>000{classId}</p>
                <Button icon={<CopyOutlined />} size='small' className='text-gray-400' onClick={() => { handleCopyClassId() }} />
              </div>
            </div>
            {/* Invite */}
            <InviteMemberModal />
          </div>
        </div>
        <p className='text-gray-500 italic mb-4'>{classDetails.description}</p>

        <Tabs defaultActiveKey='1' items={tabItems} onChange={(value) => {
          console.log(value)
        }} />
      </div>

    </div>
  );
}