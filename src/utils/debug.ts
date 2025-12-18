/**
 * 调试工具函数
 */
import { STORAGE_KEY } from "../api/config";

/**
 * 检查认证状态
 */
export const checkAuthStatus = () => {
  const token = localStorage.getItem(STORAGE_KEY.TOKEN);
  const isAuthenticated = localStorage.getItem(STORAGE_KEY.IS_AUTHENTICATED);
  const userInfo = localStorage.getItem(STORAGE_KEY.USER_INFO);

  console.group("🔍 Auth Status Check");
  console.log(
    "Token:",
    token ? `${token.substring(0, 30)}...` : "❌ Not found"
  );
  console.log("Is Authenticated:", isAuthenticated);
  console.log("User Info:", userInfo ? JSON.parse(userInfo) : "❌ Not found");
  console.log("Token Length:", token?.length || 0);
  console.log("Storage Keys:", {
    TOKEN: STORAGE_KEY.TOKEN,
    USER_INFO: STORAGE_KEY.USER_INFO,
    IS_AUTHENTICATED: STORAGE_KEY.IS_AUTHENTICATED,
  });
  console.groupEnd();

  return {
    hasToken: !!token,
    isAuthenticated: isAuthenticated === "true",
    userInfo: userInfo ? JSON.parse(userInfo) : null,
  };
};

/**
 * 清除所有认证信息（用于调试）
 */
export const clearAllAuth = () => {
  console.log("🧹 Clearing all auth data...");
  localStorage.removeItem(STORAGE_KEY.TOKEN);
  localStorage.removeItem(STORAGE_KEY.IS_AUTHENTICATED);
  localStorage.removeItem(STORAGE_KEY.USER_INFO);
  console.log("✅ Auth data cleared");
};

/**
 * 手动设置 Token（用于调试）
 */
export const setDebugToken = (token: string) => {
  console.log("🔧 Setting debug token...");
  localStorage.setItem(STORAGE_KEY.TOKEN, token);
  localStorage.setItem(STORAGE_KEY.IS_AUTHENTICATED, "true");
  console.log("✅ Token set:", token.substring(0, 30) + "...");
};

// 在开发环境下暴露到 window 对象
if (import.meta.env.DEV) {
  (window as unknown as { debugAuth: typeof checkAuthStatus }).debugAuth =
    checkAuthStatus;
  (window as unknown as { clearAuth: typeof clearAllAuth }).clearAuth =
    clearAllAuth;
  (window as unknown as { setToken: typeof setDebugToken }).setToken =
    setDebugToken;

  console.log("🛠️ Debug tools available:");
  console.log("  - window.debugAuth() - Check auth status");
  console.log("  - window.clearAuth() - Clear all auth data");
  console.log("  - window.setToken(token) - Set debug token");
}
