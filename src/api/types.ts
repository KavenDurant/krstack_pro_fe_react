/*
 * @Author: KavenDurant luojiaxin888@gmail.com
 * @Date: 2025-12-17 10:59:18
 * @LastEditors: KavenDurant luojiaxin888@gmail.com
 * @LastEditTime: 2025-12-18 10:32:09
 * @FilePath: /krstack_pro_fe_react/src/api/types.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * API 通用类型定义
 */

// 通用响应结构
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

// 分页响应结构
export interface PaginatedResponse<T = unknown> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 请求配置扩展
export interface RequestConfig {
  showError?: boolean; // 是否显示错误提示
  showLoading?: boolean; // 是否显示加载状态
  timeout?: number; // 请求超时时间
}

// 错误响应结构
export interface ErrorResponse {
  code: number;
  message: string;
  details?: string;
}
