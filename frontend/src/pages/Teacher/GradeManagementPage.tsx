import {
  DownloadOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  LeftOutlined,
  UploadOutlined,
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

  const templateData = [
    {
      studentId: '',
      name: '',
      gradeEntries: [],
      totalGrade: 0,
    },
  ];

  const data: Grade[] = [];

  const formatRawDataToTableData = (rawData: any) => {
    const students: any[] = rawData.students || [];
    const gradeCompositions: any[] = rawData.gradeCompositions || [];
    const gradeCompositionsMap = keyBy(gradeCompositions, 'name');
    setGradeCompositionNameMap(gradeCompositionsMap);
    setGradeCompositionNames(Object.keys(gradeCompositionsMap));
    return students.map((data) => {
      const gradeCompositionItems = keyBy(data.gradeEntries, 'name');
      Object.keys(gradeCompositionItems).forEach((gradeName) => {
        gradeCompositionItems[gradeName] =
          gradeCompositionItems[gradeName].grade;
      });
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
      const formattedData = formatRawDataToTableData(res.data);
      setFormattedData(formattedData);
    } catch (err) {}
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
      fetchGradeBoardInformation();
      messageApi.open({
        type: 'success',
        content: 'Success',
        duration: 1,
      });
    } catch (error) {
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
      if (fileData?.type == 'text/csv') {
        Papa.parse(fileData, {
          header: true,
          complete: function (results) {
            doUploadStudentList(results.data);
          },
        });
      } else {
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
        studentId: dataRow.studentId,
        name: dataRow.name,
      };
    });
    return res;
  };

  const downloadStudentListCSV = () => {
    const data = formattedData.length <= 0 ? templateData : formattedData;
    const studentTemplate = getStudentTemplate(data);
    downloadCSV(studentTemplate, `StudentList_Class${classId}`);
  };

  const downloadStudentListXLSX = () => {
    const data = formattedData.length <= 0 ? templateData : formattedData;
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
      onClick: () => downloadCSV(formattedData, `GradeBoard_Class${classId}`),
    },
    {
      key: '2',
      label: 'XLSX',
      icon: <FileExcelOutlined />,
      onClick: () => {
        let templateData = {
          studentId: '',
          name: '',
          totalGrade: '',
        };
        gradeCompositionNames.forEach((gradeCompositionName: string) => {
          templateData = { ...templateData, [gradeCompositionName]: '' };
        });
        const exportFormattedData = formattedData.map((row: any) => {
          delete row['gradeEntries'];
          return row;
        });
        const exportData =
          formattedData.length <= 0 ? [templateData] : exportFormattedData;
        downloadXLSX(exportData, `GradeBoard_Class${classId}`);
      },
    },
  ];

  const exportOptions: MenuProps['items'] = [
    {
      key: 'studentList',
      label: 'Student List',
      children: exportStudentListOptions,
    },
    {
      key: 'gradeBoard',
      label: 'Grade Board',
      children: exportGradeBoardListOptions,
    },
  ];

  return (
    <div className="flex flex-col">
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
              onClick={(e) => {
                const element = e.target as HTMLInputElement;
                element.value = '';
              }}
              onChange={handleUploadStudentList}
              id="buttonFile"
              className="hidden"
            />

            <Button className="p-0">
              <label
                htmlFor="buttonFile"
                className="px-6 py-2 w-full h-full flex gap-2 cursor-pointer"
              >
                <span className=" w-full h-full text-center flex justify-center items-center">
                  Upload Student List
                </span>
                <UploadOutlined />
              </label>
            </Button>
            <Dropdown
              menu={{
                items: exportOptions,
              }}
            >
              <Button>
                <Space>
                  Download
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
              {gradeCompositionNames.map((gradeCompositionName: any) => {
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
