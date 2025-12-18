/**
 * 集群相关类型定义
 */

// 集群状态
export type ClusterStatus = "online" | "offline" | "syncing" | "error";

// 后端返回的集群数据结构
export interface ClusterBackend {
  cluster_id: number;
  cluster_uid: string;
  name: string;
  status: ClusterStatus;
  nodes_num: number;
  platform_type: string;
  ip: string;
  vt_type: string;
  created_at: string;
}

// 前端使用的集群信息
export interface Cluster {
  id: string;
  uid: string;
  name: string;
  status: ClusterStatus;
  nodesNum: number;
  platformType: string;
  ip: string;
  vtType: string;
  createdAt: string;
}

// 后端返回的集群详情数据结构
export interface ClusterDetailBackend {
  cluster_uid: string;
  resource_name: string;
  cpu_used: number;
  cpu_total: number;
  mem_used: number;
  mem_total: number;
  disk_used: number;
  disk_total: number;
  vt_type: string;
  created_at: string;
}

// 前端使用的集群详情
export interface ClusterDetail {
  uid: string;
  name: string;
  cpuUsed: number;
  cpuTotal: number;
  memUsed: number;
  memTotal: number;
  diskUsed: number;
  diskTotal: number;
  vtType: string;
  createdAt: string;
}

// 集群列表响应
export interface ClusterListResponse {
  resources: ClusterBackend[];
}

// 添加集群参数
export interface AddClusterParams {
  name: string;
  ip: string;
  platform_type: string;
  vt_type: string;
  username?: string;
  password?: string;
}

// 更新集群参数
export interface UpdateClusterParams {
  name?: string;
  ip?: string;
  platform_type?: string;
  vt_type?: string;
  username?: string;
  password?: string;
}

// 存储内容查询参数
export interface ContentQuery {
  clusterId: string;
  nodeId?: string;
  storage?: string;
}

// 存储内容
export interface StorageContent {
  volid: string;
  content: string;
  format: string;
  size: number;
  used: number;
}

// 后端返回的物理机信息
export interface PhysicalNodeBackend {
  name: string;
  ip: string;
  status: string;
  cpu_total: number;
  mem_total: number;
}

// 前端使用的物理机信息
export interface PhysicalNode {
  name: string;
  ip: string;
  status: string;
  cpuTotal: number;
  memTotal: number;
}

// 物理机列表响应
export interface PhysicalNodeListResponse {
  nodes: PhysicalNodeBackend[];
}
