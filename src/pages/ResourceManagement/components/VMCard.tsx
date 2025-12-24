import React from "react";
import { Card, Tag, Space } from "antd";
import { PlayCircleFilled, PoweroffOutlined } from "@ant-design/icons";
import type { VMInfo } from "@/api";
import { formatBytesAuto } from "@/utils/format";

// 操作系统图标映射
const OS_ICON_MAP: Record<string, string> = {
  Windows: "/src/assets/resource-node-icon/Windows.svg",
  CentOS: "/src/assets/resource-node-icon/CentOS.svg",
  Ubuntu: "/src/assets/resource-node-icon/Ubuntu.svg",
  Debian: "/src/assets/resource-node-icon/Debian.svg",
  RedFlag: "/src/assets/resource-node-icon/RedFlag.svg",
  UnionTechUOS: "/src/assets/resource-node-icon/UnionTechUOS.svg",
  GalaxyKylin: "/src/assets/resource-node-icon/GalaxyKylin.svg",
  NeoKylin: "/src/assets/resource-node-icon/NeoKylin.svg",
  NFS: "/src/assets/resource-node-icon/NFS.svg",
  Other: "/src/assets/resource-node-icon/Other.svg",
  Linux: "/src/assets/resource-node-icon/linux.svg",
};

interface VMCardProps {
  vm: VMInfo;
  onClick?: (vm: VMInfo) => void;
}

const VMCard: React.FC<VMCardProps> = ({ vm, onClick }) => {
  const isRunning = vm.status === "Running";

  // 根据操作系统类型获取图标
  const getOSIcon = (osType: string): string => {
    // 尝试精确匹配
    if (OS_ICON_MAP[osType]) {
      return OS_ICON_MAP[osType];
    }

    // 模糊匹配
    const lowerOsType = osType.toLowerCase();
    if (lowerOsType.includes("windows")) return OS_ICON_MAP.Windows;
    if (lowerOsType.includes("centos")) return OS_ICON_MAP.CentOS;
    if (lowerOsType.includes("ubuntu")) return OS_ICON_MAP.Ubuntu;
    if (lowerOsType.includes("debian")) return OS_ICON_MAP.Debian;
    if (lowerOsType.includes("红旗") || lowerOsType.includes("redflag"))
      return OS_ICON_MAP.RedFlag;
    if (lowerOsType.includes("统信") || lowerOsType.includes("uos"))
      return OS_ICON_MAP.UnionTechUOS;
    if (lowerOsType.includes("银河") || lowerOsType.includes("galaxy"))
      return OS_ICON_MAP.GalaxyKylin;
    if (lowerOsType.includes("中标") || lowerOsType.includes("neokylin"))
      return OS_ICON_MAP.NeoKylin;
    if (lowerOsType.includes("方德") || lowerOsType.includes("nfs"))
      return OS_ICON_MAP.NFS;
    if (lowerOsType.includes("linux")) return OS_ICON_MAP.Linux;

    return OS_ICON_MAP.Other;
  };

  return (
    <Card
      hoverable
      onClick={() => onClick?.(vm)}
      styles={{
        body: {
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        },
      }}
      style={{
        width: "100%",
        height: "100%",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f5f5f5",
            borderRadius: 4,
            flexShrink: 0,
          }}
        >
          <img
            src={getOSIcon(vm.osType)}
            alt={vm.osType}
            style={{ width: 32, height: 32 }}
            onError={e => {
              (e.target as HTMLImageElement).src = OS_ICON_MAP.Other;
            }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "#333",
              marginBottom: 4,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {vm.name}
          </div>
          <Space size={4}>
            {isRunning ? (
              <PlayCircleFilled style={{ color: "#52c41a", fontSize: 12 }} />
            ) : (
              <PoweroffOutlined style={{ color: "#999", fontSize: 12 }} />
            )}
            <span style={{ fontSize: 12, color: "#666" }}>
              {isRunning ? "运行中" : "已停止"}
            </span>
          </Space>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          fontSize: 12,
          color: "#666",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>状态:</span>
          <Tag color={isRunning ? "success" : "default"} style={{ margin: 0 }}>
            {isRunning ? "运行中" : "已停止"}
          </Tag>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>IP:</span>
          <span style={{ color: "#333" }}>
            {vm.ip || <Tag color="default">暂未提供</Tag>}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>CPU:</span>
          <span style={{ color: "#333" }}>{vm.cpuTotal} 核</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>内存:</span>
          <span style={{ color: "#333" }}>{formatBytesAuto(vm.memTotal)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>系统:</span>
          <span
            style={{
              color: "#333",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={vm.osType}
          >
            {vm.osType || <Tag color="default">暂未提供</Tag>}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default VMCard;
