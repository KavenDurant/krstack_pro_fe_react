import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { Breadcrumb } from "antd";
import ResourceTree, { type SelectionInfo } from "./components/ResourceTree";
import StatisticsCards from "./components/StatisticsCards";
import SearchFilter from "./components/SearchFilter";
import HostTable from "./components/HostTable";
import ColumnSettingsDrawer from "./components/ColumnSettingsDrawer";
import type { ColumnConfig } from "./components/ColumnSettingsDrawer";
import HostDetail from "./components/HostDetail";
import { mockVMData } from "../../api/mockData";
import type { HostDataType } from "./components/HostTable";

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

type Selection = SelectionInfo;

const HostManagement: React.FC = () => {
  const [columnDrawerVisible, setColumnDrawerVisible] = useState(false);
  const [columns, setColumns] = useState<ColumnConfig[]>(defaultColumns);
  const [selection, setSelection] = useState<Selection>({ type: "all" });
  const [sideWidth, setSideWidth] = useState(280);
  const dragState = useRef<{ startX: number; startWidth: number } | null>(null);
  const MIN_SIDE = 280;
  const MAX_SIDE = 350;
  const [dragging, setDragging] = useState(false);
  const allVMs = useMemo<HostDataType[]>(
    () =>
      mockVMData.vms.map(vm => ({
        key: vm.id,
        name: vm.name,
        status:
          (vm.status as HostDataType["status"]) === "offline"
            ? "offline"
            : (vm.status as HostDataType["status"]) || "unknown",
        console: true,
        tags: vm.tags,
        platform: vm.platform_type || "-",
        location: `${vm.cluster_name}/${vm.node_name}`,
        os: "Linux",
        ip: vm.ip || "-",
        clusterId: vm.cluster_id,
        clusterName: vm.cluster_name,
        nodeName: vm.node_name,
      })),
    []
  );

  const handleSettingsClick = useCallback(() => {
    setColumnDrawerVisible(true);
  }, []);

  const handleColumnChange = useCallback((newColumns: ColumnConfig[]) => {
    setColumns(newColumns);
  }, []);

  const handleTreeSelect = useCallback((info: SelectionInfo) => {
    setSelection(info);
  }, []);

  const handleHostClick = useCallback((record: HostDataType) => {
    setSelection({
      type: "vm",
      clusterId: record.clusterId ?? 0,
      clusterName: record.clusterName ?? "",
      hostName: record.nodeName ?? "",
      vmId: String(record.key),
      vmName: record.name,
    });
  }, []);

  const handleBackToTable = useCallback(() => {
    setSelection(prev =>
      prev.type === "vm"
        ? {
            type: "host",
            clusterId: prev.clusterId,
            clusterName: prev.clusterName,
            hostName: prev.hostName,
          }
        : { type: "all" }
    );
  }, []);

  const handleDragStart = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      dragState.current = { startX: e.clientX, startWidth: sideWidth };
      setDragging(true);
      e.preventDefault();
    },
    [sideWidth]
  );

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: MouseEvent) => {
      if (!dragState.current) return;
      const delta = e.clientX - dragState.current.startX;
      const next = Math.min(
        MAX_SIDE,
        Math.max(MIN_SIDE, dragState.current.startWidth + delta)
      );
      setSideWidth(next);
    };

    const onUp = () => {
      setDragging(false);
      dragState.current = null;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging]);

  const visibleVMs = useMemo(() => {
    switch (selection.type) {
      case "cluster":
        return allVMs.filter(vm => vm.clusterId === selection.clusterId);
      case "host":
        return allVMs.filter(
          vm =>
            vm.clusterId === selection.clusterId &&
            vm.nodeName === selection.hostName
        );
      case "vm":
        return allVMs.filter(vm => String(vm.key) === selection.vmId);
      default:
        return allVMs;
    }
  }, [selection, allVMs]);

  const selectedTreeKey = useMemo(() => {
    if (selection.type === "cluster") return `cluster-${selection.clusterId}`;
    if (selection.type === "host")
      return `host-${selection.clusterId}-${selection.hostName}`;
    if (selection.type === "vm") return `vm-${selection.vmId}`;
    return "all";
  }, [selection]);

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div
        style={{
          width: sideWidth,
          borderRight: "1px solid #f0f0f0",
          borderLeft: "1px solid #e0e0e0",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          userSelect: dragging ? "none" : "auto",
        }}
      >
        <div style={{ flex: 1, overflow: "hidden" }}>
          <ResourceTree
            onSelectNode={handleTreeSelect}
            selectedKey={selectedTreeKey}
          />
        </div>
        <div
          onMouseDown={handleDragStart}
          style={{
            position: "absolute",
            top: 0,
            right: -4,
            width: 8,
            height: "100%",
            cursor: "col-resize",
            zIndex: 2,
            background: dragging ? "rgba(24, 144, 255, 0.1)" : "transparent",
          }}
        />
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
        {selection.type === "vm" ? (
          <HostDetail hostName={selection.vmName} onBack={handleBackToTable} />
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
                  data={visibleVMs}
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
