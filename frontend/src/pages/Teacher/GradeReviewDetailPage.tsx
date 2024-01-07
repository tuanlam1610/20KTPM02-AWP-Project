import { Comment } from '@ant-design/compatible';
import {
  CheckCircleFilled,
  LeftOutlined,
  MinusCircleFilled,
  UserOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  InputNumber,
  Modal,
  Row,
  Spin,
  Tooltip,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { queryClient } from '../../App';
import { Comment as CommentData, GradeReview } from '../../interface';
import { useAppSelector } from '../../redux/store';

export interface GradeReviewDetail extends GradeReview {
  comment: CommentData[];
}

export default function GradeReviewDetailPage() {
  const userInfo = useAppSelector((state) => state.app.userInfo);
  const params = useParams();
  const gradeReviewId: string = params.gradeReviewId
    ? params.gradeReviewId
    : '';

  const [isAcceptedModalOpen, setIsAcceptedModalOpen] = useState(false);
  const [isDeniedModalOpen, setIsDeniedModalOpen] = useState(false);

  const fetchGradeReviewDetail = async () => {
    const res = await axios.get(
      `${
        import.meta.env.VITE_REACT_APP_SERVER_URL
      }/grade-reviews/${gradeReviewId}/details`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      },
    );
    return res.data as GradeReviewDetail;
  };

  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ['gradeReviews', gradeReviewId],
    queryFn: () => fetchGradeReviewDetail(),
  });

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

  const [form] = useForm();

  const handleOk = async () => {
    const values = await form.validateFields();
    await axios.patch(
      `${
        import.meta.env.VITE_REACT_APP_SERVER_URL
      }/grade-reviews/${gradeReviewId}/finalize`,
      {
        teacherId: userInfo?.teacherId.id,
        finalGrade: values.finalGrade,
        status: 'Accepted',
      },
    );
    await queryClient.refetchQueries({
      queryKey: ['gradeReviews', gradeReviewId],
      type: 'active',
    });
  };

  const handleDenyButton = async () => {
    await axios.patch(
      `${
        import.meta.env.VITE_REACT_APP_SERVER_URL
      }/grade-reviews/${gradeReviewId}/finalize`,
      {
        teacherId: userInfo?.teacherId.id,
        finalGrade: null,
        status: 'Denied',
      },
    );
    await queryClient.refetchQueries({
      queryKey: ['gradeReviews', gradeReviewId],
      type: 'active',
    });
  };

  const handleCancel = () => {
    setIsAcceptedModalOpen(false);
    setIsDeniedModalOpen(false);
    form.resetFields();
  };

  if (isLoading)
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <Spin />
      </div>
    );

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
            Grade review on {data?.studentGrade.gradeComposition.name}
          </div>
          <div className="my-6 flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Avatar className="bg-indigo-500" icon={<UserOutlined />} />
              <div>
                {data?.student.name}

                <Tooltip
                  title={dayjs(data?.createdAt).format('YYYY-MM-DD HH:mm')}
                  mouseEnterDelay={0.5}
                >
                  <div className="cursor-default text-sm">
                    {dayjs(data?.createdAt).fromNow()}
                  </div>
                </Tooltip>
              </div>
            </div>
            <div className="flex gap-2">
              {userInfo?.roles.includes('teacher') &&
                data?.status === 'Open' && (
                  <>
                    <Button
                      className="bg-slate-100 w-40"
                      size="large"
                      type="text"
                      icon={<CheckCircleFilled style={{ color: 'green' }} />}
                      onClick={() => setIsAcceptedModalOpen(true)}
                    >
                      Resolve
                    </Button>
                    <Modal
                      title={'Resolve Grade Review'}
                      open={isAcceptedModalOpen}
                      centered
                      onCancel={handleCancel}
                      footer={
                        <div>
                          <Button key="back" onClick={handleCancel}>
                            Cancel
                          </Button>
                          <Button key="submit" onClick={handleOk}>
                            Resolve
                          </Button>
                        </div>
                      }
                    >
                      <Form form={form} layout="vertical">
                        <Form.Item
                          label={<p className="">{'Final Grade:'}</p>}
                          rules={[
                            {
                              required: true,
                              message: 'Please input the final grade.',
                            },
                          ]}
                          name={'finalGrade'}
                          className="w-full mb-4"
                        >
                          <InputNumber placeholder="10" min={1} max={10} />
                        </Form.Item>
                      </Form>
                    </Modal>
                    <Button
                      className="bg-slate-100 w-40"
                      size="large"
                      type="text"
                      icon={<MinusCircleFilled style={{ color: 'red' }} />}
                      onClick={() => setIsDeniedModalOpen(true)}
                    >
                      Deny
                    </Button>
                    <Modal
                      title={'Denied Grade Review'}
                      open={isDeniedModalOpen}
                      centered
                      onCancel={handleCancel}
                      footer={
                        <div>
                          <Button key="back" onClick={handleCancel}>
                            Cancel
                          </Button>
                          <Button
                            key="submit"
                            onClick={handleDenyButton}
                            danger
                          >
                            Confirm
                          </Button>
                        </div>
                      }
                    ></Modal>
                  </>
                )}
            </div>
          </div>
          <div className="my-6">
            {data?.status === 'Denied' ? (
              <div className="flex gap-4 px-8 py-4 bg-red-100 rounded-lg">
                <MinusCircleFilled style={{ color: 'red' }} />
                <div className="flex flex-col gap-2">
                  <div className="text-xl font-semibold">
                    The request has been denied
                  </div>
                  <div>
                    Denied by: <span>{data?.teacher?.name}</span>
                  </div>
                  <div>
                    Denied on:{' '}
                    {dayjs(data.updatedAt).format('YYYY-MM-DD HH:mm')}
                  </div>
                </div>
              </div>
            ) : data?.status === 'Accepted' ? (
              <div className="flex gap-4 px-8 py-4 bg-green-100 rounded-lg">
                <CheckCircleFilled style={{ color: 'green' }} />
                <div className="flex flex-col gap-2">
                  <div className="text-xl font-semibold">
                    The request has been accepted
                  </div>
                  <div>
                    Accepted by: <span>{data?.teacher?.name}</span>
                  </div>
                  <div>
                    Accepted on:{' '}
                    {dayjs(data.updatedAt).format('YYYY-MM-DD HH:mm')}
                  </div>
                </div>
              </div>
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
                {data?.currentGrade}
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
                {data?.expectedGrade}
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
                {data?.finalGrade}
              </Card>
            </Col>
          </Row>
          <div className="text-xl font-semibold mb-2">Explanation</div>
          <p className="mb-4 indent-8">{data?.explanation}</p>
          <div className="text-xl font-semibold mb-2">Comment</div>
          <div className="flex flex-col gap-2 mb-12">
            {data?.comment.map((c) => {
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
