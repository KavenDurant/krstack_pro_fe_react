import React, { useMemo } from "react";
import { Button, Input, Space, Table, Tag } from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  SettingOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import VirtualDiskUsage from "./VirtualDiskUsage";
import type { VirtualDiskItem } from "./VirtualDiskTypes";

interface VirtualDiskTableProps {
  data: VirtualDiskItem[];
  onCreate?: () => void;
  onRefresh?: () => void;
  onSettings?: () => void;
}

const VirtualDiskTable: React.FC<VirtualDiskTableProps> = ({
  data,
  onCreate,
  onRefresh,
  onSettings,
}) => {
  const columns: ColumnsType<VirtualDiskItem> = useMemo(
    () => [
      {
        title: "名称",
        dataIndex: "name",
        key: "name",
        width: 220,
        fixed: "left",
      },
      {
        title: "存储容量",
        dataIndex: "usedGB",
        key: "usage",
        width: 320,
        render: (_value, record) => (
          <VirtualDiskUsage usedGB={record.usedGB} totalGB={record.totalGB} />
        ),
      },
      {
        title: "存储位置",
        dataIndex: "location",
        key: "location",
        width: 200,
        render: value => <span title={value}>{value}</span>,
      },
      {
        title: "类型",
        dataIndex: "category",
        key: "category",
        width: 120,
        render: value => <Tag>{value}</Tag>,
      },
      {
        title: "操作",
        key: "action",
        width: 180,
        fixed: "right",
        render: () => (
          <Space size="middle">
            <Button type="link" style={{ padding: 0 }}>
              扩容
            </Button>
            <Button type="link" style={{ padding: 0 }}>
              迁移
            </Button>
            <Button type="link" style={{ padding: 0 }}>
              删除
            </Button>
          </Space>
        ),
      },
    ],
    []
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 0,
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          paddingBottom: 16,
        }}
      >
        <Input
          placeholder="名称"
          prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
          style={{ width: 300 }}
        />
        <Space size={8}>
          <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
            创建虚拟磁盘
          </Button>
          <Button icon={<ReloadOutlined />} onClick={onRefresh} />
          <Button icon={<SettingOutlined />} onClick={onSettings} />
        </Space>
      </div>

      <div style={{ color: "#666", marginBottom: 8 }}>
        共计 {data.length} 条数据
      </div>

      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="key"
        size="middle"
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

export default VirtualDiskTable;
