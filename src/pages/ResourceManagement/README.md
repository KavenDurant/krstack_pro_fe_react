# 集群管理模块

## 概述

集群管理模块已接入真实 API，支持完整的 CRUD 操作和数据展示。

## API 接口

### 1. 获取集群列表

```typescript
import { clusterApi } from "@/api";

const response = await clusterApi.getClusterList();
// response.data.list: Cluster[]
// response.data.total: number
```

### 2. 获取集群详情

```typescript
const response = await clusterApi.getClusterDetail(clusterId);
// response.data: Cluster
```

### 3. 添加集群

```typescript
import type { AddClusterParams } from "@/api";

const params: AddClusterParams = {
  name: "cluster-name",
  controlAddress: "192.168.1.100",
  platform: "KRCloud",
  technology: "KVM",
  authInfo: "token-or-password",
};

const response = await clusterApi.addCluster(params);
```

### 4. 更新集群

```typescript
import type { UpdateClusterParams } from "@/api";

const params: UpdateClusterParams = {
  name: "new-name",
  controlAddress: "192.168.1.101",
};

const response = await clusterApi.updateCluster(clusterId, params);
```

### 5. 删除集群

```typescript
const response = await clusterApi.deleteCluster(clusterId);
```

### 6. 同步集群

```typescript
const response = await clusterApi.syncCluster(clusterId);
```

### 7. 获取物理机列表

```typescript
const response = await clusterApi.getPhysicalList(clusterId);
// response.data: PhysicalNode[]
```

## 数据类型

### Cluster

```typescript
interface Cluster {
  id: string;
  name: string;
  status: "running" | "syncing" | "stopped" | "error";
  controlAddress: string;
  platform: string;
  technology: string;
  hostCount: number;
  lastSyncTime: string;
  authInfo?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### PhysicalNode

```typescript
interface PhysicalNode {
  id: string;
  name: string;
  status: string;
  cpu: number;
  maxcpu: number;
  mem: number;
  maxmem: number;
  uptime: number;
}
```

## 功能特性

### 已实现功能

- ✅ 集群列表展示（带搜索过滤）
- ✅ 添加集群
- ✅ 删除集群（带确认弹窗）
- ✅ 集群详情查看
- ✅ 物理机列表展示
- ✅ 刷新数据
- ✅ 加载状态显示
- ✅ 错误提示

### 组件说明

#### ResourceManagement (主页面)

- 管理集群列表的展示和操作
- 处理搜索、添加、删除、刷新等操作
- 使用真实 API 获取和更新数据

#### ClusterTable (集群表格)

- 展示集群列表
- 支持排序、选择、删除操作
- 点击集群名称查看详情

#### ClusterAddModal (添加集群弹窗)

- 表单验证
- 调用真实 API 添加集群
- 成功后刷新列表

#### ClusterDetail (集群详情)

- 展示集群基本信息
- 展示物理机列表（从 API 获取）
- 支持物理机搜索过滤

## 注意事项

1. 所有 API 调用都包含错误处理和用户提示
2. 使用 TypeScript 严格类型检查，避免使用 `any`
3. 遵循项目的间距和样式规范
4. 加载状态和错误状态都有相应的 UI 反馈
