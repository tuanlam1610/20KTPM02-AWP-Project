import { Avatar, Button, Dropdown, MenuProps } from 'antd';
import Logo from '../assets/imgs/Logo.png';
import { Link, useLocation } from 'react-router-dom';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
export default function Navbar() {
    const location = useLocation()
    const pathName = location.pathname.replace('/', '')
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <Link to={'/profile'} className={`flex gap-4`}>
                    <UserOutlined />
                    <p>User Profile</p>
                </Link>
            ),
        },
        {
            key: '2',
            label: (
                <Link to={'/'} className={`flex gap-4`} onClick={() => {
                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('refreshToken')
                }}>
                    <LogoutOutlined />
                    <p>Sign Out</p>
                </Link>

            ),
        },
    ];
    return (
        <div className="flex items-center justify-between h-12 shadow-lg sticky">
            <Link to={'/'} className="flex h-full items-center gap-2 mx-4">
                <img
                    src={Logo}
                    alt="Logo"
                    className="h-full object-contain box-border py-2"
                />
                <h1 className="uppercase font-semibold text-lg">Edu</h1>
            </Link>
            {pathName == '' && (
                <div className="flex gap-2 justify-between mx-4">
                    <Link to={`login`}>
                        <Button type="primary" className="bg-indigo-500 px-8 rounded-full">
                            Sign In
                        </Button>
                    </Link>
                </div>
            )}
            {!['', 'login', 'register'].includes(pathName) && (
                <Dropdown menu={{ items }} placement="bottomRight">
                    <div className='flex gap-2 justify-between h-full'>
                        <div className='flex gap-3 items-center px-4 duration-300 cursor-pointer border-b-2 border-transparent hover:border-indigo-500'>
                            <p className='text-black text-sm'>Quang Nguyen</p>
                            <Avatar className='bg-indigo-500' icon={<UserOutlined />} />
                        </div>
                    </div>
                </Dropdown>
            )}

        </div>

    )
}
