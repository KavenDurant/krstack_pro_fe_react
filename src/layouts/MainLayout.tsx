import React from "react";
import { Layout, Menu, theme, Avatar, Space, Typography, Alert } from "antd";
import {
  DesktopOutlined,
  CloudServerOutlined,
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  FileTextOutlined,
  TagsOutlined,
  CloseCircleFilled,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();

  // Top Navigation Items
  const topNavItems = [
    { key: "overview", label: "数据概览", icon: <AppstoreOutlined /> },
    { key: "vm-manage", label: "虚拟机管理", icon: <DesktopOutlined /> },
    {
      key: "desktop-manage",
      label: "云桌面管理",
      icon: <CloudServerOutlined />,
    },
    { key: "resource-manage", label: "资源管理", icon: <FileTextOutlined /> },
    { key: "ops-manage", label: "运维管理", icon: <SettingOutlined /> },
    { key: "platform-manage", label: "平台管理", icon: <SettingOutlined /> },
  ];

  // Side Navigation Items - dynamically change based on top nav selection
  const getSideNavItems = () => {
    const path = location.pathname;

    // Cloud Desktop Management submenu
    if (path.startsWith("/cloud-desktop")) {
      return [
        {
          key: "/cloud-desktop",
          label: "云桌面管理",
          icon: <DesktopOutlined />,
        },
      ];
    }

    // Resource Management submenu
    if (path.startsWith("/resource-management")) {
      return [
        {
          key: "/resource-management",
          label: "资源概览",
          icon: <CloudServerOutlined />,
        },
      ];
    }

    // Platform Management submenu
    if (path.startsWith("/platform-management")) {
      return [
        {
          key: "/platform-management/users",
          label: "用户管理",
          icon: <UserOutlined />,
        },
        {
          key: "/platform-management/license",
          label: "许可管理",
          icon: <FileTextOutlined />,
        },
        {
          key: "/platform-management/data",
          label: "平台数据管理",
          icon: <FileTextOutlined />,
        },
        {
          key: "/platform-management/security",
          label: "平台安全设置",
          icon: <SettingOutlined />,
        },
        {
          key: "/platform-management/lab",
          label: "实验室",
          icon: <SettingOutlined />,
        },
        {
          key: "/platform-management/appearance",
          label: "平台外观管理",
          icon: <SettingOutlined />,
        },
      ];
    }

    // Operations Management submenu
    if (path.startsWith("/operations-management")) {
      return [
        {
          key: "/operations-management",
          label: "操作日志",
          icon: <FileTextOutlined />,
        },
      ];
    }

    // Default: VM Management submenu
    return [
      { key: "/hosts", label: "虚拟机管理", icon: <DesktopOutlined /> },
      {
        key: "/templates",
        label: "虚拟机规格模板",
        icon: <FileTextOutlined />,
      },
      {
        key: "/settings/form",
        label: "虚拟机表单设置",
        icon: <SettingOutlined />,
      },
      { key: "/backups", label: "虚拟机备份管理", icon: <FileTextOutlined /> },
      { key: "/hosts/tags", icon: <TagsOutlined />, label: "虚拟机标签管理" },
    ];
  };

  const sideNavItems = getSideNavItems();

  // Get current top navigation key based on pathname
  const getCurrentTopNavKey = () => {
    const path = location.pathname;
    if (path.startsWith("/cloud-desktop")) return "desktop-manage";
    if (path.startsWith("/resource-management")) return "resource-manage";
    if (path.startsWith("/platform-management")) return "platform-manage";
    if (path.startsWith("/operations-management")) return "ops-manage";
    return "vm-manage"; // Default to VM management
  };

  // Handle top navigation clicks
  const handleTopNavClick = (key: string) => {
    switch (key) {
      case "vm-manage":
        navigate("/hosts");
        break;
      case "desktop-manage":
        navigate("/cloud-desktop");
        break;
      case "resource-manage":
        navigate("/resource-management");
        break;
      case "ops-manage":
        navigate("/operations-management");
        break;
      case "platform-manage":
        navigate("/platform-management");
        break;
      default:
        break;
    }
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          background: "#fff",
          padding: "0 16px",
          borderBottom: "1px solid #f0f0f0",
          height: 50,
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        <div
          className="logo"
          style={{ display: "flex", alignItems: "center", marginRight: 32 }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              background: "#1890ff",
              borderRadius: 4,
              marginRight: 8,
            }}
          ></div>
          <Typography.Title
            level={4}
            style={{ margin: 0, fontSize: 18, lineHeight: "28px" }}
          >
            云管理平台
          </Typography.Title>
        </div>
        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[getCurrentTopNavKey()]}
          items={topNavItems}
          style={{
            flex: 1,
            borderBottom: "none",
            minWidth: 0,
            lineHeight: "50px",
          }}
          overflowedIndicator={<span style={{ padding: "0 8px" }}>…</span>}
          onClick={({ key }) => handleTopNavClick(key)}
        />
        <Space size={8} style={{ whiteSpace: "nowrap" }}>
          <Avatar icon={<UserOutlined />} size={32} />
          <span style={{ fontSize: 14 }}>admin</span>
        </Space>
      </Header>
      {location.pathname === "/hosts" && (
        <div style={{ width: "100%" }}>
          <Alert
            description={
              <span style={{ fontSize: 12 }}>
                集群cluster237下的物理机host181已离线！
              </span>
            }
            type="error"
            icon={<CloseCircleFilled style={{ fontSize: 14 }} />}
            showIcon
            closable
            style={{
              borderRadius: 0,
              border: "none",
              borderBottom: "1px solid #ffccc7",
              padding: "4px 15px", // Reduced padding
              alignItems: "center",
            }}
          />
          <Alert
            description={
              <span style={{ fontSize: 12 }}>
                集群cluster237下的local-lvm存储可用容量&lt;10%
              </span>
            }
            type="warning"
            icon={<ExclamationCircleFilled style={{ fontSize: 14 }} />}
            showIcon
            closable
            style={{
              borderRadius: 0,
              border: "none",
              borderBottom: "1px solid #ffe58f",
              padding: "4px 15px", // Reduced padding
              alignItems: "center",
            }}
          />
        </div>
      )}
      <Layout style={{ overflow: "hidden" }}>
        {!location.pathname.startsWith("/resource-management") && (
          <Sider
            width={176}
            style={{
              background: colorBgContainer,
              borderRight: "1px solid #f0f0f0",
            }}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={["/hosts"]}
              selectedKeys={[location.pathname]}
              style={{ height: "100%", borderRight: 0 }}
              items={sideNavItems}
              onClick={({ key }) => navigate(key)}
            />
          </Sider>
        )}
        <Layout style={{ padding: 0, overflow: "hidden" }}>
          <Content
            style={{
              background: colorBgContainer,
              padding: 0,
              margin: 0,
              height: "100%",
              overflow: "hidden",
              borderRadius: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
