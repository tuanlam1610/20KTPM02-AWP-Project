import { LeftOutlined } from '@ant-design/icons';
import { Button, Tooltip, message } from 'antd';
import Table from 'antd/es/table';
import Column from 'antd/es/table/Column';
import ColumnGroup from 'antd/es/table/ColumnGroup';
import axios from 'axios';
import { keyBy } from 'lodash';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../redux/store';
import RequestGradeReviewModal from './components/Modals/RequestGradeReviewModal';

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

export default function StudentGradeBoardPage() {
  // const dispatch = useAppDispatch()
  const classes = useAppSelector((state) => state.app.classes);
  const [messageApi, contextHolder] = message.useMessage();
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const pathName = location.pathname;
  const classId: string = params.id ? params.id : '';
  const { userInfo } = useAppSelector((state) => state.app);
  const [gradeCompositionNameMap, setGradeCompositionNameMap] = useState<any>(
    {},
  );
  const [studentGradeMap, setStudentGradeMap] = useState<any>({});
  const [gradeCompositionNames, setGradeCompositionNames] = useState<string[]>(
    [],
  );
  const data: Grade[] = [];

  const formatRawDataToTableData = (rawData: any) => {
    const students: any[] = rawData.students || [];
    const gradeCompositions: any[] = rawData.gradeCompositions || [];
    const gradeCompositionsMap = keyBy(gradeCompositions, 'name');
    const gradeEntries = rawData.students[0].gradeEntries;
    const newStudentGradeMap = keyBy(gradeEntries, 'name');
    setStudentGradeMap(newStudentGradeMap);
    setGradeCompositionNameMap(gradeCompositionsMap);
    setGradeCompositionNames(Object.keys(gradeCompositionsMap));
    return students.map((data) => {
      const gradeCompositionItems = keyBy(data.gradeEntries, 'name');
      Object.keys(gradeCompositionItems).forEach((gradeName) => {
        gradeCompositionItems[gradeName] = gradeCompositionItems[gradeName]
          .isFinalized
          ? gradeCompositionItems[gradeName].grade
          : null;
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
      const studentId = userInfo?.studentId.id;
      const url = `${
        import.meta.env.VITE_REACT_APP_SERVER_URL
      }/classes/${classId}/students/${studentId}/finalizedGrade`;
      const res = await axios.get(url);

      const formattedData = formatRawDataToTableData(res.data);
      setFormattedData(formattedData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (userInfo) fetchGradeBoardInformation();
  }, [classId, userInfo]);

  const handleBackButton = () => {
    navigate(-1);
  };

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
          <p className="text-4xl font-semibold">Grade Board:</p>
        </div>
        <div className="px-4 mt-4">
          <Table dataSource={formattedData} bordered pagination={false}>
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
                    title={
                      <div className="flex justify-between items-center">
                        {gradeCompositionName}
                        <Tooltip title="Request a review">
                          <RequestGradeReviewModal
                            currentGrade={
                              formattedData[0][gradeCompositionName]
                            }
                            gradeCompositionId={
                              gradeCompositionNameMap[gradeCompositionName].id
                            }
                            studentGradeId={
                              studentGradeMap[gradeCompositionName].id
                            }
                          />
                        </Tooltip>
                      </div>
                    }
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
