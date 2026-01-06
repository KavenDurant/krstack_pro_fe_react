/*
 * @Author: KavenDurant luojiaxin888@gmail.com
 * @Date: 2025-12-19 14:35:00
 * @LastEditors: KavenDurant luojiaxin888@gmail.com
 * @LastEditTime: 2025-12-19 14:35:00
 * @FilePath: /krstack_pro_fe_react/src/pages/ResourceManagement/components/USBManagement.tsx
 * @Description: USB管理页面 - 使用Mock数据
 */
import React, { useState } from "react";
import { Table, Tag, Card, Space } from "antd";
import type { ColumnsType } from "antd/es/table";

interface USBDevice {
  key: string;
  name: string;
  cluster: string;
  node: string;
  vendor: string;
  productId: string;
  status: "online" | "offline" | "error";
  vmAttached?: string;
}

const mockUSBData: USBDevice[] = [
  {
    key: "1",
    name: "USB Camera",
    cluster: "cluster237",
    node: "host237",
    vendor: "Logitech",
    productId: "085d:0110",
    status: "online",
    vmAttached: "vm-101",
  },
  {
    key: "2",
    name: "USB Storage",
    cluster: "cluster237",
    node: "host237",
    vendor: "SanDisk",
    productId: "0781:5567",
    status: "online",
  },
  {
    key: "3",
    name: "USB Dongle",
    cluster: "cluster237",
    node: "host238",
    vendor: "Broadcom",
    productId: "0a5c:21e8",
    status: "offline",
  },
  {
    key: "4",
    name: "USB Serial",
    cluster: "cluster238",
    node: "host238",
    vendor: "FTDI",
    productId: "0403:6001",
    status: "error",
  },
];

const USBManagement: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const columns: ColumnsType<USBDevice> = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "所属集群",
      dataIndex: "cluster",
      key: "cluster",
      width: 150,
    },
    {
      title: "所属节点",
      dataIndex: "node",
      key: "node",
      width: 150,
    },
    {
      title: "厂商",
      dataIndex: "vendor",
      key: "vendor",
      width: 150,
    },
    {
      title: "产品ID",
      dataIndex: "productId",
      key: "productId",
      width: 150,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => {
        const statusConfig: Record<string, { text: string; color: string }> = {
          online: { text: "在线", color: "success" },
          offline: { text: "离线", color: "default" },
          error: { text: "故障", color: "error" },
        };
        const config = statusConfig[status] || statusConfig.offline;
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "关联VM",
      dataIndex: "vmAttached",
      key: "vmAttached",
      width: 120,
      render: (vm: string | undefined) =>
        vm ? <Tag color="blue">{vm}</Tag> : <Tag color="default">-</Tag>,
    },
  ];

  return (
    <div
      style={{
        padding: 12,
        flex: 1,
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Mock 数据提示 */}
      <Card
        style={{
          marginBottom: 12,
          background: "#fff7e6",
          borderColor: "#ffa940",
          borderLeft: "4px solid #ffa940",
        }}
        bodyStyle={{ padding: "12px 16px" }}
      >
        <Space>
          <Tag color="warning" style={{ margin: 0, fontSize: 14 }}>
            MOCK 数据
          </Tag>
          <span style={{ color: "#d46b08", fontSize: 13 }}>
            本页面暂时使用 Mock 数据，非真实后端数据
          </span>
        </Space>
      </Card>

      {/* 数据统计 */}
      <div
        style={{
          fontSize: 12,
          color: "#666",
          margin: "0 0 8px 0",
          lineHeight: 1.4,
        }}
      >
        共计 {mockUSBData.length} 条数据 已选 {selectedRowKeys.length} 条
      </div>

      {/* 数据表格 */}
      <Table
        columns={columns}
        dataSource={mockUSBData}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: total => `共 ${total} 条`,
        }}
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

export default USBManagement;
