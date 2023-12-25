import { LeftOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
} from 'antd';
import Search from 'antd/es/input/Search';
import Column from 'antd/es/table/Column';
import axios from 'axios';
import Papa from 'papaparse';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { useAppSelector } from '../../redux/store';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: any;
  index: number;
  children: React.ReactNode;
}

export default function GradeCompositionPage() {
  const params = useParams();
  const navigate = useNavigate();
  const classes = useAppSelector((state) => state.teacher.classes);
  const classId: number = params.id ? Number(params.id) : 0;
  const gradeCompositionId = params?.gradeCompositionId;
  const [data, setData] = useState<any>([]);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record: any) => record.key === editingKey;
  const edit = (record: any & { key: React.Key }) => {
    form.setFieldsValue({ name: '', age: '', address: '', ...record });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey('');
  };
  const save = async (key: React.Key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      console.log(newData);
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

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
  const handleBackButton = () => {
    navigate(-1);
  };

  const fetchGradeComposition = async () => {
    try {
      const url = `${import.meta.env.VITE_REACT_APP_SERVER_URL}/classes/${
        classes[classId].id
      }/gradeComposition/${gradeCompositionId}`;
      const res = await axios.get(url);
      console.log(res.data);
    } catch (err) {
      setData([...sampleGradeCompositionData]);
      console.log(err);
    }
  };

  useEffect(() => {
    console.log('Grade Composition Fetch');
    fetchGradeComposition();
  }, []);

  const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

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
          <p className="text-4xl font-semibold">
            Grade Composition - Exercise 01
          </p>
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
              key="Exercise 01"
              dataIndex="Exercise 01"
              title="Exercise 01"
            />
            <Column
              render={(_: any, record: any) => {
                const editable = isEditing(record);
                return editable ? (
                  <span>
                    <Typography.Link
                      onClick={() => save(record.key)}
                      style={{ marginRight: 8 }}
                    >
                      Save
                    </Typography.Link>
                    <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                      <a>Cancel</a>
                    </Popconfirm>
                  </span>
                ) : (
                  <Typography.Link
                    disabled={editingKey !== ''}
                    onClick={() => edit(record)}
                  >
                    Edit
                  </Typography.Link>
                );
              }}
            />
          </Table>
        </div>
      </div>
    </div>
  );
}
