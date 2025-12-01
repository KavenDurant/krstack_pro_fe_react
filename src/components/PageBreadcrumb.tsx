import React from "react";
import { Breadcrumb, Divider } from "antd";
import { useLocation } from "react-router-dom";

const breadcrumbMap: Record<string, { title: string }[]> = {
  "/hosts": [
    { title: "虚拟机管理" },
    { title: "全部虚拟机" },
    { title: "cluster237" },
    { title: "host180" },
  ],
  "/cloud-desktop": [{ title: "云桌面管理" }, { title: "全部云桌面" }],
  "/resource-management": [{ title: "资源管理" }, { title: "集群管理" }],
  "/platform-management": [{ title: "平台管理" }, { title: "系统设置" }],
  "/operations-management": [{ title: "运维管理" }, { title: "操作日志" }],
};

interface PageBreadcrumbProps {
  fullWidth?: boolean;
}

const PageBreadcrumb: React.FC<PageBreadcrumbProps> = () => {
  const location = useLocation();
  const items = breadcrumbMap[location.pathname] || [];

  if (items.length === 0) return null;

  return (
    <div style={{ background: "#fff" }}>
      <div style={{ height: 48, padding: "0 0 0 12px", display: "flex", alignItems: "center" }}>
        <Breadcrumb items={items} />
      </div>
      <Divider style={{ margin: 0 }} />
    </div>
  );
};

export default PageBreadcrumb;
