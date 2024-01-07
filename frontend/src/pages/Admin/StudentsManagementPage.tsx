import {
  DownloadOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Dropdown,
  Input,
  InputRef,
  MenuProps,
  Space,
  Table,
  message,
} from 'antd';
import { ColumnType } from 'antd/es/table';
import Column from 'antd/es/table/Column';
import { FilterConfirmProps } from 'antd/es/table/interface';
import axios from 'axios';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { downloadCSV, downloadXLSX } from '../../utils/helper';

export default function StudentsManagementPage() {
  const [messageApi, contextHolder] = message.useMessage();

  const [students, setStudents] = useState([]);

  const templateData = [
    {
      studentId: '',
      studentName: '',
      userId: '',
      userName: '',
    },
  ];

  const fetchStudents = async () => {
    try {
      const studentsUrl = `${
        import.meta.env.VITE_REACT_APP_SERVER_URL
      }/students`;
      const resStudents = await axios.get(studentsUrl);
      console.log(resStudents.data);
      if (resStudents.data) setStudents(resStudents.data);
    } catch (error) {
      console.log(error);
      messageApi.open({
        type: 'error',
        content: `Cannot fetch data`,
        duration: 1,
      });
    }
  };
  useEffect(() => {
    fetchStudents();
  }, []);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: string,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (dataIndex: string, clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
    setSearchedColumn(dataIndex);
  };

  const getColumnSearchProps = (dataIndex: string): ColumnType<any> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e: any) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            className="bg-indigo-500 text-white"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(dataIndex, clearFilters)}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <div className="px-2 aspect-square flex justify-center items-center">
        <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
      </div>
    ),
    onFilter: (value, record: any) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const exportStudentListOptions: MenuProps['items'] = [
    {
      key: '1',
      label: 'CSV',
      icon: <FileTextOutlined />,
      onClick: () => {
        const exportData = students.length <= 0 ? templateData : students;
        delete exportData['id'];
        downloadCSV(exportData, `StudentList`);
      },
    },
    {
      key: '2',
      label: 'XLSX',
      icon: <FileExcelOutlined />,
      onClick: () => {
        const exportData = students.length <= 0 ? templateData : students;
        exportData.map((row: any) => {
          delete row['id'];
          return row;
        });

        downloadXLSX(exportData, `StudentList`);
      },
    },
  ];

  const doUploadStudentList = async (data: any) => {
    // Upload List Student
    try {
      const url = `${
        import.meta.env.VITE_REACT_APP_SERVER_URL
      }/grade-compositions//updateAllStudentGrades/`;
      const result = await axios.patch(url, {
        studentGrades: data,
      });
      console.log(result);
      //   fetchGradeComposition();
      messageApi.open({
        type: 'success',
        content: 'Upload grade composition successfully',
        duration: 1,
      });
    } catch (error) {
      console.log(error);
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
      console.log(fileData);
      if (fileData.type == 'text/csv') {
        console.log('Parse CSV File');
        Papa.parse(fileData, {
          header: true,
          complete: function (results: any) {
            const data = results.data.map((row: any) => {
              return { ...row, grade: Number(row?.grade) };
            });
            console.log(data);
            doUploadStudentList(data);
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

  return (
    <div className="flex flex-col min-h-screen">
      {contextHolder}
      {/* Content */}
      <div className="flex flex-col mx-8 my-8 gap-4">
        <div className="flex justify-between items-center">
          <p className="text-4xl font-semibold mb-4">Students Management</p>
        </div>
        <div className="flex justify-between items-center px-4 mt-4">
          <div className="flex gap-2 justify-start items-center">
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
            <Dropdown
              menu={{
                items: exportStudentListOptions,
              }}
            >
              <Button>
                <Space>
                  Export
                  <DownloadOutlined />
                </Space>
              </Button>
            </Dropdown>
          </div>
        </div>
        <Table
          dataSource={students}
          pagination={{
            defaultPageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '30'],
            position: ['bottomCenter'],
          }}
        >
          <Column
            key="id"
            dataIndex="id"
            title="Student ID"
            width={120}
            sortDirections={['ascend', 'descend']}
            sorter={(a: any, b: any) => {
              if (a.id < b.id) {
                return -1;
              }
              if (a.id > b.id) {
                return 1;
              }
              return 0;
            }}
            {...getColumnSearchProps('id')}
          />
          <Column
            key="name"
            dataIndex="name"
            title="Student ID"
            width={120}
            sortDirections={['ascend', 'descend']}
            sorter={(a: any, b: any) => {
              if (a.id < b.id) {
                return -1;
              }
              if (a.id > b.id) {
                return 1;
              }
              return 0;
            }}
            {...getColumnSearchProps('name')}
          />
          <Column
            key="userId"
            dataIndex="userId"
            title="User ID"
            width={120}
            sortDirections={['ascend', 'descend']}
            sorter={(a: any, b: any) => {
              if (a.id < b.id) {
                return -1;
              }
              if (a.id > b.id) {
                return 1;
              }
              return 0;
            }}
            {...getColumnSearchProps('userId')}
          />
        </Table>
      </div>
    </div>
  );
}
