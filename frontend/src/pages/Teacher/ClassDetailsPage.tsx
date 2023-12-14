import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../redux/store';
import { Button } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import InviteMemberModal from './components/Modals/InviteMemberModal';

export default function HomePage() {
  const params = useParams()
  console.log(params)
  const classId: number = params.id ? Number(params.id) : 0
  const classes = useAppSelector((state) => state.teacher.classes)
  const classDetails = classes[classId]

  const handleCopyClassId = () => {
    console.log("Copied Class Id")
    navigator.clipboard.writeText(`000${classId}`)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Content */}
      <div className="flex flex-col mx-8 my-8 gap-4">
        <div className='flex justify-between items-center'>
          <p className="text-4xl font-semibold">{classDetails.name}</p>
        </div>
        <p className='text-gray-500 italic mb-4'>{classDetails.description}</p>
        {/* Class Code & Invite Section */}
        <div className='flex justify-between items-center'>
          {/* Class Code */}
          <div className='flex flex-col border-[1px] border-gray-400 rounded-lg overflow-hidden'>
            <div className='py-2 px-4 bg-indigo-500 text-white'>
              <p>Class Code:</p>
            </div>
            <div className='flex justify-between items-center py-2 px-4'>
              <p>000{classId}</p>
              <Button icon={<CopyOutlined />} size='small' className='text-gray-400' onClick={() => { handleCopyClassId() }} />
            </div>
          </div>
          {/* Invite */}
          <InviteMemberModal />
        </div>
        <div className='flex justify-center'>
          <p className='text-3xl font-semibold text-indigo-500'>{classId}</p>
        </div>
      </div>

    </div>
  );
}
