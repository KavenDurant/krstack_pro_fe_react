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
import type { MenuProps } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

interface ResourceSidebarProps {
  onSelect: (key: string) => void;
  selectedKey: string;
}

const ResourceSidebar: React.FC<ResourceSidebarProps> = ({
  onSelect,
  selectedKey,
}) => {
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
      label: "虚拟组盘管理",
      icon: <HddOutlined />,
    },
    {
      key: "image",
      label: "镜像管理",
      icon: <FolderOutlined />,
    },
  ];

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
        selectedKeys={[selectedKey]}
        defaultOpenKeys={["hardware"]}
        items={items}
        onClick={({ key }) => onSelect(key)}
        style={{ height: "100%", borderRight: 0 }}
      />
    </div>
  );
};

export default ResourceSidebar;
