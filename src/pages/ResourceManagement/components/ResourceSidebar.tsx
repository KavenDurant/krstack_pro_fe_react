import React from "react";
import { Menu } from "antd";
import {
  HddOutlined,
  ClusterOutlined,
  DatabaseOutlined,
  CloudServerOutlined,
  UsbOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import type { MenuProps } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

const ResourceSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === "/resource-management") return "cluster";
    if (path.includes("/host")) return "host";
    if (path.includes("/gpu")) return "gpu";
    if (path.includes("/usb")) return "usb";
    if (path.includes("storage")) return "storage";
    if (path.includes("/virtual-disk")) return "virtual-disk";
    if (path.includes("image")) return "image";
    return "cluster";
  };
  const items: MenuItem[] = [
    {
      key: "hardware",
      label: "硬件管理",
      icon: <HddOutlined />,
      children: [
        { key: "cluster", label: "集群管理", icon: <ClusterOutlined /> },
        { key: "host", label: "物理机管理", icon: <CloudServerOutlined /> },
        { key: "gpu", label: "GPU管理", icon: <DatabaseOutlined /> },
        { key: "usb", label: "USB管理", icon: <UsbOutlined /> },
      ],
    },
    {
      key: "storage",
      label: "存储管理",
      icon: <DatabaseOutlined />,
    },
    {
      key: "virtual-disk",
      label: "虚拟磁盘管理",
      icon: <HddOutlined />,
    },
    {
      key: "image",
      label: "镜像管理",
      icon: <FolderOutlined />,
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "cluster") {
      navigate("/resource-management");
    } else if (key === "storage") {
      // 直接导航到外挂存储，避免重定向
      navigate("/resource-management/external-storage");
    } else {
      navigate(`/resource-management/${key}`);
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        height: "100%",
        borderRight: "1px solid #f0f0f0",
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        defaultOpenKeys={["hardware"]}
        items={items}
        onClick={handleMenuClick}
        style={{ height: "100%", borderRight: 0 }}
      />
    </div>
  );
};

export default ResourceSidebar;
