/**
 * 虚拟机相关 API
 */
import { get, post, put, del } from "@/api/request/index";
import type { ApiResponse } from "@/api/types";
import type {
  VM,
  VMListParams,
  VMListResponse,
  CreateVMParams,
  UpdateVMParams,
  VMArray,
  VmStartPayload,
  VmSpecType,
  VmSpecTypeResponse,
  DeleteVmSpecResponse,
  VmSystemCreateParams,
  VmTemplateCreateParams,
  VMDetailBaseInfo,
  UpdateVMNameParams,
  UpdateVMCPUParams,
  UpdateVMMemParams,
  UpdateVMSelfStartParams,
  NetworkListItem,
  UpdateNetworkData,
  NetworkConfigResponse,
  IpConfigRequest,
  USBDeviceItem,
  GPUDeviceItem,
  CDRomItem,
  MountCDRomParams,
  DiskItem,
  CreateCloudDiskParams,
  UnmountDiskParams,
  MigrateDiskParams,
  ResizeDiskParams,
  ConsoleAddress,
  BackupItem,
  CreateBackupParams,
  BackupRemarkParams,
  SnapshotItem,
  SnapshotRemarkParams,
  ExecutionPlanConfig,
  SnapshotHierarchyItem,
  MonitorTimeFrame,
  MonitorDataType,
  PerformanceDataPoint,
  VMTag,
  TagData,
  CreateTagParams,
  SetBootOrderParams,
  BootOrderResponse,
  ResourceDistribution,
  MacAddressResponse,
} from "./types";

const URL = {
  list: "vms",
  detail: "vms",
  start: "vms/start",
  stop: "vms/stop",
  reboot: "vms/reboot",
  clone: "vms/clone",
  convertTemplate: "vms/convert_template",
  spec: "vms/spec",
  deleteSpecs: "vms/delete_specs",
  system: "vms/system",
  template: "vms/template",
  images: "images/system",
  templateImages: "images/template",
  clusters: "clusters",
  nodes: "nodes",
  nodesCluster: "nodes/cluster",
} as const;

// ========== 虚拟机基础操作 ==========

/**
 * 获取虚拟机列表
 */
export const getVMList = async (): Promise<ApiResponse<VMListResponse>> => {
  return get<VMListResponse>(URL.list);
};

/**
 * 获取虚拟机详情基本信息
 */
export const getVMDetailBaseInfo = async (
  vmUid: string
): Promise<ApiResponse<VMDetailBaseInfo>> => {
  return get<VMDetailBaseInfo>(`${URL.detail}/detail/${vmUid}`);
};

/**
 * 批量删除虚拟机
 */
export const deleteVMList = async (
  data: VMArray
): Promise<ApiResponse<null>> => {
  return post<null>("vms/delete", data);
};

/**
 * 批量启动虚拟机
 */
export const startVMList = async (
  data: VmStartPayload[]
): Promise<ApiResponse<null>> => {
  return post<null>(URL.start, data);
};

/**
 * 批量停止虚拟机
 */
export const stopVMList = async (data: VMArray): Promise<ApiResponse<null>> => {
  return post<null>(URL.stop, data);
};

/**
 * 批量重启虚拟机
 */
export const rebootVMList = async (
  data: VMArray
): Promise<ApiResponse<null>> => {
  return post<null>(URL.reboot, data);
};

/**
 * 克隆虚拟机
 */
export const cloneVMList = async (
  data: VMArray
): Promise<ApiResponse<null>> => {
  return post<null>(URL.clone, data);
};

/**
 * 转换成模板
 */
export const convertToTemplate = async (
  data: VMArray
): Promise<ApiResponse<null>> => {
  return post<null>(URL.convertTemplate, data);
};

// ========== 虚拟机创建 ==========

/**
 * 创建云主机（系统镜像）
 */
export const createVM = async (
  data: VmSystemCreateParams
): Promise<ApiResponse<VM>> => {
  return post<VM>(URL.system, data);
};

/**
 * 创建模板镜像
 */
export const createTemplate = async (
  data: VmTemplateCreateParams
): Promise<ApiResponse<VM>> => {
  return post<VM>(URL.template, data);
};

/**
 * 获取资源列表（集群列表，用于创建云主机）
 */
export const getResourcesList = async (): Promise<ApiResponse<unknown[]>> => {
  return get<unknown[]>(URL.clusters);
};

/**
 * 获取物理机列表（用于创建云主机）
 */
export const getNodesForResource = async (): Promise<
  ApiResponse<unknown[]>
> => {
  return get<unknown[]>(URL.nodes);
};

/**
 * 获取系统镜像列表（用于创建云主机）
 */
export const getSystemImages = async (): Promise<ApiResponse<unknown[]>> => {
  return get<unknown[]>(URL.images);
};

/**
 * 获取模板镜像列表
 */
export const getTemplateImages = async (): Promise<ApiResponse<unknown[]>> => {
  return get<unknown[]>(URL.templateImages);
};

// ========== 虚拟机规格管理 ==========

/**
 * 获取虚拟机规格列表
 */
export const getVmSpecList = async (): Promise<
  ApiResponse<VmSpecTypeResponse>
> => {
  return get<VmSpecTypeResponse>(URL.spec);
};

/**
 * 创建规格模板
 */
export const createVmSpec = async (
  data: VmSpecType
): Promise<ApiResponse<VmSpecType>> => {
  return post<VmSpecType>(URL.spec, data);
};

/**
 * 编辑规格模板
 */
export const updateVmSpec = async (
  specId: string,
  data: VmSpecType
): Promise<ApiResponse<VmSpecType>> => {
  return put<VmSpecType>(`${URL.spec}/${specId}`, data);
};

/**
 * 删除规格模板
 */
export const deleteVmSpec = async (data: {
  spec_ids: number[];
}): Promise<ApiResponse<DeleteVmSpecResponse>> => {
  return post<DeleteVmSpecResponse>(URL.deleteSpecs, data);
};

/**
 * 创建自定义配置（同创建规格）
 */
export const createSelfConfig = async (
  data: VmSpecType
): Promise<ApiResponse<VmSpecType>> => {
  return post<VmSpecType>(URL.spec, data);
};

/**
 * 获取自定义配置列表（同获取规格列表）
 */
export const getCustomConfigs = async (): Promise<
  ApiResponse<VmSpecTypeResponse>
> => {
  return get<VmSpecTypeResponse>(URL.spec);
};

// ========== 虚拟机配置修改 ==========

/**
 * 修改云主机名称
 */
export const updateVMName = async (
  uid: string,
  vmName: string
): Promise<ApiResponse<null>> => {
  return post<null>(`vms/rename/${uid}`, { vm_name: vmName });
};

/**
 * 修改云主机 CPU
 */
export const updateVMCPU = async (
  uid: string,
  cpuNum: number
): Promise<ApiResponse<null>> => {
  return post<null>(`vms/spec_cpu/${uid}`, { cpu_num: cpuNum });
};

/**
 * 修改内存容量
 */
export const updateVMMem = async (
  uid: string,
  memNum: number
): Promise<ApiResponse<null>> => {
  return post<null>(`vms/spec_mem/${uid}`, { mem_num: memNum });
};

/**
 * 修改开机自启动开关
 */
export const updateVMSelfStart = async (
  uid: string,
  onboot: boolean
): Promise<ApiResponse<null>> => {
  return post<null>(`vms/spec_onboot/${uid}`, { onboot });
};

// ========== 网络管理 ==========

/**
 * 获取网卡列表
 */
export const getVMNetworkList = async (
  uid: string
): Promise<ApiResponse<NetworkListItem[]>> => {
  return get<NetworkListItem[]>(`vms/network/${uid}`);
};

/**
 * 编辑网卡数据（修改 MAC）
 */
export const updateNetworkData = async (
  uid: string,
  data: UpdateNetworkData
): Promise<ApiResponse<null>> => {
  return post<null>(`vms/network/mac/${uid}`, {
    mac: data.mac,
    vm_network_uid: data.vm_network_uid,
  });
};

/**
 * 卸载网卡
 */
export const unmountNetwork = async (
  uid: string,
  vmNetworkUid: string
): Promise<ApiResponse<null>> => {
  return post<null>(`vms/network/unmount/${uid}`, {
    vm_network_uid: vmNetworkUid,
  });
};

/**
 * 加载网卡设备
 */
export const mountNetwork = async (
  uid: string,
  nodeNetworkUid: string
): Promise<ApiResponse<null>> => {
  return post<null>(`vms/network/mount/${uid}`, {
    node_network_uid: nodeNetworkUid,
  });
};

/**
 * 获取网桥网卡下拉（用于加载网卡）
 */
export const getNetworkSelect = async (
  clusterId: number,
  nodeName: string
): Promise<ApiResponse<unknown[]>> => {
  return get<unknown[]>(
    `${URL.nodesCluster}/${clusterId}/node/${nodeName}/network`
  );
};

/**
 * 获取 IP 地址信息
 */
export const getIpAddress = async (
  vmUid: string
): Promise<ApiResponse<NetworkConfigResponse>> => {
  return get<NetworkConfigResponse>(`vms/network/ip/${vmUid}`);
};

/**
 * 修改 IP 地址信息
 */
export const updateIpAddress = async (
  vmUid: string,
  data: IpConfigRequest
): Promise<ApiResponse<null>> => {
  return post<null>(`vms/network/ip/${vmUid}`, data);
};

/**
 * 随机生成 MAC 地址
 */
export const getMacAddress = async (): Promise<
  ApiResponse<MacAddressResponse>
> => {
  return get<MacAddressResponse>("vms/mac");
};

// ========== USB 管理 ==========

/**
 * 获取 USB 列表
 */
export const getVMUSBList = async (
  uid: string
): Promise<ApiResponse<USBDeviceItem[]>> => {
  return get<USBDeviceItem[]>(`vms/usb/${uid}`);
};

/**
 * 获取 USB 加载下拉框
 */
export const getUSBSelect = async (
  clusterId: number,
  nodeName: string
): Promise<ApiResponse<unknown[]>> => {
  return get<unknown[]>(
    `${URL.nodesCluster}/${clusterId}/node/${nodeName}/usb`
  );
};

/**
 * 新增 USB 设备
 */
export const mountUSB = async (
  uid: string,
  nodeUsbUid: string
): Promise<ApiResponse<null>> => {
  return post<null>(`vms/usb/mount/${uid}`, {
    node_usb_uid: nodeUsbUid,
  });
};

/**
 * 卸载 USB 设备
 */
export const unmountUSB = async (
  uid: string,
  vmUsbUid: string
): Promise<ApiResponse<null>> => {
  return post<null>(`vms/usb/unmount/${uid}`, {
    vm_usb_uid: vmUsbUid,
  });
};

// ========== GPU 管理 ==========

/**
 * 获取 GPU 列表
 */
export const getVMGPUList = async (
  uid: string
): Promise<ApiResponse<GPUDeviceItem[]>> => {
  return get<GPUDeviceItem[]>(`vms/gpu/${uid}`);
};

/**
 * 获取 GPU 加载下拉数据
 */
export const getGPUSelectData = async (
  nodeUid: string
): Promise<ApiResponse<unknown[]>> => {
  return get<unknown[]>(`nodes/gpu/${nodeUid}`);
};

/**
 * 挂载 GPU 设备
 */
export const mountGPU = async (
  vmUid: string,
  nodeGpuUid: string
): Promise<ApiResponse<null>> => {
  return post<null>(`vms/gpu/mount/${vmUid}`, {
    node_gpu_uid: nodeGpuUid,
  });
};

/**
 * 卸载 GPU
 */
export const unmountGPU = async (
  vmUid: string,
  vmGpuUid: string
): Promise<ApiResponse<null>> => {
  return post<null>(`vms/gpu/unmount/${vmUid}`, {
    vm_gpu_uid: vmGpuUid,
  });
};

// ========== 光驱管理 ==========

/**
 * 获取虚拟光驱列表
 */
export const getVMCDRomList = async (
  uid: string
): Promise<ApiResponse<CDRomItem[]>> => {
  return get<CDRomItem[]>(`vms/cdrom/${uid}`);
};

/**
 * 挂载虚拟光驱
 */
export const mountCDRom = async (
  vmUid: string,
  imageUid: string
): Promise<ApiResponse<null>> => {
  return post<null>(`vms/cdrom/mount/${vmUid}`, {
    image_uid: imageUid,
  });
};

/**
 * 卸载虚拟光驱
 */
export const unmountCDRom = async (
  uid: string,
  vmCdromUid: string
): Promise<ApiResponse<null>> => {
  return post<null>(`vms/cdrom/unmount/${uid}`, {
    vm_cdrom_uid: vmCdromUid,
  });
};

// ========== 磁盘管理 ==========

/**
 * 获取云硬盘列表
 */
export const getVMDiskList = async (
  uid: string
): Promise<ApiResponse<DiskItem[]>> => {
  return get<DiskItem[]>(`vms/disk/${uid}`);
};

/**
 * 创建云硬盘
 */
export const createCloudDisk = async (
  vmUid: string,
  data: CreateCloudDiskParams
): Promise<ApiResponse<null>> => {
  return post<null>(`vms/disk/mount/${vmUid}`, data);
};

/**
 * 删除云硬盘（卸载）
 */
export const unmountDisk = async (
  vmUid: string,
  data: UnmountDiskParams
): Promise<ApiResponse<null>> => {
  return post<null>(`vms/disk/unmount/${vmUid}`, data);
};

/**
 * 迁移云硬盘
 */
export const migrateDisk = async (
  vmUid: string,
  data: MigrateDiskParams
): Promise<ApiResponse<null>> => {
  return post<null>(`vms/disk/migrate/${vmUid}`, data);
};

/**
 * 扩容云硬盘
 */
export const resizeDisk = async (
  vmUid: string,
  data: ResizeDiskParams
): Promise<ApiResponse<null>> => {
  return post<null>(`vms/disk/resize/${vmUid}`, data);
};

/**
 * 获取资源分配信息
 */
export const getResourceDistribution = async (
  nodeUid: string
): Promise<ApiResponse<ResourceDistribution>> => {
  return get<ResourceDistribution>(`vms/distribution/${nodeUid}`);
};

// ========== 控制台 ==========

/**
 * 获取控制台地址
 */
export const getVMConsoleAddress = async (
  uid: string
): Promise<ApiResponse<ConsoleAddress>> => {
  return get<ConsoleAddress>(`vms/console/${uid}`);
};

// ========== 备份管理 ==========

/**
 * 获取备份列表
 */
export const getVMBackupList = async (
  vmUid: string
): Promise<ApiResponse<BackupItem[]>> => {
  return get<BackupItem[]>(`vms/${vmUid}/backup`);
};

/**
 * 创建云主机备份
 */
export const createVMBackup = async (
  vmUid: string,
  data: CreateBackupParams
): Promise<ApiResponse<null>> => {
  return post<null>(`vms/${vmUid}/backup`, data);
};

/**
 * 删除备份
 */
export const deleteBackup = async (
  backupUid: string
): Promise<ApiResponse<null>> => {
  return del<null>(`vms/backup/${backupUid}`);
};

/**
 * 恢复备份
 */
export const applyBackup = async (
  backupUid: string
): Promise<ApiResponse<null>> => {
  return post<null>(`vms/backup/${backupUid}/apply`);
};

/**
 * 备份备注
 */
export const updateBackupRemark = async (
  backupUid: string,
  data: BackupRemarkParams
): Promise<ApiResponse<null>> => {
  return put<null>(`vms/backup/${backupUid}/remark`, data);
};

// ========== 快照管理 ==========

/**
 * 获取快照列表
 */
export const getVMSnapshotList = async (
  vmUid: string
): Promise<ApiResponse<SnapshotItem[]>> => {
  return get<SnapshotItem[]>(`vms/${vmUid}/snapshot`);
};

/**
 * 创建快照
 */
export const createVMSnapshot = async (
  vmUid: string
): Promise<ApiResponse<null>> => {
  return post<null>(`vms/${vmUid}/snapshot`);
};

/**
 * 删除快照
 */
export const deleteSnapshot = async (
  snapshotUid: string
): Promise<ApiResponse<null>> => {
  return del<null>(`vms/snapshot/${snapshotUid}`);
};

/**
 * 应用快照
 */
export const applySnapshot = async (
  snapshotUid: string
): Promise<ApiResponse<null>> => {
  return post<null>(`vms/snapshot/${snapshotUid}`);
};

/**
 * 快照备注
 */
export const updateSnapshotRemark = async (
  snapshotUid: string,
  data: SnapshotRemarkParams
): Promise<ApiResponse<null>> => {
  return put<null>(`vms/snapshot/${snapshotUid}/description`, data);
};

/**
 * 获取快照策略
 */
export const getVMSnapshotStrategy = async (
  vmUid: string
): Promise<ApiResponse<ExecutionPlanConfig>> => {
  return get<ExecutionPlanConfig>(`vms/${vmUid}/snapshot/strategy`);
};

/**
 * 修改快照策略
 */
export const updateVMSnapshotStrategy = async (
  vmUid: string,
  data: ExecutionPlanConfig
): Promise<ApiResponse<null>> => {
  return put<null>(`vms/${vmUid}/snapshot/strategy`, data);
};

/**
 * 获取快照层级列表
 */
export const getSnapshotHierarchy = async (
  vmUid: string
): Promise<ApiResponse<SnapshotHierarchyItem[]>> => {
  return get<SnapshotHierarchyItem[]>(`vms/${vmUid}/snapshot/hierarchy`);
};

// ========== 性能监控 ==========

/**
 * 获取性能监控数据
 */
export const getVMMonitorData = async (
  vmUid: string,
  timeFrame: MonitorTimeFrame,
  dataType: MonitorDataType
): Promise<ApiResponse<PerformanceDataPoint[]>> => {
  return get<PerformanceDataPoint[]>(
    `vms/${vmUid}/monitor/${timeFrame}/${dataType}`
  );
};

// ========== 标签管理 ==========

/**
 * 查询云主机标签库所有标签
 */
export const getVmTags = async (): Promise<ApiResponse<VMTag[]>> => {
  return get<VMTag[]>("vms/tag");
};

/**
 * 云主机标签库新增一个标签
 */
export const addVmTag = async (
  data: CreateTagParams
): Promise<ApiResponse<VMTag>> => {
  return post<VMTag>("vms/tag", data);
};

/**
 * 云主机设置标签
 */
export const setVmTags = async (
  vmUid: string,
  data: TagData
): Promise<ApiResponse<null>> => {
  return put<null>(`vms/${vmUid}/tag`, data);
};

// ========== 引导项管理 ==========

/**
 * 获取引导项
 */
export const getBootOrder = async (
  uid: string
): Promise<ApiResponse<BootOrderResponse>> => {
  return get<BootOrderResponse>(`vms/boot/${uid}`);
};

/**
 * 修改引导项
 */
export const updateBootOrder = async (
  uid: string,
  data: SetBootOrderParams
): Promise<ApiResponse<null>> => {
  return put<null>(`vms/boot/${uid}`, data);
};

// ========== 存储设置 ==========

/**
 * 获取云硬盘存储设置
 */
export const getCloudDiskSetting = async (): Promise<ApiResponse<unknown>> => {
  return get<unknown>("storages/alarm_threshold");
};
