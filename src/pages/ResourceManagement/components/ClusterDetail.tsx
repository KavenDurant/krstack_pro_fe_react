import React from "react";
import {
  Button,
  Tabs,
  Progress,
  Descriptions,
  Card,
  Table,
  Input,
  Space,
} from "antd";
import {
  ArrowLeftOutlined,
  SearchOutlined,
  PlayCircleFilled,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { ClusterDataType } from "./ClusterTable";

interface ClusterDetailProps {
  cluster: ClusterDataType;
  onBack: () => void;
}

interface PhysicalMachineType {
  key: string;
  name: string;
  status: string;
  platform: string;
  ip: string;
  cpu: number;
  memory: number;
  ipmi: string;
  storage: {
    used: number; // TB
    total: number; // TB
    percent: number;
  };
}

const physicalMachines: PhysicalMachineType[] = [
  {
    key: "1",
    name: "host180",
    status: "运行中",
    platform: "KRCloud",
    ip: "192.168.1.102",
    cpu: 128,
    memory: 512,
    ipmi: "https://192.168.1.80:3000",
    storage: {
      used: 0.45,
      total: 1,
      percent: 55,
    },
  },
  {
    key: "2",
    name: "host181",
    status: "运行中",
    platform: "KRCloud",
    ip: "192.168.1.102",
    cpu: 128,
    memory: 512,
    ipmi: "https://192.168.1.181:3000",
    storage: {
      used: 0.45,
      total: 1,
      percent: 55,
    },
  },
];

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
    render: text => (
      <Space>
        <PlayCircleFilled style={{ color: "#52c41a" }} />
        <span>{text}</span>
      </Space>
    ),
  },
  {
    title: "虚拟化平台",
    dataIndex: "platform",
    key: "platform",
  },
  {
    title: "IP",
    dataIndex: "ip",
    key: "ip",
  },
  {
    title: "CPU (核)",
    dataIndex: "cpu",
    key: "cpu",
  },
  {
    title: "内存 (GB)",
    dataIndex: "memory",
    key: "memory",
  },
  {
    title: "ipmi地址",
    dataIndex: "ipmi",
    key: "ipmi",
    render: text => (
      <a
        style={{ color: "#1890ff" }}
        href={text}
        target="_blank"
        rel="noreferrer"
      >
        {text}
      </a>
    ),
  },
  {
    title: "本机存储",
    dataIndex: "storage",
    key: "storage",
    width: 300,
    render: storage => (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            marginBottom: 4,
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
];

const ClusterDetail: React.FC<ClusterDetailProps> = ({ cluster, onBack }) => {
  const items = [
    {
      key: "basic",
      label: "基本信息",
      children: (
        <div style={{ display: "flex", gap: 10 }}>
          <Card
            variant="outlined"
            style={{ width: "30%" }}
            className="cluster-detail-card"
          >
            <Descriptions
              title="基本信息"
              column={1}
              size="small"
              styles={{
                label: { width: 120, color: "#666" },
                content: { color: "#333" },
              }}
            >
              <Descriptions.Item label="虚拟化技术">
                {cluster.technology}
              </Descriptions.Item>
              <Descriptions.Item label="虚拟化平台">
                {cluster.platform}
              </Descriptions.Item>
              <Descriptions.Item label="物理机数量">
                <a style={{ color: "#1890ff" }}>{cluster.hostCount}</a>
              </Descriptions.Item>
              <Descriptions.Item label="虚拟机数量">
                <a style={{ color: "#1890ff" }}>200</a>
              </Descriptions.Item>
              <Descriptions.Item label="添加时间">
                2015-09-03 17:54:41
              </Descriptions.Item>
              <Descriptions.Item label="最近同步时间">
                {cluster.lastSyncTime}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card
            variant="outlined"
            style={{ flex: 1 }}
            className="cluster-detail-card"
          >
            <Descriptions
              title="集群资源使用概览"
              column={1}
              size="small"
              styles={{ label: { width: 100, color: "#666" } }}
            >
              <Descriptions.Item label="集群存储">
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                      fontSize: 13,
                      lineHeight: 1.4,
                    }}
                  >
                    <span>剩余:55.00GB</span>
                    <span>45%</span>
                  </div>
                  <Progress
                    percent={45}
                    strokeColor="#52c41a"
                    showInfo={false}
                    size="small"
                  />
                  <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                    45.26TB/100TB
                  </div>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="CPU使用率">
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginBottom: 8,
                      fontSize: 13,
                      lineHeight: 1.4,
                    }}
                  >
                    <span>15%</span>
                  </div>
                  <Progress
                    percent={15}
                    strokeColor="#52c41a"
                    showInfo={false}
                    size="small"
                  />
                  <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                    15.26%/100%
                  </div>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="内存使用率">
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                      fontSize: 13,
                      lineHeight: 1.4,
                    }}
                  >
                    <span>剩余:55.00GB</span>
                    <span>28%</span>
                  </div>
                  <Progress
                    percent={28}
                    strokeColor="#52c41a"
                    showInfo={false}
                    size="small"
                  />
                  <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                    36.02GB/128GB
                  </div>
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      ),
    },
    {
      key: "hosts",
      label: "物理机",
      children: (
        <div style={{ padding: "0 0" }}>
          <div style={{ marginBottom: 16 }}>
            <Input
              placeholder="名称"
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              style={{ width: 240 }}
            />
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#666",
              margin: "0 0 8px 0",
              lineHeight: 1.4,
            }}
          >
            共计 {physicalMachines.length} 条数据
          </div>
          <Table
            columns={columns}
            dataSource={physicalMachines}
            pagination={false}
            size="small"
          />
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          style={{ padding: "4px 8px" }}
        />
        <span style={{ fontSize: 16, fontWeight: 500 }}>{cluster.name}</span>
      </div>

      <style>
        {`
          .cluster-detail-tabs {
            display: flex;
            flex-direction: column;
            flex: 1;
            overflow: hidden;
          }
          .cluster-detail-tabs > .ant-tabs-nav {
            margin: 0;
          }
          .cluster-detail-tabs > .ant-tabs-content-holder {
            flex: 1;
            overflow: auto;
            padding: 8px 0 0 0;
          }
          .cluster-detail-tabs .ant-tabs-content {
            height: 100%;
          }
          .cluster-detail-tabs .ant-tabs-tabpane {
            height: 100%;
          }
          .cluster-detail-card {
            background: rgba(245, 245, 245, 0.3);
          }
        `}
      </style>
      <Tabs type="card" items={items} className="cluster-detail-tabs" />
    </div>
  );
};

export default ClusterDetail;
