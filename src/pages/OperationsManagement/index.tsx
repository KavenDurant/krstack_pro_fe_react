import React from "react";
import { Layout, Breadcrumb, Card, Table, Tag, Badge } from "antd";
import type { ColumnsType } from "antd/es/table";

const { Content } = Layout;

interface LogDataType {
  key: string;
  time: string;
  level: "info" | "warning" | "error";
  module: string;
  message: string;
  operator: string;
}

const levelMap = {
  info: { color: "blue", text: "信息" },
  warning: { color: "orange", text: "警告" },
  error: { color: "red", text: "错误" },
};

const columns: ColumnsType<LogDataType> = [
  {
    title: "时间",
    dataIndex: "time",
    key: "time",
    width: 180,
  },
  {
    title: "级别",
    dataIndex: "level",
    key: "level",
    width: 100,
    render: (level: keyof typeof levelMap) => {
      const { color, text } = levelMap[level];
      return <Tag color={color}>{text}</Tag>;
    },
  },
  {
    title: "模块",
    dataIndex: "module",
    key: "module",
    width: 150,
  },
  {
    title: "消息",
    dataIndex: "message",
    key: "message",
  },
  {
    title: "操作人",
    dataIndex: "operator",
    key: "operator",
    width: 120,
  },
];

const data: LogDataType[] = [
  {
    key: "1",
    time: "2024-11-19 16:20:30",
    level: "info",
    module: "虚拟机管理",
    message: "虚拟机 VM-001 启动成功",
    operator: "admin",
  },
  {
    key: "2",
    time: "2024-11-19 16:15:22",
    level: "warning",
    module: "资源管理",
    message: "CPU 使用率超过 80%",
    operator: "system",
  },
  {
    key: "3",
    time: "2024-11-19 16:10:15",
    level: "error",
    module: "存储管理",
    message: "存储池 local-lvm 可用容量不足 10%",
    operator: "system",
  },
  {
    key: "4",
    time: "2024-11-19 16:05:08",
    level: "info",
    module: "用户管理",
    message: "用户 zhangsan 登录系统",
    operator: "zhangsan",
  },
  {
    key: "5",
    time: "2024-11-19 16:00:00",
    level: "info",
    module: "备份管理",
    message: "定时备份任务执行成功",
    operator: "system",
  },
];

const OperationsManagement: React.FC = () => {
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
          items={[{ title: "运维管理" }, { title: "操作日志" }]}
          style={{ marginBottom: 16 }}
        />

        <Card
          title="系统日志"
          extra={<Badge status="processing" text="实时监控中" />}
        >
          <Table
            columns={columns}
            dataSource={data}
            pagination={{
              total: 100,
              showTotal: total => `共计 ${total} 条日志`,
              defaultPageSize: 10,
              showSizeChanger: true,
            }}
          />
        </Card>
      </Content>
    </div>
  );
};

export default OperationsManagement;
