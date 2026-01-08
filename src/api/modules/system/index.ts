/**
 * 系统服务相关 API
 */
import { get, post, put, del } from "@/api/request/index";
import type { ApiResponse } from "@/api/types";
import type {
  SystemInfo,
  DiagnosisLogFile,
  AutomaticSnapshotConfig,
} from "./types";

const URL = {
  systemInfo: "system/info",
  license: "system/license",
  desktopLicense: "system/desktop_license",
  diagnosisLogs: "system/diagnosis_logs",
  featureFlag: "system/feature_flag",
  cleanErrorOperation: "system/clean_err_operation",
} as const;

// ========== 系统信息 ==========

/**
 * 获取系统服务信息
 */
export const getSystemInfo = async (): Promise<ApiResponse<SystemInfo>> => {
  return get<SystemInfo>(URL.systemInfo);
};

/**
 * 修改系统信息
 */
export const updateSystemInfo = async (
  data: SystemInfo
): Promise<ApiResponse<null>> => {
  return put<null>(URL.systemInfo, data);
};

// ========== 诊断日志 ==========

/**
 * 获取诊断日志列表
 */
export const getDiagnosisLogs = async (): Promise<
  ApiResponse<DiagnosisLogFile[]>
> => {
  return get<DiagnosisLogFile[]>(URL.diagnosisLogs);
};

/**
 * 生成诊断日志
 */
export const createDiagnosisLog = async (): Promise<ApiResponse<null>> => {
  return post<null>(URL.diagnosisLogs);
};

/**
 * 下载诊断日志
 */
export const downloadDiagnosisLog = async (fileName: string): Promise<void> => {
  const { download } = await import("@/api/request/index");
  await download(
    `${URL.diagnosisLogs}/${fileName}/download`,
    fileName,
    undefined
  );
};

// ========== 自动快照 ==========

/**
 * 获取自动快照配置
 */
export const getAutomaticSnapshotConfig = async (): Promise<
  ApiResponse<AutomaticSnapshotConfig>
> => {
  return get<AutomaticSnapshotConfig>(URL.featureFlag);
};

/**
 * 修改自动快照配置
 */
export const updateAutomaticSnapshotConfig = async (
  data: AutomaticSnapshotConfig
): Promise<ApiResponse<null>> => {
  return post<null>(URL.featureFlag, data);
};

/**
 * 删除自动快照配置
 */
export const deleteAutomaticSnapshotConfig = async (
  flagName: string,
  data: Record<string, unknown>
): Promise<ApiResponse<null>> => {
  return del<null>(`${URL.featureFlag}/${flagName}`, data);
};

// ========== 异常任务 ==========

/**
 * 清除异常任务
 */
export const cleanErrorOperation = async (): Promise<ApiResponse<null>> => {
  return post<null>(URL.cleanErrorOperation);
};
