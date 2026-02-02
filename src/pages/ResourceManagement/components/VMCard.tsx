import React from "react";
import { Tag } from "antd";
import type { VMInfo } from "@/api";
import { formatBytesAuto } from "@/utils/format";
import GrayCard from "@/components/GrayCard";
import styles from "./VMCard.module.less";

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

// 状态颜色映射
const STATUS_COLORS: Record<string, string> = {
  success: "#52c41a",
  warning: "#faad14",
  error: "#ff4d4f",
  default: "#666666",
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

  // 获取显示器图标（根据运行状态）
  const getMonitorIcon = (): string => {
    return isRunning
      ? "/src/assets/resource-node-icon/open-vm.svg"
      : "/src/assets/resource-node-icon/close-vm.svg";
  };

  // 信息项列表
  const infoItems = [
    {
      label: "状态",
      value: isRunning ? "运行中" : "已停止",
      status: isRunning ? "success" : "default",
    },
    {
      label: "IP",
      value: vm.ip || <Tag color="default">暂未提供</Tag>,
    },
    {
      label: "CPU",
      value: `${vm.cpuTotal} 核`,
    },
    {
      label: "内存",
      value: formatBytesAuto(vm.memTotal),
    },
  ];

  return (
    <GrayCard
      className={styles.vmCard}
      loading={false}
      style={{
        cursor: onClick ? "pointer" : "default",
        height: "100%",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
      }}
    >
      <div className={styles.cardContent} onClick={() => onClick?.(vm)}>
        {/* 头部：名称 + 平台图标 */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.name} title={vm.name}>
              {vm.name}
            </span>
          </div>
          <span className={styles.platformIcon}>
            <img
              src={getOSIcon(vm.osType)}
              alt={vm.osType || "系统图标"}
              onError={e => {
                (e.target as HTMLImageElement).src = OS_ICON_MAP.Other;
              }}
            />
          </span>
        </div>

        {/* 主体：左侧图片 + 右侧信息 */}
        <div className={styles.body}>
          {/* 左侧图片/图标 */}
          <div className={styles.imageWrapper}>
            <img src={getMonitorIcon()} alt={isRunning ? "运行中" : "已停止"} />
          </div>

          {/* 右侧信息列表 */}
          <div className={styles.infoList}>
            {infoItems.map((item, index) => (
              <div key={index} className={styles.infoItem}>
                <span className={styles.infoLabel}>{item.label}：</span>
                <span
                  className={styles.infoValue}
                  style={{
                    color: item.status
                      ? STATUS_COLORS[item.status] || STATUS_COLORS.default
                      : "#333",
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GrayCard>
  );
};

export default VMCard;
