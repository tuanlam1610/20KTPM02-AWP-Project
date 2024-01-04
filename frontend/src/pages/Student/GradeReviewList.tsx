import { Select, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { useNavigate, useParams } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { GradeReview } from '../../interface';
import { useAppDispatch } from '../../redux/store';

const queryClient = new QueryClient();

export function GradePreviewListProvider() {
  return (
    <QueryClientProvider client={queryClient}>
      <GradeReviewList />
    </QueryClientProvider>
  );
}

export interface GradeReviewItem extends GradeReview {
  numOfComment: number;
}

export default function GradeReviewList() {
  const queryClient = useQueryClient();
  const [type, setType] = useState('Open');
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const params = useParams();
  const classId: string = params.id ? params.id : '';

  const columns: ColumnsType<GradeReviewItem> = [
    {
      title: 'Student',
      dataIndex: 'student',
      key: 'student',
      width: 150,
      fixed: 'left',
      render: (student) => <p className="truncate">{student.name}</p>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      fixed: 'left',
      render: (status) => {
        switch (status) {
          case 'Open': {
            return (
              <div className="flex justify-center items-center">
                <Tag color="blue">Open</Tag>
              </div>
            );
          }
          case 'Denied': {
            return (
              <div className="flex justify-center items-center">
                <Tag color="red">Denied</Tag>
              </div>
            );
          }
          case 'Accepted': {
            return (
              <div className="flex justify-center items-center">
                <Tag color="green">Accepted</Tag>
              </div>
            );
          }
        }
      },
    },
    {
      title: 'Grade',
      children: [
        {
          title: 'Current',
          dataIndex: 'currentGrade',
          key: 'currentGrade',
        },
        {
          title: 'Expected',
          dataIndex: 'expectedGrade',
          key: 'expectedGrade',
        },
        {
          title: 'Final',
          dataIndex: 'finalGrade',
          key: 'finalGrade',
        },
      ],
    },
    {
      title: 'Grade',
      dataIndex: 'studentGrade',
      key: 'studentGrade',
      render: (studentGrade) => (
        <p className="truncate">{studentGrade.gradeComposition.name}</p>
      ),
    },
    {
      title: 'Resolved by',
      dataIndex: 'teacher',
      key: 'teacher',
      render: (teacher) => <p className="truncate">{teacher?.name}</p>,
    },
  ];

  const fetchGradeReviews = async (page = 0, type = 'Open') => {
    const res = await axios.get(
      `${
        import.meta.env.VITE_REACT_APP_SERVER_URL
      }/classes/${classId}/getGradeReview?status=${type}&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      },
    );
    setPage(res.data.currentPage);
    return {
      gradeReviews: res.data.gradeReviews as GradeReviewItem[],
      hasMore: res.data.currentPage < res.data.totalPage - 1,
      totalReviews: res.data.totalRecord,
    };
  };

  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ['gradeReviews', page, type],
    queryFn: () => fetchGradeReviews(page, type),
  });

  const handleChange = (value: string) => {
    setType(value);
  };

  useEffect(() => {
    if (data?.hasMore) {
      queryClient.prefetchQuery({
        queryKey: ['gradeReviews', page, type],
        queryFn: () => fetchGradeReviews(page, type),
      });
    }
  }, [page]);

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['gradeReviews', 0, type],
      queryFn: () => fetchGradeReviews(0, type),
    });
    setPage(0);
  }, [type]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">My Grade Reviews:</h1>
        <div className="flex gap-2">
          <Select
            style={{ width: '120px' }}
            value={type}
            onChange={handleChange}
            options={[
              { value: 'Open', label: 'Open' },
              { value: 'Accepted', label: 'Accepted' },
              { value: 'Denied', label: 'Denied' },
              { value: 'All', label: 'All' },
            ]}
          />
        </div>
      </div>
      <div>
        <Table
          rowClassName="cursor-pointer"
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                navigate(`gradeReview/${record.id}`);
              }, // click row
            };
          }}
          dataSource={isLoading ? [] : data?.gradeReviews}
          columns={columns}
          scroll={{ y: 480, x: 1000 }}
          pagination={{
            onChange: (page, pageSize) => {
              setPage(page - 1);
            },
            current: page + 1,
            defaultPageSize: 1,
            total: data?.totalReviews,
          }}
        />
      </div>
    </div>
  );
}
