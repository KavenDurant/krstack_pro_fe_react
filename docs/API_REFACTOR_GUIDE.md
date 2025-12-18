# API 重构指南

## 概述

本次重构将 API 封装升级为企业级标准，主要改进：

1. ✅ 环境变量配置（支持多环境）
2. ✅ 完善的类型定义
3. ✅ 统一的错误处理
4. ✅ 详细的请求日志
5. ✅ 标准化的配置管理

## 主要变更

### 1. 环境变量配置

**之前：**
```typescript
// 硬编码在代码中
BASE_URL: import.meta.env.DEV ? "" : "http://192.168.1.248:8000"
```

**现在：**
```bash
# .env.development
VITE_API_BASE_URL=http://192.168.1.248:8000
VITE_API_TIMEOUT=30000
VITE_SHOW_DEBUG=true
```

```typescript
// src/config/env.ts
export const ENV_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT),
  SHOW_DEBUG: import.meta.env.VITE_SHOW_DEBUG === "true",
};
```

### 2. 配置结构优化

**新增配置：**

```typescript
// HTTP 状态码
export const HTTP_STATUS = {
  OK: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  // ...
};

// 存储键名
export const STORAGE_KEY = {
  TOKEN: "token",
  USER_INFO: "userInfo",
  IS_AUTHENTICATED: "isAuthenticated",
  // ...
};

// 请求头配置
export const REQUEST_HEADERS = {
  CONTENT_TYPE: "Content-Type",
  AUTHORIZATION: "Authorization",
  ACCEPT: "Accept",
  // ...
};

// Content-Type 类型
export const CONTENT_TYPE = {
  JSON: "application/json",
  FORM_DATA: "multipart/form-data",
  // ...
};
```

### 3. 拦截器增强

**请求拦截器：**
- ✅ 自动添加 Authorization 头
- ✅ 开发环境请求日志
- ✅ 支持自定义配置

**响应拦截器：**
- ✅ 统一错误处理
- ✅ 401 自动跳转登录
- ✅ 开发环境响应日志
- ✅ 兼容多种响应格式

### 4. Vite 配置优化

**代理配置：**
```typescript
proxy: {
  "/api": {
    target: env.VITE_API_BASE_URL,
    changeOrigin: true,
    rewrite: path => path.replace(/^\/api/, ""),
    configure: proxy => {
      // 添加代理日志
      proxy.on("error", err => console.log("proxy error", err));
      proxy.on("proxyReq", (_proxyReq, req) => {
        console.log("Sending Request:", req.method, req.url);
      });
      proxy.on("proxyRes", (proxyRes, req) => {
        console.log("Received Response:", proxyRes.statusCode, req.url);
      });
    },
  },
}
```

## 迁移步骤

### 步骤 1：创建环境变量文件

```bash
# 复制模板文件
cp .env.example .env.development
cp .env.example .env.production

# 修改对应环境的配置
vim .env.development
```

### 步骤 2：更新导入路径

**之前：**
```typescript
import { API_CONFIG, TOKEN_KEY } from "@/api/config";
```

**现在：**
```typescript
import { API_CONFIG, STORAGE_KEY, HTTP_STATUS } from "@/api/config";
import { ENV_CONFIG } from "@/config/env";
```

### 步骤 3：更新存储键名

**之前：**
```typescript
localStorage.getItem("token");
localStorage.getItem("userInfo");
```

**现在：**
```typescript
import { STORAGE_KEY } from "@/api/config";

localStorage.getItem(STORAGE_KEY.TOKEN);
localStorage.getItem(STORAGE_KEY.USER_INFO);
```

### 步骤 4：重启开发服务器

```bash
# 停止当前服务器
# Ctrl + C

# 重新启动
npm run dev
```

## 环境配置

### 开发环境

```bash
# .env.development
VITE_APP_TITLE=KRSTACK PRO - 开发环境
VITE_APP_ENV=development
VITE_API_BASE_URL=http://192.168.1.248:8000
VITE_API_TIMEOUT=30000
VITE_USE_MOCK=false
VITE_SHOW_DEBUG=true
```

### 测试环境

```bash
# .env.test
VITE_APP_TITLE=KRSTACK PRO - 测试环境
VITE_APP_ENV=test
VITE_API_BASE_URL=http://test.krstack.com
VITE_API_TIMEOUT=30000
VITE_USE_MOCK=false
VITE_SHOW_DEBUG=true
```

### 生产环境

```bash
# .env.production
VITE_APP_TITLE=KRSTACK PRO
VITE_APP_ENV=production
VITE_API_BASE_URL=https://api.krstack.com
VITE_API_TIMEOUT=30000
VITE_USE_MOCK=false
VITE_SHOW_DEBUG=false
```

## 构建命令

```bash
# 开发环境
npm run dev

# 测试环境构建
npm run build -- --mode test

# 生产环境构建
npm run build

# 预览构建结果
npm run preview
```

## 新增功能

### 1. 环境信息打印

开发环境下会自动打印环境配置：

```
🌍 Environment Config
Environment: development
API Base URL: http://192.168.1.248:8000
API Timeout: 30000
Use Mock: false
```

### 2. 请求日志

开发环境下会自动打印请求和响应：

```
📤 Request: {
  method: "GET",
  url: "/api/clusters",
  params: {},
  hasToken: true
}

📥 Response: {
  url: "/api/clusters",
  status: 200,
  data: {...}
}
```

### 3. 代理日志

Vite 代理会打印转发信息：

```
Sending Request: GET /api/clusters
Received Response: 200 /api/clusters
```

### 4. 调试工具

开发环境下可使用：

```javascript
// 检查环境配置
console.log(ENV_CONFIG);

// 检查认证状态
window.debugAuth();

// 清除认证数据
window.clearAuth();
```

## 最佳实践

### 1. 使用环境变量

```typescript
// ✅ 好的做法
import { ENV_CONFIG } from "@/config/env";
const apiUrl = ENV_CONFIG.API_BASE_URL;

// ❌ 避免硬编码
const apiUrl = "http://192.168.1.248:8000";
```

### 2. 使用配置常量

```typescript
// ✅ 好的做法
import { STORAGE_KEY, HTTP_STATUS } from "@/api/config";

if (response.status === HTTP_STATUS.OK) {
  localStorage.setItem(STORAGE_KEY.TOKEN, token);
}

// ❌ 避免魔法数字和字符串
if (response.status === 200) {
  localStorage.setItem("token", token);
}
```

### 3. 类型安全

```typescript
// ✅ 好的做法
import type { ApiResponse, Cluster } from "@/api";
const response: ApiResponse<Cluster[]> = await clusterApi.getClusterList();

// ❌ 避免使用 any
const response: any = await clusterApi.getClusterList();
```

## 常见问题

### Q: 修改环境变量后不生效？

A: 需要重启开发服务器。Vite 只在启动时读取环境变量。

### Q: 如何在代码中判断当前环境？

A: 使用 `src/config/env.ts` 中的工具函数：

```typescript
import { isDev, isProd, isTest, ENV_CONFIG } from "@/config/env";

if (isDev) {
  console.log("开发环境");
}

if (ENV_CONFIG.APP_ENV === "production") {
  // 生产环境特殊处理
}
```

### Q: 如何添加新的环境变量？

A: 
1. 在 `.env.*` 文件中添加变量（必须以 `VITE_` 开头）
2. 在 `src/config/env.ts` 中添加类型定义
3. 重启开发服务器

### Q: 生产环境如何配置？

A: 
1. 修改 `.env.production` 文件
2. 运行 `npm run build`
3. 部署 `dist` 目录

### Q: 如何禁用请求日志？

A: 设置 `VITE_SHOW_DEBUG=false`

## 向后兼容

为了保持向后兼容，以下内容仍然可用：

```typescript
// TOKEN_KEY 仍然可用（指向 STORAGE_KEY.TOKEN）
import { TOKEN_KEY } from "@/api/config";

// BUSINESS_CODE 保持不变
import { BUSINESS_CODE } from "@/api/config";

// API_PREFIX 保持不变
import { API_PREFIX } from "@/api/config";
```

## 检查清单

升级完成后，请检查：

- [ ] 环境变量文件已创建并配置
- [ ] 开发服务器可以正常启动
- [ ] 登录功能正常
- [ ] API 请求正常
- [ ] 控制台有环境配置日志
- [ ] 控制台有请求/响应日志（开发环境）
- [ ] 401 错误会自动跳转登录页
- [ ] 生产构建正常

## 回滚方案

如果遇到问题需要回滚：

1. 恢复 `src/api/config/index.ts` 的旧版本
2. 恢复 `src/api/request/instance.ts` 的旧版本
3. 恢复 `vite.config.ts` 的旧版本
4. 删除 `src/config/env.ts`
5. 删除 `.env.*` 文件

## 技术支持

如有问题，请查看：

- `src/api/README.md` - API 使用文档
- `docs/DEBUG_401_ISSUE.md` - 401 问题调试
- `docs/QUICK_FIX_401.md` - 快速修复指南
