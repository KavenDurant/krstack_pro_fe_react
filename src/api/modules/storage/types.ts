/**
 * 存储管理相关类型定义
 */

// 外挂存储
export interface ExternalStorage {
  storage_uid: string; // 存储唯一标识符
  name: string; // 存储名称
  clusters: StorageCluster[]; // 集群列表
  disk_total: number | null; // 磁盘总容量，可能为空
  disk_used: number | null; // 已用磁盘容量，可能为空
  disk_left: number | null; // 剩余磁盘容量，可能为空
  server: string; // 服务器地址
  status: string; // 存储状态
}

// 存储关联的集群
export interface StorageCluster {
  cluster_uid: string; // 集群唯一标识符
  cluster_name?: string; // 集群名称
}

// 内置存储列表
export interface InternalStorage {
  storage_uid: string;
  name: string;
  cluster_uid: string;
  cluster_name: string;
  disk_total: number;
  disk_used: number;
  disk_left: number;
  node_name: string | null;
  platform_type: "zstack" | "kr_cloud";
}

// 删除存储载荷
export interface DeleteStoragePayload {
  storages: {
    storage_uid: string;
  }[];
}

// 存储挂载/卸载载荷
export interface StorageMountPayload {
  storage_uid: string; // 存储唯一标识符
  cluster_uid: string; // 集群唯一标识符
}

// 存储报警阈值
export interface StorageAlarmThreshold {
  storage_alarm_threshold: number; // 存储报警阈值，例如 50 表示 50%
}

// 编辑列表（集群列表）
export interface ClusterEditList {
  cluster_id: number;
  cluster_uid: string;
  cluster_name: string;
  mount_status: boolean;
  platform_type: "zstack" | "kr_cloud";
}

// 平台配置（用于添加外挂存储）
export interface PlatformConfig {
  platform_type: string;
  server: string | null;
  port?: number | null;
  username: string | null;
  password: string | null;
  name: string | null;
  cluster_uid: string | null;
  share_path: string | null;
}

// SMB/CIFS 路径查询参数
export interface SmbCifsPathParams {
  server: string;
  port?: number;
  username: string;
  password: string;
  share_path: string;
}

// SMB/CIFS 路径选项
export interface SmbCifsPathOption {
  path: string;
  [key: string]: unknown;
}

// 存储内容查询参数
export interface StorageContentQuery {
  cluster_uid?: string | null;
  usage?: string[] | null;
  shared?: boolean | null;
}

// 存储内容项
export interface StorageContent {
  storage_uid: string;
  storage_name: string;
  disk_total: number;
  disk_used: number;
  cluster_uid: string;
  cluster_name?: string;
  content: string;
  overview: string;
  storage?: string;
}
