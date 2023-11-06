import { Button, Divider } from 'antd'
import { Link } from 'react-router-dom'

export default function HomeView() {
    return (
        <div className='flex flex-col h-screen'>
            {/* Top Nav Bar */}
            <div className='flex items-center justify-between h-12 '>
                <h1 className='uppercase font-semibold mx-4'><Link to={`/`}>HQL</Link></h1>
                <div className='flex gap-2 justify-between mx-4'>
                    <Button type="primary" ghost><Link to={`login`}>Login</Link></Button>
                </div>
            </div>
            <Divider className='bg-black m-0 shadow-sm' />
        </div>
    )
}
