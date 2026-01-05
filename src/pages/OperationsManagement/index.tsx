import React, { useState } from "react";
import { Layout, Menu, theme } from "antd";
import {
  MessageOutlined,
  SafetyCertificateOutlined,
  AlertOutlined,
  ScheduleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import PageBreadcrumb from "../../components/PageBreadcrumb";
import AlertMessages from "./components/AlertMessages";
import OperationLogs from "./components/OperationLogs";
import TaskLogs from "./components/TaskLogs";

const { Content, Sider } = Layout;

type MenuItem = {
  key: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  label: React.ReactNode;
};

function getItem(
  label: React.ReactNode,
  key: string,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items: MenuItem[] = [
  getItem("消息日志", "message-logs", <MessageOutlined />, [
    getItem("告警消息", "alert-messages", <AlertOutlined />),
    getItem("任务日志", "task-logs", <ScheduleOutlined />),
    getItem("操作日志", "operation-logs", <HistoryOutlined />),
  ]),
  getItem("审计管理", "audit-management", <SafetyCertificateOutlined />),
];

const OperationsManagement: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [selectedKey, setSelectedKey] = useState("alert-messages");
  const [openKeys, setOpenKeys] = useState(["message-logs"]);
  const [collapsed, setCollapsed] = useState(false);

  const getBreadcrumbItems = () => {
    const base = [{ title: "运维管理" }];
    switch (selectedKey) {
      case "alert-messages":
        return [...base, { title: "消息日志" }, { title: "告警消息" }];
      case "task-logs":
        return [...base, { title: "消息日志" }, { title: "任务日志" }];
      case "operation-logs":
        return [...base, { title: "消息日志" }, { title: "操作日志" }];
      case "audit-management":
        return [...base, { title: "审计管理" }];
      default:
        return base;
    }
  };

  const renderContent = () => {
    switch (selectedKey) {
      case "alert-messages":
        return <AlertMessages />;
      case "task-logs":
        return <TaskLogs />;
      case "operation-logs":
        return <OperationLogs />;
      case "audit-management":
        return <div>审计管理内容</div>;
      default:
        return <AlertMessages />;
    }
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#f0f2f5", // Use a light gray background for the main container
      }}
    >
      <Layout style={{ height: "100%" }}>
        <Sider
          width={200}
          collapsedWidth={80}
          collapsible
          collapsed={collapsed}
          onCollapse={value => setCollapsed(value)}
          trigger={
            <div
              style={{
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: colorBgContainer,
                borderTop: "1px solid #f0f0f0",
                borderRight: "1px solid #f0f0f0",
                cursor: "pointer",
                color: "rgba(0, 0, 0, 0.65)",
                fontSize: 16,
              }}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
          }
          style={{
            background: colorBgContainer,
            borderRight: "1px solid #f0f0f0",
          }}
        >
          <div style={{ height: "100%", overflowY: "auto" }}>
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              openKeys={openKeys}
              onOpenChange={keys => setOpenKeys(keys as string[])}
              onSelect={({ key }) => setSelectedKey(key)}
              style={{ height: "100%", borderRight: 0 }}
              items={items}
            />
          </div>
        </Sider>
        <Layout style={{ padding: "0" }}>
          <PageBreadcrumb customItems={getBreadcrumbItems()} />
          <Content
            style={{
              background: colorBgContainer,
              margin: 0,
              minHeight: 280,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default OperationsManagement;
