/**
 * 环境变量配置
 */

interface EnvConfig {
  // 应用配置
  APP_TITLE: string;
  APP_ENV: string;

  // API 配置
  API_BASE_URL: string;
  API_TIMEOUT: number;

  // 功能开关
  USE_MOCK: boolean;
  SHOW_DEBUG: boolean;
}

/**
 * 获取环境变量
 */
const getEnvConfig = (): EnvConfig => {
  return {
    APP_TITLE: import.meta.env.VITE_APP_TITLE || "KRSTACK PRO",
    APP_ENV: import.meta.env.VITE_APP_ENV || "development",

    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "",
    API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,

    USE_MOCK: import.meta.env.VITE_USE_MOCK === "true",
    SHOW_DEBUG: import.meta.env.VITE_SHOW_DEBUG === "true",
  };
};

/**
 * 环境变量配置
 */
export const ENV_CONFIG = getEnvConfig();

/**
 * 是否为开发环境
 */
export const isDev = import.meta.env.DEV;

/**
 * 是否为生产环境
 */
export const isProd = import.meta.env.PROD;

/**
 * 是否为测试环境
 */
export const isTest = ENV_CONFIG.APP_ENV === "test";

/**
 * 打印环境配置（仅开发环境）
 */
if (ENV_CONFIG.SHOW_DEBUG) {
  console.group("🌍 Environment Config");
  console.log("Environment:", ENV_CONFIG.APP_ENV);
  console.log("API Base URL:", ENV_CONFIG.API_BASE_URL);
  console.log("API Timeout:", ENV_CONFIG.API_TIMEOUT);
  console.log("Use Mock:", ENV_CONFIG.USE_MOCK);
  console.groupEnd();
}
