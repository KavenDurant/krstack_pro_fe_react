/**
 * Axios 实例配置
 */
import axios from "axios";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { message } from "antd";
import type { ApiResponse, RequestConfig } from "../types";
import {
  API_CONFIG,
  HTTP_STATUS,
  BUSINESS_CODE,
  STORAGE_KEY,
  REQUEST_HEADERS,
  CONTENT_TYPE,
} from "../config";

/**
 * 创建 axios 实例
 */
const instance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    [REQUEST_HEADERS.CONTENT_TYPE]: CONTENT_TYPE.JSON,
    [REQUEST_HEADERS.ACCEPT]: CONTENT_TYPE.JSON,
  },
});

/**
 * 请求拦截器
 */
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const customConfig = config as InternalAxiosRequestConfig & RequestConfig;

    // 从 localStorage 获取 token
    const token = localStorage.getItem(STORAGE_KEY.TOKEN);

    // 添加 Authorization 头（后端不需要 Bearer 前缀）
    if (token && config.headers) {
      config.headers[REQUEST_HEADERS.AUTHORIZATION] = token;
    }

    // 显示加载状态
    if (customConfig.showLoading) {
      // 可以在这里添加全局 loading 状态管理
      // 例如：store.dispatch(setLoading(true));
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 */
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const customConfig = response.config as AxiosRequestConfig & RequestConfig;

    // 隐藏加载状态
    if (customConfig.showLoading) {
      // store.dispatch(setLoading(false));
    }

    // 检查响应数据
    const data = response.data;

    // 如果响应有 code 字段，按照标准格式处理
    if (typeof data === "object" && data !== null && "code" in data) {
      const { code, message: msg } = data as ApiResponse;

      // 根据业务状态码处理
      if (
        code === BUSINESS_CODE.SUCCESS ||
        code === BUSINESS_CODE.SUCCESS_ALT
      ) {
        return response;
      }

      // 处理业务错误
      if (customConfig.showError !== false) {
        message.error(msg || "请求失败");
      }

      return Promise.reject(data);
    }

    // 如果没有 code 字段，直接返回（登录接口等）
    return response;
  },
  (error: AxiosError) => {
    const customConfig = error.config as
      | (AxiosRequestConfig & RequestConfig)
      | undefined;

    // 隐藏加载状态
    if (customConfig?.showLoading) {
      // store.dispatch(setLoading(false));
    }

    // 处理 HTTP 错误
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case HTTP_STATUS.UNAUTHORIZED:
          message.error("未授权，请重新登录");
          // 清除认证信息并跳转到登录页
          localStorage.removeItem(STORAGE_KEY.TOKEN);
          localStorage.removeItem(STORAGE_KEY.USER_INFO);
          localStorage.removeItem(STORAGE_KEY.IS_AUTHENTICATED);
          // 延迟跳转，避免多次触发
          setTimeout(() => {
            if (window.location.pathname !== "/login") {
              window.location.href = "/login";
            }
          }, 100);
          break;

        case HTTP_STATUS.FORBIDDEN:
          message.error("拒绝访问，权限不足");
          break;

        case HTTP_STATUS.NOT_FOUND:
          message.error("请求的资源不存在");
          break;

        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
          message.error("服务器内部错误");
          break;

        case HTTP_STATUS.BAD_GATEWAY:
          message.error("网关错误");
          break;

        case HTTP_STATUS.SERVICE_UNAVAILABLE:
          message.error("服务不可用");
          break;

        case HTTP_STATUS.GATEWAY_TIMEOUT:
          message.error("网关超时");
          break;

        default:
          if (customConfig?.showError !== false) {
            // 优先使用后端返回的 detail 字段，其次是 message 字段
            const errorMsg =
              (data as { detail?: string; message?: string })?.detail ||
              (data as { detail?: string; message?: string })?.message ||
              error.message ||
              "请求失败";
            message.error(errorMsg);
          }
      }
    } else if (error.message) {
      // 处理网络错误
      if (error.message.includes("timeout")) {
        message.error("请求超时，请稍后重试");
      } else if (error.message.includes("Network Error")) {
        message.error("网络连接失败，请检查网络");
      } else if (customConfig?.showError !== false) {
        message.error(error.message);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
