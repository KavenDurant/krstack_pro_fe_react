# API 使用指南

## 目录结构

```
src/api/
├── config/                    # 配置文件
│   └── index.ts              # API 配置
├── request/                  # 请求封装
│   ├── instance.ts           # Axios 实例
│   └── index.ts              # 请求方法
├── modules/                  # API 模块
│   ├── auth/                 # 认证模块
│   │   ├── index.ts         # 接口调用
│   │   └── types.ts         # 类型定义
│   ├── user/                 # 用户模块
│   │   ├── index.ts
│   │   └── types.ts
│   ├── vm/                   # 虚拟机模块
│   │   ├── index.ts
│   │   └── types.ts
│   └── cluster/              # 集群模块
│       ├── index.ts
│       └── types.ts
├── types.ts                  # 通用类型
├── mockData.ts               # Mock 数据
└── index.ts                  # 统一导出
```

## 使用示例

### 1. 集群管理

```typescript
import { clusterApi } from "@/api";
import type { AddClusterParams } from "@/api";

// 获取集群列表
const fetchClusters = async () => {
  const response = await clusterApi.getClusterList();
  console.log(response.data.list);
};

// 添加集群
const addCluster = async () => {
  const params: AddClusterParams = {
    name: "cluster-1",
    type: "proxmox",
    host: "192.168.1.100",
    port: 8006,
    username: "root",
    password: "password",
  };
  await clusterApi.addClusterList(params);
};

// 删除集群
const deleteCluster = async (id: string) => {
  await clusterApi.deleteClusterList(id);
};

// 获取物理机列表
const fetchPhysicalNodes = async (clusterId: string) => {
  const response = await clusterApi.getPhysicalList(clusterId);
  console.log(response.data);
};
```

### 2. 虚拟机管理

```typescript
import { vmApi } from "@/api";
import type { VMListParams, CreateVMParams } from "@/api";

// 获取虚拟机列表
const fetchVMs = async () => {
  const params: VMListParams = {
    page: 1,
    pageSize: 10,
    status: "running",
  };
  const response = await vmApi.getVMList(params);
  console.log(response.data.list);
};

// 创建虚拟机
const createVM = async () => {
  const params: CreateVMParams = {
    name: "vm-test",
    clusterId: 1,
    nodeId: "node-1",
    cpuTotal: 4,
    memTotal: 8589934592,
    diskSize: 107374182400,
  };
  await vmApi.createVM(params);
};

// 启动虚拟机
const startVM = async (id: string) => {
  await vmApi.startVM(id);
};

// 停止虚拟机
const stopVM = async (id: string) => {
  await vmApi.stopVM(id);
};

// 重启虚拟机
const rebootVM = async (id: string) => {
  await vmApi.rebootVM(id);
};
```

### 3. 用户管理

```typescript
import { userApi } from "@/api";
import type { UserListParams, CreateUserParams } from "@/api";

// 获取用户列表
const fetchUsers = async () => {
  const params: UserListParams = {
    page: 1,
    pageSize: 10,
    role: "admin",
  };
  const response = await userApi.getUserList(params);
  console.log(response.data.list);
};

// 创建用户
const createUser = async () => {
  const params: CreateUserParams = {
    username: "testuser",
    email: "test@example.com",
    password: "123456",
    role: "user",
  };
  await userApi.createUser(params);
};

// 获取当前用户
const getCurrentUser = async () => {
  const response = await userApi.getCurrentUser();
  console.log(response.data);
};
```

### 4. 认证

```typescript
import { authApi } from "@/api";
import type { LoginParams } from "@/api";

// 登录
const handleLogin = async () => {
  const params: LoginParams = {
    username: "admin",
    password: "123456",
  };

  const response = await authApi.login(params);

  if (response.code === 200) {
    // 保存 token
    localStorage.setItem("token", response.data.token);
    console.log("登录成功", response.data.user);
  }
};

// 登出
const handleLogout = async () => {
  await authApi.logout();
  localStorage.removeItem("token");
};

// 刷新 token
const refreshToken = async () => {
  const response = await authApi.refreshToken();
  localStorage.setItem("token", response.data.token);
};
```

## 在组件中使用

```typescript
import { useState, useEffect } from 'react';
import { message } from 'antd';
import { clusterApi } from '@/api';
import type { Cluster } from '@/api';

const ClusterList = () => {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取集群列表
  const fetchClusters = async () => {
    setLoading(true);
    try {
      const response = await clusterApi.getClusterList();
      if (response.code === 200) {
        setClusters(response.data.list);
      }
    } catch (error) {
      console.error('获取集群列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 删除集群
  const handleDelete = async (id: string) => {
    try {
      await clusterApi.deleteClusterList(id);
      message.success('删除成功');
      fetchClusters();
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  useEffect(() => {
    fetchClusters();
  }, []);

  return (
    <div>
      {/* 组件 JSX */}
    </div>
  );
};
```

## 请求配置

```typescript
// 不显示错误提示
await clusterApi.getClusterList({}, { showError: false });

// 显示加载状态
await clusterApi.getClusterList({}, { showLoading: true });

// 自定义超时时间
await clusterApi.getClusterList({}, { timeout: 5000 });
```

## 添加新模块

### 1. 创建模块文件夹

```bash
mkdir -p src/api/modules/node
```

### 2. 创建类型定义（types.ts）

```typescript
// src/api/modules/node/types.ts
export interface Node {
  id: string;
  name: string;
  status: string;
  cpu: number;
  memory: number;
}

export interface NodeListParams {
  clusterId: string;
  status?: string;
}
```

### 3. 创建接口调用（index.ts）

```typescript
// src/api/modules/node/index.ts
import { get, post, del } from "../../request/index";
import type { ApiResponse } from "../../types";
import type { Node, NodeListParams } from "./types";

const URL = {
  list: "nodes",
} as const;

export const getNodeList = async (
  params: NodeListParams
): Promise<ApiResponse<Node[]>> => {
  return get<Node[]>(URL.list, params);
};

export const createNode = async (
  data: Omit<Node, "id">
): Promise<ApiResponse<Node>> => {
  return post<Node>(URL.list, data);
};

export const deleteNode = async (id: string): Promise<ApiResponse<null>> => {
  return del<null>(`${URL.list}/${id}`);
};
```

### 4. 在 index.ts 中导出

```typescript
// src/api/index.ts
export * as nodeApi from "./modules/node/index";
export type { Node, NodeListParams } from "./modules/node/types";
```

## 注意事项

1. **每个模块一个文件夹**，包含 `index.ts`（接口调用）和 `types.ts`（类型定义）
2. **使用 const 定义 URL**，避免 enum 的 erasableSyntaxOnly 问题
3. **完整的类型定义**，不使用 `any` 类型
4. **统一的错误处理**，在拦截器中自动处理
5. **导入路径使用 `/index`**，确保模块正确导入
