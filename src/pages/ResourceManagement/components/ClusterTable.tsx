import React from "react";
import { Table, Tag, Button, Space, Modal } from "antd";
import {
  CheckCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Cluster, ClusterStatus } from "@/api";

interface ClusterTableProps {
  dataSource: Cluster[];
  selectedRowKeys: React.Key[];
  onSelectChange: (selectedRowKeys: React.Key[]) => void;
  onRowClick?: (record: Cluster) => void;
  onDelete?: (id: string) => void;
  loading?: boolean;
}

const ClusterTable: React.FC<ClusterTableProps> = ({
  dataSource,
  selectedRowKeys,
  onSelectChange,
  onRowClick,
  onDelete,
  loading = false,
}) => {
  const statusConfig: Record<
    ClusterStatus,
    { icon: React.ReactNode; text: string; color: string }
  > = {
    online: {
      icon: <CheckCircleOutlined />,
      text: "在线",
      color: "success",
    },
    offline: {
      icon: <ClockCircleOutlined />,
      text: "离线",
      color: "default",
    },
    syncing: {
      icon: <SyncOutlined spin />,
      text: "同步中",
      color: "processing",
    },
    error: {
      icon: <ExclamationCircleOutlined />,
      text: "错误",
      color: "error",
    },
  };

  const handleDelete = (record: Cluster) => {
    Modal.confirm({
      title: "确认删除",
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除集群 "${record.name}" 吗？`,
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        onDelete?.(record.id);
      },
    });
  };

  const columns: ColumnsType<Cluster> = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text: string, record: Cluster) => (
        <a style={{ color: "#1890ff" }} onClick={() => onRowClick?.(record)}>
          {text}
        </a>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status: ClusterStatus) => {
        const config = statusConfig[status];
        return (
          <Tag icon={config.icon} color={config.color}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: "IP 地址",
      dataIndex: "ip",
      key: "ip",
      sorter: (a, b) => a.ip.localeCompare(b.ip),
    },
    {
      title: "平台类型",
      dataIndex: "platformType",
      key: "platformType",
      sorter: (a, b) => a.platformType.localeCompare(b.platformType),
    },
    {
      title: "虚拟化类型",
      dataIndex: "vtType",
      key: "vtType",
      sorter: (a, b) => a.vtType.localeCompare(b.vtType),
    },
    {
      title: "节点数量",
      dataIndex: "nodesNum",
      key: "nodesNum",
      sorter: (a, b) => a.nodesNum - b.nodesNum,
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
      render: (text: string) => new Date(text).toLocaleString("zh-CN"),
    },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, record: Cluster) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            danger
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table<Cluster>
      rowSelection={{
        selectedRowKeys,
        onChange: onSelectChange,
      }}
      columns={columns}
      dataSource={dataSource}
      rowKey="id"
      pagination={false}
      size="small"
      loading={loading}
    />
  );
};

export default ClusterTable;
