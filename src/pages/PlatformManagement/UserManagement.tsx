import React, { useState, useCallback, useMemo } from "react";
import { Input, Table, Button, Space, Tag } from "antd";
import {
  SearchOutlined,
  SyncOutlined,
  DownloadOutlined,
  UserAddOutlined,
  PlusOutlined,
  SettingOutlined,
  CarryOutOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { TreeDataNode } from "antd";
import PageBreadcrumb from "../../components/PageBreadcrumb";
import ResizableTreePanel from "../../components/ResizableTreePanel";
import LayoutBox from "../../components/LayoutBox";

interface UserDataType {
  key: string;
  username: string;
  name: string;
  role: string;
  group: string;
  groupId: string;
}

const mockData: UserDataType[] = [
  {
    key: "1",
    username: "admin",
    name: "admin",
    role: "超级管理员",
    group: "云管理平台",
    groupId: "0",
  },
  {
    key: "2",
    username: "duobao",
    name: "多宝",
    role: "资源组管理员",
    group: "用户组1",
    groupId: "1",
  },
  {
    key: "3",
    username: "user1",
    name: "用户1",
    role: "云桌面用户",
    group: "用户组1",
    groupId: "1",
  },
  {
    key: "4",
    username: "user2",
    name: "用户2",
    role: "云桌面用户",
    group: "用户组1",
    groupId: "1",
  },
  {
    key: "5",
    username: "user3",
    name: "用户3",
    role: "云桌面用户",
    group: "用户组1",
    groupId: "1",
  },
  {
    key: "6",
    username: "user4",
    name: "用户4",
    role: "云桌面用户",
    group: "用户组1",
    groupId: "1",
  },
  {
    key: "7",
    username: "user5",
    name: "用户5",
    role: "云桌面用户",
    group: "用户组1",
    groupId: "1",
  },
  {
    key: "8",
    username: "fah",
    name: "范范",
    role: "超级管理员",
    group: "云管理平台",
    groupId: "0",
  },
];

const UserManagement: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedTreeKey, setSelectedTreeKey] = useState<string>("all");

  const handleTreeSelect = useCallback((selectedKeys: React.Key[]) => {
    const key = selectedKeys[0] as string;
    setSelectedTreeKey(key);
  }, []);

  const filteredData = useMemo(() => {
    if (selectedTreeKey.startsWith("group-")) {
      const groupId = selectedTreeKey.replace("group-", "");
      return mockData.filter(user => user.groupId === groupId);
    }
    return mockData;
  }, [selectedTreeKey]);

  const treeData: TreeDataNode[] = useMemo(
    () => [
      {
        title: "全部用户",
        key: "all",
        icon: <CarryOutOutlined />,
        children: [
          {
            title: "用户组1",
            key: "group-1",
            icon: <CarryOutOutlined />,
          },
          {
            title: "用户组2",
            key: "group-2",
            icon: <CarryOutOutlined />,
          },
        ],
      },
    ],
    []
  );

  const columns: ColumnsType<UserDataType> = [
    { title: "用户名", dataIndex: "username", key: "username" },
    { title: "姓名", dataIndex: "name", key: "name" },
    {
      title: "角色",
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        const colorMap: Record<string, string> = {
          超级管理员: "gold",
          资源组管理员: "purple",
          云桌面用户: "blue",
        };
        return <Tag color={colorMap[role]}>{role}</Tag>;
      },
    },
    { title: "用户组", dataIndex: "group", key: "group" },
    {
      title: "操作",
      key: "action",
      render: () => (
        <Space>
          <Button type="link" size="small">
            编辑
          </Button>
          <Button type="link" size="small">
            重置密码
          </Button>
          <Button type="link" size="small" danger>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <ResizableTreePanel
      treeData={treeData}
      selectedKey={selectedTreeKey}
      onSelect={handleTreeSelect}
      defaultExpandedKeys={["all"]}
      showIcon={true}
      showLine={true}
      treeWidth={250}
      treeMinWidth={250}
      treeMaxWidth={250}
      treeToolbar={
        <Button type="default" icon={<PlusOutlined />}>
          添加用户组
        </Button>
      }
    >
      <LayoutBox>
        <PageBreadcrumb />
        <LayoutBox padding={12}>
          <div style={{ marginBottom: 12 }}>
            <Input
              placeholder="名称"
              prefix={<SearchOutlined />}
              style={{ width: 240 }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <div style={{ fontSize: 14, color: "#666" }}>
              共计 N 条数据 已选 {selectedRowKeys.length} 条
            </div>
            <Space>
              <Button icon={<SyncOutlined />}>同步头像</Button>
              <Button icon={<DownloadOutlined />}>导出用户</Button>
              <Button icon={<UserAddOutlined />}>导入用户</Button>
              <Button type="primary" icon={<PlusOutlined />}>
                添加用户
              </Button>
              <Button icon={<SyncOutlined />} />
              <Button icon={<SettingOutlined />} />
            </Space>
          </div>
          <Table
            rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
            columns={columns}
            dataSource={filteredData}
            pagination={{
              total: filteredData.length,
              showTotal: total => `共计 ${total} 条数据`,
              defaultPageSize: 10,
              showSizeChanger: true,
            }}
          />
        </LayoutBox>
      </LayoutBox>
    </ResizableTreePanel>
  );
};

export default UserManagement;
