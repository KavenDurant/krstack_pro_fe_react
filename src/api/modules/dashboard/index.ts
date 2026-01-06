/**
 * 仪表盘/监控相关 API
 */
import { get, post } from "@/api/request/index";
import type { ApiResponse } from "@/api/types";
import type {
  HardwareMonitorItem,
  CloudDesktopStats,
  CloudHostStats,
  AlarmMessage,
  OperationLog,
  MonitorDataPoint,
  StorageMonitorItem,
  CloudDesktopRankingItem,
  PersonListItem,
} from "./types";

const URL = {
  hardwareMonitor: "dashboard/cluster_hardware_monitor",
  vmMonitor: "dashboard/cluster_vm_monitor",
  cloudDesktopMonitor: "dashboard/cluster_cloud_desktop_monitor",
  cpuMonitor: "dashboard/cluster_cpu_monitor",
  memMonitor: "dashboard/cluster_mem_monitor",
  storagesMonitor: "dashboard/cluster_storages_monitor",
  cloudDesktopRanking: "dashboard/cloud_desktop_ranking",
  alarmLog: "maintenance/alarm_log/alarm_carousels",
  systemLog: "maintenance/system_log/historical",
  users: "users",
} as const;

// ========== 集群监控 ==========

/**
 * 获取集群硬件监控（前三个图表）
 */
export const getHardwareMonitor = async (
  clusterUid: string
): Promise<ApiResponse<HardwareMonitorItem[]>> => {
  return get<HardwareMonitorItem[]>(`${URL.hardwareMonitor}/${clusterUid}`);
};

/**
 * 获取云主机监控
 */
export const getCloudHostMonitor = async (
  clusterUid: string
): Promise<ApiResponse<CloudHostStats>> => {
  return get<CloudHostStats>(`${URL.vmMonitor}/${clusterUid}`);
};

/**
 * 获取云桌面监控
 */
export const getCloudDesktopMonitor = async (
  clusterUid: string
): Promise<ApiResponse<CloudDesktopStats>> => {
  return get<CloudDesktopStats>(`${URL.cloudDesktopMonitor}/${clusterUid}`);
};

/**
 * 获取 CPU 使用率
 * @param clusterUid - 集群 UID
 * @param timeSpan - 时间跨度，例如 "24" 表示 24 小时
 */
export const getCpuUsage = async (
  clusterUid: string,
  timeSpan: string
): Promise<ApiResponse<MonitorDataPoint[]>> => {
  return get<MonitorDataPoint[]>(
    `${URL.cpuMonitor}/${clusterUid}?time_span=${timeSpan}`
  );
};

/**
 * 获取内存使用率
 * @param clusterUid - 集群 UID
 * @param timeSpan - 时间跨度，例如 "24" 表示 24 小时
 */
export const getMemoryUsage = async (
  clusterUid: string,
  timeSpan: string
): Promise<ApiResponse<MonitorDataPoint[]>> => {
  return get<MonitorDataPoint[]>(
    `${URL.memMonitor}/${clusterUid}?time_span=${timeSpan}`
  );
};

/**
 * 获取存储列表监控
 */
export const getStorageMonitorList = async (
  clusterUid: string
): Promise<ApiResponse<StorageMonitorItem[]>> => {
  return get<StorageMonitorItem[]>(`${URL.storagesMonitor}/${clusterUid}`);
};

// ========== 云桌面排行 ==========

/**
 * 获取云桌面使用排行
 */
export const getCloudDesktopRanking = async (): Promise<
  ApiResponse<CloudDesktopRankingItem[]>
> => {
  return get<CloudDesktopRankingItem[]>(URL.cloudDesktopRanking);
};

// ========== 告警和日志 ==========

/**
 * 获取告警信息
 */
export const getAlarmLog = async (): Promise<ApiResponse<AlarmMessage[]>> => {
  return get<AlarmMessage[]>(URL.alarmLog);
};

/**
 * 获取操作日志
 */
export const getOperationLog = async (): Promise<
  ApiResponse<OperationLog[]>
> => {
  return get<OperationLog[]>(URL.systemLog);
};

/**
 * 获取操作日志（带时间筛选）
 */
export const getOperationLogWithTime = async (data: {
  start_time: string | null;
  end_time: string | null;
  last_id: number | null;
  last_time: string | null;
}): Promise<ApiResponse<OperationLog[]>> => {
  return post<OperationLog[]>(URL.systemLog, data);
};

/**
 * 获取人员列表
 */
export const getPersonList = async (): Promise<
  ApiResponse<PersonListItem[]>
> => {
  return get<PersonListItem[]>(URL.users);
};

/**
 * 获取走马灯（告警信息轮播）
 */
export const getMarqueeList = async (): Promise<
  ApiResponse<AlarmMessage[]>
> => {
  return get<AlarmMessage[]>(URL.alarmLog);
};
