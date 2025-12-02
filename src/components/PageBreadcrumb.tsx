import React from "react";
import { Breadcrumb, Divider } from "antd";
import { useLocation } from "react-router-dom";

const breadcrumbMap: Record<string, { title: string }[]> = {
  "/cloud-desktop": [{ title: "云桌面管理" }, { title: "全部云桌面" }],
  "/resource-management": [
    { title: "资源管理" },
    { title: "硬件管理" },
    { title: "集群管理" },
  ],
  "/resource-management/host": [
    { title: "资源管理" },
    { title: "硬件管理" },
    { title: "物理机管理" },
  ],
  "/resource-management/gpu": [
    { title: "资源管理" },
    { title: "硬件管理" },
    { title: "GPU管理" },
  ],
  "/resource-management/usb": [
    { title: "资源管理" },
    { title: "硬件管理" },
    { title: "USB管理" },
  ],
  "/resource-management/storage": [
    { title: "资源管理" },
    { title: "存储管理" },
  ],
  "/resource-management/virtual-disk": [
    { title: "资源管理" },
    { title: "虚拟组盘管理" },
  ],
  "/resource-management/image": [{ title: "资源管理" }, { title: "镜像管理" }],
  "/platform-management": [{ title: "平台管理" }, { title: "系统设置" }],
  "/platform-management/users": [{ title: "平台管理" }, { title: "用户管理" }],
  "/operations-management": [{ title: "运维管理" }, { title: "操作日志" }],
};

interface PageBreadcrumbProps {
  fullWidth?: boolean;
  customItems?: { title: string }[];
}

const PageBreadcrumb: React.FC<PageBreadcrumbProps> = ({ customItems }) => {
  const location = useLocation();
  const items = customItems || breadcrumbMap[location.pathname] || [];

  if (items.length === 0) return null;

  return (
    <div style={{ background: "#fff" }}>
      <div
        style={{
          height: 48,
          padding: "0 0 0 12px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Breadcrumb items={items} />
      </div>
      <Divider style={{ margin: 0 }} />
    </div>
  );
};

export default PageBreadcrumb;
