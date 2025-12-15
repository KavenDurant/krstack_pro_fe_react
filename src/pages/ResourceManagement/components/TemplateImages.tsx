import React, { useState } from "react";
import { Table, Input, Button, Space, Dropdown } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  SettingOutlined,
  PlusOutlined,
  DownOutlined,
  DeleteOutlined,
  WindowsOutlined,
  CodeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface ImageType {
  key: string;
  name: string;
  os: string;
  format: string;
  size: string;
  location: string;
  uploadTime: string;
}

const mockData: ImageType[] = [
  {
    key: "1",
    name: "template-centos-7",
    os: "centos",
    format: "QCOW2",
    size: "20 GB",
    location: "data112",
    uploadTime: "2025-08-10 10:00:00",
  },
  {
    key: "2",
    name: "template-win10",
    os: "Windows",
    format: "QCOW2",
    size: "40 GB",
    location: "data113",
    uploadTime: "2025-08-11 11:30:00",
  },
];

const TemplateImages: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const getOsIcon = (os: string) => {
    const lowerOs = os.toLowerCase();
    if (lowerOs.includes("windows"))
      return <WindowsOutlined style={{ color: "#0078d4" }} />;
    return <CodeOutlined style={{ color: "#f34b7d" }} />;
  };

  const columns: ColumnsType<ImageType> = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      render: text => <span style={{ color: "#333" }}>{text}</span>,
    },
    {
      title: "操作系统",
      dataIndex: "os",
      key: "os",
      render: text => (
        <Space>
          {getOsIcon(text)}
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "格式",
      dataIndex: "format",
      key: "format",
    },
    {
      title: "大小",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "存放位置",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "上传时间",
      dataIndex: "uploadTime",
      key: "uploadTime",
    },
    {
      title: "操作",
      key: "action",
      render: () => (
        <Space size="middle">
          <a style={{ color: "#1890ff" }}>编辑</a>
          <a style={{ color: "#1890ff" }}>删除</a>
          <Dropdown
            menu={{
              items: [
                { key: "download", label: "下载" },
                { key: "sync", label: "同步" },
              ],
            }}
          >
            <a style={{ color: "#1890ff" }} onClick={e => e.preventDefault()}>
              更多 <DownOutlined style={{ fontSize: 10 }} />
            </a>
          </Dropdown>
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
        padding: 16,
        background: "#fff",
      }}
    >
      <div
        style={{
          paddingBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Input
          placeholder="名称"
          prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
          style={{ width: 300 }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <Button icon={<DeleteOutlined />} disabled>
            删除
          </Button>
          <Button type="primary" icon={<PlusOutlined />}>
            上传
          </Button>
          <Button icon={<ReloadOutlined />} />
          <Button icon={<SettingOutlined />} />
        </div>
      </div>

      <div
        style={{
          fontSize: 12,
          color: "#666",
          margin: "0 0 8px 0",
          lineHeight: 1.4,
        }}
      >
        共计 {mockData.length} 条数据 已选 {selectedRowKeys.length} 条
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={mockData}
        pagination={{
          total: mockData.length,
          showTotal: total => `共 ${total} 条`,
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
      />
    </div>
  );
};

export default TemplateImages;
