import { Select, Table, Tag } from 'antd';
import { useState } from 'react';
import { GradeReview } from '../../interface';
import { useAppDispatch } from '../../redux/store';
import { ColumnsType } from 'antd/es/table';
import { useNavigate, useParams } from 'react-router-dom';

export interface GradeReviewItem extends GradeReview {
  numOfComment: number;
}

export default function GradeReviewList() {
  const dispatch = useAppDispatch();
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
      render: (student) => <p className="truncate">{student?.user?.name}</p>,
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
      dataIndex: 'grade',
      key: 'grade',
      render: (grade) => <p className="truncate">{grade?.name}</p>,
    },
    {
      title: 'Resolved by',
      dataIndex: 'teacher',
      key: 'teacher',
      render: (teacher) => <p className="truncate">{teacher?.user?.name}</p>,
    },
  ];

  // const fetchProjects = (page = 0) =>
  //   fetch('/api/projects?page=' + page).then((res) => res.json());

  // const { isLoading, isError, error, data, isFetching, isPreviousData } =
  //   useQuery({
  //     queryKey: ['projects', page],
  //     queryFn: () => fetchProjects(page),
  //   });

  const dataSource: GradeReviewItem[] = [
    {
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
      explanation: 'Toi gioi toi muon cao diem',
      numOfComment: 0,
    },
    {
      student: {
        id: '123',
        fullname: 'Ha Tuan Lam',
      },
      class: {
        name: 'ADVANCED WEB',
      },
      teacher: {
        id: '12344',
        fullname: 'Tran Duy Quang',
      },
      id: '1234',
      status: 'Accepted',
      expectedGrade: 9.5,
      currentGrade: 8,
      finalGrade: 9,
      grade: {
        name: 'Midterm',
      },
      explanation: 'Toi gioi toi muon cao diem',
      numOfComment: 0,
    },
    {
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
      explanation: 'Toi gioi toi muon cao diem',
      numOfComment: 0,
    },
    {
      student: {
        id: '123',
        fullname: 'Ha Tuan Lam',
      },
      class: {
        name: 'ADVANCED WEB',
      },
      teacher: {
        id: '12344',
        fullname: 'Tran Duy Quang',
      },
      id: '1234',
      status: 'Accepted',
      expectedGrade: 9.5,
      currentGrade: 8,
      finalGrade: 9,
      grade: {
        name: 'Midterm',
      },
      explanation: 'Toi gioi toi muon cao diem',
      numOfComment: 0,
    },
    {
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
      explanation: 'Toi gioi toi muon cao diem',
      numOfComment: 0,
    },
    {
      student: {
        id: '123',
        fullname: 'Ha Tuan Lam',
      },
      class: {
        name: 'ADVANCED WEB',
      },
      teacher: {
        id: '12344',
        fullname: 'Tran Duy Quang',
      },
      id: '1234',
      status: 'Accepted',
      expectedGrade: 9.5,
      currentGrade: 8,
      finalGrade: 9,
      grade: {
        name: 'Midterm',
      },
      explanation: 'Toi gioi toi muon cao diem',
      numOfComment: 0,
    },
    {
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
      explanation: 'Toi gioi toi muon cao diem',
      numOfComment: 0,
    },
    {
      student: {
        id: '123',
        fullname: 'Ha Tuan Lam',
      },
      class: {
        name: 'ADVANCED WEB',
      },
      teacher: {
        id: '12344',
        fullname: 'Tran Duy Quang',
      },
      id: '1234',
      status: 'Accepted',
      expectedGrade: 9.5,
      currentGrade: 8,
      finalGrade: 9,
      grade: {
        name: 'Midterm',
      },
      explanation: 'Toi gioi toi muon cao diem',
      numOfComment: 0,
    },
    {
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
      explanation: 'Toi gioi toi muon cao diem',
      numOfComment: 0,
    },
    {
      student: {
        id: '123',
        fullname: 'Ha Tuan Lam',
      },
      class: {
        name: 'ADVANCED WEB',
      },
      teacher: {
        id: '12344',
        fullname: 'Tran Duy Quang',
      },
      id: '1234',
      status: 'Accepted',
      expectedGrade: 9.5,
      currentGrade: 8,
      finalGrade: 9,
      grade: {
        name: 'Midterm',
      },
      explanation: 'Toi gioi toi muon cao diem',
      numOfComment: 0,
    },
  ];

  const handleChange = (value: string) => {
    setType(value);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Grade Reviews:</h1>
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
          dataSource={dataSource}
          columns={columns}
          scroll={{ y: 480, x: 1000 }}
        />
      </div>
    </div>
  );
}
