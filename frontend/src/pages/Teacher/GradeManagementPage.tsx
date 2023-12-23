import {
  DownloadOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  LeftOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, MenuProps, Space } from 'antd';
import Search from 'antd/es/input/Search';
import Table from 'antd/es/table';
import Column from 'antd/es/table/Column';
import ColumnGroup from 'antd/es/table/ColumnGroup';
import { keyBy } from 'lodash';
import Papa from 'papaparse';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';

interface Grade {
  key: React.Key;
  name: string;
  email: string;
  studentId: string;
  gradeCompositions: {
    id: string;
    name: string;
    grade: number | null;
    isFinalized: boolean;
  }[];
  totalGrade: number;
}

export default function GradeManagementPage() {
  // const dispatch = useAppDispatch()
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const pathName = location.pathname;
  console.log(pathName);
  const classId: number = params.id ? Number(params.id) : 0;

  const data: Grade[] = [];
  for (let i = 0; i < 20; i++) {
    data.push(
      {
        key: `${i}_1`,
        name: 'Student 1',
        email: 'student1@gmail.com',
        studentId: '20127001',
        gradeCompositions: [
          {
            id: 'composition1',
            name: 'Exercise 1',
            grade: 7,
            isFinalized: false,
          },
          {
            id: 'composition2',
            name: 'Exercise 2',
            grade: 8,
            isFinalized: false,
          },
          {
            id: 'composition3',
            name: 'Exercise 3',
            grade: 9,
            isFinalized: false,
          },
          {
            id: 'composition4',
            name: 'Exercise 4',
            grade: 8.5,
            isFinalized: false,
          },
          {
            id: 'composition5',
            name: 'Exercise 5',
            grade: 9,
            isFinalized: false,
          },
          {
            id: 'composition6',
            name: 'Exercise 6',
            grade: 7.5,
            isFinalized: false,
          },
          {
            id: 'composition7',
            name: 'Midterm',
            grade: 10,
            isFinalized: true,
          },
          {
            id: 'composition8',
            name: 'Final',
            grade: 9.5,
            isFinalized: false,
          },
        ],
        totalGrade: 8.0,
      },
      {
        key: `${i}_2`,
        name: 'Student 2',
        email: 'student2@gmail.com',
        studentId: '20127002',
        gradeCompositions: [
          {
            id: 'composition1',
            name: 'Exercise 1',
            grade: 7,
            isFinalized: false,
          },
          {
            id: 'composition2',
            name: 'Exercise 2',
            grade: 8,
            isFinalized: false,
          },
          {
            id: 'composition3',
            name: 'Exercise 3',
            grade: 9,
            isFinalized: false,
          },
          {
            id: 'composition4',
            name: 'Exercise 4',
            grade: 8.5,
            isFinalized: false,
          },
          {
            id: 'composition5',
            name: 'Exercise 5',
            grade: 9,
            isFinalized: false,
          },
          {
            id: 'composition6',
            name: 'Exercise 6',
            grade: 7.5,
            isFinalized: false,
          },
          {
            id: 'composition7',
            name: 'Midterm',
            grade: 10,
            isFinalized: true,
          },
          {
            id: 'composition8',
            name: 'Final',
            grade: 9.5,
            isFinalized: false,
          },
        ],
        totalGrade: 7.5,
      },
      {
        key: `${i}_3`,
        name: 'Student 3',
        email: 'student3@gmail.com',
        studentId: '20127003',
        gradeCompositions: [
          {
            id: 'composition1',
            name: 'Exercise 1',
            grade: 7,
            isFinalized: false,
          },
          {
            id: 'composition2',
            name: 'Exercise 2',
            grade: 8,
            isFinalized: false,
          },
          {
            id: 'composition3',
            name: 'Exercise 3',
            grade: 9,
            isFinalized: false,
          },
          {
            id: 'composition4',
            name: 'Exercise 4',
            grade: 8.5,
            isFinalized: false,
          },
          {
            id: 'composition5',
            name: 'Exercise 5',
            grade: 9,
            isFinalized: false,
          },
          {
            id: 'composition6',
            name: 'Exercise 6',
            grade: 7.5,
            isFinalized: false,
          },
          {
            id: 'composition7',
            name: 'Midterm',
            grade: 10,
            isFinalized: true,
          },
          {
            id: 'composition8',
            name: 'Final',
            grade: 9.5,
            isFinalized: false,
          },
        ],
        totalGrade: 9.0,
      },
    );
  }

  let gradeCompositionNames: string[] = [];

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
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Grade Board');
    XLSX.writeFile(workbook, `${fileName}.xlsx`, { compression: true });
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
    gradeCompositionNames = Object.keys(newGradeCompositions);
    const res = {
      ...data,
      ...newGradeCompositions,
    };
    delete res.gradeCompositions;
    return res;
  });

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
            <input
              type="file"
              accept=".xlsx, .csv"
              onChange={async (e) => {
                if (e.target.files) {
                  const fileData: File = e.target.files[0];
                  console.log(fileData);
                  if (fileData.type == 'text/csv') {
                    console.log('Parse CSV File');
                    Papa.parse(fileData, {
                      header: true,
                      complete: function (results) {
                        console.log(results.data);
                        console.log(data);
                      },
                    });
                  } else {
                    console.log('Parse XLSX File');
                    const data = await fileData.arrayBuffer();
                    const workbook = XLSX.read(data);
                    const wsName = workbook.SheetNames[0];
                    const worksheet = XLSX.utils.sheet_to_json(
                      workbook.Sheets[wsName],
                    );
                    console.log(worksheet);
                  }
                }
              }}
            />
            {/* <Upload
              beforeUpload={(file) => {
                const isValidFormat =
                  file.type === 'text/csv' ||
                  file.type ===
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                return isValidFormat || Upload.LIST_IGNORE;
              }}
            >
              <Button icon={<UploadOutlined />}>Upload Student List</Button>
            </Upload> */}
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
          <Table dataSource={formattedData} bordered>
            <Column
              key="studentId"
              dataIndex="studentId"
              title="Student ID"
              fixed="left"
            />
            <Column
              key="name"
              dataIndex="name"
              title="Full Name"
              fixed="left"
            />
            <Column key="email" dataIndex="email" title="Email" />
            <ColumnGroup title="Grade Structure">
              {gradeCompositionNames.map((gradeCompositionName) => (
                <Column
                  key={gradeCompositionName}
                  dataIndex={gradeCompositionName}
                  title={() => {
                    return (
                      <Link
                        to={`${pathName}/${
                          formattedData[`${gradeCompositionName}`]?.id
                        }`}
                      >
                        {gradeCompositionName}
                      </Link>
                      // <Button
                      //   onClick={() => {
                      //     navigate(
                      //       `${pathName}/${
                      //         formattedData[`${gradeCompositionName}`]?.id
                      //       }`,
                      //     );
                      //   }}
                      // >
                      //   {gradeCompositionName}
                      // </Button>
                    );
                  }}
                />
              ))}
            </ColumnGroup>
            <Column
              key="totalGrade"
              dataIndex="totalGrade"
              title="Total Grade"
            />
          </Table>
        </div>
      </div>
    </div>
  );
}
