# 登录功能说明

## 概述

登录功能已接入真实 API，支持用户认证、Token 管理和会话保持。

## API 接口

### 1. 用户登录

```typescript
import { authApi } from "@/api";

const response = await authApi.login({
  user_name: "admin",
  password: "password123",
});

// 响应数据
// response.data.token: string
// response.data.user?: UserInfo
```

### 2. 用户登出

```typescript
import { authApi } from "@/api";

await authApi.logout();
```

### 3. 刷新 Token

```typescript
import { authApi } from "@/api";

const response = await authApi.refreshToken();
// response.data.token: string
```

### 4. 修改密码

```typescript
import { authApi } from "@/api";

await authApi.changePassword("username", {
  old_password: "old123",
  password: "new123",
  pwd: "new123",
});
```

### 5. 获取告警日志

```typescript
import { authApi } from "@/api";

// 获取所有告警日志
const response = await authApi.getAlarmLog();

// 带时间筛选
const response = await authApi.getAlarmLogModal({
  start_time: "2024-01-01T00:00:00Z",
  end_time: "2024-12-31T23:59:59Z",
  last_id: null,
  last_time: null,
});
```

## 工具函数

### 认证工具 (src/utils/auth.ts)

```typescript
import {
  getToken,
  setToken,
  removeToken,
  getUserInfo,
  setUserInfo,
  removeUserInfo,
  isAuthenticated,
  clearAuth,
  logout,
} from "@/utils/auth";

// 获取 Token
const token = getToken();

// 设置 Token
setToken("your-token");

// 检查是否已登录
if (isAuthenticated()) {
  // 用户已登录
}

// 获取用户信息
const userInfo = getUserInfo();

// 登出
await logout();
```

## 数据类型

### LoginParams

```typescript
interface LoginParams {
  user_name: string;
  password: string;
}
```

### LoginResponse

```typescript
interface LoginResponse {
  jwt_token: string;
  user_id: number;
  user_name: string;
  nickname: string;
  user_type: string;
}
```

### UserInfo

```typescript
interface UserInfo {
  user_id: number;
  user_name: string;
  nickname: string;
  user_type: string;
}
```

### AlarmLog

```typescript
interface AlarmLog {
  id: number;
  message: string;
  created_at: string;
}
```

## 登录流程

1. 用户输入用户名和密码
2. 调用 `authApi.login()` 接口
3. 成功后保存 Token 到 localStorage
4. 保存用户信息（如果有）
5. 设置认证状态标记
6. 跳转到主页面

## 登出流程

1. 调用 `authApi.logout()` 接口
2. 清除 Token
3. 清除用户信息
4. 清除认证状态标记
5. 跳转到登录页

## 代理配置

开发环境使用 Vite 代理避免跨域问题：

```typescript
// vite.config.ts
server: {
  proxy: {
    "/api": {
      target: "http://192.168.1.248:8000",
      changeOrigin: true,
      rewrite: path => path.replace(/^\/api/, ""),
    },
  },
}
```

生产环境直接使用完整 URL：

```typescript
// src/api/config/index.ts
BASE_URL: import.meta.env.DEV ? "" : "http://192.168.1.248:8000";
```

## Token 管理

### 请求拦截器

自动在请求头中添加 Token：

```typescript
config.headers.Authorization = `Bearer ${token}`;
```

### 响应拦截器

处理 401 未授权错误：

```typescript
case 401:
  message.error("未授权，请重新登录");
  localStorage.removeItem(TOKEN_KEY);
  window.location.href = "/login";
  break;
```

## 注意事项

1. Token 存储在 localStorage 中，key 为 `token`
2. 用户信息存储在 localStorage 中，key 为 `userInfo`
3. 认证状态标记存储在 localStorage 中，key 为 `isAuthenticated`
4. 所有 API 请求自动携带 Token
5. Token 过期或无效时自动跳转到登录页
6. 登出时会清除所有认证相关信息

## 安全建议

1. 生产环境建议使用 HTTPS
2. Token 应设置合理的过期时间
3. 敏感操作应要求重新验证
4. 定期刷新 Token 以保持会话
5. 登出时应调用后端接口使 Token 失效
