/**
 * 用户相关类型定义
 */

// 用户信息
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

// 用户列表查询参数
export interface UserListParams {
  page?: number;
  pageSize?: number;
  username?: string;
  role?: string;
  status?: string;
}

// 用户列表响应
export interface UserListResponse {
  list: User[];
  total: number;
}

// 创建用户参数
export interface CreateUserParams {
  username: string;
  email: string;
  password: string;
  role: string;
}

// 更新用户参数
export interface UpdateUserParams {
  username?: string;
  email?: string;
  role?: string;
  status?: string;
}
