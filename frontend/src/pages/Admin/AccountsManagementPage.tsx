import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, InputRef, Space, Table, Tooltip, message } from 'antd';
import Column from 'antd/es/table/Column';
import { ColumnType, FilterConfirmProps } from 'antd/es/table/interface';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

export default function AccountsManagementPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [accounts, setAccounts] = useState([]);
  const fetchClasses = async () => {
    try {
      const accountUrl = `${import.meta.env.VITE_REACT_APP_SERVER_URL}/users`;
      const resAccounts = await axios.get(accountUrl);
      console.log(resAccounts.data);
      if (resAccounts.data) setAccounts(resAccounts.data);
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
    fetchClasses();
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

  return (
    <div className="flex flex-col min-h-screen">
      {contextHolder}
      {/* Content */}
      <div className="flex flex-col mx-8 my-8 gap-4">
        <div className="flex justify-between items-center">
          <p className="text-4xl font-semibold mb-4">Accounts Management</p>
        </div>
        <Table
          dataSource={accounts}
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
            title="Class ID"
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
            key="email"
            dataIndex="email"
            title="Email"
            width={120}
            sortDirections={['ascend', 'descend']}
            sorter={(a: any, b: any) => {
              if (a.code < b.code) {
                return -1;
              }
              if (a.code > b.code) {
                return 1;
              }
              return 0;
            }}
            {...getColumnSearchProps('code')}
          />
          <Column
            key="name"
            dataIndex="name"
            title="Class Name"
            width={200}
            sortDirections={['ascend', 'descend']}
            sorter={(a: any, b: any) => {
              if (a.name < b.name) {
                return -1;
              }
              if (a.name > b.name) {
                return 1;
              }
              return 0;
            }}
            {...getColumnSearchProps('name')}
          />
          <Column
            key="description"
            dataIndex="description"
            title="Description"
            width={240}
            sortDirections={['ascend', 'descend']}
            sorter={(a: any, b: any) => {
              if (a.description < b.description) {
                return -1;
              }
              if (a.description > b.description) {
                return 1;
              }
              return 0;
            }}
            {...getColumnSearchProps('description')}
            render={(value) => (
              <Tooltip title={value}>
                <p className="truncate w-[240px]">{value}</p>
              </Tooltip>
            )}
          />
          <Column
            key="classOwnerId"
            dataIndex="classOwnerId"
            title="Class Owner"
            sortDirections={['ascend', 'descend']}
            sorter={(a: any, b: any) => {
              if (a.classOwnerId < b.nameOwnerId) {
                return -1;
              }
              if (a.classOwnerId > b.classOwnerId) {
                return 1;
              }
              return 0;
            }}
            {...getColumnSearchProps('classOwnerId')}
          />
          <Column
            title="Actions"
            render={(value, record: any, index) => {
              return (
                <Button
                  onClick={() => {
                    console.log(record);
                    try {
                      const url = `${
                        import.meta.env.VITE_REACT_APP_SERVER_URL
                      }/classes/${record.id}`;
                      const res = axios.patch(url, {
                        ...record,
                        isActive: !record?.isActive,
                      });
                      console.log(res);
                      fetchClasses();
                      messageApi.open({
                        type: 'success',
                        content: `Change class state successfully`,
                        duration: 1,
                      });
                    } catch (error) {
                      console.log(error);
                      messageApi.open({
                        type: 'error',
                        content: `Failed to change state of class`,
                        duration: 1,
                      });
                    }
                  }}
                >
                  {record?.isActive ? 'Active' : 'Inactive'}
                </Button>
              );
            }}
          />
        </Table>
      </div>
    </div>
  );
}
