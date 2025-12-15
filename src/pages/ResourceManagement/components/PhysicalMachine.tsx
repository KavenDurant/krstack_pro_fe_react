import React, { useState } from "react";
import { Table, Input, Button, Space, Progress } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  SettingOutlined,
  PoweroffOutlined,
  PlayCircleFilled,
  SyncOutlined,
  LaptopOutlined,
  DatabaseOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { DataNode } from "antd/es/tree";
import ResizableTreePanel from "@/components/ResizableTreePanel";

const treeData: DataNode[] = [
  {
    title: "全部物理机",
    key: "all",
    icon: <AppstoreOutlined />,
    children: [
      {
        title: "cluster237",
        key: "cluster237",
        icon: <DatabaseOutlined />,
        children: [
          { title: "host237", key: "host237", icon: <LaptopOutlined /> },
          { title: "host180", key: "host180-c1", icon: <LaptopOutlined /> },
          { title: "host181", key: "host181-c1", icon: <LaptopOutlined /> },
        ],
      },
      {
        title: "cluster223",
        key: "cluster223",
        icon: <DatabaseOutlined />,
        children: [
          { title: "host180", key: "host180-c2", icon: <LaptopOutlined /> },
          { title: "cluster70", key: "cluster70", icon: <LaptopOutlined /> },
        ],
      },
    ],
  },
];

// --- Mock Data for Table ---
interface PhysicalMachineType {
  key: string;
  name: string;
  status: "running" | "rebooting" | "shutting_down";
  ip: string;
  cpu: number;
  memory: number;
  storage: {
    used: number; // TB
    total: number; // TB
    percent: number;
  };
  vmCount: number;
  uptime: string;
}

const tableData: PhysicalMachineType[] = [
  {
    key: "1",
    name: "host237",
    status: "running",
    ip: "192.168.1.101",
    cpu: 128,
    memory: 512,
    storage: { used: 0.45, total: 1, percent: 55 },
    vmCount: 20,
    uptime: "100时34分42秒",
  },
  {
    key: "2",
    name: "host180",
    status: "rebooting",
    ip: "192.168.1.102",
    cpu: 128,
    memory: 512,
    storage: { used: 0.45, total: 1, percent: 55 },
    vmCount: 10,
    uptime: "34时34分42秒",
  },
  {
    key: "3",
    name: "host181",
    status: "shutting_down",
    ip: "192.168.1.101",
    cpu: 128,
    memory: 512,
    storage: { used: 0.45, total: 1, percent: 55 },
    vmCount: 20,
    uptime: "190时34分42秒",
  },
  {
    key: "4",
    name: "host182",
    status: "running",
    ip: "192.168.1.101",
    cpu: 128,
    memory: 512,
    storage: { used: 0.45, total: 1, percent: 55 },
    vmCount: 20,
    uptime: "130时34分42秒",
  },
];

const PhysicalMachine: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedTreeKey, setSelectedTreeKey] = useState<React.Key>("all");

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns: ColumnsType<PhysicalMachineType> = [
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
        let icon;
        let color = "#333";
        let text;

        switch (status) {
          case "running":
            icon = <PlayCircleFilled />;
            color = "#52c41a";
            text = "运行中";
            break;
          case "rebooting":
            icon = <SyncOutlined spin />;
            color = "#1890ff";
            text = "重启中";
            break;
          case "shutting_down":
            icon = <PoweroffOutlined />;
            color = "#1890ff";
            text = "关机中";
            break;
          default:
            icon = <PoweroffOutlined />;
            text = "未知";
        }

        return (
          <Space style={{ color: color }}>
            {icon}
            <span>{text}</span>
          </Space>
        );
      },
    },
    { title: "IP", dataIndex: "ip", key: "ip" },
    { title: "CPU (核)", dataIndex: "cpu", key: "cpu" },
    { title: "内存 (GB)", dataIndex: "memory", key: "memory" },
    {
      title: "本机存储",
      dataIndex: "storage",
      key: "storage",
      width: 200,
      render: storage => (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
            }}
          >
            <span>
              {storage.used}TB/{storage.total}TB
            </span>
            <span>剩余:{(storage.total - storage.used).toFixed(2)}TB</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Progress
              percent={storage.percent}
              showInfo={false}
              strokeColor="#52c41a"
              size="small"
              style={{ flex: 1 }}
            />
            <span style={{ fontSize: 12 }}>{storage.percent}%</span>
          </div>
        </div>
      ),
    },
    { title: "关联虚拟机数量", dataIndex: "vmCount", key: "vmCount" },
    { title: "运行时长", dataIndex: "uptime", key: "uptime" },
    {
      title: "操作",
      key: "action",
      render: () => (
        <Space size="middle">
          <a style={{ color: "#1890ff" }}>关机</a>
          <a style={{ color: "#1890ff" }}>重启</a>
        </Space>
      ),
    },
  ];

  return (
    <ResizableTreePanel
      treeData={treeData}
      selectedKey={selectedTreeKey}
      onSelect={keys => setSelectedTreeKey(keys[0])}
    >
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 16,
        }}
      >
        <div
          style={{
            padding: "0 0 16px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Input
            placeholder="名称/IP"
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            style={{ width: 300 }}
          />
          <Space>
            <Button icon={<ReloadOutlined />}>重启</Button>
            <Button icon={<PoweroffOutlined />}>关机</Button>
            <Button icon={<ReloadOutlined />} />
            <Button icon={<SettingOutlined />} />
          </Space>
        </div>

        <div
          style={{
            fontSize: 12,
            color: "#666",
            margin: "0 0 8px 0",
            lineHeight: 1.4,
          }}
        >
          共计 {tableData.length} 条数据 已选 {selectedRowKeys.length} 条
        </div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={tableData}
          pagination={false}
          scroll={{ y: "calc(100vh - 300px)" }}
        />
      </div>
    </ResizableTreePanel>
  );
};

export default PhysicalMachine;
