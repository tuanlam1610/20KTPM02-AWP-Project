import { Button, Result, Spin, message } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import confirmImg from '../assets/imgs/Confirmed-amico.png';
import wave from '../assets/imgs/wave.svg';
import { useAppSelector } from '../redux/store';

export default function JoinClassByLink() {
  const navigate = useNavigate();
  const params = useParams();
  const classId: string = params.id ? params.id : '';
  const userInfo = useAppSelector((state) => state.app.userInfo);
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(true);

  const joinClassByLink = async () => {
    setIsLoading(true);
    try {
      const res = await axios.patch(
        `${
          import.meta.env.VITE_REACT_APP_SERVER_URL
        }/classes/${classId}/linkJoin/${userInfo?.id}`,
      );
      setIsSuccess(true);
      setIsLoading(false);
      messageApi.open({
        type: 'success',
        content: 'Join class successfully',
        duration: 1,
      });
    } catch (error) {
      setIsLoading(false);
      if (userInfo?.teacherId?.id || userInfo?.adminId?.id)
        messageApi.open({
          type: 'error',
          content: 'Class can only join by student',
          duration: 1,
        });
      else {
        messageApi.open({
          type: 'error',
          content: 'Something wrong when join class',
          duration: 1,
        });
      }
    }
  };

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      if (userInfo) {
        joinClassByLink();
      }
    } else {
      messageApi.open({
        type: 'info',
        content: 'Please sign in before join class',
        duration: 3,
      });
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [userInfo]);

  return (
    <div className="h-screen w-screen flex justify-center items-center fixed">
      {contextHolder}
      {/* Content */}
      <div className="flex flex-col w-1/2 h-2/3 rounded-xl bg-white border-2 border-gray-300 shadow-xl overflow-hidden">
        {isLoading ? (
          <div className=" flex justify-center items-center h-full">
            <Spin />
          </div>
        ) : isSuccess ? (
          <div className="flex flex-col flex-1 w-full justify-center items-center bg-white h-full">
            <div className=" w-full min-w-fit h-full  flex flex-col justify-center items-center">
              <h1 className="uppercase font-semibold text-xl text-center my-4">
                Join Class Successfully
              </h1>
              <div className="h-1/3 flex justify-center items-center">
                <img
                  src={confirmImg}
                  alt="confirmSuccessImg"
                  className="object-contain box-border px-8 h-full"
                />
              </div>
            </div>
          </div>
        ) : (
          <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={
              <Button
                onClick={() => {
                  navigate('/');
                }}
              >
                Back Home
              </Button>
            }
          />
        )}
      </div>
      <img
        src={wave}
        className="absolute bottom-0 left-0 right-0 -z-20 w-screen overflow-hidden"
      />
    </div>
  );
}
