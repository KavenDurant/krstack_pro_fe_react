/*
 * @Author: KavenDurant luojiaxin888@gmail.com
 * @Date: 2025-12-19 14:30:00
 * @LastEditors: KavenDurant luojiaxin888@gmail.com
 * @LastEditTime: 2025-12-19 14:30:00
 * @FilePath: /krstack_pro_fe_react/src/pages/ResourceManagement/components/GPUManagement.tsx
 * @Description: GPU管理页面 - 使用Mock数据
 */
import React, { useState } from "react";
import { Table, Tag, Card, Space } from "antd";
import type { ColumnsType } from "antd/es/table";

interface GPUDevice {
  key: string;
  name: string;
  cluster: string;
  node: string;
  model: string;
  vendor: string;
  status: "online" | "offline" | "error";
  memory: number;
  utilization: number;
}

const mockGPUData: GPUDevice[] = [
  {
    key: "1",
    name: "GPU-0",
    cluster: "cluster237",
    node: "host237",
    model: "NVIDIA Tesla T4",
    vendor: "NVIDIA",
    status: "online",
    memory: 16384,
    utilization: 45,
  },
  {
    key: "2",
    name: "GPU-1",
    cluster: "cluster237",
    node: "host237",
    model: "NVIDIA Tesla T4",
    vendor: "NVIDIA",
    status: "online",
    memory: 16384,
    utilization: 62,
  },
  {
    key: "3",
    name: "GPU-0",
    cluster: "cluster238",
    node: "host238",
    model: "NVIDIA A100",
    vendor: "NVIDIA",
    status: "offline",
    memory: 40960,
    utilization: 0,
  },
];

const GPUManagement: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const columns: ColumnsType<GPUDevice> = [
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
      title: "型号",
      dataIndex: "model",
      key: "model",
      width: 200,
    },
    {
      title: "厂商",
      dataIndex: "vendor",
      key: "vendor",
      width: 120,
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
      title: "显存",
      dataIndex: "memory",
      key: "memory",
      width: 120,
      render: (memory: number) => `${memory} MB`,
    },
    {
      title: "利用率",
      dataIndex: "utilization",
      key: "utilization",
      width: 100,
      render: (utilization: number) => `${utilization}%`,
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
        共计 {mockGPUData.length} 条数据 已选 {selectedRowKeys.length} 条
      </div>

      {/* 数据表格 */}
      <Table
        columns={columns}
        dataSource={mockGPUData}
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

export default GPUManagement;
