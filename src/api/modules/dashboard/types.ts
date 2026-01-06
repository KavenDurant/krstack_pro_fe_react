/**
 * 仪表盘/监控相关类型定义
 */

// 头部硬件监控列表项
export interface HardwareMonitorItem {
  id: string;
  name: string;
  content: string;
  used: number;
  unused: number;
  total: number;
  unit: string;
}

// 云桌面统计
export interface CloudDesktopStats {
  cloud_desktop_total: number | null;
  cloud_desktop_running: number | null;
  cloud_desktop_stopped: number | null;
  cloud_desktop_other: number | null;
}

// 云主机统计
export interface CloudHostStats {
  vm_total: number | null;
  vm_running: number | null;
  vm_stopped: number | null;
  vm_other: number | null;
}

// 告警消息
export interface AlarmMessage {
  id: number;
  message: string;
  alarm_type: "license" | "storage" | "auto_snapshot";
  created_at: string;
}

// 操作日志
export interface OperationLog {
  id: number;
  name: string;
  operation_status: string;
  object: string;
  nickname: string;
  detail: string;
  created_at: string;
}

// CPU/内存使用率数据点
export interface MonitorDataPoint {
  time: string;
  value: number;
  [key: string]: unknown;
}

// 存储监控列表项
export interface StorageMonitorItem {
  storage_uid: string;
  storage_name: string;
  disk_total: number;
  disk_used: number;
  disk_left: number;
  usage_percent: number;
  [key: string]: unknown;
}

// 云桌面使用排行项
export interface CloudDesktopRankingItem {
  desktop_name: string;
  user_name: string;
  usage_time: number;
  [key: string]: unknown;
}

// 人员列表项
export interface PersonListItem {
  uuid: string;
  name: string;
  login_name: string;
  [key: string]: unknown;
}
