/**
 * 集群相关 API
 */
import { get, post, put, del } from "../../request/index";
import type { ApiResponse } from "../../types";
import type {
  Cluster,
  ClusterBackend,
  ClusterDetail,
  ClusterDetailBackend,
  ClusterListResponse,
  AddClusterParams,
  UpdateClusterParams,
  ContentQuery,
  StorageContent,
  PhysicalNode,
  PhysicalNodeBackend,
  PhysicalNodeListResponse,
} from "./types";

const URL = {
  list: "/api/clusters",
  detail: (uid: string) => `/api/clusters/${uid}`,
  nodes: (uid: string) => `/api/clusters/${uid}/nodes`,
  sync: (uid: string) => `/api/clusters/${uid}/sync`,
  content: "/api/storages/content",
} as const;

/**
 * 转换后端集群列表数据为前端格式
 */
const transformCluster = (backend: ClusterBackend): Cluster => ({
  id: String(backend.cluster_id),
  uid: backend.cluster_uid,
  name: backend.name,
  status: backend.status,
  nodesNum: backend.nodes_num,
  platformType: backend.platform_type,
  ip: backend.ip,
  vtType: backend.vt_type,
  createdAt: backend.created_at,
});

/**
 * 转换后端集群详情数据为前端格式
 */
const transformClusterDetail = (
  backend: ClusterDetailBackend
): ClusterDetail => ({
  uid: backend.cluster_uid,
  name: backend.resource_name,
  cpuUsed: backend.cpu_used,
  cpuTotal: backend.cpu_total,
  memUsed: backend.mem_used,
  memTotal: backend.mem_total,
  diskUsed: backend.disk_used,
  diskTotal: backend.disk_total,
  vtType: backend.vt_type,
  createdAt: backend.created_at,
});

/**
 * 转换后端物理机数据为前端格式
 */
const transformPhysicalNode = (backend: PhysicalNodeBackend): PhysicalNode => ({
  name: backend.name,
  ip: backend.ip,
  status: backend.status,
  cpuTotal: backend.cpu_total,
  memTotal: backend.mem_total,
});

/**
 * 获取集群列表
 */
export const getClusterList = async (): Promise<{
  code: number;
  data: { list: Cluster[]; total: number };
  message?: string;
}> => {
  const response = await get<ClusterListResponse>(URL.list);

  // 后端直接返回 { resources: [...] }，没有包装在 data 字段中
  const backendData = response as unknown as ClusterListResponse;

  // 转换后端数据格式
  const clusters = backendData.resources.map(transformCluster);

  return {
    code: 200,
    data: {
      list: clusters,
      total: clusters.length,
    },
  };
};

/**
 * 获取集群详情
 * @param uid - 集群 UID
 */
export const getClusterDetail = async (
  uid: string
): Promise<{
  code: number;
  data: ClusterDetail;
  message?: string;
}> => {
  const response = await get<ClusterDetailBackend>(URL.detail(uid));

  // 后端直接返回详情对象
  const backendData = response as unknown as ClusterDetailBackend;

  // 转换后端数据格式
  const detail = transformClusterDetail(backendData);

  return {
    code: 200,
    data: detail,
  };
};

/**
 * 添加集群
 */
export const addCluster = async (
  data: AddClusterParams
): Promise<ApiResponse<Cluster>> => {
  return post<Cluster>(URL.list, data);
};

/**
 * 更新集群
 * @param uid - 集群 UID
 */
export const updateCluster = async (
  uid: string,
  data: UpdateClusterParams
): Promise<ApiResponse<Cluster>> => {
  return put<Cluster>(URL.detail(uid), data);
};

/**
 * 删除集群
 * @param uid - 集群 UID
 */
export const deleteCluster = async (
  uid: string
): Promise<ApiResponse<null>> => {
  return del<null>(URL.detail(uid));
};

/**
 * 同步集群
 * @param uid - 集群 UID
 */
export const syncCluster = async (
  uid: string
): Promise<ApiResponse<Cluster>> => {
  return post<Cluster>(URL.sync(uid));
};

/**
 * 获取物理机列表
 * @param uid - 集群 UID
 */
export const getPhysicalList = async (
  uid: string
): Promise<{
  code: number;
  data: PhysicalNode[];
  message?: string;
}> => {
  const response = await get<PhysicalNodeListResponse>(URL.nodes(uid));

  // 后端返回 { nodes: [...] }
  const backendData = response as unknown as PhysicalNodeListResponse;

  // 转换后端数据格式
  const nodes = backendData.nodes.map(transformPhysicalNode);

  return {
    code: 200,
    data: nodes,
  };
};

/**
 * 获取集群存储内容
 */
export const getContent = async (
  data: ContentQuery
): Promise<ApiResponse<StorageContent[]>> => {
  return post<StorageContent[]>(URL.content, data);
};
