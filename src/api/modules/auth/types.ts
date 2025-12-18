/**
 * 认证相关类型定义
 */

// 登录参数
export interface LoginParams {
  user_name: string;
  password: string;
}

// 用户信息
export interface UserInfo {
  user_id: number;
  user_name: string;
  nickname: string;
  user_type: string;
}

// 登录响应
export interface LoginResponse {
  jwt_token: string;
  user_id: number;
  user_name: string;
  nickname: string;
  user_type: string;
}

// 登出响应
export interface LogoutResponse {
  message: string;
}

// 刷新 Token 响应
export interface RefreshTokenResponse {
  token: string;
}

// 修改密码参数
export interface ChangePasswordParams {
  old_password: string | null;
  password: string | null;
  pwd: string | null;
}

// 历史记录查询参数
export interface HistoryListParams {
  start_time: string | null;
  end_time: string | null;
  last_id: number | null;
  last_time: string | null;
}

// 告警日志
export interface AlarmLog {
  id: number;
  message: string;
  created_at: string;
}
