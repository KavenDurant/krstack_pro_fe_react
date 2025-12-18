/**
 * 认证相关工具函数
 */
import { STORAGE_KEY } from "../api/config";
import type { UserInfo } from "../api";

/**
 * 获取 Token
 */
export const getToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEY.TOKEN);
};

/**
 * 设置 Token
 */
export const setToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEY.TOKEN, token);
};

/**
 * 移除 Token
 */
export const removeToken = (): void => {
  localStorage.removeItem(STORAGE_KEY.TOKEN);
};

/**
 * 获取用户信息
 */
export const getUserInfo = (): UserInfo | null => {
  const userInfoStr = localStorage.getItem(STORAGE_KEY.USER_INFO);
  if (!userInfoStr) return null;

  try {
    return JSON.parse(userInfoStr) as UserInfo;
  } catch {
    return null;
  }
};

/**
 * 设置用户信息
 */
export const setUserInfo = (userInfo: UserInfo): void => {
  localStorage.setItem(STORAGE_KEY.USER_INFO, JSON.stringify(userInfo));
};

/**
 * 移除用户信息
 */
export const removeUserInfo = (): void => {
  localStorage.removeItem(STORAGE_KEY.USER_INFO);
};

/**
 * 检查是否已登录
 */
export const isAuthenticated = (): boolean => {
  return (
    !!getToken() &&
    localStorage.getItem(STORAGE_KEY.IS_AUTHENTICATED) === "true"
  );
};

/**
 * 清除所有认证信息
 */
export const clearAuth = (): void => {
  removeToken();
  removeUserInfo();
  localStorage.removeItem(STORAGE_KEY.IS_AUTHENTICATED);
};

/**
 * 登出
 */
export const logout = async (): Promise<void> => {
  try {
    const { authApi } = await import("../api");
    await authApi.logout();
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    clearAuth();
    window.location.href = "/login";
  }
};
