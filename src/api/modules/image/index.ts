/**
 * 镜像管理相关 API
 */
import { get, post } from "@/api/request/index";
import type { ApiResponse } from "@/api/types";
import type {
  SystemImage,
  TemplateImage,
  DeleteImageParams,
  UploadImageParams,
  TemplateImageDetail,
  TemplateDescriptionParams,
  TemplateDescription,
  ImageListResponseData,
  DeleteImageResponseData,
} from "./types";

const URL = {
  system: "/api/images/system",
  systemDelete: "/api/images/system/delete_images",
  template: "/api/images/template",
  templateDelete: "/api/images/template/delete_images",
  templateDetail: "/api/images/template/detail",
  templateDescription: "/api/images/template/description",
} as const;

// ========== 系统镜像管理 ==========

/**
 * 获取系统镜像列表
 * @returns 返回包含镜像列表和祖先树的数据
 */
export const getSystemImageList = async (): Promise<
  ApiResponse<ImageListResponseData<SystemImage>>
> => {
  return get<ImageListResponseData<SystemImage>>(URL.system);
};

/**
 * 删除系统镜像
 * @param data - 要删除的镜像列表
 * @returns 返回删除成功和失败的镜像列表
 */
export const deleteSystemImage = async (
  data: DeleteImageParams
): Promise<ApiResponse<DeleteImageResponseData>> => {
  return post<DeleteImageResponseData>(URL.systemDelete, data);
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
  return post<null>(
    `/api/images/system/upload/${type}/${storageUid}`,
    data,
    config
  );
};

// ========== 模板镜像管理 ==========

/**
 * 获取模板镜像列表
 * @returns 返回包含镜像列表和祖先树的数据
 */
export const getTemplateImageList = async (): Promise<
  ApiResponse<ImageListResponseData<TemplateImage>>
> => {
  return get<ImageListResponseData<TemplateImage>>(URL.template);
};

/**
 * 删除模板镜像
 * @param data - 要删除的镜像列表
 * @returns 返回删除成功和失败的镜像列表
 */
export const deleteTemplateImage = async (
  data: DeleteImageParams
): Promise<ApiResponse<DeleteImageResponseData>> => {
  return post<DeleteImageResponseData>(URL.templateDelete, data);
};

/**
 * 获取模板镜像详情
 * @param uid - 镜像 UID
 */
export const getTemplateImageDetail = async (
  uid: string
): Promise<ApiResponse<TemplateImageDetail>> => {
  return post<TemplateImageDetail>(`${URL.templateDetail}/${uid}`);
};

/**
 * 获取模板描述
 * @param data - 包含 image_uid 的对象
 */
export const getTemplateDescription = async (data: {
  image_uid: string;
}): Promise<ApiResponse<TemplateDescription>> => {
  return post<TemplateDescription>(URL.templateDescription, data);
};

/**
 * 设置模板描述
 * @param uid - 镜像 UID
 * @param data - 包含描述信息的对象
 */
export const setTemplateDescription = async (
  uid: string,
  data: TemplateDescriptionParams
): Promise<ApiResponse<null>> => {
  return post<null>(`/api/images/template/description/${uid}`, data);
};
