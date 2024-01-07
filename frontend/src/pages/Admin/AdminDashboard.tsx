import {
  BookOutlined,
  IdcardOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Row, message } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [classes, setClasses] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [students, setStudents] = useState([]);
  const fetchUsersAndClassesNumber = async () => {
    try {
      const accountUrl = `${import.meta.env.VITE_REACT_APP_SERVER_URL}/users`;
      const classesUrl = `${import.meta.env.VITE_REACT_APP_SERVER_URL}/classes`;
      const studentsUrl = `${
        import.meta.env.VITE_REACT_APP_SERVER_URL
      }/students`;
      const resAccounts = await axios.get(accountUrl);
      if (resAccounts.data) setAccounts(resAccounts.data);
      const resClasses = await axios.get(classesUrl);
      if (resClasses.data) setClasses(resClasses.data);
      const resStudents = await axios.get(studentsUrl);
      if (resStudents.data) setStudents(resStudents.data);
    } catch (error) {
      console.log(error);
      messageApi.open({
        type: 'error',
        content: `Cannot fetch data`,
        duration: 1,
      });
    }
  };
  useEffect(() => {
    fetchUsersAndClassesNumber();
  }, []);
  return (
    <div className="flex flex-col ">
      {contextHolder}
      {/* Content */}
      <div className="flex flex-col mx-8 my-8 gap-4">
        <div className="flex justify-between items-center">
          <p className="text-4xl font-semibold mb-4">Dashboard</p>
        </div>
        <Row gutter={16}>
          <Col xs={{ order: 1, span: 24 }} md={{ order: 1, span: 8 }}>
            <Card
              title={<p className="text-xl">User Accounts</p>}
              extra={
                <Button
                  onClick={() => {
                    navigate('/admin/accounts');
                  }}
                >
                  Details
                </Button>
              }
              className="hover:shadow-xl"
            >
              <div className="flex justify-between items-center">
                <div className="bg-indigo-500 p-4 rounded-full">
                  <TeamOutlined className="text-3xl text-white" />
                </div>
                <p className="text-lg">
                  Total Accounts:
                  <p className="font-semibold ms-2 text-xl">
                    {accounts.length}
                  </p>
                </p>
              </div>
            </Card>
          </Col>
          <Col xs={{ order: 2, span: 24 }} md={{ order: 2, span: 8 }}>
            <Card
              title={<p className="text-xl">Classes</p>}
              extra={
                <Button
                  onClick={() => {
                    navigate('/admin/classes');
                  }}
                >
                  Details
                </Button>
              }
              className="hover:shadow-xl"
            >
              <div className="flex justify-between items-center">
                <div className="bg-indigo-500 p-4 rounded-full">
                  <BookOutlined className="text-3xl text-white" />
                </div>
                <p className="text-lg">
                  Total Classes:
                  <p className="font-semibold ms-2 text-xl">{classes.length}</p>
                </p>
              </div>
            </Card>
          </Col>
          <Col xs={{ order: 3, span: 24 }} md={{ order: 3, span: 8 }}>
            <Card
              title={<p className="text-xl">Students</p>}
              extra={
                <Button
                  onClick={() => {
                    navigate('/admin/students');
                  }}
                >
                  Details
                </Button>
              }
              className="hover:shadow-xl"
            >
              <div className="flex justify-between items-center">
                <div className="bg-indigo-500 p-4 rounded-full">
                  <IdcardOutlined className="text-3xl text-white" />
                </div>
                <p className="text-lg">
                  Total Students:
                  <p className="font-semibold ms-2 text-xl">
                    {students.length}
                  </p>
                </p>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
