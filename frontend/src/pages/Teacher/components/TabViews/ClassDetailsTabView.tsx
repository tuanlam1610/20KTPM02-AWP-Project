import { Col, Row } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import GradeReviewList from '../../GradeReviewList';
import GradeStructure from '../../GradeStructure';

export default function ClassDetailsTabView() {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);

  return (
    <Row gutter={[16, 16]}>
      <Col xs={{ order: 1, span: 24 }} md={{ order: 1, span: 12 }}>
        <div className="border rounded-md p-4">
          <GradeReviewList />
        </div>
      </Col>
      <Col xs={{ order: 2, span: 24 }} md={{ order: 2, span: 12 }}>
        <div className="border rounded-md p-4">
          <GradeStructure />
        </div>
      </Col>
    </Row>
  );
}
