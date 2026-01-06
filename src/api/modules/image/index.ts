/**
 * 镜像管理相关 API
 */
import { get, post, put } from "@/api/request/index";
import type { ApiResponse } from "@/api/types";
import type {
  SystemImage,
  TemplateImage,
  DeleteImageParams,
  UploadImageParams,
  TemplateImageDetail,
  TemplateDescriptionParams,
  TemplateDescription,
} from "./types";

const URL = {
  system: "images/system",
  systemDelete: "images/system/delete_images",
  template: "images/template",
  templateDelete: "images/template/delete_images",
  templateDetail: "images/template/detail",
  templateDescription: "images/template/description",
} as const;

// ========== 系统镜像管理 ==========

/**
 * 获取系统镜像列表
 */
export const getSystemImageList = async (): Promise<
  ApiResponse<SystemImage[]>
> => {
  return get<SystemImage[]>(URL.system);
};

/**
 * 删除系统镜像
 */
export const deleteSystemImage = async (
  data: DeleteImageParams
): Promise<ApiResponse<null>> => {
  return post<null>(URL.systemDelete, data);
};

/**
 * 上传镜像
 * @param type - 上传类型: 'internal' | 'external'
 * @param storageUid - 存储 UID
 * @param data - 镜像数据
 * @param config - 上传配置（包含 onUploadProgress 等）
 */
export const uploadImage = async (
  type: "internal" | "external",
  storageUid: string,
  data: UploadImageParams,
  config?: {
    onUploadProgress?: (progressEvent: {
      loaded: number;
      total?: number;
    }) => void;
    [key: string]: unknown;
  }
): Promise<ApiResponse<null>> => {
  return post<null>(`images/system/upload/${type}/${storageUid}`, data, config);
};

// ========== 模板镜像管理 ==========

/**
 * 获取模板镜像列表
 */
export const getTemplateImageList = async (): Promise<
  ApiResponse<TemplateImage[]>
> => {
  return get<TemplateImage[]>(URL.template);
};

/**
 * 删除模板镜像
 */
export const deleteTemplateImage = async (
  data: DeleteImageParams
): Promise<ApiResponse<null>> => {
  return post<null>(URL.templateDelete, data);
};

/**
 * 获取模板镜像详情
 */
export const getTemplateImageDetail = async (
  uid: string
): Promise<ApiResponse<TemplateImageDetail>> => {
  return post<TemplateImageDetail>(`${URL.templateDetail}/${uid}`);
};

/**
 * 获取模板描述
 */
export const getTemplateDescription = async (data: {
  image_uid: string;
}): Promise<ApiResponse<TemplateDescription>> => {
  return post<TemplateDescription>(URL.templateDescription, data);
};

/**
 * 设置模板描述
 */
export const setTemplateDescription = async (
  uid: string,
  data: TemplateDescriptionParams
): Promise<ApiResponse<null>> => {
  return post<null>(`images/template/description/${uid}`, data);
};
