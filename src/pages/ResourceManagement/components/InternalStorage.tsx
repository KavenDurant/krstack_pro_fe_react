import React, { useState } from "react";
import { Input, Button, Space, Tag } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import TableToolbar from "../../../components/__design-system__/TableToolbar";
import StandardTable from "../../../components/__design-system__/StandardTable";

interface InternalStorageType {
  key: string;
  name: string;
  status: "available" | "in_use";
  size: string;
  host: string;
  type: string;
}

const mockData: InternalStorageType[] = [
  {
    key: "1",
    name: "local-disk-1",
    status: "in_use",
    size: "500 GB",
    host: "host180",
    type: "SSD",
  },
  {
    key: "2",
    name: "local-disk-2",
    status: "available",
    size: "1 TB",
    host: "host237",
    type: "HDD",
  },
];

const InternalStorage: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns: ColumnsType<InternalStorageType> = [
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
      render: status => (
        <Tag color={status === "available" ? "green" : "blue"}>
          {status === "available" ? "可用" : "使用中"}
        </Tag>
      ),
    },
    {
      title: "容量",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "所属主机",
      dataIndex: "host",
      key: "host",
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "操作",
      key: "action",
      render: () => (
        <Space size="middle">
          <a style={{ color: "#1890ff" }}>查看详情</a>
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
            placeholder="名称"
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            style={{ width: 300 }}
          />
        }
        right={
          <Space>
            <Button icon={<ReloadOutlined />} />
            <Button icon={<SettingOutlined />} />
          </Space>
        }
        padding={0}
      />
      <div style={{ marginTop: 4 }}>
        <StandardTable<InternalStorageType>
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

export default InternalStorage;
