import {
  DownloadOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Dropdown,
  Form,
  Input,
  InputRef,
  MenuProps,
  Modal,
  Select,
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
import { useForm } from 'antd/es/form/Form';

export default function StudentsManagementPage() {
  const [messageApi, contextHolder] = message.useMessage();

  const [students, setStudents] = useState([]);
  const [form] = useForm();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [unmappedAccounts, setUnmappedAccount] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );

  const fetchUnmappedAccounts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_REACT_APP_SERVER_URL}/users`,
      );
      let result = res?.data.filter((account: any) => {
        return account?.roles[0] == 'student' && !account?.studentId?.id;
      });
      result = result.map((account: any) => {
        return { value: account.id, label: account.id };
      });
      setUnmappedAccount(result || []);
    } catch (error) {
      console.log(error);
    }
  };

  const showModal = (studentId: string) => {
    setSelectedStudentId(studentId);
    fetchUnmappedAccounts();
    setOpen(true);
  };
  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
    setSelectedStudentId(null);
  };
  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      const values = await form.validateFields();
      form.resetFields();
      const url = `${
        import.meta.env.VITE_REACT_APP_SERVER_URL
      }/students/${selectedStudentId}/mapStudentToUser`;
      const res = await axios.patch(url, {
        userId: values.userId,
      });
      fetchStudents();
      messageApi.open({
        type: 'success',
        content: 'Student account mapped successfully',
        duration: 1,
      });
      setConfirmLoading(false);
      setOpen(false);
    } catch (error) {
      console.log(error);
      messageApi.open({
        type: 'error',
        content: 'Failed to map student account',
        duration: 1,
      });
      setConfirmLoading(false);
    }
  };

  const templateMappingData = [
    {
      studentId: '',
      studentName: '',
      userId: '',
      userName: '',
    },
  ];

  const templateStudentData = [
    {
      studentId: '',
      name: '',
    },
  ];

  const fetchStudents = async () => {
    try {
      const studentsUrl = `${
        import.meta.env.VITE_REACT_APP_SERVER_URL
      }/students`;
      const resStudents = await axios.get(studentsUrl);
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
        ?.toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const doUploadMappingList = async (data: any) => {
    // Upload List Student
    try {
      const url = `${
        import.meta.env.VITE_REACT_APP_SERVER_URL
      }/students/mapMultipleStudentToUser`;
      const result = await axios.patch(url, {
        users: data,
      });
      fetchStudents();
      messageApi.open({
        type: 'success',
        content: 'Upload student mapping successfully',
        duration: 1,
      });
    } catch (error) {
      console.log(error);
      messageApi.open({
        type: 'error',
        content: `Something wrong when update student mapping`,
        duration: 1,
      });
    }
  };

  const doUploadStudentList = async (data: any) => {
    // Upload List Student
    try {
      const url = `${
        import.meta.env.VITE_REACT_APP_SERVER_URL
      }/students/populateStudents`;
      const result = await axios.post(url, {
        students: data,
      });
      fetchStudents();
      messageApi.open({
        type: 'success',
        content: 'Upload student list successfully',
        duration: 1,
      });
    } catch (error) {
      console.log(error);
      messageApi.open({
        type: 'error',
        content: `Something wrong when update student list`,
        duration: 1,
      });
    }
  };

  const handleUploadMappingList = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileData: File = e.target.files[0];
      if (fileData.type == 'text/csv') {
        Papa.parse(fileData, {
          header: true,
          complete: function (results: any) {
            const data = results.data;
            doUploadMappingList(data);
          },
        });
      } else {
        const data = await fileData.arrayBuffer();
        const workbook = XLSX.read(data);
        const wsName = workbook.SheetNames[0];
        const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[wsName]);
        doUploadMappingList(worksheet);
      }
    }
  };

  const handleUploadStudentList = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileData: File = e.target.files[0];
      if (fileData.type == 'text/csv') {
        Papa.parse(fileData, {
          header: true,
          complete: function (results: any) {
            const data = results.data;
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
              studentId: row?.studentId ? `${row?.studentId}` : null,
            };
          });
        doUploadStudentList(worksheet);
      }
    }
  };

  const handleUnmapStudent = async (studentId: string) => {
    try {
      const url = `${
        import.meta.env.VITE_REACT_APP_SERVER_URL
      }/students/${studentId}`;
      const result = await axios.patch(url, {
        userId: null,
      });
      fetchStudents();
      messageApi.open({
        type: 'success',
        content: 'Unmap student successfully',
        duration: 1,
      });
    } catch (error) {
      console.log(error);
      messageApi.open({
        type: 'error',
        content: `Something wrong when unmap student`,
        duration: 1,
      });
    }
  };

  const exportOptions: MenuProps['items'] = [
    {
      key: '1',
      label: 'Mapping List',
      children: [
        {
          key: '1.1',
          label: 'CSV',
          icon: <FileTextOutlined />,
          onClick: () => {
            let exportData =
              students.length <= 0 ? templateMappingData : [...students];
            exportData = exportData.map((row: any) => {
              return {
                studentId: row.id,
                studentName: row.name,
                userId: row.userId,
                userName: row.userName,
              };
            });
            downloadCSV(exportData, `MappingList`);
          },
        },
        {
          key: '1.2',
          label: 'XLSX',
          icon: <FileExcelOutlined />,
          onClick: () => {
            let exportData =
              students.length <= 0 ? templateMappingData : [...students];
            exportData = exportData.map((row: any) => {
              return {
                studentId: row.id,
                studentName: row.name,
                userId: row.userId,
                userName: row.userName,
              };
            });
            downloadXLSX(exportData, `MappingList`);
          },
        },
      ],
    },
    {
      key: '2',
      label: 'Student List',
      children: [
        {
          key: '2.1',
          label: 'CSV',
          icon: <FileTextOutlined />,
          onClick: () => {
            let exportData =
              students.length <= 0 ? templateStudentData : [...students];
            exportData = exportData.map((row: any) => {
              return {
                studentId: row.id,
                name: row.name,
              };
            });
            downloadCSV(exportData, `StudentList`);
          },
        },
        {
          key: '2.2',
          label: 'XLSX',
          icon: <FileExcelOutlined />,
          onClick: () => {
            let exportData =
              students.length <= 0 ? templateStudentData : [...students];
            exportData = exportData.map((row: any) => {
              return {
                studentId: row.id,
                name: row.name,
              };
            });
            downloadXLSX(exportData, `StudentList`);
          },
        },
      ],
    },
  ];

  const uploadOptions: MenuProps['items'] = [
    {
      key: '1_uploadMapping',
      label: (
        <label className="cursor-pointer" htmlFor="uploadMapping">
          Mapping List
          <input
            type="file"
            accept=".xlsx, .csv"
            onClick={(e) => {
              const element = e.target as HTMLInputElement;
              element.value = '';
            }}
            onChange={handleUploadMappingList}
            id="uploadMapping"
            className="hidden"
          />
        </label>
      ),
    },
    {
      key: '2_uploadStudent',
      label: (
        <label className="cursor-pointer" htmlFor="uploadStudent">
          Student List
          <input
            type="file"
            accept=".xlsx, .csv"
            onClick={(e) => {
              const element = e.target as HTMLInputElement;
              element.value = '';
            }}
            onChange={handleUploadStudentList}
            id="uploadStudent"
            className="hidden"
          />
        </label>
      ),
    },
  ];

  return (
    <div className="flex flex-col">
      {contextHolder}
      {/* Content */}
      <div className="flex flex-col mx-8 my-8 gap-4">
        <div className="flex justify-between items-center">
          <p className="text-4xl font-semibold mb-4">Students Management</p>
        </div>
        <div className="flex justify-between items-center px-4 mt-4">
          <div className="flex gap-2 justify-start items-center">
            <Dropdown menu={{ items: uploadOptions }}>
              <Button>
                <Space>
                  Upload
                  <UploadOutlined />
                </Space>
              </Button>
            </Dropdown>
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
            title="Student Name"
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
          <Column
            key="userName"
            dataIndex="userName"
            title="Username"
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
            {...getColumnSearchProps('userName')}
          />
          <Column
            title="Mapping Account"
            width={100}
            render={(value: any, record: any, index: number) => {
              return record?.userId ? (
                <Button
                  onClick={() => {
                    handleUnmapStudent(record.id);
                  }}
                >
                  Unmap
                </Button>
              ) : (
                <Button onClick={() => showModal(record.id)}>Map</Button>
              );
            }}
          />
        </Table>
      </div>
      <Modal
        title={
          <h1 className="text-2xl text-indigo-500 pb-4 mb-4 border-b-[1px] border-gray-300 uppercase">
            {`Student Account Mapping:`}
          </h1>
        }
        centered
        open={open}
        onOk={handleOk}
        okText="Confirm"
        okButtonProps={{ className: 'bg-indigo-500' }}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        styles={{
          header: {
            fontSize: 20,
          },
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label={<p className="">{'User ID:'}</p>}
            rules={[
              {
                required: true,
                message: 'Please choose user id to map with',
              },
            ]}
            name={'userId'}
            className="w-full mb-4"
          >
            <Select options={unmappedAccounts} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
