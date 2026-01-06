/**
 * 运维管理相关类型定义
 */

// 历史任务查询参数
export interface HistoryTaskParams {
  start_time: string | null;
  end_time: string | null;
  last_id: number | null;
  last_time: string | null;
}

// 当前任务项
export interface CurrentTaskItem {
  id: number;
  name: string;
  status: string;
  progress: number;
  created_at: string;
  [key: string]: unknown;
}

// 历史任务项
export interface HistoryTaskItem {
  id: number;
  name: string;
  status: string;
  created_at: string;
  finished_at?: string;
  [key: string]: unknown;
}

// 告警日志项
export interface AlarmLogItem {
  id: number;
  message: string;
  alarm_type: "license" | "storage" | "auto_snapshot" | string;
  created_at: string;
  [key: string]: unknown;
}

// 操作日志项
export interface OperationLogItem {
  id: number;
  name: string;
  operation_status: string;
  object: string;
  nickname: string;
  detail: string;
  created_at: string;
  [key: string]: unknown;
}
