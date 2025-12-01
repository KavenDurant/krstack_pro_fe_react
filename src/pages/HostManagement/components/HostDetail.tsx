import React from "react";
import {
  Button,
  Tag,
  Tabs,
  Card,
  Descriptions,
  Switch,
  Space,
  Typography,
} from "antd";
import PageBreadcrumb from "../../../components/PageBreadcrumb";
import {
  ArrowLeftOutlined,
  DesktopOutlined,
  EditOutlined,
  ReloadOutlined,
  PoweroffOutlined,
  PlayCircleOutlined,
  DeleteOutlined,
  CopyOutlined,
  FileSyncOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import ConsoleView from "./ConsoleView";
import DeviceManagement from "./DeviceManagement";
import VirtualDiskTab from "./VirtualDisk/VirtualDiskTab";
import BackupTab from "./BackupSnapshot/BackupTab";
import PerformanceTab from "./Performance/PerformanceTab";

const { Title, Text } = Typography;

interface HostDetailProps {
  onBack: () => void;
  hostName?: string;
}

const HostDetail: React.FC<HostDetailProps> = ({
  onBack,
  hostName = "desktop-101",
}) => {
  const items = [
    {
      key: "1",
      label: "基本信息",
      children: (
        <div style={{ height: "100%", display: "flex", gap: 10 }}>
          {/* Left Column: Split into two cards */}
          <div
            style={{
              width: "33.33%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {/* Top Card: Icon and Tags */}
            <Card bordered={true} className="detail-card">
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <DesktopOutlined style={{ fontSize: 64, color: "#1890ff" }} />
              </div>

              <div style={{ marginBottom: 0 }}>
                <Text type="secondary">标签</Text>
                <div style={{ marginTop: 8 }}>
                  <Tag closable color="gold">
                    MeshFlowServer
                  </Tag>
                  <Tag closable color="blue">
                    云桌面
                  </Tag>
                  <Tag closable>便签测试</Tag>
                  <Tag
                    style={{ borderStyle: "dashed" }}
                    icon={<PlusOutlined />}
                  >
                    添加标签
                  </Tag>
                </div>
              </div>
            </Card>

            {/* Bottom Card: Basic Info */}
            <Card
              bordered={true}
              className="detail-card"
              style={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              <Descriptions
                title="基本信息"
                column={1}
                size="small"
                labelStyle={{ width: 100, color: "#666" }}
              >
                <Descriptions.Item label="操作系统">Windows</Descriptions.Item>
                <Descriptions.Item label="关联云桌面">
                  <a href="#">desktop-10x</a>
                </Descriptions.Item>
                <Descriptions.Item label="关联用户">
                  <a href="#">duobao</a>
                </Descriptions.Item>
                <Descriptions.Item label="所在位置">
                  cluster237/host237
                </Descriptions.Item>
                <Descriptions.Item label="创建时间">
                  2025-06-29 10:22:43
                </Descriptions.Item>
                <Descriptions.Item label="最后操作时间">
                  2025-06-29 10:22:43
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>

          {/* Right Column: Config Info */}
          <div style={{ flex: 1, height: "100%" }}>
            <Card
              bordered={true}
              className="detail-card"
              style={{ height: "100%" }}
            >
              <Descriptions
                title="配置信息"
                column={1}
                size="middle"
                labelStyle={{ width: 120, color: "#666" }}
                contentStyle={{ display: "flex", alignItems: "center" }}
              >
                <Descriptions.Item label="CPU">
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span style={{ minWidth: 200 }}>16 核</span>
                    <EditOutlined
                      style={{ color: "#1890ff", cursor: "pointer" }}
                    />
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="内存">
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span style={{ minWidth: 200 }}>32.00GB</span>
                    <EditOutlined
                      style={{ color: "#1890ff", cursor: "pointer" }}
                    />
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="系统盘">
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span style={{ minWidth: 200 }}>100.00GB</span>
                    <PlusOutlined
                      style={{ color: "#1890ff", cursor: "pointer" }}
                    />
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="MAC">
                  46:7D:B4:39:62:30
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span>
                      网络配置{" "}
                      <QuestionCircleOutlined style={{ color: "#ccc" }} />
                    </span>
                  }
                >
                  可用
                </Descriptions.Item>
                <Descriptions.Item label="IP 地址">
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span style={{ minWidth: 200 }}>192.168.1.229</span>
                    <EditOutlined
                      style={{ color: "#1890ff", cursor: "pointer" }}
                    />
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="开机自启动">
                  <Switch defaultChecked />
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span>
                      引导顺序{" "}
                      <QuestionCircleOutlined style={{ color: "#ccc" }} />
                    </span>
                  }
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span style={{ minWidth: 200 }}>
                      SCSI1;net0;ide2;usb...
                    </span>
                    <EditOutlined
                      style={{ color: "#1890ff", cursor: "pointer" }}
                    />
                  </div>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span>
                      BIOS模式{" "}
                      <QuestionCircleOutlined style={{ color: "#ccc" }} />
                    </span>
                  }
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span style={{ minWidth: 200 }}>UEFI</span>
                    <EditOutlined
                      style={{ color: "#1890ff", cursor: "pointer" }}
                    />
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="显示模式">
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span style={{ minWidth: 200 }}>SPICE</span>
                    <EditOutlined
                      style={{ color: "#1890ff", cursor: "pointer" }}
                    />
                  </div>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span>
                      QEMU 代理{" "}
                      <QuestionCircleOutlined style={{ color: "#ccc" }} />
                    </span>
                  }
                >
                  <Switch defaultChecked />
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "控制台",
      children: (
        <div>
          <ConsoleView />
        </div>
      ),
    },
    {
      key: "3",
      label: "设备管理",
      children: <DeviceManagement />,
    },
    {
      key: "4",
      label: "虚拟磁盘",
      children: <VirtualDiskTab />,
    },
    {
      key: "5",
      label: "备份与快照",
      children: <BackupTab />,
    },
    {
      key: "6",
      label: "性能监控",
      children: <PerformanceTab />,
    },
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <PageBreadcrumb />
      {/* Header Section */}
      <div
        style={{
          background: "#fff",
          padding: 12,
          borderBottom: "1px solid #f0f0f0",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Button
              icon={<ArrowLeftOutlined />}
              type="text"
              onClick={onBack}
              style={{ fontSize: 16 }}
            />
            <Title level={4} style={{ margin: 0 }}>
              {hostName}
            </Title>
            <Tag color="gold">备份中</Tag>
          </div>

          <Space>
            <Button icon={<CopyOutlined />}>克隆</Button>
            <Button icon={<FileSyncOutlined />}>转换成模板</Button>
            <Button icon={<DeleteOutlined />} danger>
              删除
            </Button>
            <Button icon={<ReloadOutlined />}>重启</Button>
            <Button icon={<PoweroffOutlined />}>关机</Button>
            <Button icon={<PlayCircleOutlined />}>开机</Button>
          </Space>
        </div>

        <style>
          {`
            .detail-card {
              background: rgba(245, 245, 245, 0.3);
            }
            .full-height-tabs {
              display: flex;
              flex-direction: column;
              flex: 1;
              overflow: hidden;
            }
            .full-height-tabs > .ant-tabs-nav {
              margin: 0;
            }
            .full-height-tabs > .ant-tabs-content-holder {
              flex: 1;
              overflow: auto;
              padding: 0;
            }
            .full-height-tabs .ant-tabs-content {
              height: 100%;
            }
            .full-height-tabs .ant-tabs-tabpane {
              height: 100%;
            }
          `}
        </style>
        <Tabs
          type="card"
          items={items}
          className="full-height-tabs"
          style={{ marginTop: 16 }}
        />
      </div>

      {/* Content Section - Tabs content is rendered here but Tabs component handles it */}
      {/* To make the content scrollable while header is fixed, we might need to adjust layout, 
          but for now standard Tabs behavior is fine as long as the page scrolls. 
          However, user asked for "fixed header" behavior implicitly? 
          The screenshot shows tabs part of the white header block. 
      */}
    </div>
  );
};

export default HostDetail;
