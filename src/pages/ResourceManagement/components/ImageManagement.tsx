import React, { useEffect } from "react";
import { Tabs } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import SystemImages from "./SystemImages";
import TemplateImages from "./TemplateImages";

const ImageManagement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveKey = () => {
    if (location.pathname.includes("template-image")) return "template";
    return "system";
  };

  const handleTabChange = (key: string) => {
    if (key === "system") {
      navigate("/resource-management/system-image");
    } else {
      navigate("/resource-management/template-image");
    }
  };

  // Redirect /image to /system-image by default
  useEffect(() => {
    if (
      location.pathname.endsWith("/image") ||
      location.pathname.endsWith("/image/")
    ) {
      navigate("/resource-management/system-image", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div style={{ height: "100%", background: "#fff" }}>
      <style>
        {`
          .image-management-tabs .ant-tabs-tabpane {
            padding-left: 0 !important;
          }
        `}
      </style>
      <Tabs
        tabPlacement="start"
        activeKey={getActiveKey()}
        onChange={handleTabChange}
        style={{ height: "100%" }}
        className="image-management-tabs"
        items={[
          {
            key: "system",
            label: "系统镜像",
            children: (
              <div style={{ height: "100%", overflow: "hidden" }}>
                <SystemImages />
              </div>
            ),
          },
          {
            key: "template",
            label: "模板镜像",
            children: (
              <div style={{ height: "100%", overflow: "hidden" }}>
                <TemplateImages />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default ImageManagement;
