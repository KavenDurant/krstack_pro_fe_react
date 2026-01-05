/**
 * API 配置文件
 */
import { ENV_CONFIG, isDev } from "@/config/env";

/**
 * API 基础配置
 */
export const API_CONFIG = {
  // 基础 URL - 开发环境使用代理（空字符串），生产环境使用完整 URL
  BASE_URL: isDev ? "" : ENV_CONFIG.API_BASE_URL,

  // 超时时间（毫秒）
  TIMEOUT: ENV_CONFIG.API_TIMEOUT,

  // 请求重试次数
  RETRY_COUNT: 3,

  // 请求重试延迟（毫秒）
  RETRY_DELAY: 1000,

  // 是否显示请求日志
  SHOW_LOG: ENV_CONFIG.SHOW_DEBUG,
} as const;

/**
 * HTTP 状态码
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

/**
 * 业务状态码
 */
export const BUSINESS_CODE = {
  SUCCESS: 200,
  SUCCESS_ALT: 0,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const;

/**
 * 存储键名
 */
export const STORAGE_KEY = {
  TOKEN: "token",
  USER_INFO: "userInfo",
  IS_AUTHENTICATED: "isAuthenticated",
  LANGUAGE: "language",
  THEME: "theme",
} as const;

/**
 * Token 存储键名（向后兼容）
 */
export const TOKEN_KEY = STORAGE_KEY.TOKEN;

/**
 * API 路径前缀
 */
export const API_PREFIX = {
  AUTH: "/api/auth",
  USER: "/api/users",
  VM: "/api/vms",
  CLUSTER: "/api/clusters",
  NODE: "/api/nodes",
  STORAGE: "/api/storages",
  UPLOAD: "/api/upload",
  DOWNLOAD: "/api/download",
  MAINTENANCE: "/api/maintenance",
} as const;

/**
 * 请求头配置
 */
export const REQUEST_HEADERS = {
  CONTENT_TYPE: "Content-Type",
  AUTHORIZATION: "Authorization",
  ACCEPT: "Accept",
  ACCEPT_LANGUAGE: "Accept-Language",
} as const;

/**
 * Content-Type 类型
 */
export const CONTENT_TYPE = {
  JSON: "application/json",
  FORM_DATA: "multipart/form-data",
  FORM_URLENCODED: "application/x-www-form-urlencoded",
  TEXT: "text/plain",
} as const;
