import {
  ArrowRightOutlined,
  FacebookOutlined,
  GoogleOutlined,
  HomeOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { Button, Checkbox, Form, Input, notification } from 'antd';
import useForm from 'antd/es/form/hooks/useForm';
import axios from 'axios';
import {
  browserSessionPersistence,
  setPersistence,
  signInWithPopup,
} from 'firebase/auth';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { auth, fbAuthProvider, googleAuthProvider } from '../../firebase';
import loginImg from '../assets/imgs/Login-amico.png';
import wave from '../assets/imgs/wave.svg';
import { setUserInfo } from '../redux/appSlice';
import { useAppDispatch } from '../redux/store';

type FieldType = {
  email?: string;
  password?: string;
  remember?: string;
};

export default function SignInPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const activateAccount = async (values: { email: string | undefined }) => {
    try {
      await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_SERVER_URL
        }/email-confirmation/resendVerification`,
        values,
      );
    } catch (err) {
      console.log(err);
    }
  };

  const getUserProfile = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/users/getUserProfile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
      );
      dispatch(setUserInfo(res.data));
      if (!res?.data?.roles[0]) {
        return navigate('/chooserole');
      }
      navigate(`/${res?.data?.roles[0]}/home`);
      setIsSubmitting(false);
      document.body.style.cursor = 'default';
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
      document.body.style.cursor = 'default';
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      dispatch(setUserInfo(undefined));
      navigate('/');
    }
  };

  const onFinish = async (values: FieldType) => {
    try {
      setIsSubmitting(true);
      document.body.style.cursor = 'wait';
      const signInResult = await axios.post(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/auth/local/signin`,
        values,
      );
      localStorage.setItem('refreshToken', signInResult.data.refreshToken);
      localStorage.setItem('accessToken', signInResult.data.accessToken);
      await getUserProfile();
      document.body.style.cursor = 'default';
    } catch (err: any) {
      const errMsg = err.response.data.message;
      if (
        err.response.data.statusCode == 401 &&
        errMsg == 'Email not confirmed'
      ) {
        await activateAccount({ email: values.email });
        setCurrentStep(1);
      } else if (errMsg == 'User is locked') openLockNotification();
      else if (errMsg == 'User is banned') openBanNotification();
      else openNotification();
      setIsSubmitting(false);
      document.body.style.cursor = 'default';
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const [api, contextHolder] = notification.useNotification({
    stack: { threshold: 3 },
  });
  const openNotification = () => {
    api['error']({
      message: t('text.signInPage.signInFail'),
      description: t('text.signInPage.signInFailDescription'),
      duration: 2,
    });
  };

  const openBanNotification = () => {
    api['error']({
      message: t('text.signInPage.bannedNotificationTitle'),
      description: t('text.signInPage.bannedNotificationDescription'),
      duration: 5,
    });
  };
  const openLockNotification = () => {
    api['error']({
      message: t('text.signInPage.lockedNotificationTitle'),
      description: t('text.signInPage.lockedNotificationDescription'),
      duration: 5,
    });
  };

  const handleSignInWithGG = async () => {
    setPersistence(auth, browserSessionPersistence);
    const result = await signInWithPopup(auth, googleAuthProvider);
    const idToken = await result.user.getIdToken();
    const value = { idToken: idToken };
    // Send token to backend

    const signInResult = await axios.post(
      `${import.meta.env.VITE_REACT_APP_SERVER_URL}/auth/google/signin`,
      value,
    );
    localStorage.setItem('refreshToken', signInResult.data.refreshToken);
    localStorage.setItem('accessToken', signInResult.data.accessToken);
    navigate('/student/home');
    setIsSubmitting(false);
    document.body.style.cursor = 'default';
  };

  const handleSignInWithFB = async () => {
    const result = await signInWithPopup(auth, fbAuthProvider);

    const signInResult = await axios.post(
      `${import.meta.env.VITE_REACT_APP_SERVER_URL}/auth/facebook/signin`,
      { idToken: await result.user.getIdToken() },
    );
    localStorage.setItem('refreshToken', signInResult.data.refreshToken);
    localStorage.setItem('accessToken', signInResult.data.accessToken);
    navigate('/student/home');
    setIsSubmitting(false);
    document.body.style.cursor = 'default';
  };

  const steps = [
    {
      title: t('text.signInPage.fillInInformation'),
      content: (
        <div className="flex flex-col flex-1 justify-center items-center overflow-auto">
          {/* {isSubmitting && <Spin />} */}
          <h1 className="uppercase font-semibold text-2xl text-center my-4">
            {t('text.signInPage.signIn')}
          </h1>
          <div className="w-2/3 min-w-fit flex justify-center">
            <Button
              className="w-full mb-2 py-4 flex justify-center items-center gap-4 text-indigo-500 border-indigo-500 rounded-full"
              onClick={handleSignInWithGG}
            >
              <GoogleOutlined />
              <p className="w-1/2 flex">{t('text.signInPage.googleSignIn')}</p>
            </Button>
          </div>
          <div className="w-2/3 min-w-fit flex justify-center">
            <Button
              className="w-full py-4 flex justify-center items-center gap-4 text-indigo-500 border-indigo-500 rounded-full"
              onClick={handleSignInWithFB}
            >
              <FacebookOutlined />
              <p className="w-1/2 flex">{t('text.signInPage.fbSignIn')}</p>
            </Button>
          </div>
          <p className="mt-4">{t('text.signInPage.or')}</p>
          <Form
            form={form}
            className="mt-4 w-2/3 min-w-fit"
            labelWrap
            labelCol={{ span: 8 }}
            labelAlign="left"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            rootClassName="flex flex-col items-center"
          >
            <Form.Item<FieldType>
              label="Email"
              rules={[
                {
                  required: true,
                  message: t('text.signInPage.emailRequired'),
                },
                {
                  pattern: RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i),
                  message: t('text.signInPage.emailInvalid'),
                },
              ]}
              name={'email'}
              className="w-full mb-4"
            >
              <Input type="text" placeholder="example@email.com" />
            </Form.Item>

            <Form.Item<FieldType>
              label="Password"
              rules={[
                {
                  required: true,
                  message: t('text.signInPage.passwordRequired'),
                },
              ]}
              name={'password'}
              className="w-full mb-2"
            >
              <Input.Password
                placeholder={t('text.signInPage.passwordPlaceholder')}
              />
            </Form.Item>

            <div className="w-full flex justify-between">
              <Form.Item<FieldType>
                valuePropName="checked"
                name={'remember'}
                className="w-fit mb-6"
              >
                <Checkbox>{t('text.signInPage.rememberMe')}</Checkbox>
              </Form.Item>
              <Link
                to={'/recover'}
                className="underline font-semibold p-2 hover:text-indigo-500"
              >
                <p className="text-sm underline font-semibold">
                  {t('text.signInPage.forgetPassword')}
                </p>
              </Link>
            </div>

            <Form.Item className="w-full mb-2">
              <Button
                type="primary"
                htmlType="submit"
                className="flex justify-center items-center px-8 py-4 bg-indigo-500 rounded-full w-full"
                loading={isSubmitting}
              >
                <span>{t('text.signInPage.signIn')}</span>
                <ArrowRightOutlined className="text-sm flex justify-center items-center leading-none" />
              </Button>
            </Form.Item>
          </Form>
          <p className="text-sm">
            {t('text.signInPage.forgetPassword')}
            <Link
              to={'/register'}
              className="underline font-semibold p-2 hover:text-indigo-500"
            >
              {t('text.signInPage.signUp')}
            </Link>
          </p>
        </div>
      ),
    },
    {
      title: t('text.signInPage.emailVerification'),
      content: (
        <div className="flex flex-col flex-1 justify-center items-center overflow-auto">
          <div className="w-2/3">
            <h1 className="uppercase font-semibold text-xl text-center my-4">
              {t('text.signInPage.activateAccount')}
            </h1>
            <div>
              <MailOutlined className="text-4xl" />
            </div>
            <div className="my-4 w-full overflow-hidden flex flex-col gap-4 text-gray-700 text-sm">
              <p>{t('text.signInPage.sendEmailTo')}</p>
              <p className="font-semibold text-lg">
                {form.getFieldValue('email') != ''
                  ? form.getFieldValue('email')
                  : 'example@email.com'}
              </p>
              <div>
                <p>{t('text.signInPage.activateAccountContent')}</p>
              </div>
              <p className="">
                {t('text.signInPage.notReceiveMail')}
                <span className="underline text-indigo-500 font-semibold hover:cursor-pointer">
                  {t('text.signInPage.resend')}
                </span>
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="h-screen w-screen flex justify-center items-center fixed">
      {contextHolder}
      {/* Content */}
      <div className="flex flex-row w-7/12 h-2/3 rounded-xl bg-white border-2 border-gray-300 shadow-xl overflow-hidden">
        {/* Left Section */}
        <div className="w-2/5 flex flex-col justify-start items-center bg-indigo-400 text-white">
          <div className="w-full flex justify-start my-4">
            <Link to={'/'}>
              <Button className="ms-4 flex justify-center items-center border-white text-indigo-500 bg-white">
                <HomeOutlined />
              </Button>
            </Link>
          </div>
          <h1 className="uppercase font-semibold text-xl text-center">
            HQL Application
          </h1>
          <p className=" mt-2 mb-4 text-sm text-center">
            {t('text.signInPage.welcome')}
          </p>
          <img src={loginImg} className="object-contain box-border px-8" />
        </div>
        {/* Right Section */}
        {steps[currentStep].content}
      </div>
      <img
        src={wave}
        className="absolute bottom-0 left-0 right-0 -z-20 w-screen overflow-hidden"
      />
    </div>
  );
}
