import { UserDeleteOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Divider } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import InviteMemberModal from '../Modals/InviteMemberModal';

export default function ClassMemberTabView() {
  const params = useParams();
  const classId: number = params.id ? Number(params.id) : 0;
  const [members, setMembers] = useState<{
    students: { name: string; type: string }[];
    teachers: { name: string; type: string }[];
  }>({ students: [], teachers: [] });

  const randomBg = () => {
    const randomColor: string = Math.floor(Math.random() * 16777215).toString(
      16,
    );
    return randomColor;
  };

  const fetchClassMembers = async () => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_SERVER_URL
        }/class/${classId}/getMembers`,
      );
      console.log(res);
      return res;
    } catch (err) {
      const sampleMembers = [
        {
          name: 'Nguyen Van A',
          type: 'teacher',
        },
        {
          name: 'Nguyen Van B',
          type: 'student',
        },
        {
          name: 'Nguyen Van C',
          type: 'student',
        },
        {
          name: 'Nguyen Van D',
          type: 'student',
        },
        {
          name: 'Nguyen Van E',
          type: 'teacher',
        },
      ];
      const students = sampleMembers.filter(
        (member) => member.type == 'student',
      );
      const teachers = sampleMembers.filter(
        (member) => member.type == 'teacher',
      );
      setMembers({
        students,
        teachers,
      });
    }
  };

  useEffect(() => {
    fetchClassMembers();
  }, []);

  return (
    <div className="flex justify-center">
      <div className="w-2/3  p-4 border-[1px] border-gray-300 h-fit rounded-md flex flex-col gap-8">
        {/* Class Members List */}
        {/* Teachers */}
        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-semibold text-indigo-500">
              Teachers:
            </h1>
            <div className="flex gap-4">
              <p className="text-lg font-semibold text-indigo-500 me-2">
                {`${members.teachers.length} teachers`}
              </p>
              {/* Invite */}
              <InviteMemberModal type="teacher" />
            </div>
          </div>
          <Divider className="mx-0 mt-2 mb-4 rounded-full h-[1px] text-indigo-500 bg-indigo-500" />
          <div>
            {members.teachers.map((teacher, index) => {
              const bgColor = randomBg();
              console.log(bgColor);
              return (
                <div>
                  <div className="flex justify-between items-center p-4">
                    <div className="flex items-center gap-4">
                      <Avatar
                        className=""
                        icon={<UserOutlined />}
                        style={{ backgroundColor: `#${bgColor}` }}
                      />
                      <p className="font-semibold">{teacher.name}</p>
                    </div>
                    <Button icon={<UserDeleteOutlined />} type="text" />
                  </div>
                  {index !== members.teachers.length - 1 && (
                    <Divider className="m-0 rounded-full bg-gray-300" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {/* Students */}
        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-semibold text-indigo-500">
              Students:
            </h1>
            <div className="flex gap-4">
              <p className="text-lg font-semibold text-indigo-500 me-2">
                {`${members.students.length} teachers`}
              </p>
              {/* Invite */}
              <InviteMemberModal type="student" />
            </div>
          </div>
          <Divider className="mx-0 mt-2 mb-4 rounded-full h-[1px] text-indigo-500 bg-indigo-500" />
          <div>
            {members.students.map((student, index) => {
              const bgColor = randomBg();
              console.log(bgColor);
              return (
                <div>
                  <div className="flex justify-between items-center p-4">
                    <div className="flex items-center gap-4">
                      <Avatar
                        className=""
                        icon={<UserOutlined />}
                        style={{ backgroundColor: `#${bgColor}` }}
                      />
                      <p className="font-semibold">{student.name}</p>
                    </div>
                    <Button icon={<UserDeleteOutlined />} type="text" />
                  </div>
                  {index != members.students.length - 1 && (
                    <Divider className="m-0 rounded-full bg-gray-300" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
