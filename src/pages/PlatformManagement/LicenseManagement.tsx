import React from "react";
import { Tabs } from "antd";
import PageBreadcrumb from "../../components/PageBreadcrumb";
import DesktopLicense from "./components/DesktopLicense";

const LicenseManagement: React.FC = () => {
  const tabItems = [
    {
      key: "platform",
      label: "平台许可",
      children: <div>平台许可内容</div>,
    },
    {
      key: "domain",
      label: "桌面许可",
      children: <DesktopLicense />,
    },
  ];

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
      }}
    >
      <PageBreadcrumb />
      <div style={{ flex: 1, overflow: "auto" }}>
        <Tabs
          items={tabItems}
          tabPosition="left"
          style={{
            height: "100%",
          }}
          styles={{
            nav: {
              width: 132,
              borderRight: "1px solid #f0f0f0",
            },
            content: {
              paddingLeft: 0,
              padding: 12,
            },
          }}
        />
      </div>
    </div>
  );
};

export default LicenseManagement;
