import React, { useState } from "react";
import { Layout, Tabs } from "antd";
import { DesktopOutlined, SettingOutlined } from "@ant-design/icons";
import PageBreadcrumb from "../../components/PageBreadcrumb";
import DesktopTable from "./components/DesktopTable";
import DesktopFilter from "./components/DesktopFilter";
import DesktopPolicy from "./components/DesktopPolicy";

const { Content } = Layout;

const CloudDesktop: React.FC = () => {
  const [activeTab, setActiveTab] = useState("desktop");

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const breadcrumbItems = [
    { title: "云桌面管理" },
    { title: activeTab === "desktop" ? "云桌面" : "桌面策略" },
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
      <PageBreadcrumb customItems={breadcrumbItems} />
      <Content
        style={{
          overflow: "hidden",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ height: "100%", background: "#fff" }}>
          <style>
            {`
              .cloud-desktop-tabs .ant-tabs-tabpane {
                padding-left: 0 !important;
              }
              .cloud-desktop-tabs .ant-tabs-content-holder {
                flex: 1;
                padding: 12px;
                overflow: auto;
              }
              .cloud-desktop-tabs .tab-label {
                display: flex;
                align-items: center;
                gap: 8px;
              }
              .cloud-desktop-tabs .tab-label .tab-icon {
                display: flex;
                align-items: center;
                font-size: 16px;
              }
            `}
          </style>
          <Tabs
            tabPlacement="start"
            activeKey={activeTab}
            onChange={handleTabChange}
            style={{ height: "100%" }}
            className="cloud-desktop-tabs"
            items={[
              {
                key: "desktop",
                label: (
                  <span className="tab-label">
                    <span className="tab-icon">
                      <DesktopOutlined />
                    </span>
                    <span>云桌面</span>
                  </span>
                ),
                children: (
                  <div
                    style={{
                      height: "100%",
                      overflow: "auto",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <DesktopFilter />
                    <DesktopTable />
                  </div>
                ),
              },
              {
                key: "policy",
                label: (
                  <span className="tab-label">
                    <span className="tab-icon">
                      <SettingOutlined />
                    </span>
                    <span>桌面策略</span>
                  </span>
                ),
                children: <DesktopPolicy />,
              },
            ]}
          />
        </div>
      </Content>
    </div>
  );
};

export default CloudDesktop;
