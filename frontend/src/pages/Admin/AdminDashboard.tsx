import { UsergroupAddOutlined } from '@ant-design/icons';
import { Card, Col, Row, message } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [messageApi, contextHolder] = message.useMessage();
  const [classes, setClasses] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const fetchUsersAndClassesNumber = async () => {
    try {
      const accountUrl = `${import.meta.env.VITE_REACT_APP_SERVER_URL}/users`;
      const classesUrl = `${import.meta.env.VITE_REACT_APP_SERVER_URL}/classes`;
      const resAccounts = await axios.get(accountUrl);
      console.log(resAccounts.data);
      if (resAccounts.data) setClasses(resAccounts.data);
      const resClasses = await axios.get(classesUrl);
      console.log(resClasses.data);
      if (resClasses.data) setAccounts(resClasses.data);
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
    <div className="flex flex-col min-h-screen">
      {contextHolder}
      {/* Content */}
      <div className="flex flex-col mx-8 my-8 gap-4">
        <div className="flex justify-between items-center">
          <p className="text-4xl font-semibold mb-4">Dashboard</p>
        </div>
        <Row gutter={16}>
          <Col xs={{ order: 1, span: 24 }} md={{ order: 1, span: 12 }}>
            <Card title="User Accounts" extra={<Link to="/">Details</Link>}>
              <div className="flex justify-between items-center">
                <p>
                  Total: <span>{accounts.length}</span>
                </p>
              </div>
            </Card>
          </Col>
          <Col xs={{ order: 2, span: 24 }} md={{ order: 2, span: 12 }}>
            <Card title="Classes">
              <div className="flex justify-between items-center">
                <p>
                  Total: <span>{classes.length}</span>
                </p>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}