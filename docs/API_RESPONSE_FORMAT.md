# API 响应格式说明

## 概述

本项目的后端 API 返回两种不同的响应格式，前端需要兼容处理。

## 响应格式类型

### 1. 标准格式（带 code 字段）

大部分 API 使用标准格式：

```typescript
{
  "code": 200,
  "message": "success",
  "data": {
    // 实际数据
  }
}
```

**示例：**
```typescript
// 集群列表
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [...],
    "total": 10
  }
}
```

### 2. 直接返回格式（无 code 字段）

部分 API（如登录）直接返回数据：

```typescript
{
  "jwt_token": "...",
  "user_id": 2,
  "user_name": "admin",
  "nickname": "admin",
  "user_type": "admin"
}
```

## 前端处理方案

### 响应拦截器

在 `src/api/request/instance.ts` 中，响应拦截器会自动判断响应格式：

```typescript
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const data = response.data;

    // 如果响应有 code 字段，按照标准格式处理
    if (typeof data === "object" && data !== null && "code" in data) {
      const { code, message: msg } = data as ApiResponse;

      if (code === 200 || code === 0) {
        return response;
      }

      // 处理业务错误
      message.error(msg || "请求失败");
      return Promise.reject(data);
    }

    // 如果没有 code 字段，直接返回（登录接口等）
    return response;
  }
);
```

### POST 请求包装

在 `src/api/request/index.ts` 中，POST 请求会自动包装响应：

```typescript
export const post = <T = unknown>(
  url: string,
  data?: Record<string, unknown> | unknown,
  config?: ExtendedRequestConfig
): Promise<ApiResponse<T>> => {
  return request.post(url, data, config).then(res => {
    // 如果响应数据有 code 字段，返回标准格式
    if (res.data && typeof res.data === "object" && "code" in res.data) {
      return res.data;
    }
    // 否则包装成标准格式
    return {
      code: 200,
      message: "success",
      data: res.data,
    } as ApiResponse<T>;
  });
};
```

## 使用示例

### 标准格式 API

```typescript
// 集群列表 API
const response = await clusterApi.getClusterList();

if (response.code === 200) {
  console.log(response.data.list);
}
```

### 直接返回格式 API

```typescript
// 登录 API
const response = await authApi.login({
  user_name: "admin",
  password: "password",
});

// 自动包装后，可以统一使用
const data = response.data;
console.log(data.jwt_token);
console.log(data.user_name);
```

## API 列表

### 标准格式 API

- `GET /api/clusters` - 集群列表
- `POST /api/clusters` - 添加集群
- `DELETE /api/clusters/:id` - 删除集群
- `GET /api/clusters/:id/nodes` - 物理机列表
- 其他大部分 API

### 直接返回格式 API

- `POST /api/login` - 用户登录
- 可能还有其他认证相关接口

## 注意事项

1. **新增 API 时**：先确认后端返回格式，如果是直接返回格式，前端会自动包装
2. **错误处理**：标准格式的错误会在拦截器中统一处理，直接返回格式需要在业务代码中处理
3. **类型定义**：为直接返回格式的 API 定义准确的响应类型
4. **兼容性**：当前方案可以兼容两种格式，无需修改现有代码

## 建议

为了统一性和可维护性，建议：

1. **后端统一**：建议后端统一使用标准格式（带 code 字段）
2. **前端适配**：如果后端无法修改，前端当前的自动包装方案可以很好地处理
3. **文档同步**：新增 API 时在文档中明确标注响应格式
