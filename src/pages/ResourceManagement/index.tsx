import React from "react";
import {
  Layout,
  Breadcrumb,
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Table,
} from "antd";
import {
  CloudServerOutlined,
  DatabaseOutlined,
  HddOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Content } = Layout;

interface ResourceDataType {
  key: string;
  name: string;
  type: string;
  total: string;
  used: string;
  available: string;
  usage: number;
}

const columns: ColumnsType<ResourceDataType> = [
  { title: "资源名称", dataIndex: "name", key: "name" },
  { title: "资源类型", dataIndex: "type", key: "type" },
  { title: "总量", dataIndex: "total", key: "total" },
  { title: "已用", dataIndex: "used", key: "used" },
  { title: "可用", dataIndex: "available", key: "available" },
  {
    title: "使用率",
    dataIndex: "usage",
    key: "usage",
    render: (usage: number) => <Progress percent={usage} size="small" />,
  },
];

const data: ResourceDataType[] = [
  {
    key: "1",
    name: "CPU资源池",
    type: "CPU",
    total: "256核",
    used: "180核",
    available: "76核",
    usage: 70,
  },
  {
    key: "2",
    name: "内存资源池",
    type: "内存",
    total: "512GB",
    used: "384GB",
    available: "128GB",
    usage: 75,
  },
  {
    key: "3",
    name: "存储资源池",
    type: "存储",
    total: "10TB",
    used: "6.5TB",
    available: "3.5TB",
    usage: 65,
  },
];

const ResourceManagement: React.FC = () => {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#f0f2f5",
      }}
    >
      <Content
        style={{ padding: "16px 16px 16px 24px", overflow: "auto", flex: 1 }}
      >
        <Breadcrumb
          items={[{ title: "资源管理" }, { title: "资源概览" }]}
          style={{ marginBottom: 16 }}
        />

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="CPU总量"
                value={256}
                suffix="核"
                prefix={<CloudServerOutlined />}
                valueStyle={{ color: "#3f8600" }}
              />
              <Progress percent={70} strokeColor="#3f8600" />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="内存总量"
                value={512}
                suffix="GB"
                prefix={<DatabaseOutlined />}
                valueStyle={{ color: "#cf1322" }}
              />
              <Progress percent={75} strokeColor="#cf1322" />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="存储总量"
                value={10}
                suffix="TB"
                prefix={<HddOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
              <Progress percent={65} strokeColor="#1890ff" />
            </Card>
          </Col>
        </Row>

        <Card title="资源详情">
          <Table columns={columns} dataSource={data} pagination={false} />
        </Card>
      </Content>
    </div>
  );
};

export default ResourceManagement;
