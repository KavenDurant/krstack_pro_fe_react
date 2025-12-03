import React from "react";
import { SafetyCertificateOutlined, UploadOutlined } from "@ant-design/icons";
import LayoutBox from "../../../components/LayoutBox";
import BreadcrumbContainer from "../../../components/BreadcrumbContainer";
import VerticalTabs from "../../../components/VerticalTabs";
import PlatformLicenseContent from "./tabs/PlatformLicenseContent";
import DesktopLicenseContent from "./tabs/DesktopLicenseContent";

const LicenseManagement: React.FC = () => {
  const tabItems = [
    {
      key: "platform-license",
      label: "平台许可",
      icon: <SafetyCertificateOutlined />,
      children: <PlatformLicenseContent />,
    },
    {
      key: "desktop-license",
      label: "桌面许可",
      icon: <UploadOutlined />,
      children: <DesktopLicenseContent />,
    },
  ];

  return (
    <LayoutBox>
      <BreadcrumbContainer items={[{ label: "许可管理" }]} />
      <LayoutBox>
        <VerticalTabs items={tabItems} defaultActiveKey="platform-license" />
      </LayoutBox>
    </LayoutBox>
  );
};

export default LicenseManagement;
