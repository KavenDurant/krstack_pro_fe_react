/**
 * 请求方法统一导出
 */
import request from "./instance";
import type { AxiosRequestConfig } from "axios";
import type {
  ApiResponse,
  PaginatedResponse,
  RequestConfig,
} from "@/api/types";

// 扩展的请求配置类型
type ExtendedRequestConfig = AxiosRequestConfig & RequestConfig;

/**
 * GET 请求
 */
export const get = <T = unknown>(
  url: string,
  params?: Record<string, unknown>,
  config?: ExtendedRequestConfig
): Promise<ApiResponse<T>> => {
  return request.get(url, { params, ...config }).then(res => res.data);
};

/**
 * POST 请求
 */
export const post = <T = unknown>(
  url: string,
  data?: Record<string, unknown> | unknown,
  config?: ExtendedRequestConfig
): Promise<ApiResponse<T>> => {
  return request.post(url, data, config).then(res => {
    // 如果响应数据有 code 字段，返回标准格式
    if (res.data && typeof res.data === "object" && "code" in res.data) {
      return res.data;
    }
    // 否则包装成标准格式
    return {
      code: 200,
      message: "success",
      data: res.data,
    } as ApiResponse<T>;
  });
};

/**
 * PUT 请求
 */
export const put = <T = unknown>(
  url: string,
  data?: Record<string, unknown> | unknown,
  config?: ExtendedRequestConfig
): Promise<ApiResponse<T>> => {
  return request.put(url, data, config).then(res => res.data);
};

/**
 * DELETE 请求
 */
export const del = <T = unknown>(
  url: string,
  params?: Record<string, unknown>,
  config?: ExtendedRequestConfig
): Promise<ApiResponse<T>> => {
  return request.delete(url, { params, ...config }).then(res => res.data);
};

/**
 * PATCH 请求
 */
export const patch = <T = unknown>(
  url: string,
  data?: Record<string, unknown> | unknown,
  config?: ExtendedRequestConfig
): Promise<ApiResponse<T>> => {
  return request.patch(url, data, config).then(res => res.data);
};

/**
 * 文件上传
 */
export const upload = <T = unknown>(
  url: string,
  file: File,
  onProgress?: (progress: number) => void,
  config?: ExtendedRequestConfig
): Promise<ApiResponse<T>> => {
  const formData = new FormData();
  formData.append("file", file);

  return request
    .post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: progressEvent => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
      ...config,
    })
    .then(res => res.data);
};

/**
 * 文件下载
 */
export const download = (
  url: string,
  filename: string,
  params?: Record<string, unknown>,
  config?: ExtendedRequestConfig
): Promise<void> => {
  return request
    .get(url, {
      params,
      responseType: "blob",
      ...config,
    })
    .then(response => {
      const blob = new Blob([response.data as BlobPart]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(link.href);
    });
};

// 导出类型
export type { ApiResponse, PaginatedResponse, RequestConfig };

// 导出 request 实例，用于特殊场景
export { request };
