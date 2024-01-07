import { useNavigate, useSearchParams } from 'react-router-dom';
import wave from '../assets/imgs/wave.svg';
import confirmImg from '../assets/imgs/Confirmed-amico.png';
import { Button } from 'antd';
import { useEffect } from 'react';
import axios from 'axios';

export default function RecoverPasswordPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token');

  const activateEmail = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_REACT_APP_SERVER_URL}/email-confirmation/confirm`,
      {
        params: {
          token: token,
        },
      },
    );
  };

  useEffect(() => {
    activateEmail();
  }, []);

  return (
    <div className="h-screen w-screen flex justify-center items-center fixed">
      {/* Content */}
      <div className="flex flex-col w-1/2 h-2/3 rounded-xl bg-white border-2 border-gray-300 shadow-xl overflow-hidden">
        {/* Right Section */}
        <div className="flex flex-col flex-1 w-full justify-center items-center bg-white mt-4">
          <div className="mt-4 w-full min-w-fit">
            <h1 className="uppercase font-semibold text-xl text-center my-4">
              Activate Account Successfully
            </h1>
            <div className="h-1/3 flex justify-center items-center">
              <img
                src={confirmImg}
                alt="confirmSuccessImg"
                className="object-contain box-border px-8 h-full"
              />
            </div>
            <p className="text-sm text-gray-500 text-center">
              Your account is activated successfully. Please sign in again to
              join with us!
            </p>
            <div className="flex justify-center items-center my-4">
              <Button
                className="flex justify-center items-center rounded-full w-2/3 px-6 py-4 bg-indigo-500 text-white hover:bg-white"
                onClick={() => {
                  navigate('/login');
                }}
              >
                Sign In
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
