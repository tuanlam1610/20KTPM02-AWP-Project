import { Col, Row } from 'antd';

export default function ClassDetailsTabView() {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={{ order: 1, span: 24 }} md={{ order: 1, span: 8 }}>
        <div className="bg-blue-300 rounded-md h-96 p-4">
          <h1 className="text-lg font-semibold">Other Information:</h1>
        </div>
      </Col>
      <Col xs={{ order: 2, span: 24 }} md={{ order: 2, span: 16 }}>
        <div className="bg-gray-300 rounded-md h-96 p-4">
          <h1 className="text-lg font-semibold">Grade Structure:</h1>
        </div>
      </Col>
    </Row>
  );
}
