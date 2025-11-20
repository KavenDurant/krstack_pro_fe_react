import React, { useState, useCallback } from "react";
import { Breadcrumb } from "antd";
import ResourceTree from "./components/ResourceTree";
import StatisticsCards from "./components/StatisticsCards";
import SearchFilter from "./components/SearchFilter";
import HostTable from "./components/HostTable";
import ColumnSettingsDrawer from "./components/ColumnSettingsDrawer";
import type { ColumnConfig } from "./components/ColumnSettingsDrawer";
import HostDetail from "./components/HostDetail";

const defaultColumns: ColumnConfig[] = [
  { key: "name", title: "名称", visible: true, fixed: true },
  { key: "status", title: "状态", visible: true },
  { key: "console", title: "控制台", visible: true },
  { key: "tags", title: "标签", visible: true },
  { key: "platform", title: "所属平台", visible: true },
  { key: "location", title: "所在位置", visible: true },
  { key: "os", title: "操作系统", visible: true },
  { key: "ip", title: "IP", visible: true },
  { key: "action", title: "操作", visible: true, fixed: true },
];

const HostManagement: React.FC = () => {
  const [columnDrawerVisible, setColumnDrawerVisible] = useState(false);
  const [columns, setColumns] = useState<ColumnConfig[]>(defaultColumns);
  const [selectedHost, setSelectedHost] = useState<string | null>(null);

  const handleSettingsClick = useCallback(() => {
    setColumnDrawerVisible(true);
  }, []);

  const handleColumnChange = useCallback((newColumns: ColumnConfig[]) => {
    setColumns(newColumns);
  }, []);

  const handleHostClick = useCallback((record: any) => {
    setSelectedHost(record.name);
  }, []);

  const handleBackToTable = useCallback(() => {
    setSelectedHost(null);
  }, []);

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div
        style={{
          width: 280,
          borderRight: "1px solid #f0f0f0",
          borderLeft: "1px solid #e0e0e0",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ResourceTree />
      </div>

      {/* Right Content Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "#fff",
        }}
      >
        {selectedHost ? (
          <HostDetail hostName={selectedHost} onBack={handleBackToTable} />
        ) : (
          <>
            {/* Breadcrumb */}
            <div style={{ padding: "16px 16px 0 16px" }}>
              <Breadcrumb
                items={[
                  { title: "虚拟机管理" },
                  { title: "全部虚拟机" },
                  { title: "cluster237" },
                  { title: "host180" },
                ]}
              />
            </div>

            {/* Main Content */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <StatisticsCards />
              <SearchFilter onSettingsClick={handleSettingsClick} />

              {/* Table Area */}
              <div
                style={{
                  flex: 1,
                  padding: "0 16px 16px 16px",
                  overflow: "hidden",
                }}
              >
                <HostTable
                  columnsConfig={columns}
                  onHostClick={handleHostClick}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <ColumnSettingsDrawer
        open={columnDrawerVisible}
        onClose={() => setColumnDrawerVisible(false)}
        columns={columns}
        onColumnsChange={handleColumnChange}
      />
    </div>
  );
};

export default HostManagement;
