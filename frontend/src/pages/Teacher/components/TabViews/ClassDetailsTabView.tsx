import { Button, Col, Row } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ClassDetailsTabView() {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);

  return (
    <Row gutter={[16, 16]}>
      <Col xs={{ order: 1, span: 24 }} md={{ order: 1, span: 8 }}>
        <div className="bg-blue-300 rounded-md h-96 p-4">
          <h1 className="text-lg font-semibold">Other Information:</h1>
        </div>
      </Col>
      <Col xs={{ order: 2, span: 24 }} md={{ order: 2, span: 16 }}>
        <div className="bg-gray-300 rounded-md h-96 p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold">Grade Structure:</h1>
            <Button
              className="flex justify-center items-center px-8 py-4 mb-2 bg-indigo-500 text-white"
              onClick={() => {
                navigate(`grademanagement`);
              }}
            >
              Manage Grade
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  );
}
