/**
 * 云桌面相关 API
 */
import { get, post, put } from "@/api/request/index";
import type { ApiResponse } from "@/api/types";
import type {
  CloudDesk,
  DesktopListItem,
  OperationParams,
  DeleteCloudDeskParams,
  DetachUserParams,
  RelatedUserParams,
  SynchronousUser,
  ImportListResponse,
  ImportCloudDeskType,
  UsbPolicyRoot,
  DataAccessPolicyRoot,
  TransportProtocolPolicyRoot,
  SystemServerInfo,
} from "./types";

const URL = {
  list: "desktops",
  start: "vms/start",
  stop: "vms/stop",
  reboot: "vms/reboot",
  delete: "desktops/delete",
  users: "desktops/users",
  synchronize: "desktops/user_synchronize",
  incrementSynchronize: "desktops/user_increment",
  attach: "desktops/user_attach",
  detach: "desktops/user_detach",
  importList: "desktops/can_be_imported_desktops",
  import: "desktops/import_desktop_to_vms",
  systemInfo: "system/info",
} as const;

// ========== 云桌面基础操作 ==========

/**
 * 获取云桌面列表
 */
export const getCloudDeskList = async (): Promise<
  ApiResponse<DesktopListItem[]>
> => {
  return get<DesktopListItem[]>(URL.list);
};

/**
 * 开机云桌面
 */
export const startCloudDeskList = async (
  data: OperationParams[]
): Promise<ApiResponse<null>> => {
  return post<null>(URL.start, data);
};

/**
 * 关机云桌面
 */
export const stopCloudDeskList = async (
  data: OperationParams[]
): Promise<ApiResponse<null>> => {
  return post<null>(URL.stop, data);
};

/**
 * 重启云桌面
 */
export const rebootCloudDeskList = async (
  data: OperationParams[]
): Promise<ApiResponse<null>> => {
  return post<null>(URL.reboot, data);
};

/**
 * 删除云桌面
 */
export const deleteCloudDeskList = async (
  data: DeleteCloudDeskParams
): Promise<ApiResponse<null>> => {
  return post<null>(URL.delete, data);
};

// ========== 用户关联管理 ==========

/**
 * 获取关联用户下拉列表
 */
export const getCloudDeskUserSelect = async (): Promise<
  ApiResponse<SynchronousUser[]>
> => {
  return get<SynchronousUser[]>(URL.users);
};

/**
 * 同步用户（全量）
 */
export const synchronizeUser = async (): Promise<ApiResponse<null>> => {
  return get<null>(URL.synchronize);
};

/**
 * 同步用户（增量）
 */
export const incrementSynchronizeUser = async (): Promise<
  ApiResponse<null>
> => {
  return get<null>(URL.incrementSynchronize);
};

/**
 * 关联用户
 */
export const relatedUser = async (
  data: RelatedUserParams
): Promise<ApiResponse<null>> => {
  return post<null>(URL.attach, data);
};

/**
 * 解绑用户
 */
export const detachUser = async (
  data: DetachUserParams
): Promise<ApiResponse<null>> => {
  return post<null>(URL.detach, data);
};

// ========== 桌面策略 - USB ==========

/**
 * 获取 USB 策略（单个桌面）
 */
export const getUsbPolicy = async (
  uuid: string
): Promise<ApiResponse<UsbPolicyRoot>> => {
  return get<UsbPolicyRoot>(`desktops/policy/usb/desktop/${uuid}`);
};

/**
 * 修改 USB 策略（单个桌面）
 */
export const updateUsbPolicy = async (
  uuid: string,
  data: UsbPolicyRoot
): Promise<ApiResponse<null>> => {
  return put<null>(`desktops/policy/usb/desktop/${uuid}`, data);
};

/**
 * 获取全局 USB 策略
 */
export const getGlobalUsbPolicy = async (): Promise<
  ApiResponse<UsbPolicyRoot>
> => {
  return get<UsbPolicyRoot>("desktops/policy/usb/global_desktop");
};

/**
 * 修改全局 USB 策略
 */
export const updateGlobalUsbPolicy = async (
  data: UsbPolicyRoot
): Promise<ApiResponse<null>> => {
  return put<null>("desktops/policy/usb/global_desktop", data);
};

// ========== 桌面策略 - 数据访问 ==========

/**
 * 获取数据访问策略（单个桌面）
 */
export const getDataAccessPolicy = async (
  uuid: string
): Promise<ApiResponse<DataAccessPolicyRoot>> => {
  return get<DataAccessPolicyRoot>(
    `desktops/policy/data_access/desktop/${uuid}`
  );
};

/**
 * 修改数据访问策略（单个桌面）
 */
export const updateDataAccessPolicy = async (
  uuid: string,
  data: DataAccessPolicyRoot
): Promise<ApiResponse<null>> => {
  return put<null>(`desktops/policy/data_access/desktop/${uuid}`, data);
};

/**
 * 获取全局数据访问策略
 */
export const getGlobalDataAccessPolicy = async (): Promise<
  ApiResponse<DataAccessPolicyRoot>
> => {
  return get<DataAccessPolicyRoot>(
    "desktops/policy/data_access/global_desktop"
  );
};

/**
 * 修改全局数据访问策略
 */
export const updateGlobalDataAccessPolicy = async (
  data: DataAccessPolicyRoot
): Promise<ApiResponse<null>> => {
  return put<null>("desktops/policy/data_access/global_desktop", data);
};

// ========== 桌面策略 - 传输协议 ==========

/**
 * 获取传输协议策略（单个桌面）
 */
export const getTransportProtocolPolicy = async (
  uuid: string
): Promise<ApiResponse<TransportProtocolPolicyRoot>> => {
  return get<TransportProtocolPolicyRoot>(
    `desktops/policy/transport_protocol/desktop/${uuid}`
  );
};

/**
 * 修改传输协议策略（单个桌面）
 */
export const updateTransportProtocolPolicy = async (
  uuid: string,
  data: TransportProtocolPolicyRoot
): Promise<ApiResponse<null>> => {
  return put<null>(`desktops/policy/transport_protocol/desktop/${uuid}`, data);
};

/**
 * 获取全局传输协议策略
 */
export const getGlobalTransportProtocolPolicy = async (): Promise<
  ApiResponse<TransportProtocolPolicyRoot>
> => {
  return get<TransportProtocolPolicyRoot>(
    "desktops/policy/transport_protocol/global_desktop"
  );
};

/**
 * 修改全局传输协议策略
 */
export const updateGlobalTransportProtocolPolicy = async (
  data: TransportProtocolPolicyRoot
): Promise<ApiResponse<null>> => {
  return put<null>("desktops/policy/transport_protocol/global_desktop", data);
};

// ========== 系统服务 ==========

/**
 * 获取云桌面服务信息
 */
export const getCloudDeskServer = async (): Promise<
  ApiResponse<SystemServerInfo>
> => {
  return get<SystemServerInfo>(URL.systemInfo);
};

// ========== 导入云桌面 ==========

/**
 * 获取可导入的云桌面列表
 */
export const getImportCloudList = async (): Promise<
  ApiResponse<ImportCloudDeskType[]>
> => {
  return get<ImportCloudDeskType[]>(URL.importList);
};

/**
 * 导入云桌面
 */
export const importCloudDesk = async (
  data: ImportListResponse
): Promise<ApiResponse<null>> => {
  return post<null>(URL.import, data);
};
