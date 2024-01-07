import { Button, Col, Row } from 'antd';
import { GradePreviewListProvider } from '../../GradeReviewList';
import GradeStructure from '../../GradeStructure';
import { useNavigate } from 'react-router-dom';

export default function ClassDetailsTabView() {
  const navigate = useNavigate();
  return (
    <Row gutter={[16, 16]}>
      <Col xs={{ order: 1, span: 24 }} md={{ order: 1, span: 12 }}>
        <div className="border rounded-md p-4">
          <GradePreviewListProvider />
        </div>
      </Col>
      <Col xs={{ order: 2, span: 24 }} md={{ order: 2, span: 12 }}>
        <div className="border rounded-md p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold">Grade Board:</h1>
            <Button
              className="flex justify-center items-center px-8 py-4 mb-2 bg-indigo-500 text-white"
              onClick={() => {
                navigate(`gradeboard`);
              }}
            >
              View Grade
            </Button>
          </div>
          <GradeStructure />
        </div>
      </Col>
    </Row>
  );
}
