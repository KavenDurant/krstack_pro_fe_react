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
  USBDeviceBackend,
  USBVmUse,
  GPUDevice,
  GPUDeviceBackend,
  StorageInfo,
  StorageInfoBackend,
  NetworkSetting,
  NetworkSettingBackend,
  PerformanceData,
  NetworkPerformanceData, // Add this
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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isApiResponseArray = <T>(value: unknown): value is ApiResponse<T[]> => {
  if (!isRecord(value)) {
    return false;
  }

  return typeof value.code === "number" && Array.isArray(value.data);
};

/** 从多种后端响应形态中按 key 取出数组，统一为 ApiResponse<unknown[]> */
const extractListByKey = (
  response: unknown,
  key: string
): ApiResponse<unknown[]> => {
  if (Array.isArray(response)) {
    return {
      code: 200,
      message: "success",
      data: response,
    };
  }

  if (isRecord(response)) {
    const list = response[key];
    if (Array.isArray(list)) {
      return {
        code: 200,
        message: "success",
        data: list,
      };
    }

    if (isApiResponseArray<unknown>(response)) {
      return response;
    }

    const data = response.data;
    if (isRecord(data) && Array.isArray(data[key])) {
      return {
        code: typeof response.code === "number" ? response.code : 200,
        message:
          typeof response.message === "string" ? response.message : "success",
        data: data[key] as unknown[],
      };
    }
  }

  return {
    code: 500,
    message: "数据格式错误",
    data: [],
  };
};

const transformGPUDevice = (gpu: GPUDeviceBackend): GPUDevice => ({
  uid: gpu.uid,
  id: gpu.id,
  status: gpu.status,
  deviceName: gpu.device_name ?? null,
  manufacturer: gpu.manufacturer ?? null,
  vmUse: (gpu.vm_use || []).map(item => ({
    name: item.name,
    vmUid: item.vm_uid,
    gpuId: item.gpu_id,
    gpuUid: item.gpu_uid,
    gpuName: item.gpu_name ?? null,
    status: item.status,
  })),
});

const isStorageInfoBackend = (value: unknown): value is StorageInfoBackend => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.name === "string" &&
    typeof value.storage_uid === "string" &&
    typeof value.disk_total === "number" &&
    typeof value.disk_used === "number" &&
    typeof value.disk_left === "number" &&
    typeof value.type === "string" &&
    typeof value.status === "string" &&
    typeof value.shared === "boolean"
  );
};

const transformStorageInfo = (storage: StorageInfoBackend): StorageInfo => ({
  name: storage.name,
  storageUid: storage.storage_uid,
  diskTotal: storage.disk_total,
  diskUsed: storage.disk_used,
  diskLeft: storage.disk_left,
  type: storage.type,
  status: storage.status,
  shared: storage.shared,
  clusterId: storage.cluster_id,
});

const isNetworkSettingBackend = (
  value: unknown
): value is NetworkSettingBackend => {
  if (!isRecord(value)) return false;
  return (
    typeof value.name === "string" &&
    typeof value.type === "string" &&
    typeof value.active === "boolean"
  );
};

const transformNetworkSetting = (
  item: NetworkSettingBackend
): NetworkSetting => ({
  name: item.name,
  type: item.type,
  active: item.active,
  autostart: item.autostart ?? null,
  vlanAware: item.vlan_aware ?? null,
  port: item.port ?? null,
  bondMode: item.bond_mode ?? null,
  cidr: item.cidr ?? null,
  gateway: item.gateway ?? null,
  comments: item.comments ?? null,
});

const transformUSBDevice = (usb: USBDeviceBackend): USBDevice => ({
  uid: usb.uid,
  id: usb.id,
  name: usb.name ?? null,
  host: usb.host ?? null,
  manufacturer: usb.manufacturer ?? null,
  product: usb.product ?? null,
  status: usb.status,
  vmUse: (usb.vm_use || []).map<USBVmUse>(item => ({
    name: item.name,
    vmUid: item.vm_uid,
    usbId: item.usb_id,
    usbUid: item.usb_uid,
    usbName: item.usb_name ?? null,
    status: item.status,
  })),
});

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
    id: vm.id,
    name: vm.name,
    vmUid: vm.vm_uid,
    status:
      vm.status.toLowerCase() === "running" ||
      vm.status.toLowerCase() === "online"
        ? "Running"
        : "Stopped",
    clusterId: vm.cluster_id,
    clusterName: vm.cluster_name,
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
  const response = await get<unknown>(URL.network(uid));
  const normalized = extractListByKey(response, "network");
  if (normalized.code !== 200) {
    return {
      code: normalized.code,
      message: normalized.message,
      data: [],
    };
  }
  const list = normalized.data as NetworkInterface[];
  return { code: 200, message: "success", data: list };
};

/**
 * 获取物理机 USB 设备列表
 * @param uid - 物理机 UID
 */
export const getUSBList = async (
  uid: string
): Promise<ApiResponse<USBDevice[]>> => {
  const response = await get<USBDeviceBackend[] | { usb: USBDeviceBackend[] }>(
    URL.usb(uid)
  );

  const normalized = extractListByKey(response, "usb");
  if (normalized.code !== 200) {
    return {
      code: normalized.code,
      message: normalized.message,
      data: [],
    };
  }

  return {
    code: 200,
    message: "success",
    data: (normalized.data as USBDeviceBackend[]).map(transformUSBDevice),
  };
};

/**
 * 获取物理机 GPU 设备列表
 * @param uid - 物理机 UID
 */
export const getGPUList = async (
  uid: string
): Promise<ApiResponse<GPUDevice[]>> => {
  const response = await get<GPUDeviceBackend[] | { gpu: GPUDeviceBackend[] }>(
    URL.gpu(uid)
  );

  const normalized = extractListByKey(response, "gpu");
  if (normalized.code !== 200) {
    return {
      code: normalized.code,
      message: normalized.message,
      data: [],
    };
  }

  return {
    code: 200,
    message: "success",
    data: (normalized.data as GPUDeviceBackend[]).map(transformGPUDevice),
  };
};

/**
 * 获取物理机存储列表
 * @param nodeUid - 物理机 UID
 */
export const getStorageList = async (
  nodeUid: string
): Promise<ApiResponse<StorageInfo[]>> => {
  const response = await get<unknown>(URL.storage(nodeUid));
  const normalized = extractListByKey(response, "storages");

  if (normalized.code !== 200) {
    return {
      code: normalized.code,
      message: normalized.message,
      data: [],
    };
  }

  const storages = normalized.data
    .filter(isStorageInfoBackend)
    .map(transformStorageInfo);

  return {
    code: normalized.code,
    message: normalized.message,
    data: storages,
  };
};

/**
 * 获取物理机网络设置
 * @param uid - 物理机 UID
 */
export const getNetworkSettings = async (
  uid: string
): Promise<ApiResponse<NetworkSetting[]>> => {
  const response = await get<unknown>(URL.networkSettings(uid));
  const normalized = extractListByKey(response, "network");

  if (normalized.code !== 200) {
    return {
      code: normalized.code,
      message: normalized.message,
      data: [],
    };
  }

  const list = normalized.data
    .filter(isNetworkSettingBackend)
    .map(transformNetworkSetting);

  return {
    code: 200,
    message: "success",
    data: list,
  };
};

const normalizePerformanceItem = (item: unknown): PerformanceData | null => {
  if (!isRecord(item)) return null;

  // Use bracket notation to safely access properties on Record<string, unknown>
  const record = item as Record<string, unknown>;
  let ts = record["timestamp"] ?? record["time"];
  let val = record["value"] ?? record["val"] ?? record["usage"];

  // 处理时间戳可能是字符串的情况
  if (typeof ts === "string") {
    // 尝试直接转换数字
    const parsed = Number(ts);
    if (!isNaN(parsed)) {
      ts = parsed;
    } else {
      // 尝试解析日期字符串
      const date = new Date(ts);
      if (!isNaN(date.getTime())) {
        ts = Math.floor(date.getTime() / 1000); // 转换为秒级时间戳
      }
    }
  }

  // 处理值可能是字符串的情况
  if (typeof val === "string") {
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      val = parsed;
    }
  }

  if (typeof ts !== "number" || typeof val !== "number") return null;
  return { timestamp: ts, value: val };
};

const extractPerformanceResponse = (
  response: unknown,
  key: string
): ApiResponse<PerformanceData[]> => {
  // 1. 尝试处理 "Parallel Arrays" 格式 (time: [], value: [])
  if (isRecord(response)) {
    const data = response as Record<string, unknown>;
    // Check for nested structure which might happen depending on axios/backend response wrapping
    // Backend often returns { code: 200, data: { time: [], ... } }
    const innerData = (isRecord(data.data) ? data.data : data) as Record<
      string,
      unknown
    >;

    // 获取时间数组
    const timeArray = innerData["time"];

    // 如果存在 time 数组，说明是并行数组结构
    if (Array.isArray(timeArray)) {
      const timestamps = timeArray.map(t => {
        if (typeof t === "number") return t;
        const date = new Date(t);
        return !isNaN(date.getTime()) ? Math.floor(date.getTime() / 1000) : 0;
      });

      let values: number[] = [];

      // 根据不同的 Key 提取值并转换
      if (key === "cpu") {
        const usage = innerData["cpu_usage"];
        if (Array.isArray(usage)) {
          values = usage.map(v => Number(v) || 0);
        }
      } else if (key === "mem") {
        const used = innerData["mem_used"];
        const total = innerData["mem_total"];
        if (Array.isArray(used) && Array.isArray(total)) {
          values = used.map((u, i) => {
            const t = Number(total[i]) || 1;
            return ((Number(u) || 0) / t) * 100;
          });
        }
      } else if (key === "loadavg") {
        const load = innerData["loadavg"];
        if (Array.isArray(load)) {
          values = load.map(v => Number(v) || 0);
        }
      }

      // 如果成功提取了值，组装数据
      if (values.length > 0 && timestamps.length === values.length) {
        const result = timestamps.map((ts, i) => ({
          timestamp: ts,
          value: values[i],
        }));
        // Filter out bad timestamps
        const validResult = result.filter(r => r.timestamp > 0);

        return {
          code: 200,
          message: "success",
          data: validResult,
        };
      }
    }
  }

  // 2. 如果不是并行数组，尝试之前的处理逻辑 (Array of Objects)
  let normalized = extractListByKey(response, key);
  if (normalized.code !== 200 && isRecord(response)) {
    normalized = extractListByKey(response, "data");
  }
  if (normalized.code !== 200) {
    return {
      code: normalized.code,
      message: normalized.message,
      data: [],
    };
  }
  const data = normalized.data
    .map(normalizePerformanceItem)
    .filter((item): item is PerformanceData => item !== null);
  return {
    code: 200,
    message: "success",
    data,
  };
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
  const response = await get<unknown>(URL.monitorCpu(nodeUid, timeFrame));
  return extractPerformanceResponse(response, "cpu");
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
  const response = await get<unknown>(URL.monitorMem(nodeUid, timeFrame));
  return extractPerformanceResponse(response, "mem");
};

/**
 * 获取网络性能监控数据
 * @param nodeUid - 物理机 UID
 * @param timeFrame - 时间范围 (hour/day/week/month)
 */
/**
 * 获取网络性能监控数据 (包含上行和下行)
 * @param nodeUid - 物理机 UID
 * @param timeFrame - 时间范围 (hour/day/week/month)
 */
export const getPerformanceNet = async (
  nodeUid: string,
  timeFrame: string
): Promise<ApiResponse<NetworkPerformanceData[]>> => {
  const response = await get<unknown>(URL.monitorNet(nodeUid, timeFrame));

  if (isRecord(response)) {
    const data = response as Record<string, unknown>;
    // Check for nested structure which might happen depending on axios/backend response wrapping
    const innerData = (isRecord(data.data) ? data.data : data) as Record<
      string,
      unknown
    >;

    const timeArray = innerData["time"];

    if (Array.isArray(timeArray)) {
      const timestamps = timeArray.map(t => {
        if (typeof t === "number") return t;
        const date = new Date(t);
        return !isNaN(date.getTime()) ? Math.floor(date.getTime() / 1000) : 0;
      });

      const netIn = innerData["net_in"];
      const netOut = innerData["net_out"];

      if (Array.isArray(netIn) && Array.isArray(netOut)) {
        const result = timestamps.map((ts, i) => ({
          timestamp: ts,
          rx: Number(netIn[i]) || 0, // Keep as Bytes/s, formatting handles unit
          tx: Number(netOut[i]) || 0, // Keep as Bytes/s
        }));

        // Filter out any where timestamp parsing failed (0)
        const validResult = result.filter(r => r.timestamp > 0);

        return {
          code: 200,
          message: "success",
          data: validResult,
        };
      }
    }
  }

  // Fallback if structure doesn't match expected parallel arrays
  // Just return empty array for safety as we can't map object-list to Rx/Tx easily without knowing structure
  return {
    code: 200,
    message: "success",
    data: [],
  };
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
  const response = await get<unknown>(URL.monitorLoadavg(nodeUid, timeFrame));
  return extractPerformanceResponse(response, "loadavg");
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
