import { Button, Select } from 'antd';
import newMember from '../assets/imgs/New team members-pana.png';
import wave from '../assets/imgs/wave.svg';
import { useState } from 'react';

export default function ChooseRolePage() {
  const [role, setRole] = useState('student');

  const handleConfirm = () => {
    console.log(role);
  };
  return (
    <div className="h-screen w-screen flex justify-center items-center fixed">
      {/* Content */}
      <div className="flex flex-col w-1/4 h-2/3 rounded-xl bg-white border-2 border-gray-300 shadow-xl overflow-hidden">
        {/* Right Section */}
        <div className="flex flex-col flex-1 w-full justify-start items-center bg-white mt-4">
          <div className="mt-4 w-full min-w-fit px-4 h-full">
            <h1 className="uppercase font-semibold text-2xl text-center text-indigo-500 my-4">
              Choose Your Role
            </h1>
            <img
              src={newMember}
              alt="new member img"
              className="h-1/3 object-contain box-border px-8 flex justify-center items-center w-full"
            />
            <div className="flex flex-col gap-2 mb-4">
              <h1 className="ms-2 font-semibold">Your Role:</h1>
              <Select
                className="w-full"
                defaultValue="student"
                onChange={(value) => {
                  setRole(value);
                }}
                options={[
                  { value: 'student', label: 'Student' },
                  { value: 'teacher', label: 'Teacher' },
                ]}
              />
            </div>
            <div className="flex justify-center">
              <Button
                className="flex justify-center items-center px-8 py-4 mb-2 bg-indigo-500 rounded-full w-full text-white"
                onClick={handleConfirm}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </div>
      <img
        src={wave}
        className="absolute bottom-0 left-0 right-0 -z-20 w-screen overflow-hidden"
      />
    </div>
  );
}
