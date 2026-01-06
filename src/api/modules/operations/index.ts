/**
 * 运维管理相关 API
 */
import { get, post } from "@/api/request/index";
import type { ApiResponse } from "@/api/types";
import type {
  HistoryTaskParams,
  CurrentTaskItem,
  HistoryTaskItem,
  AlarmLogItem,
  OperationLogItem,
} from "./types";

const URL = {
  currentTask: "maintenance/operation_log/current",
  historyTask: "maintenance/operation_log/historical",
  alarmLog: "maintenance/alarm_log/historical",
} as const;

// ========== 任务管理 ==========

/**
 * 获取任务队列（当前任务）
 */
export const getTaskQueue = async (): Promise<
  ApiResponse<CurrentTaskItem[]>
> => {
  return get<CurrentTaskItem[]>(URL.currentTask);
};

/**
 * 获取历史任务
 */
export const getHistoryTask = async (): Promise<
  ApiResponse<HistoryTaskItem[]>
> => {
  return get<HistoryTaskItem[]>(URL.historyTask);
};

/**
 * 获取历史任务（带时间筛选）
 */
export const getHistoryTaskWithTime = async (
  data: HistoryTaskParams
): Promise<ApiResponse<HistoryTaskItem[]>> => {
  return post<HistoryTaskItem[]>(URL.historyTask, data);
};

// ========== 告警日志 ==========

/**
 * 获取告警日志
 */
export const getAlarmLog = async (): Promise<ApiResponse<AlarmLogItem[]>> => {
  return get<AlarmLogItem[]>(URL.alarmLog);
};

/**
 * 获取告警日志（带时间筛选）
 */
export const getAlarmLogWithTime = async (
  data: HistoryTaskParams
): Promise<ApiResponse<AlarmLogItem[]>> => {
  return post<AlarmLogItem[]>(URL.alarmLog, data);
};

// ========== 操作日志 ==========

/**
 * 获取操作日志
 */
export const getOperationLog = async (): Promise<
  ApiResponse<OperationLogItem[]>
> => {
  return get<OperationLogItem[]>(URL.historyTask);
};

/**
 * 获取操作日志（带时间筛选）
 */
export const getOperationLogWithTime = async (
  data: HistoryTaskParams
): Promise<ApiResponse<OperationLogItem[]>> => {
  return post<OperationLogItem[]>(URL.historyTask, data);
};
