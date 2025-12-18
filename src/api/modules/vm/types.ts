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
