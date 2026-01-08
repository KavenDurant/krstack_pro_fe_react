/**
 * 物理机相关 API
 */
import { get, post } from "@/api/request/index";
import type { ApiResponse } from "@/api/types";
import type {
  Node,
  NodeBackend,
  NodeDetail,
  NodeDetailBackend,
  NodeListResponse,
  VMListResponse,
  VMInfo,
  NetworkInterface,
  USBDevice,
  GPUDevice,
  StorageInfo,
  NetworkSetting,
  PerformanceData,
  NodeStatus,
} from "./types";

const URL = {
  list: "/nodes",
  detail: (uid: string) => `/nodes/detail/${uid}`,
  vms: (uid: string) => `/nodes/vms/${uid}`,
  network: (uid: string) => `/nodes/network/${uid}`,
  usb: (uid: string) => `/nodes/usb/${uid}`,
  gpu: (uid: string) => `/nodes/gpu/${uid}`,
  storage: (nodeUid: string) => `/nodes/cluster/node/${nodeUid}/storage`,
  networkSettings: (uid: string) => `/nodes/network/settings/${uid}`,
  monitorCpu: (nodeUid: string, timeFrame: string) =>
    `/nodes/cluster/node/${nodeUid}/monitor/${timeFrame}/cpu`,
  monitorMem: (nodeUid: string, timeFrame: string) =>
    `/nodes/cluster/node/${nodeUid}/monitor/${timeFrame}/mem`,
  monitorNet: (nodeUid: string, timeFrame: string) =>
    `/nodes/cluster/node/${nodeUid}/monitor/${timeFrame}/net`,
  monitorLoadavg: (nodeUid: string, timeFrame: string) =>
    `/nodes/cluster/node/${nodeUid}/monitor/${timeFrame}/loadavg`,
  reboot: (uid: string) => `/nodes/reboot/${uid}`,
  shutdown: (uid: string) => `/nodes/shutdown/${uid}`,
} as const;

/**
 * 转换后端物理机数据为前端格式
 */
const transformNode = (backend: NodeBackend): Node => {
  // 状态映射
  const statusMap: Record<string, NodeStatus> = {
    online: "online",
    offline: "offline",
    rebooting: "rebooting",
    shutting_down: "shutting_down",
  };

  return {
    key: backend.node_uid,
    uid: backend.node_uid,
    name: backend.name,
    ip: backend.ip,
    status: statusMap[backend.status] || "offline",
    clusterId: backend.cluster_id,
    clusterName: backend.cluster_name,
    cpuTotal: backend.cpu_total,
    memTotal: backend.mem_total,
    diskUsed: backend.disk_used,
    diskTotal: backend.disk_total,
    vmCount: backend.vm_count,
    uptime: backend.uptime,
  };
};

/**
 * 转换后端物理机详情数据为前端格式
 */
const transformNodeDetail = (backend: NodeDetailBackend): NodeDetail => {
  const statusMap: Record<string, NodeStatus> = {
    online: "online",
    offline: "offline",
    rebooting: "rebooting",
    shutting_down: "shutting_down",
  };

  return {
    uid: backend.node_uid,
    name: backend.name,
    ip: backend.ip,
    status: statusMap[backend.status] || "offline",
    clusterId: backend.cluster_id,
    clusterName: backend.cluster_name,
    cpuTotal: backend.cpu_total,
    memTotal: backend.mem_total,
    diskUsed: backend.disk_used,
    diskTotal: backend.disk_total,
    vmCount: backend.vm_count,
    uptime: backend.uptime,
  };
};

/**
 * 获取物理机列表
 */
export const getNodeList = async (): Promise<{
  code: number;
  data: { list: Node[]; total: number };
  message?: string;
}> => {
  const response = await get<NodeListResponse>(URL.list);

  const backendData = response as unknown as NodeListResponse;

  // 转换后端数据格式
  const nodes = backendData.nodes.map(transformNode);

  return {
    code: 200,
    data: {
      list: nodes,
      total: nodes.length,
    },
  };
};

/**
 * 获取物理机详情
 * @param uid - 物理机 UID
 */
export const getNodeDetail = async (
  uid: string
): Promise<{
  code: number;
  data: NodeDetail;
  message?: string;
}> => {
  const response = await get<NodeDetailBackend>(URL.detail(uid));

  const backendData = response as unknown as NodeDetailBackend;
  const detail = transformNodeDetail(backendData);

  return {
    code: 200,
    data: detail,
  };
};

/**
 * 获取物理机上的虚拟机列表
 * @param uid - 物理机 UID
 */
export const getNodeVMs = async (
  uid: string
): Promise<ApiResponse<VMInfo[]>> => {
  const response = await get<VMListResponse>(URL.vms(uid));

  const backendData = response as unknown as VMListResponse;

  const vms: VMInfo[] = backendData.vms.map(vm => ({
    nodeUid: vm.node_uid,
    id: vm.id,
    name: vm.name,
    vmId: vm.vm_id,
    status: vm.status as "Running" | "Stopped",
    clusterId: vm.cluster_id,
    nodeName: vm.node_name,
    cpuTotal: vm.cpu_total,
    memTotal: vm.mem_total,
    ip: vm.ip,
    osType: vm.os_type,
  }));

  return {
    code: 200,
    message: "success",
    data: vms,
  };
};

/**
 * 获取物理机网络接口列表
 * @param uid - 物理机 UID
 */
export const getNetworkList = async (
  uid: string
): Promise<ApiResponse<NetworkInterface[]>> => {
  return get<NetworkInterface[]>(URL.network(uid));
};

/**
 * 获取物理机 USB 设备列表
 * @param uid - 物理机 UID
 */
export const getUSBList = async (
  uid: string
): Promise<ApiResponse<USBDevice[]>> => {
  return get<USBDevice[]>(URL.usb(uid));
};

/**
 * 获取物理机 GPU 设备列表
 * @param uid - 物理机 UID
 */
export const getGPUList = async (
  uid: string
): Promise<ApiResponse<GPUDevice[]>> => {
  return get<GPUDevice[]>(URL.gpu(uid));
};

/**
 * 获取物理机存储列表
 * @param nodeUid - 物理机 UID
 */
export const getStorageList = async (
  nodeUid: string
): Promise<ApiResponse<StorageInfo[]>> => {
  return get<StorageInfo[]>(URL.storage(nodeUid));
};

/**
 * 获取物理机网络设置
 * @param uid - 物理机 UID
 */
export const getNetworkSettings = async (
  uid: string
): Promise<ApiResponse<NetworkSetting[]>> => {
  return get<NetworkSetting[]>(URL.networkSettings(uid));
};

/**
 * 获取 CPU 性能监控数据
 * @param nodeUid - 物理机 UID
 * @param timeFrame - 时间范围 (hour/day/week/month)
 */
export const getPerformanceCpu = async (
  nodeUid: string,
  timeFrame: string
): Promise<ApiResponse<PerformanceData[]>> => {
  return get<PerformanceData[]>(URL.monitorCpu(nodeUid, timeFrame));
};

/**
 * 获取内存性能监控数据
 * @param nodeUid - 物理机 UID
 * @param timeFrame - 时间范围 (hour/day/week/month)
 */
export const getPerformanceMem = async (
  nodeUid: string,
  timeFrame: string
): Promise<ApiResponse<PerformanceData[]>> => {
  return get<PerformanceData[]>(URL.monitorMem(nodeUid, timeFrame));
};

/**
 * 获取网络性能监控数据
 * @param nodeUid - 物理机 UID
 * @param timeFrame - 时间范围 (hour/day/week/month)
 */
export const getPerformanceNet = async (
  nodeUid: string,
  timeFrame: string
): Promise<ApiResponse<PerformanceData[]>> => {
  return get<PerformanceData[]>(URL.monitorNet(nodeUid, timeFrame));
};

/**
 * 获取负载性能监控数据
 * @param nodeUid - 物理机 UID
 * @param timeFrame - 时间范围 (hour/day/week/month)
 */
export const getPerformanceLoadavg = async (
  nodeUid: string,
  timeFrame: string
): Promise<ApiResponse<PerformanceData[]>> => {
  return get<PerformanceData[]>(URL.monitorLoadavg(nodeUid, timeFrame));
};

/**
 * 重启物理机
 * @param uid - 物理机 UID
 */
export const rebootNode = async (uid: string): Promise<ApiResponse<null>> => {
  return post<null>(URL.reboot(uid));
};

/**
 * 关机物理机
 * @param uid - 物理机 UID
 */
export const shutdownNode = async (uid: string): Promise<ApiResponse<null>> => {
  return post<null>(URL.shutdown(uid));
};
