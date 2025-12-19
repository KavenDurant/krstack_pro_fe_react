/**
 * 物理机相关类型定义
 */

/**
 * 物理机状态
 */
export type NodeStatus = "online" | "offline" | "rebooting" | "shutting_down";

/**
 * 后端返回的物理机数据格式
 */
export interface NodeBackend {
  cluster_id: number;
  cluster_name: string;
  ip: string;
  name: string;
  node_uid: string;
  status: string;
  platform_type?: string;
  cpu_total?: number;
  mem_total?: number;
  disk_used?: number;
  disk_total?: number;
  vm_count?: number;
  uptime?: string;
}

/**
 * 前端使用的物理机数据格式
 */
export interface Node {
  key: string;
  uid: string;
  name: string;
  ip: string;
  status: NodeStatus;
  clusterId: number;
  clusterName: string;
  cpuTotal?: number;
  memTotal?: number;
  diskUsed?: number;
  diskTotal?: number;
  vmCount?: number;
  uptime?: string;
}

/**
 * 物理机列表响应
 */
export interface NodeListResponse {
  nodes: NodeBackend[];
}

/**
 * 物理机详情（后端格式）
 */
export interface NodeDetailBackend {
  node_uid: string;
  name: string;
  ip: string;
  status: string;
  cluster_id: number;
  cluster_name: string;
  cpu_total: number;
  mem_total: number;
  disk_used: number;
  disk_total: number;
  vm_count: number;
  uptime: string;
}

/**
 * 物理机详情（前端格式）
 */
export interface NodeDetail {
  uid: string;
  name: string;
  ip: string;
  status: NodeStatus;
  clusterId: number;
  clusterName: string;
  cpuTotal: number;
  memTotal: number;
  diskUsed: number;
  diskTotal: number;
  vmCount: number;
  uptime: string;
}

/**
 * 虚拟机信息
 */
export interface VMInfo {
  nodeUid: string;
  id: string;
  name: string;
  vmId: number;
  status: "Running" | "Stopped";
  clusterId: number;
  nodeName: string;
  cpuTotal: number;
  memTotal: number;
  ip: string;
  osType: string;
}

/**
 * 虚拟机列表响应
 */
export interface VMListResponse {
  vms: {
    node_uid: string;
    id: string;
    name: string;
    vm_id: number;
    status: string;
    cluster_id: number;
    node_name: string;
    cpu_total: number;
    mem_total: number;
    ip: string;
    os_type: string;
  }[];
}

/**
 * 网络接口信息
 */
export interface NetworkInterface {
  uid: string;
  name: string;
  type: string;
  status: string;
  ip: string;
  ports: string;
}

/**
 * USB 设备信息
 */
export interface USBDevice {
  uid: string;
  id: string;
  name: string;
  host: string;
  manufacturer: string;
  product: string;
  status: string;
}

/**
 * GPU 设备信息
 */
export interface GPUDevice {
  id: string;
  status: string;
  deviceName: string;
  manufacturer: string;
  vmUse: {
    name: string;
    vmUid: string;
    gpuId: string;
    gpuName: string;
    status: string;
  }[];
}

/**
 * 存储信息
 */
export interface StorageInfo {
  name: string;
  storageUid: string;
  diskTotal: number;
  diskUsed: number;
  diskLeft: number;
  type: string;
  status: string;
  shared: boolean;
  clusterId?: number;
}

/**
 * 网络设置信息
 */
export interface NetworkSetting {
  name: string;
  type: string;
  active: boolean;
  autostart: boolean | null;
  vlanAware: boolean | null;
  port: string | null;
  bondMode: string | null;
  cidr: string | null;
  gateway: string | null;
  comments: string | null;
}

/**
 * 性能监控数据
 */
export interface PerformanceData {
  timestamp: number;
  value: number;
}
