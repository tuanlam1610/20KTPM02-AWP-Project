import Search from 'antd/es/input/Search';
import Title from 'antd/es/typography/Title';
import { useAppSelector } from '../../redux/store';
import CreateClassModal from './components/Modals/CreateClassModal';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const classes = useAppSelector((state) => state.teacher.classes)
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Content */}
      <div className="flex flex-col mx-8 my-8 gap-4">
        <div className='flex justify-between items-center'>
          <p className="text-4xl font-semibold mb-4">All Courses</p>
          <CreateClassModal />
        </div>
        <Search
          placeholder="Search course name..."
          size="large"
          className="mb-8"
        />
        {/* List Of Courses */}
        <div className="flex flex-1 flex-wrap justify-center gap-8">
          {classes.map((course, index) => {
            return (
              <div
                key={index}
                className="flex flex-col w-1/5 min-h-[50vh] border-2 border-indigo-200 rounded-xl overflow-hidden 
                hover:shadow-2xl hover:cursor-pointer active:bg-indigo-200"
                onClick={() => {
                  navigate(`/classDetails/${index}`)
                }}
              >
                <img src={course.courseImg} className="h-1/2 object-contain" />
                <div className="px-4 my-4">
                  <Title level={4} className="truncate">
                    {course.name}
                  </Title>
                  <p className="italic text-gray-500 text-sm">
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
