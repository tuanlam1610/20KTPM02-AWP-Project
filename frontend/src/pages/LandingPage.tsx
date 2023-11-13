import {
  FacebookOutlined,
  GoogleOutlined,
  InstagramOutlined,
  LinkedinOutlined,
} from '@ant-design/icons';
import { Button, Carousel } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import carouselImg2 from '../assets/imgs/IDC_SocialShareIcon_1200x630.webp';
import Logo from '../assets/imgs/Logo.png';
import carouselImg1 from '../assets/imgs/Online-education-laptop.jpg';
import contentImg from '../assets/imgs/contentImg.png';
import carouselImg3 from '../assets/imgs/teenage-students-in-classroom--141090063-5af498bc6bf0690036889c1b.jpg';
import { useEffect } from 'react';

export default function LandingPage() {
  const navigate = useNavigate();
  useEffect(() => {
    console.log(localStorage);
    if (localStorage.getItem('accessToken')) navigate('/home');
  });
  const listContent = [
    {
      title: 'Online Learning',
      imgSrc: contentImg,
      summary: 'Lorem ipsum dolor sit amet, consectetur',
    },
    {
      title: 'Education & Training',
      imgSrc: contentImg,
      summary: 'Lorem ipsum dolor sit amet, consectetur',
    },
    {
      title: 'Online Learning',
      imgSrc: contentImg,
      summary: 'Lorem ipsum dolor sit amet, consectetur',
    },
    {
      title: 'Education & Training',
      imgSrc: contentImg,
      summary: 'Lorem ipsum dolor sit amet, consectetur',
    },
  ];
  return (
    <div className="flex flex-col">
      {/* Content */}
      <div className="flex flex-col">
        <div className="h-[80vh] mb-12 border-dashed border-b-2 border-indigo-300">
          <div className="flex h-full">
            {/* Left Section */}
            <div className="h-full w-5/12 flex justify-center">
              <div className="w-3/4 h-full flex flex-col gap-2 justify-center items-start">
                <p className="text-xl text-indigo-500">
                  New Learning Experience At
                </p>
                <h1 className="text-3xl uppercase font-semibold text-indigo-500">
                  HQL Education
                </h1>
                <p className=" text-gray-700 italic mb-4">
                  Enrich your knowledge and get a head start into your next
                  career.
                </p>
                <Button className="px-12 py-6 rounded-full bg-indigo-500 flex justify-center items-center text-white hover:bg-white">
                  Contact Us
                </Button>
              </div>
            </div>
            {/* Right Section */}
            <div className="flex-1 bg-gray-400 overflow-hidden">
              <Carousel autoplay>
                <div className="h-[80vh]">
                  <img
                    src={carouselImg1}
                    alt="carousel1"
                    className="h-full object-cover"
                  />
                </div>
                <div className="h-[80vh]">
                  <img
                    src={carouselImg2}
                    alt="carousel2"
                    className="h-full object-cover"
                  />
                </div>
                <div className="h-[80vh]">
                  <img
                    src={carouselImg3}
                    alt="carousel3"
                    className="h-full object-cover"
                  />
                </div>
              </Carousel>
            </div>
          </div>
        </div>
        {/* Preview Section */}
        <div className="flex flex-col items-center gap-4 w-full mb-12">
          <img src={Logo} alt="Logo" />
          <h1 className="text-2xl font-semibold">Welcome to HQL Education</h1>
          <p className="text-base mb-8">
            HQL is a platform that allows you to learn and grow your knowledge
            in various fields of study.
          </p>
          {/* Horizontal View */}
          <div className="flex w-9/12 mx-8 gap-8">
            {listContent.map((content, index) => (
              <div
                key={index}
                className="w-1/4 h-[50vh] px-2 py-12 border-2 border-indigo-300 rounded-xl flex flex-col items-center
                            hover:shadow-xl hover:bg-indigo-100"
              >
                <img
                  src={content.imgSrc}
                  alt="content"
                  className="object-contain w-1/3 flex-1 flex justify-center"
                />
                <h3 className="mb-4 font-semibold text-lg">{content.title}</h3>
                <p className="text-center text-sm text-gray-600">
                  {content.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* Footer */}
        <div className="bg-indigo-300 h-[50vh] flex text-white">
          {/* Left Logo */}
          <div className="w-1/3 flex flex-col justify-center items-center">
            <div className="flex gap-4 justify-center items-center">
              <img src={Logo} alt="Logo" />
              <h1 className="text-3xl font-semibold">HQL Education</h1>
            </div>
            <p className="text-sm mt-4">&copy; Copyright HQL Group 2023</p>
          </div>
          {/* Right Information */}
          <div className="flex justify-center w-2/3 gap-12 my-8">
            <div className="py-8">
              <h2 className="text-2xl">Information</h2>
              <div className="border-2 border-indigo-500 w-1/2 my-2"></div>
              <div className="my-2 px-8 py-2 border-b-2 border-transparent hover:border-indigo-500 hover:text-indigo-500 duration-300">
                <Link to={'/'}>About Us</Link>
              </div>
              <div className="my-2 px-8 py-2 border-b-2 border-transparent hover:border-indigo-500 hover:text-indigo-500 duration-300">
                <Link to={'/'}>Contact Us</Link>
              </div>
              <div className="my-2 px-8 py-2 border-b-2 border-transparent hover:border-indigo-500 hover:text-indigo-500 duration-300">
                <Link to={'/'}>FAQ</Link>
              </div>
            </div>
            <div className="py-8 ">
              <h2 className="text-2xl">Follow Us</h2>
              <div className="border-2 border-indigo-500 w-1/2 mt-2 mb-4"></div>
              <div className="flex gap-4">
                <Link to={'/'}>
                  <Button className="h-8 w-8 text-lg text-indigo-300 bg-white flex justify-center items-center rounded-full">
                    <GoogleOutlined />
                  </Button>
                </Link>
                <Link to={'/'}>
                  <Button className="h-8 w-8 text-lg text-indigo-300 bg-white flex justify-center items-center rounded-full">
                    <LinkedinOutlined />
                  </Button>
                </Link>
                <Link to={'/'}>
                  <Button className="h-8 w-8 text-lg text-indigo-300 bg-white flex justify-center items-center rounded-full">
                    <FacebookOutlined />
                  </Button>
                </Link>
                <Link to={'/'}>
                  <Button className="h-8 w-8 text-lg text-indigo-300 bg-white flex justify-center items-center rounded-full">
                    <InstagramOutlined />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
