import React, { useState, useCallback, useMemo } from "react";
import PageBreadcrumb from "../../components/PageBreadcrumb";
import ResourceTree, { type SelectionInfo } from "./components/ResourceTree";
import StatisticsCards from "./components/StatisticsCards";
import SearchFilter from "./components/SearchFilter";
import HostTable from "./components/HostTable";
import ColumnSettingsDrawer from "./components/ColumnSettingsDrawer";
import type { ColumnConfig } from "./components/ColumnSettingsDrawer";
import HostDetail from "./components/HostDetail";
import { mockVMData } from "../../api/mockData";
import type { HostDataType } from "./components/HostTable";
import Splitter from "../../components/Splitter";
import LayoutBox from "../../components/LayoutBox";

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

  const breadcrumbItems = useMemo(() => {
    const items = [{ title: "虚拟机管理" }, { title: "全部虚拟机" }];

    if (selection.type === "cluster") {
      items.push({ title: selection.clusterName });
    } else if (selection.type === "host") {
      items.push({ title: selection.clusterName });
      items.push({ title: selection.hostName });
    } else if (selection.type === "vm") {
      items.push({ title: selection.clusterName });
      items.push({ title: selection.hostName });
      items.push({ title: selection.vmName });
    }

    return items;
  }, [selection]);

  const splitterPanels = [
    {
      key: "left",
      size: 280,
      min: 280,
      max: 350,
      children: (
        <ResourceTree
          onSelectNode={handleTreeSelect}
          selectedKey={selectedTreeKey}
        />
      ),
    },
    {
      key: "right",
      children:
        selection.type === "vm" ? (
          <HostDetail
            hostName={selection.vmName}
            onBack={handleBackToTable}
            breadcrumbItems={breadcrumbItems}
          />
        ) : (
          <LayoutBox>
            <PageBreadcrumb customItems={breadcrumbItems} />
            <LayoutBox padding={12}>
              <StatisticsCards />
              <SearchFilter onSettingsClick={handleSettingsClick} />
              <div style={{ flex: 1, overflow: "hidden" }}>
                <HostTable
                  columnsConfig={columns}
                  onHostClick={handleHostClick}
                  data={visibleVMs}
                />
              </div>
            </LayoutBox>
          </LayoutBox>
        ),
    },
  ];

  return (
    <>
      <Splitter panels={splitterPanels} />
      <ColumnSettingsDrawer
        open={columnDrawerVisible}
        onClose={() => setColumnDrawerVisible(false)}
        columns={columns}
        onColumnsChange={handleColumnChange}
      />
    </>
  );
};

export default HostManagement;
