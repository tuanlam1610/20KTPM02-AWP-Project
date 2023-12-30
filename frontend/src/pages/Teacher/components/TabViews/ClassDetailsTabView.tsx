import { Col, Row } from 'antd';
import GradeStructure from '../../GradeStructure';
import { GradePreviewListProvider } from '../../GradeReviewList';

export default function ClassDetailsTabView() {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={{ order: 1, span: 24 }} md={{ order: 1, span: 12 }}>
        <div className="border rounded-md p-4">
          <GradePreviewListProvider />
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
