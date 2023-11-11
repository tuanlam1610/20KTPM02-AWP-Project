import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import Logo from '../assets/imgs/Logo.png'
import { Avatar, Button, Dropdown, MenuProps } from 'antd'
import Search from 'antd/es/input/Search'
import Title from 'antd/es/typography/Title'
import { Link } from 'react-router-dom'

export default function HomePage() {
    const courses = [
        { name: "CBA1 - Business Analysis 1", description: "This is online course for business analysis 1", courseImg: "https://cdn.create.vista.com/downloads/b1ec016d-2cd8-4c23-ba56-0b4f3bfe19fa_1024.jpeg" },
        { name: "CUX1 - UI UX Fundamental 1", description: "This is online course for UI UX fundamental knowledge 1", courseImg: "https://cdn.sanity.io/images/qyzm5ged/production/4fe5252b1031f0520fc5a58fc109749e01972381-2138x1200.jpg" },
        { name: "CBA2 - Business Analysis 2", description: "This is online course for business analysis 2", courseImg: "https://cdn.create.vista.com/downloads/b1ec016d-2cd8-4c23-ba56-0b4f3bfe19fa_1024.jpeg" },
        { name: "CUX1 - UI UX Fundamental 2", description: "This is online course for UI UX fundamental knowledge 2", courseImg: "https://cdn.sanity.io/images/qyzm5ged/production/4fe5252b1031f0520fc5a58fc109749e01972381-2138x1200.jpg" },
        { name: "CBA5 - Business Analysis 3", description: "This is online course for business analysis 5", courseImg: "https://cdn.create.vista.com/downloads/b1ec016d-2cd8-4c23-ba56-0b4f3bfe19fa_1024.jpeg" },
        { name: "CUX1 - UI UX Fundamental 3", description: "This is online course for UI UX fundamental knowledge 3", courseImg: "https://cdn.sanity.io/images/qyzm5ged/production/4fe5252b1031f0520fc5a58fc109749e01972381-2138x1200.jpg" },
        { name: "CBA7 - Business Analysis 4", description: "This is online course for business analysis 7", courseImg: "https://cdn.create.vista.com/downloads/b1ec016d-2cd8-4c23-ba56-0b4f3bfe19fa_1024.jpeg" },
        { name: "CUX1 - UI UX Fundamental 4", description: "This is online course for UI UX fundamental knowledge 4", courseImg: "https://cdn.sanity.io/images/qyzm5ged/production/4fe5252b1031f0520fc5a58fc109749e01972381-2138x1200.jpg" },
        { name: "CBA9 - Business Analysis 5", description: "This is online course for business analysis 9", courseImg: "https://cdn.create.vista.com/downloads/b1ec016d-2cd8-4c23-ba56-0b4f3bfe19fa_1024.jpeg" },
        { name: "CUX1 - UI UX Fundamental 5", description: "This is online course for UI UX fundamental knowledge 5", courseImg: "https://cdn.sanity.io/images/qyzm5ged/production/4fe5252b1031f0520fc5a58fc109749e01972381-2138x1200.jpg" },
    ]
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <Link to={'/'} className='flex gap-4'>
                    <UserOutlined />
                    <p>User Profile</p>
                </Link>
            ),
        },
        {
            key: '2',
            label: (
                <Link to={'/'} className='flex gap-4'>
                    <LogoutOutlined />
                    <p>Sign Out</p>
                </Link>
            ),
        },
    ];
    return (
        <div className='flex flex-col min-h-screen'>
            {/* Top Nav Bar */}
            <div className='flex items-center justify-between h-12 shadow-lg'>
                <div className='flex h-full items-center gap-2 mx-4'>
                    <img src={Logo} alt='Logo' className='h-full object-contain box-border py-2' />
                    <h1 className='uppercase font-semibold text-lg'>Edu</h1>
                </div>
                <Dropdown menu={{ items }} placement="bottomRight">
                    <div className='flex gap-2 justify-between h-full'>
                        <div className='flex gap-3 items-center px-4 duration-300 cursor-pointer border-b-2 border-transparent hover:border-indigo-500'>
                            <p className='text-black text-sm'>Quang Nguyen</p>
                            <Avatar className='bg-indigo-500' icon={<UserOutlined />} />
                        </div>
                    </div>
                </Dropdown>

            </div>
            {/* Content */}
            <div className='flex flex-col mx-8 my-8 gap-4'>
                <p className='text-4xl font-semibold mb-4'>All Courses</p>
                <Search placeholder='Search course name...' size='large' className='mb-8' />
                {/* List Of Courses */}
                <div className='flex flex-1 flex-wrap justify-center gap-8'>
                    {
                        courses.map((course, index) => {
                            return (
                                <div key={index} className='flex flex-col w-1/5 min-h-[50vh] border-2 border-indigo-200 rounded-xl overflow-hidden hover:shadow-2xl'>
                                    <img src={course.courseImg} className='h-1/2 object-contain' />
                                    <div className='px-4 my-4'>
                                        <Title level={4} className='truncate'>{course.name}</Title>
                                        <p className='italic text-gray-500 text-sm'>{course.description}</p>
                                    </div>
                                    <div className='flex flex-1 justify-center items-center'>
                                        <Button className='flex-1 py-4 mx-4 bg-indigo-500 text-white hover:bg-white rounded-full flex justify-center items-center'>Assign Course</Button>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}
