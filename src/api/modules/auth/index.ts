/*
 * @Author: KavenDurant luojiaxin888@gmail.com
 * @Date: 2025-12-17 11:15:55
 * @LastEditors: KavenDurant luojiaxin888@gmail.com
 * @LastEditTime: 2025-12-17 11:31:36
 * @FilePath: /krstack_pro_fe_react/src/api/modules/auth/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 认证相关 API
 */
import { get, post, put } from "@/api/request/index";
import type { ApiResponse } from "@/api/types";
import type {
  LoginParams,
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  ChangePasswordParams,
  HistoryListParams,
  AlarmLog,
} from "./types";

const URL = {
  login: "/login",
  logout: "/logout",
  refresh: "/refresh",
  taskQueue: "/maintenance/operation_log/current",
  historyTask: "/maintenance/operation_log/historical",
  alarmLog: "/maintenance/alarm_log/historical",
  changePassword: (username: string) => `/users/${username}/password`,
} as const;

/**
 * 用户登录
 */
export const login = async (
  data: LoginParams
): Promise<ApiResponse<LoginResponse>> => {
  console.log("调用 login API:", data);
  return post<LoginResponse>(URL.login, data);
};

/**
 * 用户登出
 */
export const logout = async (): Promise<ApiResponse<LogoutResponse>> => {
  return post<LogoutResponse>(URL.logout);
};

/**
 * 刷新 Token
 */
export const refreshToken = async (): Promise<
  ApiResponse<RefreshTokenResponse>
> => {
  return post<RefreshTokenResponse>(URL.refresh);
};

/**
 * 获取任务队列
 */
export const getTaskQueue = async (): Promise<ApiResponse<unknown>> => {
  return get<unknown>(URL.taskQueue);
};

/**
 * 获取历史任务
 */
export const getHistoryTask = async (): Promise<ApiResponse<unknown>> => {
  return get<unknown>(URL.historyTask);
};

/**
 * 获取历史任务（带时间筛选）
 */
export const getHistoryTaskTime = async (
  data: HistoryListParams
): Promise<ApiResponse<unknown>> => {
  return post<unknown>(URL.historyTask, data);
};

/**
 * 获取告警日志
 */
export const getAlarmLog = async (): Promise<ApiResponse<AlarmLog[]>> => {
  return get<AlarmLog[]>(URL.alarmLog);
};

/**
 * 获取告警日志（带时间筛选）
 */
export const getAlarmLogModal = async (
  data: HistoryListParams
): Promise<ApiResponse<AlarmLog[]>> => {
  return post<AlarmLog[]>(URL.alarmLog, data);
};

/**
 * 修改密码
 */
export const changePassword = async (
  username: string,
  data: ChangePasswordParams
): Promise<ApiResponse<unknown>> => {
  return put<unknown>(URL.changePassword(username), data);
};
