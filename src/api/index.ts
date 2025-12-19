/*
 * @Author: KavenDurant luojiaxin888@gmail.com
 * @Date: 2025-12-17 10:59:36
 * @LastEditors: KavenDurant luojiaxin888@gmail.com
 * @LastEditTime: 2025-12-18 15:03:06
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
} from "./request/index";

// 导出通用类型
export type { ApiResponse, PaginatedResponse, RequestConfig } from "./types";

// 导出配置
export { API_CONFIG, BUSINESS_CODE, TOKEN_KEY, API_PREFIX } from "./config";

// 导出 API 模块
export * as authApi from "./modules/auth/index";
export * as vmApi from "./modules/vm/index";
export * as clusterApi from "./modules/cluster/index";
export * as userApi from "./modules/user/index";
export * as nodeApi from "./modules/node/index";

// 导出各模块类型
export type {
  LoginParams,
  LoginResponse,
  ChangePasswordParams,
  HistoryListParams,
  AlarmLog,
  UserInfo,
} from "./modules/auth/types";
export type {
  User,
  UserListParams,
  CreateUserParams,
} from "./modules/user/types";
export type {
  VM,
  VMStatus,
  VMListParams,
  CreateVMParams,
  AncestorNode,
} from "./modules/vm/types";
export type {
  Cluster,
  ClusterDetail,
  ClusterStatus,
  AddClusterParams,
  UpdateClusterParams,
  ContentQuery,
  PhysicalNode,
} from "./modules/cluster/types";
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
} from "./modules/node/types";
