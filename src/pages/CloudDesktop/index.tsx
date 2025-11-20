import React from "react";
import { Layout, Breadcrumb } from "antd";
import DesktopTable from "./components/DesktopTable";
import DesktopFilter from "./components/DesktopFilter";

const { Content } = Layout;

const CloudDesktop: React.FC = () => {
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
          items={[{ title: "云桌面管理" }, { title: "全部云桌面" }]}
          style={{ marginBottom: 16 }}
        />
        <DesktopFilter />
        <DesktopTable />
      </Content>
    </div>
  );
};

export default CloudDesktop;
