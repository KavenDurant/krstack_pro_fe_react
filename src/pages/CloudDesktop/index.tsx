import React from "react";
import { Layout } from "antd";
import PageBreadcrumb from "../../components/PageBreadcrumb";
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
        background: "#fff",
      }}
    >
      <PageBreadcrumb fullWidth />
      <Content style={{ padding: 12, overflow: "auto", flex: 1 }}>
        <DesktopFilter />
        <DesktopTable />
      </Content>
    </div>
  );
};

export default CloudDesktop;
