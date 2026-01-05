/**
 * 虚拟机相关 API
 */
import { get, post, put, del } from "@/api/request/index";
import type { ApiResponse } from "@/api/types";
import type {
  VM,
  VMListParams,
  VMListResponse,
  CreateVMParams,
  UpdateVMParams,
} from "./types";

const URL = {
  list: "vms",
  detail: "vms",
  start: "vms",
  stop: "vms",
  reboot: "vms",
} as const;

/**
 * 获取虚拟机列表
 */
export const getVMList = async (
  params: VMListParams
): Promise<ApiResponse<VMListResponse>> => {
  return get<VMListResponse>(URL.list, params as Record<string, unknown>);
};

/**
 * 获取虚拟机详情
 */
export const getVMDetail = async (id: string): Promise<ApiResponse<VM>> => {
  return get<VM>(`${URL.detail}/${id}`);
};

/**
 * 创建虚拟机
 */
export const createVM = async (
  data: CreateVMParams
): Promise<ApiResponse<VM>> => {
  return post<VM>(URL.list, data);
};

/**
 * 更新虚拟机
 */
export const updateVM = async (
  id: string,
  data: UpdateVMParams
): Promise<ApiResponse<VM>> => {
  return put<VM>(`${URL.detail}/${id}`, data);
};

/**
 * 删除虚拟机
 */
export const deleteVM = async (id: string): Promise<ApiResponse<null>> => {
  return del<null>(`${URL.detail}/${id}`);
};

/**
 * 启动虚拟机
 */
export const startVM = async (id: string): Promise<ApiResponse<null>> => {
  return post<null>(`${URL.start}/${id}/start`);
};

/**
 * 停止虚拟机
 */
export const stopVM = async (id: string): Promise<ApiResponse<null>> => {
  return post<null>(`${URL.stop}/${id}/stop`);
};

/**
 * 重启虚拟机
 */
export const rebootVM = async (id: string): Promise<ApiResponse<null>> => {
  return post<null>(`${URL.reboot}/${id}/reboot`);
};
