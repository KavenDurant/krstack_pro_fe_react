import React from "react";
import { Table, Tag, Button, Space } from "antd";
import {
  CheckCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

export interface ClusterDataType {
  key: string;
  name: string;
  status: "running" | "syncing" | "stopped";
  controlAddress: string;
  platform: string;
  technology: string;
  hostCount: number;
  lastSyncTime: string;
}

interface ClusterTableProps {
  dataSource: ClusterDataType[];
  selectedRowKeys: React.Key[];
  onSelectChange: (selectedRowKeys: React.Key[]) => void;
  onRowClick?: (record: ClusterDataType) => void;
}

const ClusterTable: React.FC<ClusterTableProps> = ({
  dataSource,
  selectedRowKeys,
  onSelectChange,
  onRowClick,
}) => {
  const statusConfig = {
    running: {
      icon: <CheckCircleOutlined />,
      text: "运行中",
      color: "success",
    },
    syncing: {
      icon: <SyncOutlined spin />,
      text: "同步中",
      color: "processing",
    },
    stopped: {
      icon: <ClockCircleOutlined />,
      text: "已停止",
      color: "default",
    },
  };

  const columns: ColumnsType<ClusterDataType> = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      sorter: true,
      render: (text: string, record: ClusterDataType) => (
        <a
          style={{ color: "#1890ff" }}
          onClick={() => onRowClick?.(record)}
        >
          {text}
        </a>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      sorter: true,
      render: (status: ClusterDataType["status"]) => {
        const config = statusConfig[status];
        return (
          <Tag icon={config.icon} color={config.color}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: "控制台地址",
      dataIndex: "controlAddress",
      key: "controlAddress",
      sorter: true,
    },
    {
      title: "虚拟化平台",
      dataIndex: "platform",
      key: "platform",
    },
    {
      title: "虚拟化技术",
      dataIndex: "technology",
      key: "technology",
    },
    {
      title: "物理机数量",
      dataIndex: "hostCount",
      key: "hostCount",
      sorter: true,
    },
    {
      title: "最近同步时间",
      dataIndex: "lastSyncTime",
      key: "lastSyncTime",
      sorter: true,
    },
    {
      title: "操作",
      key: "action",
      render: () => (
        <Space size="small">
          <Button type="link" size="small">
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table<ClusterDataType>
      rowSelection={{
        selectedRowKeys,
        onChange: onSelectChange,
      }}
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      size="small"
    />
  );
};

export default ClusterTable;
