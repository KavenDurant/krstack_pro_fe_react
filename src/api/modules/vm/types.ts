/**
 * 虚拟机相关类型定义
 */

// 虚拟机状态
export type VMStatus =
  | "running"
  | "stopped"
  | "offline"
  | "paused"
  | "suspended";

// 虚拟机信息
export interface VM {
  lock: string | null;
  name: string;
  id: string;
  vm_uid: string;
  node_uid: string;
  cluster_uid: string;
  platform_type: string;
  cluster_name: string;
  cluster_id: number;
  node_name: string;
  ip: string;
  status: VMStatus;
  underway: string | null;
  cpu_total: number;
  mem_total: number;
  created_at: string;
  tags: string[];
}

// 虚拟机列表查询参数
export interface VMListParams {
  page?: number;
  pageSize?: number;
  name?: string;
  status?: string;
  clusterId?: number;
  nodeId?: string;
}

// 虚拟机列表响应
export interface VMListResponse {
  list: VM[];
  total: number;
}

// 创建虚拟机参数
export interface CreateVMParams {
  name: string;
  clusterId: number;
  nodeId: string;
  cpuTotal: number;
  memTotal: number;
  diskSize: number;
}

// 更新虚拟机参数
export interface UpdateVMParams {
  name?: string;
  cpuTotal?: number;
  memTotal?: number;
}

// 祖先节点（集群树结构）
export interface AncestorNode {
  value: number | string;
  label: string;
  children?: AncestorNode[];
}

// 虚拟机统计信息
export interface VMStats {
  total: number;
  running: number;
  stopped: number;
  offline: number;
}

// ========== 批量操作相关类型 ==========

// 基础虚拟机信息（用于批量操作）
export interface BaseVM {
  cluster_id: number;
  node_name: string;
  vm_id: number;
}

// 虚拟机数组（用于批量操作）
export interface VMItem extends BaseVM {
  name: string;
  id: string;
  cluster_name: string;
  ip: string | null;
  status: string;
  underway: string | null;
  cpu_total: number;
  mem_total: number;
  created_at: string;
}

export type VMArray = VMItem[];

// 虚拟机启动载荷
export interface VmStartPayload {
  vm_uid: string;
}

// ========== 虚拟机规格相关类型 ==========

// 虚拟机规格类型
export interface VmSpecType {
  id?: number;
  name: string;
  cpu: number;
  mem: number;
  disk: number;
  describe: string;
}

// 虚拟机规格响应
export interface VmSpecTypeResponse {
  spec_list: VmSpecType[];
}

// 删除规格响应
export interface DeleteVmSpecResponse {
  success: number[];
  failed: number[];
}

// ========== 虚拟机创建相关类型 ==========

// 系统镜像创建参数
export interface VmSystemCreateParams {
  cluster_uid: string;
  node_uid: string;
  image_uid: string;
  storage_uid: string;
  vm_name: string;
  vm_num: number;
  cpu: number;
  mem: number;
  disk: number;
}

// 模板镜像创建参数
export interface VmTemplateCreateParams {
  cluster_uid: string;
  node_uid: string;
  image_uid: string;
  vm_name: string;
  vm_num: number;
}

// ========== 虚拟机详情相关类型 ==========

// 虚拟机详情基本信息
export interface VMDetailBaseInfo {
  [key: string]: unknown;
}

// ========== 虚拟机配置修改相关类型 ==========

// 修改虚拟机名称参数
export interface UpdateVMNameParams {
  vm_name: string;
}

// 修改 CPU 参数
export interface UpdateVMCPUParams {
  cpu_num: number;
}

// 修改内存参数
export interface UpdateVMMemParams {
  mem_num: number;
}

// 修改开机自启动参数
export interface UpdateVMSelfStartParams {
  onboot: boolean;
}

// ========== 网络相关类型 ==========

// 网络列表项
export interface NetworkListItem {
  net_uid: string;
  name: string;
  bridge: string;
  mac: string;
  status: string;
}

// 更新网络数据
export interface UpdateNetworkData {
  vm_network_uid: string;
  mac: string;
}

// 网络配置响应
export interface NetworkConfigResponse {
  network: NetworkItem[];
  ipconfig_status: boolean;
}

// 网络接口项
export interface NetworkItem {
  net_uid: string;
  ip: string;
  netmask: string;
  gateway: string;
  net_status: string;
}

// IP 配置请求
export interface IpConfigRequest {
  vm_network_uid: string;
  ip: string;
  netmask: string;
  gateway: string;
}

// ========== USB 相关类型 ==========

// USB 设备列表项
export interface USBDeviceItem {
  [key: string]: unknown;
}

// ========== GPU 相关类型 ==========

// GPU 设备列表项
export interface GPUDeviceItem {
  uid: string;
  id: string;
  status: string;
  device_name: string;
  manufacturer: string;
  vm_use: GPUVMUse[];
}

// GPU 虚拟机使用信息
export interface GPUVMUse {
  name: string;
  vm_uid: string;
  gpu_id: string;
  gpu_uid: string;
  gpu_name: string;
  status: string;
}

// ========== 光驱相关类型 ==========

// 光驱列表项
export interface CDRomItem {
  cdrom_uid: string;
  cdrom_name: string;
  storage: string;
  image_name: string;
  size: number;
  status: "normal" | "error" | string;
}

// 挂载光驱参数
export interface MountCDRomParams {
  image_uid: string;
}

// ========== 磁盘相关类型 ==========

// 磁盘列表项
export interface DiskItem {
  [key: string]: unknown;
}

// 创建云硬盘参数
export interface CreateCloudDiskParams {
  size: string;
  vm_disk_uid?: string;
}

// 卸载磁盘参数
export interface UnmountDiskParams {
  vm_disk_uid: string;
}

// 迁移磁盘参数
export interface MigrateDiskParams {
  storage_uid: string;
  vm_disk_uid: string;
}

// 扩容磁盘参数
export interface ResizeDiskParams {
  size: string;
  vm_disk_uid: string;
}

// ========== 控制台相关类型 ==========

// 控制台地址响应
export interface ConsoleAddress {
  url: string;
  [key: string]: unknown;
}

// ========== 备份相关类型 ==========

// 备份列表项
export interface BackupItem {
  backup_uid: string;
  vm_uid: string;
  name: string;
  size: number;
  created_at: string;
  remark?: string;
  [key: string]: unknown;
}

// 创建备份参数
export interface CreateBackupParams {
  storage_uid: string;
}

// 备份备注参数
export interface BackupRemarkParams {
  remark: string;
}

// ========== 快照相关类型 ==========

// 快照列表项
export interface SnapshotItem {
  snapshot_uid: string;
  vm_uid: string;
  name: string;
  size: number;
  created_at: string;
  description?: string;
  [key: string]: unknown;
}

// 快照备注参数
export interface SnapshotRemarkParams {
  description: string;
}

// 快照策略配置
export interface ExecutionPlanConfig {
  enable: boolean;
  execution_plan: string;
  retention_time: number | null;
  retention_num: number | null;
}

// 快照层级项
export interface SnapshotHierarchyItem {
  [key: string]: unknown;
}

// ========== 性能监控相关类型 ==========

// 监控时间范围
export type MonitorTimeFrame = "hour" | "day" | "week" | "month";

// 监控数据类型
export type MonitorDataType = "cpu" | "mem" | "net" | "disk";

// 性能监控数据点
export interface PerformanceDataPoint {
  time: string;
  value: number;
  [key: string]: unknown;
}

// ========== 标签相关类型 ==========

// 标签
export interface VMTag {
  tag_id: number;
  tag_name: string;
  tag_type: string;
}

// 标签数据
export interface TagData {
  tag_ids: number[];
}

// 创建标签参数
export interface CreateTagParams {
  tag_name: string;
}

// ========== 引导项相关类型 ==========

// 设置引导项参数
export interface SetBootOrderParams {
  device_list: string[];
}

// 引导项响应
export interface BootOrderResponse {
  device_list: string[];
  [key: string]: unknown;
}

// ========== 资源分配相关类型 ==========

// 资源分配信息
export interface ResourceDistribution {
  [key: string]: unknown;
}

// ========== MAC 地址相关类型 ==========

// MAC 地址响应
export interface MacAddressResponse {
  mac: string;
}
