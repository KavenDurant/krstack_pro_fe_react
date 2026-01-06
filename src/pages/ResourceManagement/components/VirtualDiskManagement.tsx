/**
 * ⚠️ 注意：此组件当前使用 MOCK 数据
 *
 * 原因：后端暂未提供全局虚拟磁盘列表的 API 接口
 *
 * 说明：
 * - API 迁移计划中只有 `vmApi.getVMDiskList(vmUid)` 用于获取特定虚拟机的磁盘列表
 * - 没有全局虚拟磁盘列表的 API
 * - 如需实现真实数据，需要：
 *   1. 等待后端提供全局虚拟磁盘列表 API
 *   2. 或者从所有虚拟机中聚合磁盘数据（不推荐，性能问题）
 *
 * 待办：等待后端提供对应的 API 接口后，替换为真实 API 调用
 */
import React, { useState } from "react";
import { Table, Input, Button, Space, Dropdown, Progress, Tag } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  SettingOutlined,
  PlusOutlined,
  DownOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface VirtualDiskType {
  key: string;
  name: string;
  capacity: {
    used: number; // GB
    total: number; // GB
    remaining: number; // GB
    percent: number;
  };
  location: string;
  format: string;
  createTime: string;
  associatedVm?: string;
}

// ⚠️ MOCK 数据 - 等待后端提供 API 接口
const mockData: VirtualDiskType[] = [
  {
    key: "1",
    name: "vm-101-disk-0.raw",
    capacity: {
      used: 45.0,
      total: 100.0,
      remaining: 55.0,
      percent: 45,
    },
    location: "cluster180/data112",
    format: "raw",
    createTime: "2025-08-01 14:44:31",
    associatedVm: "desktop-100",
  },
  {
    key: "2",
    name: "100/vm-100-disk-1.raw",
    capacity: {
      used: 45.0,
      total: 100.0,
      remaining: 55.0,
      percent: 45,
    },
    location: "cluster180/host180/local-lvm",
    format: "raw",
    createTime: "2025-08-01 14:44:31",
    associatedVm: "desktop-101",
  },
  {
    key: "3",
    name: "107/base-107-disk-1.qcow2/104/vm104/vm-...",
    capacity: {
      used: 45.0,
      total: 100.0,
      remaining: 55.0,
      percent: 45,
    },
    location: "cluster180/host180/local",
    format: "qcow2",
    createTime: "2025-08-01 14:44:31",
  },
];

const VirtualDiskManagement: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState("");

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns: ColumnsType<VirtualDiskType> = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "存储容量",
      key: "capacity",
      width: 240,
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
              {record.capacity.used.toFixed(2)}GB/
              {record.capacity.total.toFixed(2)}GB
            </span>
            <span>剩余:{record.capacity.remaining.toFixed(2)}GB</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Progress
              percent={record.capacity.percent}
              showInfo={false}
              strokeColor="#52c41a"
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
      title: "存储位置",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "格式",
      dataIndex: "format",
      key: "format",
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: "关联虚拟机",
      dataIndex: "associatedVm",
      key: "associatedVm",
      render: text => (text ? <Tag>{text}</Tag> : null),
    },
    {
      title: "操作",
      key: "action",
      render: () => (
        <Space size="middle">
          <a style={{ color: "#1890ff" }}>扩容</a>
          <a style={{ color: "#1890ff" }}>迁移</a>
          <Dropdown
            menu={{
              items: [
                { key: "load", label: "挂载" },
                { key: "unload", label: "卸载" },
                { key: "clear", label: "清除缓存" },
                { key: "delete", label: "删除" },
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
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <Button icon={<DeleteOutlined />} disabled>
            删除
          </Button>
          <Button type="primary" icon={<PlusOutlined />}>
            创建
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

export default VirtualDiskManagement;
