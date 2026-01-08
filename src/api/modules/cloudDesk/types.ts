/**
 * 云桌面相关类型定义
 */

// 云桌面响应类型（与后端保持一致）
export interface CloudDesk {
  user_name: string; // 用户姓名
  user_login_name: string; // 用户登录名
  session_status: "disconnected" | "active" | string; // 会话状态
  status: string; // 用户状态
  vm_uid: string; // 虚拟机唯一标识符
  vm_name: string; // 虚拟机名称
  node_name: string; // 节点名称
  cluster_name: string; // 集群名称
  ip: string; // IP 地址
  desktop_type: string; // 桌面类型
  uuid: string; // 用户的唯一标识符
  node_uid?: string; // 节点 UID
  platform_type?: string; // 平台类型
  cluster_id?: string; // 集群 ID
}

// 云桌面列表响应（后端返回格式）
export interface CloudDeskListResponse {
  desktops: CloudDesk[];
  ancestor_trees: AncestorTree[];
}

// 树形节点类型
export interface AncestorTree {
  label: string;
  value: number | string;
  key?: number | string;
  children?: AncestorTree[];
}

// 操作参数
export interface OperationParams {
  cluster_id: string;
  node_name: string;
  vm_id?: string;
  vm_uid?: string;
}

// 删除云桌面参数
export interface DeleteCloudDeskParams {
  delete_desktops: OperationParams[];
  delete_vm_model: boolean;
}

// 解绑用户参数
export interface DetachUserParams {
  desktop: string; // 代表云桌面 ID
}

// 关联用户参数
export interface RelatedUserParams {
  user: string;
  desktop: string;
}

// 导入桌面响应
export interface ImportDesktop {
  vm_uid: string;
  vm_name: string;
  cluster_name: string;
  node_name: string;
  ip: string;
  status: string;
  platform_type: string;
  cluster_id: string;
}

// 桌面列表项
export interface DesktopListItem {
  user_name: string;
  user_login_name: string;
  session_status: string;
  status: string;
  vm_uid: string;
  uuid: string;
  vm_name: string;
  node_name: string;
  cluster_name: string;
  ip: string;
  desktop_type: string;
  node_uid: string;
  platform_type: string;
}

// 同步用户
export interface SynchronousUser {
  uuid: string; // 用户的唯一标识符
  name: string; // 用户名称
  login_name: string; // 用户登录名
}

// 导入列表响应
export interface ImportListResponse {
  import_list: ImportCloudDeskType[];
}

// 可导入的云桌面类型
export interface ImportCloudDeskType {
  id: number;
  name: string;
  cluster_id: number;
  node_name: string;
}

// USB 策略
export interface UsbPolicy {
  usb_storage: boolean;
  usb_storage_model: number;
  usb_printer: boolean;
  usb_smart_card: boolean;
  usb_audio: boolean;
  usb_video: boolean;
  usb_other: boolean;
}

// USB 策略根对象
export interface UsbPolicyRoot {
  covered: boolean;
  usb_policy: UsbPolicy;
}

// 数据访问策略
export interface DataAccessPolicy {
  file_drag: boolean;
  cut_plate: boolean;
  copy_permissions: number;
}

// 数据访问策略根对象
export interface DataAccessPolicyRoot {
  covered: boolean;
  data_access_policy: DataAccessPolicy;
}

// 传输协议策略
export interface TransportProtocolPolicy {
  normal_desktop_graphics_quality: number;
  gpu_desktop_graphics_quality: number;
  audio_quality: number;
  camera_quality: number;
  camera_model: number;
}

// 传输协议策略根对象
export interface TransportProtocolPolicyRoot {
  covered: boolean;
  transport_protocol_policy: TransportProtocolPolicy;
}

// 系统服务信息
export interface SystemServerInfo {
  [key: string]: unknown;
}
