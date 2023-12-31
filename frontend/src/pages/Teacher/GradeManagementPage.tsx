import {
  DownloadOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  LeftOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, MenuProps, Space, message } from 'antd';
import Search from 'antd/es/input/Search';
import Table from 'antd/es/table';
import Column from 'antd/es/table/Column';
import ColumnGroup from 'antd/es/table/ColumnGroup';
import { keyBy } from 'lodash';
import Papa from 'papaparse';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { useAppSelector } from '../../redux/store';
import axios from 'axios';
import { ChangeEvent, useEffect, useState } from 'react';
import { downloadCSV, downloadXLSX } from '../../utils/helper';

interface Grade {
  key: React.Key;
  name: string;
  studentId: string;
  gradeEntries: {
    id: string;
    name: string;
    grade: number | null;
    isFinalized: boolean;
  }[];
  totalGrade: number;
}

export default function GradeManagementPage() {
  // const dispatch = useAppDispatch()
  const classes = useAppSelector((state) => state.app.classes);
  const [messageApi, contextHolder] = message.useMessage();
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const pathName = location.pathname;
  const classId: string = params.id ? params.id : '';
  const [gradeCompositionNameMap, setGradeCompositionNameMap] = useState<any>(
    {},
  );
  const [gradeCompositionNames, setGradeCompositionNames] = useState<string[]>(
    [],
  );

  const data: Grade[] = [];
  for (let i = 0; i < 20; i++) {
    data.push(
      {
        key: `${i}_1`,
        name: 'Student 1',
        studentId: '20127001',
        gradeEntries: [
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
        studentId: '20127002',
        gradeEntries: [
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
        studentId: '20127003',
        gradeEntries: [
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

  const formatRawDataToTableData = (rawData: any[]) => {
    return rawData.map((data) => {
      const gradeCompositionItems = keyBy(data.gradeEntries, 'name');
      setGradeCompositionNameMap(keyBy(data.gradeEntries, 'name'));
      console.log(gradeCompositionNameMap);
      Object.keys(gradeCompositionItems).forEach((gradeName) => {
        gradeCompositionItems[gradeName] =
          gradeCompositionItems[gradeName].grade;
      });
      setGradeCompositionNames(Object.keys(gradeCompositionItems));
      const res = {
        ...data,
        ...gradeCompositionItems,
      };
      return res;
    });
  };

  const [formattedData, setFormattedData] = useState<any>([]);

  const fetchGradeBoardInformation = async () => {
    try {
      const url = `${
        import.meta.env.VITE_REACT_APP_SERVER_URL
      }/classes/${classId}/getAllGradesOfStudent`;
      const res = await axios.get(url);
      console.log(res.data);
      const formattedData = formatRawDataToTableData(res.data);
      console.log(formattedData);
      setFormattedData(formattedData);
    } catch (err) {
      console.log(err);
    }
  };

  const doUploadStudentList = async (data: any) => {
    // Upload List Student
    try {
      const url = `${
        import.meta.env.VITE_REACT_APP_SERVER_URL
      }/classes/${classId}/populateClassStudents`;
      const result = await axios.post(url, {
        students: data,
      });
      console.log(result);
      fetchGradeBoardInformation();
      messageApi.open({
        type: 'success',
        content: 'Success',
        duration: 1,
      });
    } catch (error) {
      console.log(error);
      messageApi.open({
        type: 'error',
        content: `${error}`,
        duration: 1,
      });
    }
  };

  const handleUploadStudentList = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileData: File = e.target.files[0];
      console.log(fileData);
      if (fileData.type == 'text/csv') {
        console.log('Parse CSV File');
        Papa.parse(fileData, {
          header: true,
          complete: function (results) {
            console.log(results.data);
            doUploadStudentList(results.data);
          },
        });
      } else {
        console.log('Parse XLSX File');
        const data = await fileData.arrayBuffer();
        const workbook = XLSX.read(data);
        const wsName = workbook.SheetNames[0];
        const worksheet = XLSX.utils
          .sheet_to_json(workbook.Sheets[wsName])
          .map((row: any) => {
            return {
              ...row,
              studentId: `${row.studentId}`,
            };
          });
        console.log(worksheet);
        doUploadStudentList(worksheet);
      }
    }
  };

  useEffect(() => {
    fetchGradeBoardInformation();
  }, [classId]);

  const handleBackButton = () => {
    navigate(-1);
  };

  const getStudentTemplate = (data: Grade[]) => {
    const res = data.map((dataRow) => {
      return {
        key: dataRow.key,
        studentId: dataRow.studentId,
        name: dataRow.name,
      };
    });
    return res;
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

  return (
    <div className="flex flex-col min-h-screen">
      {contextHolder}
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
              onChange={handleUploadStudentList}
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
            <ColumnGroup title="Grade Structure">
              {gradeCompositionNames.map((gradeCompositionName) => {
                console.log(gradeCompositionNames);
                return (
                  <Column
                    key={gradeCompositionName}
                    dataIndex={gradeCompositionName}
                    title={() => {
                      return (
                        <Link
                          to={`${pathName}/${
                            gradeCompositionNameMap?.[`${gradeCompositionName}`]
                              ?.id
                          }`}
                        >
                          {gradeCompositionName}
                        </Link>
                      );
                    }}
                  />
                );
              })}
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
