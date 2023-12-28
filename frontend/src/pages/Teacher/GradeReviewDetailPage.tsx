import { Avatar, Button, Card, Col, Form, Row, Tooltip } from 'antd';
import { GradeReview, Comment as CommentData } from '../../interface';
import { Comment } from '@ant-design/compatible';
import {
  CheckCircleFilled,
  LeftOutlined,
  MinusCircleFilled,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/store';
import dayjs from 'dayjs';
import TextArea from 'antd/es/input/TextArea';
import { useState } from 'react';

export interface GradeReviewDetail extends GradeReview {
  comment: CommentData[];
}

export default function GradeReviewDetailPage() {
  const userInfo = useAppSelector((state) => state.app.userInfo);
  const data: GradeReviewDetail = {
    student: {
      id: '123',
      fullname: 'Ha Tuan Lam',
    },
    class: {
      name: 'ADVANCED WEB',
    },
    id: '1234',
    status: 'Open',
    expectedGrade: 9.5,
    currentGrade: 8,
    grade: {
      name: 'Final',
    },
    // teacher: {
    //   id: 'hehe',
    //   fullname: 'Nguyen Ngoc Quang',
    // },
    explanation: 'Toi gioi toi muon cao diem',
    createdAt: '2023-12-12 13:22',
    updatedAt: '2023-24-12 13:22',
    comment: [
      {
        user: {
          name: 'Ha Tuan Lam',
        },
        createdAt: '2023-12-12 13:22',
        content: 'Giai quyet cho em',
      },
      {
        user: {
          name: 'Ha Tuan Lam',
        },
        createdAt: '2023-12-12 13:22',
        content: 'Giai quyet cho em',
      },
    ],
  };

  const navigate = useNavigate();

  const handleBackButton = () => {
    navigate(-1);
  };

  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (!value) return;

    setSubmitting(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="overflow-auto">
      {/* Content */}
      <div className="mx-20 my-4">
        <div className="my-6">
          <Button icon={<LeftOutlined />} onClick={handleBackButton}>
            Back
          </Button>
        </div>
        <div className="px-40">
          <div className="text-4xl font-bold my-6">
            Grade review on {data.grade.name}
          </div>
          <div className="my-6 flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Avatar className="bg-indigo-500" icon={<UserOutlined />} />
              <div>
                {data.student.fullname}

                <Tooltip
                  title={dayjs(data.createdAt).format('YYYY-MM-DD HH:mm')}
                  mouseEnterDelay={0.5}
                >
                  <div className="cursor-default text-sm">
                    {dayjs(data.createdAt).fromNow()}
                  </div>
                </Tooltip>
              </div>
            </div>
            <div className="flex gap-2">
              {userInfo?.roles.includes('teacher') &&
                data.status === 'Open' && (
                  <>
                    <Button
                      className="bg-slate-100 w-40"
                      size="large"
                      type="text"
                      icon={<CheckCircleFilled style={{ color: 'green' }} />}
                      onClick={handleBackButton}
                    >
                      Accept
                    </Button>
                    <Button
                      className="bg-slate-100 w-40"
                      size="large"
                      type="text"
                      icon={<MinusCircleFilled style={{ color: 'red' }} />}
                      onClick={handleBackButton}
                    >
                      Deny
                    </Button>
                  </>
                )}
            </div>
          </div>
          <div className="my-6">
            {data.status === 'Denied' ? (
              <div className="flex gap-4 px-8 py-4 bg-red-100 rounded">
                <MinusCircleFilled style={{ color: 'red' }} />
                <div className="flex flex-col gap-2">
                  <div className="text-xl font-semibold">
                    The request has been denied
                  </div>
                  <div>
                    Denied by: <span>{data.teacher?.fullname}</span>
                  </div>
                  <div>Denied on: {data.updatedAt}</div>
                </div>
              </div>
            ) : data.status === 'Accepted' ? (
              <div></div>
            ) : (
              <></>
            )}
          </div>
          <div className="text-xl font-semibold mb-2">Grade</div>
          <Row className="mb-4" gutter={16}>
            <Col span={8}>
              <Card
                className="drop-shadow"
                headStyle={{ textAlign: 'center' }}
                bodyStyle={{ height: '70px', textAlign: 'center' }}
                title="Current grade"
                bordered={false}
              >
                {data.currentGrade}
              </Card>
            </Col>
            <Col span={8}>
              <Card
                className="drop-shadow"
                headStyle={{ textAlign: 'center' }}
                bodyStyle={{
                  height: '70px',
                  textAlign: 'center',
                }}
                title="Expected grade"
                bordered={false}
              >
                {data.expectedGrade}
              </Card>
            </Col>
            <Col span={8}>
              <Card
                className="drop-shadow"
                headStyle={{
                  textAlign: 'center',
                }}
                bodyStyle={{
                  height: '70px',
                  textAlign: 'center',
                }}
                title="Final grade"
                bordered={false}
              >
                {data.finalGrade}
              </Card>
            </Col>
          </Row>
          <div className="text-xl font-semibold mb-2">Explanation</div>
          <p className="mb-4 indent-8">
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. The point
            of using Lorem Ipsum is that it has a more-or-less normal
            distribution of letters, as opposed to using 'Content here, content
            here', making it look like readable English. Many desktop publishing
            packages and web page editors now use Lorem Ipsum as their default
            model text, and a search for 'lorem ipsum' will uncover many web
            sites still in their infancy. Various versions have evolved over the
            years, sometimes by accident, sometimes on purpose (injected humour
            and the like).
          </p>
          <div className="text-xl font-semibold mb-2">Comment</div>
          <div className="flex flex-col gap-2 mb-12">
            {data.comment.map((c) => {
              console.log(dayjs(c.createdAt));
              return (
                <Comment
                  className="border-b rounded p-4 drop-shadow"
                  // actions={actions}
                  author={
                    <div className="font-semibold text-base">{c.user.name}</div>
                  }
                  avatar={
                    <Avatar className="bg-indigo-500" icon={<UserOutlined />} />
                  }
                  content={<p>{c.content}</p>}
                  datetime={
                    <Tooltip
                      title={dayjs(c.createdAt).format('YYYY-MM-DD HH:mm')}
                      mouseEnterDelay={0.5}
                    >
                      <span className="cursor-default">
                        {dayjs(c.createdAt).fromNow()}
                      </span>
                    </Tooltip>
                  }
                />
              );
            })}
            <Comment
              className="border-b rounded p-4 drop-shadow"
              avatar={
                <Avatar className="bg-indigo-500" icon={<UserOutlined />} />
              }
              content={
                <Editor
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                  value={value}
                />
              }
            />
          </div>
        </div>

        {/* <div className="flex justify-between items-center">
          <p className="text-4xl font-semibold">{classDetails?.name}</p>
          <div className="flex justify-between items-center gap-4">
            <div className="flex flex-col border-[1px] border-gray-400 rounded-lg overflow-hidden">
              <div className="py-1 px-6 bg-indigo-500 text-white flex justify-center">
                <p>Class Code:</p>
              </div>
              <div className="flex justify-between items-center py-1 px-4">
                <p>{classDetails?.code}</p>
                <Button
                  icon={<CopyOutlined />}
                  size="small"
                  className="text-gray-400"
                  onClick={() => {
                    handleCopyClassId();
                  }}
                />
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

interface EditorProps {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  submitting: boolean;
  value: string;
}

const Editor = ({ onChange, onSubmit, submitting, value }: EditorProps) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item className="mb-0">
      <Button htmlType="submit" loading={submitting} onClick={onSubmit}>
        Add Comment
      </Button>
    </Form.Item>
  </>
);
