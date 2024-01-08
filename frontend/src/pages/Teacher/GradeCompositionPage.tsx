import {
  DownloadOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  LeftOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Dropdown,
  MenuProps,
  Modal,
  Space,
  Table,
  message,
} from 'antd';
import Search from 'antd/es/input/Search';
import Column from 'antd/es/table/Column';
import axios from 'axios';
import Papa from 'papaparse';
import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { downloadCSV, downloadXLSX } from '../../utils/helper';
import EditGradeCompositionModal from './components/Modals/EditGradeCompositionModal';
import { useAppSelector } from '../../redux/store';

export default function GradeCompositionPage() {
  const params = useParams();
  const navigate = useNavigate();
  const classId: string = params.id ? params.id : '';
  const gradeCompositionId = params?.gradeCompositionId;
  const userInfo = useAppSelector((state) => state.app.userInfo);

  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState<any>([]);
  const [gradeComposition, setGradeComposition] = useState<any>({});
  const { isEditingGradeComposition } = useAppSelector((state) => state.app);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sampleGradeCompositionData: any = [];
  for (let i = 0; i < 20; i++) {
    sampleGradeCompositionData.push(
      {
        key: `${i}_1`,
        name: 'Student 1',
        studentId: '20127001',
        ['Exercise 01']: 8,
      },
      {
        key: `${i}_2`,
        name: 'Student 2',
        studentId: '20127002',
        ['Exercise 01']: 9,
      },
      {
        key: `${i}_3`,
        name: 'Student 3',
        studentId: '20127003',
        ['Exercise 01']: 10,
      },
    );
  }

  const templateData = [
    {
      studentId: '',
      name: '',
      grade: '',
    },
  ];

  const handleBackButton = () => {
    navigate(-1);
  };

  const handleFinalize = async () => {
    try {
      const url = `${
        import.meta.env.VITE_REACT_APP_SERVER_URL
      }/grade-compositions/${gradeCompositionId}/finalize`;
      const values = {
        teacherId: userInfo?.teacherId.id,
      };
      await axios.patch(url, values);
      setGradeComposition({
        id: gradeComposition.id,
        name: gradeComposition.name,
        isFinalized: true,
      });
      setIsModalOpen(false);
    } catch (error) {}
  };

  const fetchGradeComposition = async () => {
    try {
      const url = `${
        import.meta.env.VITE_REACT_APP_SERVER_URL
      }/grade-compositions/${gradeCompositionId}/getStudentsGrade`;
      const res = await axios.get(url);
      let resultData = res.data?.studentGrades || [];
      setData(resultData);
      setGradeComposition(res.data?.gradeComposition || {});
    } catch (err) {
      setData([...sampleGradeCompositionData]);
    }
  };

  useEffect(() => {
    fetchGradeComposition();
  }, [isEditingGradeComposition]);

  const exportGradeCompositionOptions: MenuProps['items'] = [
    {
      key: '1',
      label: 'CSV',
      icon: <FileTextOutlined />,
      onClick: () => {
        const exportData = data.length <= 0 ? templateData : data;
        delete exportData['id'];
        downloadCSV(exportData, `Class${classId}_${gradeComposition.name}`);
      },
    },
    {
      key: '2',
      label: 'XLSX',
      icon: <FileExcelOutlined />,
      onClick: () => {
        const exportData = data.length <= 0 ? templateData : data;
        exportData.map((row: any) => {
          delete row['id'];
          return row;
        });

        downloadXLSX(exportData, `Class${classId}_${gradeComposition.name}`);
      },
    },
  ];

  const doUploadStudentList = async (data: any) => {
    // Upload List Student
    try {
      const url = `${
        import.meta.env.VITE_REACT_APP_SERVER_URL
      }/grade-compositions/${gradeCompositionId}/updateAllStudentGrades/${classId}`;
      const result = await axios.patch(url, {
        studentGrades: data,
      });
      fetchGradeComposition();
      messageApi.open({
        type: 'success',
        content: 'Upload grade composition successfully',
        duration: 1,
      });
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: `Something wrong when upload grade composition`,
        duration: 1,
      });
    }
  };

  const handleUploadStudentList = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileData: File = e.target.files[0];

      if (fileData.type == 'text/csv') {
        Papa.parse(fileData, {
          header: true,
          complete: function (results: any) {
            const data = results.data.map((row: any) => {
              return { ...row, grade: Number(row?.grade) };
            });

            doUploadStudentList(data);
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
          <p className="text-4xl font-semibold">
            {`Grade Composition - ${gradeComposition.name}`}
          </p>
        </div>
        <div className="flex justify-between items-center px-4 mt-4">
          <Search placeholder="Search student ID" className="w-1/2" />
          <div className="flex gap-2 justify-start items-center">
            {!gradeComposition.isFinalized && (
              <div className="w-fit">
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
                      Upload
                    </span>
                    <UploadOutlined />
                  </label>
                </Button>
              </div>
            )}
            <Dropdown
              menu={{
                items: exportGradeCompositionOptions,
              }}
            >
              <Button>
                <Space>
                  Download
                  <DownloadOutlined />
                </Space>
              </Button>
            </Dropdown>
            {!gradeComposition.isFinalized && (
              <>
                <Button onClick={() => setIsModalOpen(true)}>Finalize</Button>

                <Modal
                  title={'Finalize This Grade'}
                  open={isModalOpen}
                  centered
                  onCancel={() => setIsModalOpen(false)}
                  footer={
                    <div>
                      <Button key="back" onClick={() => setIsModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleFinalize} danger>
                        Confirm
                      </Button>
                    </div>
                  }
                ></Modal>
              </>
            )}
          </div>
        </div>
        <div className="px-4 mt-4">
          <Table dataSource={data} bordered>
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

            <Column
              key="grade"
              dataIndex="grade"
              title={`${gradeComposition.name}`}
            />
            {!gradeComposition.isFinalized && (
              <Column
                key="id"
                dataIndex="id"
                render={(value, record, index) => {
                  return (
                    <EditGradeCompositionModal
                      record={data[index]}
                      classId={classId}
                    />
                  );
                }}
              />
            )}
          </Table>
        </div>
      </div>
    </div>
  );
}
