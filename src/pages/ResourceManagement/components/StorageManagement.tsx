import React, { useEffect } from "react";
import { Tabs } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import ExternalStorage from "./ExternalStorage";
import InternalStorage from "./InternalStorage";

const StorageManagement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveKey = () => {
    if (location.pathname.includes("internal-storage")) return "internal";
    return "external";
  };

  const handleTabChange = (key: string) => {
    if (key === "external") {
      navigate("/resource-management/external-storage");
    } else {
      navigate("/resource-management/internal-storage");
    }
  };

  // Redirect /storage to /external-storage by default to ensure a valid path for breadcrumbs
  useEffect(() => {
    if (
      location.pathname.endsWith("/storage") ||
      location.pathname.endsWith("/storage/")
    ) {
      navigate("/resource-management/external-storage", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div style={{ height: "100%", background: "#fff" }}>
      <style>
        {`
          .storage-management-tabs .ant-tabs-tabpane {
            padding-left: 0 !important;
          }
        `}
      </style>
      <Tabs
        tabPlacement="start"
        activeKey={getActiveKey()}
        onChange={handleTabChange}
        style={{ height: "100%" }}
        className="storage-management-tabs"
        items={[
          {
            key: "external",
            label: "外挂存储",
            children: (
              <div style={{ height: "100%", overflow: "hidden" }}>
                <ExternalStorage />
              </div>
            ),
          },
          {
            key: "internal",
            label: "内置存储",
            children: (
              <div style={{ height: "100%", overflow: "hidden" }}>
                <InternalStorage />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};

export default StorageManagement;
