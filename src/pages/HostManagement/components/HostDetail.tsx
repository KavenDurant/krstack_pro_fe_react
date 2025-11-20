import React from "react";
import {
  Breadcrumb,
  Button,
  Tag,
  Tabs,
  Card,
  Row,
  Col,
  Descriptions,
  Switch,
  Space,
  Divider,
  Typography,
} from "antd";
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
        <Row gutter={24}>
          {/* Left Column: Basic Info */}
          <Col span={8}>
            <Card bordered={false} className="detail-card">
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <DesktopOutlined style={{ fontSize: 64, color: "#1890ff" }} />
              </div>

              <div style={{ marginBottom: 24 }}>
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

              <Divider />

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

              <div
                style={{
                  marginTop: 16,
                  background: "#fffbe6",
                  padding: 12,
                  borderRadius: 4,
                  border: "1px solid #ffe58f",
                }}
              >
                <Text type="warning" style={{ fontSize: 12 }}>
                  #11
                  <br />
                  卡片内容更新为基本信息和配置信息
                  <br />
                  1、可配置的面向技术运维管理的操作统一放到配置信息卡片
                  <br />
                  2、信息查阅的放到基本信息
                </Text>
              </div>
            </Card>
          </Col>

          {/* Right Column: Config Info */}
          <Col span={16}>
            <Card title="配置信息" bordered={false} className="detail-card">
              <Descriptions
                column={1}
                size="middle"
                labelStyle={{ width: 120, color: "#666" }}
                contentStyle={{ alignItems: "center" }}
              >
                <Descriptions.Item label="CPU">
                  <Space>
                    16 核
                    <EditOutlined
                      style={{ color: "#1890ff", cursor: "pointer" }}
                    />
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="内存">
                  <Space>
                    32.00GB
                    <EditOutlined
                      style={{ color: "#1890ff", cursor: "pointer" }}
                    />
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="系统盘">
                  <Space>
                    100.00GB
                    <PlusOutlined
                      style={{ color: "#1890ff", cursor: "pointer" }}
                    />
                  </Space>
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
                  <Space>
                    192.168.1.229
                    <EditOutlined
                      style={{ color: "#1890ff", cursor: "pointer" }}
                    />
                  </Space>
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
                  <Space>
                    SCSI1;net0;ide2;usb...
                    <EditOutlined
                      style={{ color: "#1890ff", cursor: "pointer" }}
                    />
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span>
                      BIOS模式{" "}
                      <QuestionCircleOutlined style={{ color: "#ccc" }} />
                    </span>
                  }
                >
                  <Space>
                    UEFI
                    <EditOutlined
                      style={{ color: "#1890ff", cursor: "pointer" }}
                    />
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="显示模式">
                  <Space>
                    SPICE
                    <EditOutlined
                      style={{ color: "#1890ff", cursor: "pointer" }}
                    />
                  </Space>
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
          </Col>
        </Row>
      ),
    },
    {
      key: "2",
      label: "控制台",
      children: <div style={{ padding: 24 }}>控制台内容...</div>,
    },
    {
      key: "3",
      label: "设备管理",
      children: <div style={{ padding: 24 }}>设备管理内容...</div>,
    },
    {
      key: "4",
      label: "虚拟磁盘",
      children: <div style={{ padding: 24 }}>虚拟磁盘内容...</div>,
    },
    {
      key: "5",
      label: "备份与快照",
      children: <div style={{ padding: 24 }}>备份与快照内容...</div>,
    },
    {
      key: "6",
      label: "性能监控",
      children: <div style={{ padding: 24 }}>性能监控内容...</div>,
    },
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header Section */}
      <div
        style={{
          background: "#fff",
          padding: "16px 24px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Breadcrumb
          items={[
            { title: "虚拟机管理" },
            { title: "全部虚拟机" },
            { title: "cluster237" },
            { title: "host237" },
            { title: hostName },
          ]}
          style={{ marginBottom: 16 }}
        />

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

        <Tabs items={items} style={{ marginTop: 16 }} />
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
