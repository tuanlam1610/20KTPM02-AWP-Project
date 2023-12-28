import { UserDeleteOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Divider, Empty } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../../redux/store';

export default function ClassMemberTabView() {
  const params = useParams();
  const classes = useAppSelector((state) => state.app.classes);
  const classIndex: number = params.id ? Number(params.id) : 0;
  const classDetails = classes[classIndex];
  const [members, setMembers] = useState<{
    students: { id: string; name: string }[];
    teachers: { id: string; name: string }[];
  }>({ students: [], teachers: [] });

  const randomBg = () => {
    const randomColor: string = Math.floor(Math.random() * 16777215).toString(
      16,
    );
    return randomColor;
  };

  const fetchClassMembers = async () => {
    try {
      console.log('FETCHED');
      console.log(classDetails);
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/classes/${
          classDetails.id
        }/getStudentsTeachers`,
      );
      const resultData = res.data;
      console.log(resultData);
      setMembers({
        students: resultData.userStudents,
        teachers: resultData.userTeachers,
      });
      return res;
    } catch (err) {
      const sampleMembers = {
        userStudents: [
          {
            id: 'student1',
            name: 'Nguyen Van B',
          },
          {
            id: 'student2',
            name: 'Nguyen Van C',
          },
          {
            id: 'student3',
            name: 'Nguyen Van D',
          },
        ],
        userTeachers: [
          {
            id: 'teacher1',
            name: 'Nguyen Van A',
          },
          {
            id: 'teacher2',
            name: 'Nguyen Van E',
          },
        ],
      };
      setMembers({
        students: sampleMembers.userStudents,
        teachers: sampleMembers.userTeachers,
      });
    }
  };

  useEffect(() => {
    console.log('Fetch class members');
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
            </div>
          </div>
          <Divider className="mx-0 mt-2 mb-4 rounded-full h-[1px] text-indigo-500 bg-indigo-500" />
          <div>
            {members.teachers.length <= 0 && (
              <div className="flex justify-center w-full">
                <Empty
                  description="No Teacher Found"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </div>
            )}
            {members.teachers.map((teacher, index) => {
              const bgColor = randomBg();
              return (
                <div key={index}>
                  <div className="flex justify-between items-center p-4">
                    <div className="flex items-center gap-4">
                      <Avatar
                        className=""
                        icon={<UserOutlined />}
                        style={{ backgroundColor: `#${bgColor}` }}
                      />
                      <p className="font-semibold">{teacher.name}</p>
                    </div>
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
                {`${members.students.length} students`}
              </p>
            </div>
          </div>
          <Divider className="mx-0 mt-2 mb-4 rounded-full h-[1px] text-indigo-500 bg-indigo-500" />
          <div>
            {members.students.length <= 0 && (
              <div className="flex justify-center w-full">
                <Empty
                  description="No Student Found"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </div>
            )}
            {members.students.map((student, index) => {
              const bgColor = randomBg();
              return (
                <div key={index}>
                  <div className="flex justify-between items-center p-4">
                    <div className="flex items-center gap-4">
                      <Avatar
                        className=""
                        icon={<UserOutlined />}
                        style={{ backgroundColor: `#${bgColor}` }}
                      />
                      <p className="font-semibold">{student.name}</p>
                    </div>
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
