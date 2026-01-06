/**
 * 存储管理相关 API
 */
import { get, post, put, del } from "@/api/request/index";
import type { ApiResponse } from "@/api/types";
import type {
  ExternalStorage,
  InternalStorage,
  DeleteStoragePayload,
  StorageMountPayload,
  StorageAlarmThreshold,
  ClusterEditList,
  PlatformConfig,
  SmbCifsPathParams,
  SmbCifsPathOption,
  StorageContentQuery,
  StorageContent,
} from "./types";

const URL = {
  outside: "/api/storages/outside",
  inside: "/api/storages/inside",
  mount: "/api/storages/outside/mount",
  unmount: "/api/storages/outside/unmount",
  alarmThreshold: "/api/storages/alarm_threshold",
  content: "/api/storages/content",
  clusters: "/api/clusters",
  smbCifsPath: "/api/storages/get_smb_cifs_path",
} as const;

// ========== 外挂存储管理 ==========

/**
 * 获取外挂存储列表
 */
export const getExternalStorageList = async (): Promise<
  ApiResponse<{ storages: ExternalStorage[] }>
> => {
  return get<{ storages: ExternalStorage[] }>(URL.outside);
};

/**
 * 获取外挂存储编辑列表（集群列表）
 */
export const getExternalStorageEditList = async (
  clusterId: string
): Promise<ApiResponse<ClusterEditList[]>> => {
  return get<ClusterEditList[]>(`/api/storages/outside/${clusterId}`);
};

/**
 * 添加外挂存储
 */
export const addExternalStorage = async (
  data: PlatformConfig
): Promise<ApiResponse<ExternalStorage>> => {
  return post<ExternalStorage>(URL.outside, data);
};

/**
 * 删除外挂存储
 */
export const deleteExternalStorage = async (
  data: DeleteStoragePayload
): Promise<ApiResponse<null>> => {
  return del<null>(URL.outside, data as unknown as Record<string, unknown>);
};

/**
 * 挂载存储
 */
export const mountStorage = async (
  data: StorageMountPayload
): Promise<ApiResponse<null>> => {
  return post<null>(URL.mount, data);
};

/**
 * 卸载存储
 */
export const unmountStorage = async (
  data: StorageMountPayload
): Promise<ApiResponse<null>> => {
  return post<null>(URL.unmount, data);
};

// ========== 内置存储管理 ==========

/**
 * 获取内置存储列表
 */
export const getInternalStorageList = async (): Promise<
  ApiResponse<{ cluster_storages: InternalStorage[] }>
> => {
  return get<{ cluster_storages: InternalStorage[] }>(URL.inside);
};

// ========== 存储设置 ==========

/**
 * 获取存储报警阈值设置
 */
export const getStorageAlarmThreshold = async (): Promise<
  ApiResponse<StorageAlarmThreshold>
> => {
  return get<StorageAlarmThreshold>(URL.alarmThreshold);
};

/**
 * 修改存储报警阈值设置
 */
export const updateStorageAlarmThreshold = async (
  data: StorageAlarmThreshold
): Promise<ApiResponse<null>> => {
  return put<null>(URL.alarmThreshold, data);
};

// ========== 存储内容查询 ==========

/**
 * 获取集群存储内容列表
 */
export const getStorageContent = async (
  data: StorageContentQuery
): Promise<ApiResponse<StorageContent[]>> => {
  return post<StorageContent[]>(URL.content, data);
};

// ========== 辅助接口 ==========

/**
 * 获取集群选择列表
 */
export const getClusterSelectList = async (): Promise<
  ApiResponse<unknown[]>
> => {
  return get<unknown[]>(URL.clusters);
};

/**
 * 获取 SMB/CIFS 路径选项
 */
export const getSmbCifsPathOptions = async (
  data: SmbCifsPathParams
): Promise<ApiResponse<SmbCifsPathOption[]>> => {
  return post<SmbCifsPathOption[]>(URL.smbCifsPath, data);
};
