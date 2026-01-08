/*
 * @Author: KavenDurant luojiaxin888@gmail.com
 * @Date: 2025-12-17 10:59:36
 * @LastEditors: KavenDurant luojiaxin888@gmail.com
 * @LastEditTime: 2026-01-06 10:10:03
 * @FilePath: /krstack_pro_fe_react/src/api/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * API 统一导出入口
 */

// 导出请求方法
export {
  get,
  post,
  put,
  del,
  patch,
  upload,
  download,
  request,
} from "@/api/request/index";

// 导出通用类型
export type {
  ApiResponse,
  PaginatedResponse,
  RequestConfig,
} from "@/api/types";

// 导出配置
export { API_CONFIG, BUSINESS_CODE, TOKEN_KEY, API_PREFIX } from "@/api/config";

// 导出 API 模块
export * as authApi from "@/api/modules/auth/index";
export * as vmApi from "@/api/modules/vm/index";
export * as clusterApi from "@/api/modules/cluster/index";
export * as userApi from "@/api/modules/user/index";
export * as nodeApi from "@/api/modules/node/index";
export * as cloudDeskApi from "@/api/modules/cloudDesk/index";
export * as storageApi from "@/api/modules/storage/index";
export * as imageApi from "@/api/modules/image/index";
export * as dashboardApi from "@/api/modules/dashboard/index";
export * as operationsApi from "@/api/modules/operations/index";
export * as systemApi from "@/api/modules/system/index";
export * as licenseApi from "@/api/modules/license/index";

// 导出各模块类型
export type {
  LoginParams,
  LoginResponse,
  ChangePasswordParams,
  HistoryListParams,
  AlarmLog,
  UserInfo,
} from "@/api/modules/auth/types";
export type {
  User,
  UserListParams,
  CreateUserParams,
} from "@/api/modules/user/types";
export type { VM, VMStatus, AncestorNode } from "@/api/modules/vm/types";
export type {
  Cluster,
  ClusterDetail,
  ClusterStatus,
  AddClusterParams,
  UpdateClusterParams,
  ContentQuery,
  PhysicalNode,
} from "@/api/modules/cluster/types";
export type {
  Node,
  NodeStatus,
  NodeDetail,
  VMInfo,
  NetworkInterface,
  USBDevice,
  GPUDevice,
  StorageInfo,
  NetworkSetting,
  PerformanceData,
} from "@/api/modules/node/types";
export type {
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
} from "@/api/modules/cloudDesk/types";
export type {
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
} from "@/api/modules/storage/types";
export type {
  SystemImage,
  TemplateImage,
  DeleteImageParams,
  TemplateImageDetail,
  TemplateDescriptionParams,
  TemplateDescription,
} from "@/api/modules/image/types";
export type {
  HardwareMonitorItem,
  CloudDesktopStats,
  CloudHostStats,
  AlarmMessage,
  OperationLog,
  MonitorDataPoint,
  StorageMonitorItem,
  CloudDesktopRankingItem,
  PersonListItem,
} from "@/api/modules/dashboard/types";
export type {
  HistoryTaskParams,
  CurrentTaskItem,
  HistoryTaskItem,
  AlarmLogItem,
  OperationLogItem,
} from "@/api/modules/operations/types";
export type {
  SystemInfo,
  DiagnosisLogFile,
  AutomaticSnapshotConfig,
} from "@/api/modules/system/types";
export type {
  PlatformLicense,
  DesktopLicense,
} from "@/api/modules/license/types";
