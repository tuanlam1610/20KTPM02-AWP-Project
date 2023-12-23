import {
  DownloadOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  LeftOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, MenuProps, Space, Upload } from 'antd';
import Search from 'antd/es/input/Search';
import Table, { ColumnsType } from 'antd/es/table';
import Papa from 'papaparse';
import { useNavigate, useParams } from 'react-router-dom';
import { utils, writeFile } from 'xlsx';
import { keyBy } from 'lodash';

interface Grade {
  key: React.Key;
  name: string;
  email: string;
  studentId: string;
  gradeCompositions: {
    id: string;
    name: string;
    grade: number;
    isFinalized: boolean;
  }[];
  totalGrade: number;
}

export default function GradeManagementPage() {
  // const dispatch = useAppDispatch()
  const params = useParams();
  const navigate = useNavigate();

  const classId: number = params.id ? Number(params.id) : 0;

  const columns: ColumnsType<any> = [
    {
      title: 'Student ID',
      dataIndex: 'studentId',
      key: 'studentId',
      responsive: ['lg'],
    },
    {
      title: 'Fullname',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      responsive: ['md'],
    },
    {
      title: 'Total Grade',
      dataIndex: 'totalGrade',
      key: 'totalGrade',
    },
  ];

  // const {Column, ColumnGroup} = Table

  const data: Grade[] = [
    {
      key: '1',
      name: 'Student 1',
      email: 'student1@gmail.com',
      studentId: '20127001',
      gradeCompositions: [
        {
          id: 'composition1',
          name: 'Exercise 1',
          grade: 8.0,
          isFinalized: false,
        },
        {
          id: 'composition2',
          name: 'Midterm',
          grade: 10,
          isFinalized: true,
        },
        {
          id: 'composition3',
          name: 'Final',
          grade: 9.5,
          isFinalized: false,
        },
      ],
      totalGrade: 8.0,
    },
    {
      key: '2',
      name: 'Student 2',
      email: 'student2@gmail.com',
      studentId: '20127002',
      gradeCompositions: [
        {
          id: 'composition1',
          name: 'Exercise 1',
          grade: 8.0,
          isFinalized: false,
        },
        {
          id: 'composition2',
          name: 'Midterm',
          grade: 10,
          isFinalized: true,
        },
        {
          id: 'composition3',
          name: 'Final',
          grade: 9.5,
          isFinalized: false,
        },
      ],
      totalGrade: 7.5,
    },
    {
      key: '3',
      name: 'Student 3',
      email: 'student3@gmail.com',
      studentId: '20127003',
      gradeCompositions: [
        {
          id: 'composition1',
          name: 'Exercise 1',
          grade: 8.0,
          isFinalized: false,
        },
        {
          id: 'composition2',
          name: 'Midterm',
          grade: 10,
          isFinalized: true,
        },
        {
          id: 'composition3',
          name: 'Final',
          grade: 9.5,
          isFinalized: false,
        },
      ],
      totalGrade: 9.0,
    },
  ];

  // const getGradeBoardInformation = async () => {
  //   try {
  //     const res = await axios.get(
  //       `${
  //         import.meta.env.VITE_REACT_APP_SERVER_URL
  //       }/teacher/class/${classId}/getGradeBoard`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  //         },
  //       },
  //     );
  //     console.log(res);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // useEffect(() => {
  //   getGradeBoardInformation();
  // });

  const handleBackButton = () => {
    navigate(-1);
  };

  const getStudentTemplate = (data: Grade[]) => {
    const res = data.map((dataRow) => {
      return {
        key: dataRow.key,
        studentId: dataRow.studentId,
        name: dataRow.name,
        email: dataRow.email,
      };
    });
    return res;
  };

  const downloadCSV = (data: any[], fileName: string) => {
    const csv = Papa.unparse(data);
    const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const csvURL = window.URL.createObjectURL(csvData);
    const tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', `${fileName}.csv`);
    tempLink.click();
  };

  const downloadXLSX = (data: any[], fileName: string) => {
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Grade Board');
    writeFile(workbook, `${fileName}.xlsx`, { compression: true });
  };

  const downloadStudentListCSV = () => {
    const studentTemplate = getStudentTemplate(data);
    downloadCSV(studentTemplate, `StudentList_Class${classId}`);
  };

  const downloadStudentListXLSX = () => {
    const studentTemplate = getStudentTemplate(data);
    downloadXLSX(studentTemplate, `StudentList_Class${classId}`);
  };

  const exportStudentListOptions: MenuProps['items'] = [
    {
      key: '1',
      label: 'CSV',
      icon: <FileTextOutlined />,
      onClick: downloadStudentListCSV,
    },
    {
      key: '2',
      label: 'XLSX',
      icon: <FileExcelOutlined />,
      onClick: downloadStudentListXLSX,
    },
  ];

  const exportGradeBoardListOptions: MenuProps['items'] = [
    {
      key: '1',
      label: 'CSV',
      icon: <FileTextOutlined />,
      onClick: () => downloadCSV(data, `GradeBoard_Class${classId}`),
    },
    {
      key: '2',
      label: 'XLSX',
      icon: <FileExcelOutlined />,
      onClick: () => downloadXLSX(data, `GradeBoard_Class${classId}`),
    },
  ];

  const formattedData = data.map((data) => {
    const newGradeCompositions = keyBy(data.gradeCompositions, 'name');
    Object.keys(newGradeCompositions).forEach((gradeName) => {
      newGradeCompositions[gradeName] = newGradeCompositions[gradeName].grade;
    });
    const res = {
      ...data,
      ...newGradeCompositions,
    };
    delete res.gradeCompositions;
    console.log(res);
    return res;
  });

  console.log(formattedData);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Content */}
      <div className="flex flex-col mx-8 my-8 gap-4">
        <div className="">
          <Button icon={<LeftOutlined />} onClick={handleBackButton}>
            Back
          </Button>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-4xl font-semibold">Grade Management:</p>
        </div>
        <div className="flex justify-between items-center px-4 mt-4">
          <Search placeholder="Search student ID" className="w-1/2" />
          <div className="flex gap-2 justify-center items-center">
            <Upload
              beforeUpload={(file) => {
                console.log(file.type);
                const isValidFormat =
                  file.type === 'text/csv' ||
                  file.type ===
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                console.log(isValidFormat);
                return isValidFormat || Upload.LIST_IGNORE;
              }}
            >
              <Button icon={<UploadOutlined />}>Upload Student List</Button>
            </Upload>
            <Dropdown
              menu={{
                items: exportStudentListOptions,
              }}
            >
              <Button>
                <Space>
                  Export Student List
                  <DownloadOutlined />
                </Space>
              </Button>
            </Dropdown>
            <Dropdown
              menu={{
                items: exportGradeBoardListOptions,
              }}
            >
              <Button>
                <Space>
                  Export Grade Board
                  <DownloadOutlined />
                </Space>
              </Button>
            </Dropdown>
          </div>
        </div>
        <div className="px-4 mt-4">
          <Table columns={columns} dataSource={data} />
        </div>
        {/* <div className="flex gap-2">
          <Button
            icon={<DownloadOutlined />}
            onClick={() => downloadCSV(data, `GradeBoard_Class${classId}`)}
          >
            Export CSV
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={() => downloadXLSX(data, `GradeBoard_Class${classId}`)}
          >
            Export XLSX
          </Button>
          <Button icon={<DownloadOutlined />} onClick={downloadStudentListCSV}>
            Export Student List CSV
          </Button>
          <Button icon={<DownloadOutlined />} onClick={downloadStudentListXLSX}>
            Export Student List
          </Button>
        </div> */}
      </div>
    </div>
  );
}
