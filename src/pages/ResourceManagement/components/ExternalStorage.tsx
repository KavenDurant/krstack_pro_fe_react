import React, { useState } from "react";
import { Input, Button, Space, Progress, Tag } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  SettingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import TableToolbar from "../../../components/__design-system__/TableToolbar";
import StandardTable from "../../../components/__design-system__/StandardTable";

interface ExternalStorageType {
  key: string;
  name: string;
  status: "available" | "unavailable";
  capacity: {
    used: number; // GB
    total: number; // GB
    remaining: number; // GB
    percent: number;
  };
  path: string;
  clusters: string[];
}

const mockData: ExternalStorageType[] = [
  {
    key: "1",
    name: "data112",
    status: "available",
    capacity: {
      used: 45.08,
      total: 100.0,
      remaining: 54.92,
      percent: 45,
    },
    path: "\\\\192.168.1.112\\data",
    clusters: ["cluster180", "cluster237"],
  },
  {
    key: "2",
    name: "data113",
    status: "unavailable",
    capacity: {
      used: 0.0,
      total: 0.0,
      remaining: 0.0,
      percent: 0,
    },
    path: "\\\\192.168.1.112\\data",
    clusters: [],
  },
];

const ExternalStorage: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState("");

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns: ColumnsType<ExternalStorageType> = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      render: text => <a style={{ color: "#1890ff" }}>{text}</a>,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: status => {
        const color = status === "available" ? "success" : "error";
        const text = status === "available" ? "可用" : "不可用";
        // Using custom styling for light background tags similar to image if needed,
        // but Antd 'success'/'error' tags are standard.
        // Image shows light green bg for 'available' and light red for 'unavailable'.
        return (
          <Tag color={color === "success" ? "green" : "volcano"}>{text}</Tag>
        );
      },
    },
    {
      title: "存储容量",
      key: "capacity",
      width: 300,
      render: (_, record) => (
        <div style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              color: "#666",
              marginBottom: 4,
            }}
          >
            <span>
              {record.capacity.used.toFixed(2)} GB/
              {record.capacity.total.toFixed(2)} GB
            </span>
            <span>剩余: {record.capacity.remaining.toFixed(2)} GB</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Progress
              percent={record.capacity.percent}
              showInfo={false}
              strokeColor="#52c41a"
              trailColor="#f0f0f0"
              size="small"
              style={{ flex: 1 }}
            />
            <span style={{ fontSize: 12, minWidth: 24, textAlign: "right" }}>
              {record.capacity.percent}%
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "访问路径",
      dataIndex: "path",
      key: "path",
    },
    {
      title: "关联集群",
      dataIndex: "clusters",
      key: "clusters",
      render: (clusters: string[]) => (
        <Space size={[0, 8]} wrap>
          {clusters.length > 0 ? (
            clusters.map(cluster => (
              <Tag key={cluster} color="blue">
                {cluster}
              </Tag>
            ))
          ) : (
            <span>—</span>
          )}
        </Space>
      ),
    },
    {
      title: "操作",
      key: "action",
      render: () => (
        <Space size="middle">
          <a style={{ color: "#1890ff" }}>关联集群</a>
          <a style={{ color: "#ff4d4f" }}>删除</a>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "12px",
        overflow: "auto",
      }}
    >
      <TableToolbar
        left={
          <Input
            placeholder="名称/访问路径"
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            style={{ width: 300 }}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        }
        right={
          <Space>
            <Button type="primary" icon={<PlusOutlined />}>
              添加
            </Button>
            <Button icon={<ReloadOutlined />} />
            <Button icon={<SettingOutlined />} />
          </Space>
        }
        padding={0}
      />
      <div style={{ marginTop: 4 }}>
        <StandardTable<ExternalStorageType>
          rowSelection={rowSelection}
          columns={columns}
          dataSource={mockData}
          selectedCount={selectedRowKeys.length}
          pagination={{
            total: mockData.length,
            defaultPageSize: 10,
          }}
          containerStyle={{
            paddingLeft: 0,
          }}
        />
      </div>
    </div>
  );
};

export default ExternalStorage;
