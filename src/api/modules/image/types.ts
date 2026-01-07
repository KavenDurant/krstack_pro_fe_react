/**
 * 镜像管理相关类型定义
 */

// 模板详情类型（用于上传）
export interface TemplateDetailType {
  id: string;
  node: string;
  cluster_id: number;
}

// 磁盘镜像基础类型
export interface DiskImage {
  image_uid: string; // 镜像唯一标识符
  storage_uid: string; // 存储唯一标识符
  name: string; // 镜像名称
  format: string; // 镜像格式
  storage: string; // 存储名称
  cluster_name: string; // 集群名称
  cluster_id: number; // 集群ID
  node: string; // 节点信息(为空)
  os_type: string; // 操作系统类型
  platform_type: string; // 平台类型
  size: number; // 镜像大小(字节)
  updated_at: string; // 更新时间
}

// 系统镜像
export interface SystemImage extends DiskImage {
  [key: string]: unknown;
}

// 模板镜像
export interface TemplateImage extends DiskImage {
  cpu_total?: number;
  mem_total?: number;
  disk_total?: number;
  mac?: string;
  [key: string]: unknown;
}

// 删除镜像参数 - 使用 images 数组格式
export interface DeleteImageParams {
  images: Array<{
    image_uid: string;
  }>;
}

// 上传镜像参数
export interface UploadImageParams {
  name: string;
  format: string;
  [key: string]: unknown;
}

// 模板镜像详情
export interface TemplateImageDetail {
  image_uid: string;
  name: string;
  format: string;
  storage: string;
  cluster_name: string;
  cluster_id: number;
  cpu_total: number;
  mem_total: number;
  disk_total: number;
  node: string;
  platform_type: string;
  mac: string;
  updated_at: string;
  [key: string]: unknown;
}

// 模板描述参数
export interface TemplateDescriptionParams {
  description: string;
  [key: string]: unknown;
}

// 模板描述响应
export interface TemplateDescription {
  description: string;
  [key: string]: unknown;
}

// 镜像列表响应数据（与后端返回格式匹配）
export interface ImageListResponseData<T extends SystemImage | TemplateImage> {
  images: T[];
  ancestor_trees?: Array<{
    title: string;
    value: string;
    children?: unknown[];
  }>;
}

// 删除镜像响应数据
export interface DeleteImageResponseData {
  delete_images_succeed: Array<{
    image_uid: string;
  }>;
  delete_images_failed: Array<{
    image_uid: string;
    error?: string;
  }>;
}
