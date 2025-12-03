// Table component for Cloud Desktop
import React from "react";
import { Table, Tag, Space, Button, Dropdown, Badge } from "antd";
import type { ColumnsType, BadgeProps } from "antd/es/table";
import type { MenuProps } from "antd";
import {
  DesktopOutlined,
  WindowsOutlined,
  DownOutlined,
} from "@ant-design/icons";

interface DesktopDataType {
  key: string;
  name: string;
  status: "running" | "stopped" | "starting";
  user: string;
  userGroup: string;
  os: string;
  ip: string;
  cpu: string;
  memory: string;
}

const statusMap = {
  running: { status: "success", text: "运行中" },
  stopped: { status: "default", text: "已关机" },
  starting: { status: "processing", text: "启动中" },
};

const columns: ColumnsType<DesktopDataType> = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
    render: text => <a>{text}</a>,
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    render: (status: keyof typeof statusMap) => {
      const { status: badgeStatus, text } =
        statusMap[status] || statusMap.stopped;
      return <Badge status={badgeStatus as BadgeProps["status"]} text={text} />;
    },
  },
  {
    title: "控制台",
    dataIndex: "console",
    key: "console",
    render: () => (
      <DesktopOutlined style={{ color: "#1890ff", fontSize: "16px" }} />
    ),
  },
  {
    title: "用户",
    dataIndex: "user",
    key: "user",
  },
  {
    title: "用户组",
    dataIndex: "userGroup",
    key: "userGroup",
    render: text => <Tag color="blue">{text}</Tag>,
  },
  {
    title: "操作系统",
    dataIndex: "os",
    key: "os",
    render: os => (
      <Space>
        <WindowsOutlined style={{ color: "#1890ff" }} />
        {os}
      </Space>
    ),
  },
  {
    title: "IP地址",
    dataIndex: "ip",
    key: "ip",
  },
  {
    title: "CPU",
    dataIndex: "cpu",
    key: "cpu",
  },
  {
    title: "内存",
    dataIndex: "memory",
    key: "memory",
  },
  {
    title: "操作",
    key: "action",
    render: () => {
      const items: MenuProps["items"] = [
        { key: "1", label: "重启" },
        { key: "2", label: "编辑" },
        { key: "3", label: "分配用户" },
        { key: "4", label: "删除", danger: true },
      ];

      return (
        <Space size="small">
          <Button type="link" size="small">
            连接
          </Button>
          <Button type="link" size="small" danger>
            关机
          </Button>
          <Dropdown menu={{ items }}>
            <Button type="link" size="small">
              更多 <DownOutlined />
            </Button>
          </Dropdown>
        </Space>
      );
    },
  },
];

const data: DesktopDataType[] = [
  {
    key: "1",
    name: "Desktop-Dev-001",
    status: "running",
    user: "张三",
    userGroup: "开发组",
    os: "Windows 10",
    ip: "192.168.1.101",
    cpu: "4核",
    memory: "8GB",
  },
  {
    key: "2",
    name: "Desktop-Test-002",
    status: "stopped",
    user: "李四",
    userGroup: "测试组",
    os: "Windows 10",
    ip: "192.168.1.102",
    cpu: "2核",
    memory: "4GB",
  },
  {
    key: "3",
    name: "Desktop-Dev-003",
    status: "running",
    user: "王五",
    userGroup: "开发组",
    os: "Windows 11",
    ip: "192.168.1.103",
    cpu: "8核",
    memory: "16GB",
  },
];

const DesktopTable: React.FC = () => {
  return (
    <div style={{ background: "#fff", padding: "16px" }}>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          total: 50,
          showTotal: total => `共计 ${total} 条数据`,
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
      />
    </div>
  );
};

export default DesktopTable;
