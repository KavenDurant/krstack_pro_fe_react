/*
 * @Author: KavenDurant luojiaxin888@gmail.com
 * @Date: 2025-12-17 11:16:09
 * @LastEditors: KavenDurant luojiaxin888@gmail.com
 * @LastEditTime: 2025-12-18 11:53:58
 * @FilePath: /krstack_pro_fe_react/src/api/modules/user/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * 用户相关 API
 */
import { get, post, put, del } from "@/api/request/index";
import type { ApiResponse } from "@/api/types";
import type {
  User,
  UserListParams,
  UserListResponse,
  CreateUserParams,
  UpdateUserParams,
} from "./types";

const URL = {
  list: "users",
  current: "users/current",
} as const;

/**
 * 获取用户列表
 */
export const getUserList = async (
  params: UserListParams
): Promise<ApiResponse<UserListResponse>> => {
  return get<UserListResponse>(URL.list, params as Record<string, unknown>);
};

/**
 * 获取用户详情
 */
export const getUserDetail = async (id: number): Promise<ApiResponse<User>> => {
  return get<User>(`${URL.list}/${id}`);
};

/**
 * 创建用户
 */
export const createUser = async (
  data: CreateUserParams
): Promise<ApiResponse<User>> => {
  return post<User>(URL.list, data);
};

/**
 * 更新用户
 */
export const updateUser = async (
  id: number,
  data: UpdateUserParams
): Promise<ApiResponse<User>> => {
  return put<User>(`${URL.list}/${id}`, data);
};

/**
 * 删除用户
 */
export const deleteUser = async (id: number): Promise<ApiResponse<null>> => {
  return del<null>(`${URL.list}/${id}`);
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  return get<User>(URL.current);
};

/**
 * 重置用户密码
 */
export const resetPassword = async (
  username: string
): Promise<ApiResponse<null>> => {
  return post<null>(`${URL.list}/${username}/reset_password`);
};

/**
 * 批量删除用户
 */
export const deleteUsers = async (data: {
  user_names: string[];
}): Promise<ApiResponse<null>> => {
  return post<null>("users/delete_users", data);
};

/**
 * 更新用户（通过用户名）
 */
export const updateUserByName = async (
  name: string,
  data: UpdateUserParams
): Promise<ApiResponse<User>> => {
  return put<User>(`${URL.list}/${name}`, data);
};
