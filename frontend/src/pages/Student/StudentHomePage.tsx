import Search from 'antd/es/input/Search';
import Title from 'antd/es/typography/Title';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { Empty } from 'antd';
import { setClasses } from '../../redux/appSlice';
import JoinClassModal from './components/Modals/JoinClassModal';

export default function StudentHomePage() {
  const dispatch = useAppDispatch();
  const classes = useAppSelector((state) => state.app.classes);
  const userInfo = useAppSelector((state) => state.app.userInfo);
  const navigate = useNavigate();

  const fetchClassList = async () => {
    try {
      const studentId = userInfo?.studentId.id;
      const res = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_SERVER_URL
        }/students/${studentId}/getAllClassesOfstudent`,
      );
      dispatch(setClasses(res.data));
    } catch (err) {}
  };

  useEffect(() => {
    fetchClassList();
  }, [userInfo]);

  return (
    <div className="flex flex-col">
      {/* Content */}
      <div className="flex flex-col mx-8 my-8 gap-4">
        <div className="flex justify-between items-center">
          <p className="text-4xl font-semibold mb-4">Joined Classes</p>
          <JoinClassModal />
        </div>
        <Search
          placeholder="Search course name..."
          size="large"
          className="mb-8"
        />
        {/* List Of Courses */}
        <div className="flex flex-1 flex-wrap justify-start gap-8">
          {classes.length <= 0 && (
            <div className="flex justify-center w-full">
              <Empty
                description="No Class Found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          )}
          {classes.length > 0 &&
            classes.map((course, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-col w-1/5 min-h-[32vh] border-2 border-indigo-200 rounded-xl overflow-hidden 
                hover:shadow-2xl hover:cursor-pointer active:bg-indigo-200"
                  onClick={() => {
                    navigate(`/student/class/${classes[index].id}`);
                  }}
                >
                  <img
                    src={
                      'https://cdn.create.vista.com/downloads/b1ec016d-2cd8-4c23-ba56-0b4f3bfe19fa_1024.jpeg'
                    }
                    className="h-1/2 object-contain"
                  />
                  <div className="px-4 my-4">
                    <Title level={4} className="truncate">
                      {course.name}
                    </Title>
                    <p className="italic text-gray-500 text-sm line-clamp-4 text-justify">
                      {course.description}
                    </p>
                  </div>
                  {/* <div className="flex flex-1 justify-center items-center">
                  <Button className="flex-1 py-4 mx-4 bg-indigo-500 text-white hover:bg-white rounded-full flex justify-center items-center">
                    Assign Course
                  </Button>
                </div> */}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
