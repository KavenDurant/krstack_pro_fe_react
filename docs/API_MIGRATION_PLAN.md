# API 接口迁移计划文档

## 概述

本文档详细列出了从 `/Users/luojiaxin/Project/krstack_pro_fe/src/service/api` 迁移到当前 React 项目的 API 接口计划。

## 当前项目 API 结构

当前项目已有模块：
- `auth` - 认证模块
- `user` - 用户管理
- `vm` - 虚拟机管理（基础功能）
- `cluster` - 集群管理
- `node` - 节点管理

## 源项目 API 模块分析

### 1. cloudDesk (云桌面管理) - 新模块

**位置**: `src/api/modules/cloudDesk/`

**需要迁移的接口**:

| 接口名称 | 方法 | 路径 | 说明 |
|---------|------|------|------|
| getCloudDeskList | GET | `desktops` | 获取云桌面列表 |
| startCloudDeskList | POST | `vms/start` | 开机云桌面 |
| stopCloudDeskList | POST | `vms/stop` | 关机云桌面 |
| rebootCloudDeskList | POST | `vms/reboot` | 重启云桌面 |
| deleteCloudDeskList | POST | `desktops/delete` | 删除云桌面 |
| getCloudDeskUserSelect | GET | `desktops/users` | 关联用户下拉列表 |
| synchronizeUser | GET | `desktops/user_synchronize` | 同步用户（全量） |
| incrementSynchronizeUser | GET | `desktops/user_increment` | 同步用户（增量） |
| relatedUser | POST | `desktops/user_attach` | 关联用户 |
| detachUser | POST | `desktops/user_detach` | 解绑用户 |
| getUsbChecked | GET | `desktops/policy/usb/desktop/{uuid}` | 获取 USB 策略 |
| putUsbChecked | PUT | `desktops/policy/usb/desktop/{uuid}` | 修改 USB 策略 |
| getDataChecked | GET | `desktops/policy/data_access/desktop/{uuid}` | 获取数据访问策略 |
| putDataChecked | PUT | `desktops/policy/data_access/desktop/{uuid}` | 修改数据访问策略 |
| getTransportProtocol | GET | `desktops/policy/transport_protocol/desktop/{uuid}` | 获取传输协议策略 |
| putTransportProtocol | PUT | `desktops/policy/transport_protocol/desktop/{uuid}` | 修改传输协议策略 |
| getCloudDeskServer | GET | `system/info` | 云桌面服务信息 |
| importCloudList | GET | `desktops/can_be_imported_desktops` | 导入云桌面列表 |
| importCloudDesk | POST | `desktops/import_desktop_to_vms` | 导入云桌面 |
| getGlobalUsbChecked | GET | `desktops/policy/usb/global_desktop` | 获取全局 USB 策略 |
| getGlobalDataChecked | GET | `desktops/policy/data_access/global_desktop` | 获取全局数据访问策略 |
| getGlobalHttpChecked | GET | `desktops/policy/transport_protocol/global_desktop` | 获取全局传输协议策略 |
| putGlobalUsbChecked | PUT | `desktops/policy/usb/global_desktop` | 修改全局 USB 策略 |
| putGlobalDataChecked | PUT | `desktops/policy/data_access/global_desktop` | 修改全局数据访问策略 |
| putGlobalHttpChecked | PUT | `desktops/policy/transport_protocol/global_desktop` | 修改全局传输协议策略 |

**类型定义**:
- `CloudDeskResType` - 云桌面响应类型
- `OperationParams` - 操作参数
- `DeleteCloudDeskParams` - 删除参数
- `DetachUserParams` - 解绑用户参数
- `RelatedUserParams` - 关联用户参数
- `ImportDesktopRes` - 导入桌面响应
- `DeskTopList` - 桌面列表
- `SynchronousUser` - 同步用户
- `ImportListResponse` - 导入列表响应
- `RootObject` - USB 策略根对象
- `DataRootObject` - 数据访问策略根对象
- `HttpRootObject` - 传输协议策略根对象

---

### 2. image (镜像管理) - 新模块

**位置**: `src/api/modules/image/`

**需要迁移的接口**:

| 接口名称 | 方法 | 路径 | 说明 |
|---------|------|------|------|
| getSystemImageList | GET | `images/system` | 获取系统镜像列表 |
| deleteSystemImageList | POST | `images/system/delete_images` | 删除系统镜像 |
| getTemplateImageList | GET | `images/template` | 获取模板镜像列表 |
| deleteTemplateImageList | POST | `images/template/delete_images` | 删除模板镜像 |
| upLoadingImage | POST | `images/system/upload/{type}/{storage_uid}` | 上传镜像 |
| getTemplateImageDetails | POST | `images/template/detail/{uid}` | 获取模板镜像详情 |
| getTemplateDescription | POST | `images/template/description` | 获取模板描述 |
| setTemplateImageBottom | POST | `images/template/description/{uid}` | 设置模板描述 |

**类型定义**:
- `TemplateDetailType` - 模板详情类型
- `DiskImage` - 磁盘镜像类型

---

### 3. storage (存储管理) - 新模块

**位置**: `src/api/modules/storage/`

**合并来源**: `stockpile` + `cluster_storage`

**需要迁移的接口**:

#### 来自 stockpile:

| 接口名称 | 方法 | 路径 | 说明 |
|---------|------|------|------|
| getStoragesList | GET | `storages/outside` | 获取外挂存储列表 |
| getInsideStoragesList | GET | `storages/inside` | 获取内置存储列表 |
| geExitList | GET | `storages/outside/{clusters_id}` | 编辑列表 |
| unMountStorage | POST | `storages/outside/unmount` | 卸载存储 |
| mountStorage | POST | `storages/outside/mount` | 挂载存储 |
| deleteOutsideStorages | DEL | `storages/outside` | 删除外挂存储 |
| getClusterSelectList | GET | `clusters` | 获取集群选择列表 |
| getPathOptions | POST | `storages/get_smb_cifs_path` | 获取路径选项 |
| addOutStorage | POST | `storages/outside` | 添加外挂存储 |
| getStorageSetting | GET | `storages/alarm_threshold` | 获取存储设置 |
| setStorageSetting | PUT | `storages/alarm_threshold` | 修改存储设置 |

#### 来自 cluster_storage:

| 接口名称 | 方法 | 路径 | 说明 |
|---------|------|------|------|
| getContent | POST | `storages/content` | 获取集群存储列表（已在 cluster 模块） |

**类型定义**:
- `Storage` - 存储类型
- `DeleteStoragePayload` - 删除存储载荷
- `StorageOutSidePayload` - 外挂存储载荷
- `StorageInsideList` - 内置存储列表
- `StorageAlarmThreshold` - 存储报警阈值
- `ExitClusterList` - 编辑集群列表
- `PlatformConfig` - 平台配置

---

### 4. dashboard (仪表盘/监控) - 新模块

**位置**: `src/api/modules/dashboard/`

**来源**: `cockpits`

**需要迁移的接口**:

| 接口名称 | 方法 | 路径 | 说明 |
|---------|------|------|------|
| getHeaderThirdEcharts | GET | `dashboard/cluster_hardware_monitor/{cluster_uid}` | 硬件监控（前三个图表） |
| getCloudHostEcharts | GET | `dashboard/cluster_vm_monitor/{cluster_uid}` | 云主机监控 |
| getCloudDeskEcharts | GET | `dashboard/cluster_cloud_desktop_monitor/{cluster_uid}` | 云桌面监控 |
| getCpuUsedEcharts | GET | `dashboard/cluster_cpu_monitor/{cluster_uid}?time_span={time}` | CPU 使用率 |
| getRamUsedEcharts | GET | `dashboard/cluster_mem_monitor/{cluster_uid}?time_span={time}` | 内存使用率 |
| getStorageList | GET | `dashboard/cluster_storages_monitor/{cluster_uid}` | 存储列表 |
| getCloudDeskRanking | GET | `dashboard/cloud_desktop_ranking` | 云桌面使用排行 |
| getAlarmLog | GET | `maintenance/alarm_log/alarm_carousels` | 告警信息 |
| getOperationLog | GET | `maintenance/system_log/historical` | 操作日志 |
| getOperationLogModal | POST | `maintenance/system_log/historical` | 操作日志（Modal） |
| getPersonList | GET | `users` | 人员列表 |
| getMarqueeList | GET | `maintenance/alarm_log/alarm_carousels` | 走马灯 |

**类型定义**:
- `headerListTYPE` - 头部列表类型
- `CloudDeskTYPE` - 云桌面类型
- `cloudHostTYPE` - 云主机类型
- `AlarmMessage` - 告警消息
- `OperationLog` - 操作日志

---

### 5. system (系统服务) - 新模块

**位置**: `src/api/modules/system/`

**来源**: `systemServer`

**需要迁移的接口**:

| 接口名称 | 方法 | 路径 | 说明 |
|---------|------|------|------|
| getSystemServer | GET | `system/info` | 获取系统服务信息 |
| setSystemServer | PUT | `system/info` | 修改系统信息 |
| getLicenseSystem | GET | `system/license` | 获取许可信息（上） |
| getLicenseSystemDown | GET | `system/desktop_license` | 获取许可信息（下） |
| exportLog | GET | `system/diagnosis_logs` | 导出日志 |
| createLog | POST | `system/diagnosis_logs` | 生成日志 |
| exportLogDownLoad | GET | `system/diagnosis_logs/{file_name}/download` | 下载日志 |
| getAutomaticSnapshots | GET | `system/feature_flag` | 获取自动快照 |
| setAutomaticSnapshots | POST | `system/feature_flag` | 修改自动快照 |
| deleteAutomaticSnapshots | DEL | `system/feature_flag/{flag_name}` | 删除自动快照 |
| cleanErrorOperation | POST | `system/clean_err_operation` | 清除异常任务 |

---

### 6. vmspec (虚拟机规格) - 新模块

**位置**: `src/api/modules/vmspec/`

**需要迁移的接口**:

| 接口名称 | 方法 | 路径 | 说明 |
|---------|------|------|------|
| getVmSpec | GET | `vms/spec` | 获取云主机规格列表 |
| createVmSpec | POST | `vms/spec` | 创建规格模版 |
| editVmSpec | PUT | `vms/spec/{spec_id}` | 编辑规格模版 |
| deleteVmSpec | POST | `vms/delete_specs` | 删除规格模版 |

**类型定义**:
- `VmSpecType` - 虚拟机规格类型
- `VmSpecTypeResponse` - 虚拟机规格响应
- `DeleteVmSpecResponse` - 删除规格响应

---

### 7. vm (虚拟机管理) - 补充现有模块

**位置**: `src/api/modules/vm/` (已存在，需要补充)

**需要补充的接口**:

| 接口名称 | 方法 | 路径 | 说明 |
|---------|------|------|------|
| deleteVMList | POST | `vms/delete` | 批量删除虚拟机 |
| openVMList | POST | `vms/start` | 批量开机 |
| closeVmList | POST | `vms/stop` | 批量关机 |
| rebootVMList | POST | `vms/reboot` | 批量重启 |
| cloneVMList | POST | `vms/clone` | 克隆虚拟机 |
| toTemplateVMList | POST | `vms/convert_template` | 转换成模板 |
| getResourcesList | GET | `clusters` | 获取资源列表 |
| getNodesForResource | GET | `nodes` | 获取物理机下拉 |
| createSelfConfig | POST | `vms/spec` | 创建自定义配置 |
| getVmDetailBaseInfo | GET | `vms/detail/{vm_uid}` | 云主机详情基本信息 |
| setVmName | POST | `vms/rename/{uid}` | 修改云主机名称 |
| setVmCpu | POST | `vms/spec_cpu/{uid}` | 修改云主机 CPU |
| setVmMen | POST | `vms/spec_mem/{uid}` | 修改内存容量 |
| getTemplateSelect | GET | `images/template` | 模板镜像选择列表 |
| createTemplate | POST | `vms/template` | 创建模板镜像 |
| getVMNetworkList | GET | `vms/network/{uid}` | 网卡列表 |
| exitNetWorkData | POST | `vms/network/mac/{uid}` | 编辑网卡数据 |
| deleteNetWorkData | POST | `vms/network/unmount/{uid}` | 卸载网卡 |
| getNetWorkSelect | GET | `nodes/cluster/{clusterId}/node/{node_name}/network` | 网桥网卡下拉 |
| addNetWorkData | POST | `vms/network/mount/{uid}` | 加载网卡设备 |
| getVMUSBList | GET | `vms/usb/{uid}` | USB 列表 |
| getUsbSelect | GET | `nodes/cluster/{clusterId}/node/{node_name}/usb` | USB 加载下拉框 |
| addUsbData | POST | `vms/usb/mount/{uid}` | 新增 USB 设备 |
| deleteCpuData | POST | `vms/usb/unmount/{uid}` | 卸载 USB 设备 |
| getVMGPUList | GET | `vms/gpu/{uid}` | GPU 列表 |
| deleteGpuData | POST | `vms/gpu/unmount/{vm_uid}` | GPU 卸载 |
| getGpuSelectData | GET | `nodes/gpu/{uid}` | 加载 GPU 下拉数据 |
| addGpuData | POST | `vms/gpu/mount/{vm_uid}` | 挂载 GPU 设备 |
| getMacIp | GET | `vms/mac` | 随机生成 MAC 地址 |
| getVMCDRomList | GET | `vms/cdrom/{uid}` | 虚拟光驱列表 |
| vmCDRomMount | POST | `vms/cdrom/mount/{vm_uid}` | 挂载虚拟光驱 |
| vmCDRomUnmount | POST | `vms/cdrom/unmount/{uid}` | 卸载虚拟光驱 |
| getResource | GET | `vms/distribution/{node_uid}` | 获取资源 |
| getVMDiskList | GET | `vms/disk/{uid}` | 云硬盘列表 |
| createCloudDisk | POST | `vms/disk/mount/{vm_uid}` | 创建云硬盘 |
| unmountDisk | POST | `vms/disk/unmount/{vm_uid}` | 删除云硬盘 |
| moveDisk | POST | `vms/disk/migrate/{vm_uid}` | 迁移云硬盘 |
| resizeDisk | POST | `vms/disk/resize/{vm_uid}` | 扩容云硬盘 |
| getVMConsoleAddress | GET | `vms/console/{uid}` | 获取控制台地址 |
| getVMBackupList | GET | `vms/{vm_uid}/backup` | 获取备份列表 |
| deleteBackUpList | DEL | `vms/backup/{backup_uid}` | 删除备份 |
| applyBackUp | POST | `vms/backup/{backup_uid}/apply` | 恢复备份 |
| createVMBackupi | POST | `vms/{vm_uid}/backup` | 创建云主机备份 |
| getVMSnapshotList | GET | `vms/{vm_uid}/snapshot` | 快照列表 |
| VMSnapshotRemark | PUT | `vms/snapshot/{snapshot_uid}/description` | 快照备注 |
| VMSnapshotRemark1 | PUT | `vms/backup/{backup_uid}/remark` | 备份备注 |
| useQuickPhoto | POST | `vms/snapshot/{snapshot_uid}` | 应用快照 |
| deleteQuickPhoto | DEL | `vms/snapshot/{snapshot_uid}` | 删除快照 |
| createVMSnapshot | POST | `vms/{vm_uid}/snapshot` | 创建快照 |
| getVMMonitorData | GET | `vms/{vm_uid}/monitor/{time_frame}/{data_type}` | 性能监控 |
| getMirroring | GET | `images/system` | 镜像选择 |
| getCustomConfigs | GET | `vms/spec` | 创建自定义配置 |
| getCreateVm | POST | `vms/system` | 创建云主机 |
| getCloudDisk | GET | `storages/alarm_threshold` | 云硬盘存储设置 |
| getVMSnapshotStrategy | GET | `vms/{vm_uid}/snapshot/strategy` | 云主机快照策略 |
| changeVmSnapshotStrategy | PUT | `vms/{vm_uid}/snapshot/strategy` | 修改云主机快照策略 |
| getSnapshotHierarchy | GET | `vms/{vm_uid}/snapshot/hierarchy` | 快照层级列表 |
| setSelfStarting | POST | `vms/spec_onboot/{uid}` | 修改开机自启动开关 |
| getVmTags | GET | `vms/tag` | 查询云主机标签库所有标签 |
| addVmTags | POST | `vms/tag` | 云主机标签库新增标签 |
| setVmTags | PUT | `vms/{vm_uid}/tag` | 云主机设置标签 |
| setLeadProjects | PUT | `vms/boot/{uid}` | 修改云主机详情引导项 |
| getLeadProjects | GET | `vms/boot/{uid}` | 获取修改云主机详情引导项 |
| getIpAddress | GET | `vms/network/ip/{vm_uid}` | 获取 IP 地址信息 |
| setIpAddress | POST | `vms/network/ip/{vm_uid}` | 修改 IP 地址信息 |

**需要补充的类型定义**:
- `VMArray` - 虚拟机数组
- `VmStartPayload` - 启动载荷
- `TagData` - 标签数据
- `ExecutionPlanConfig` - 执行计划配置
- `VMMonitorQueryParams` - 监控查询参数
- `MountDisk` - 挂载磁盘
- `CreateVMBackup` - 创建备份
- `UnmountDisk` - 卸载磁盘
- `MigrateDisk` - 迁移磁盘
- `createCloudDiskTYPE` - 创建云硬盘类型
- `VMCDRomMount` - 虚拟光驱挂载
- `VMCDRomUnmount` - 虚拟光驱卸载
- `Tag` - 标签
- `VmData` - 虚拟机数据
- `TableRow` - 表格行
- `SelectRowDataType` - 选择行数据类型
- `SetLeadProjectsData` - 设置引导项数据
- `VmSystemCreateParams` - 系统创建参数
- `VmTemplateCreateParams` - 模板创建参数
- `ImageListType` - 镜像列表类型
- `TemplateImageType` - 模板镜像类型
- `VmUpDataNetwork` - 更新网络数据
- `netWorkListType` - 网络列表类型
- `LoadGpu` - 加载 GPU
- `VmUse` - 虚拟机使用
- `CdromList` - 光驱列表
- `StorageDisk` - 存储磁盘
- `IsoImage` - ISO 镜像
- `LoadComponentFormState` - 加载组件表单状态
- `NetworkItem` - 网络项
- `NetworkConfigResponse` - 网络配置响应
- `IpConfigRequest` - IP 配置请求

---

### 8. user (用户管理) - 补充现有模块

**位置**: `src/api/modules/user/` (已存在，需要补充)

**需要补充的接口**:

| 接口名称 | 方法 | 路径 | 说明 |
|---------|------|------|------|
| resetPassword | POST | `users/{name}/reset_password` | 重置密码 |

**需要补充的类型定义**:
- `DeleteUserRequest` - 删除用户请求（来自 image/types.ts）

---

### 9. auth (认证模块) - 补充现有模块

**位置**: `src/api/modules/auth/` (已存在，需要补充)

**需要补充的接口**:

| 接口名称 | 方法 | 路径 | 说明 |
|---------|------|------|------|
| getTaskQueue | GET | `maintenance/operation_log/current` | 任务队列 |
| getHistoryTask | GET | `maintenance/operation_log/historical` | 历史任务 |
| getHistoryTaskTime | POST | `maintenance/operation_log/historical` | 历史任务（时间） |
| getAlarmLog | GET | `maintenance/alarm_log/historical` | 告警信息 |
| getAlarmLogModal | POST | `maintenance/alarm_log/historical` | 告警信息（Modal） |

**需要补充的类型定义**:
- `PostHistoryList` - 历史列表参数（已在 login/index.ts 中定义）

---

## 迁移优先级

### 高优先级（核心功能）
1. **vm** - 补充虚拟机管理接口（大量功能缺失）
2. **cloudDesk** - 云桌面管理（新功能）
3. **image** - 镜像管理（新功能）

### 中优先级（重要功能）
4. **storage** - 存储管理（合并两个模块）
5. **dashboard** - 仪表盘监控（新功能）
6. **vmspec** - 虚拟机规格（新功能）

### 低优先级（辅助功能）
7. **system** - 系统服务（新功能）
8. **user** - 补充用户管理接口
9. **auth** - 补充认证模块接口

---

## 迁移注意事项

### 1. 代码规范
- 遵循项目现有的 API 结构规范
- 使用 `const URL = {...}` 而不是 `enum URL`
- 所有类型定义必须明确，不使用 `any`
- 遵循项目的命名规范（camelCase）

### 2. 请求方法适配
- 源项目使用 Vue 的 HTTP 封装，需要适配到当前项目的 Axios 封装
- 注意请求参数格式的差异
- 注意响应数据格式的差异

### 3. 类型定义
- 所有类型定义需要从 Vue 项目迁移并适配
- 注意字段命名风格的统一（snake_case → camelCase）
- 需要定义完整的类型，避免使用 `any`

### 4. 模块组织
- 每个模块包含 `index.ts`（接口调用）和 `types.ts`（类型定义）
- 在 `src/api/index.ts` 中统一导出
- 遵循现有的模块结构

### 5. 数据转换
- 如果后端返回的数据格式与前端使用格式不一致，需要添加转换函数
- 参考 `cluster` 模块的数据转换模式

### 6. 接口路径
- 注意源项目中的路径可能包含 `/api` 前缀，需要确认当前项目的路径配置
- 检查 `src/api/config/index.ts` 中的 `API_PREFIX` 配置

---

## 迁移步骤建议

1. **按照当前模块体系创建 API 目录结构**
   ```bash
   src/api/modules/
   ├── auth/
   │   ├── index.ts
   │   └── types.ts
   ├── user/
   │   ├── index.ts
   │   └── types.ts
   ├── vm/
   │   ├── index.ts
   │   └── types.ts
   ├── cluster/
   │   ├── index.ts
   │   └── types.ts
   ├── node/
   │   ├── index.ts
   │   └── types.ts
   ├── cloudDesk/
   │   ├── index.ts
   │   └── types.ts
   ├── image/
   │   ├── index.ts
   │   └── types.ts
   ├── storage/
   │   ├── index.ts
   │   └── types.ts
   ├── dashboard/
   │   ├── index.ts
   │   └── types.ts
   ├── system/
   │   ├── index.ts
   │   └── types.ts
   └── vmspec/
       ├── index.ts
       └── types.ts
   ```

2. **迁移类型定义**
   - 先迁移 `types.ts`，确保类型定义完整
   - 将 snake_case 转换为 camelCase（如需要）

3. **迁移接口调用**
   - 迁移 `index.ts`，适配请求方法
   - 添加必要的参数验证和错误处理

4. **更新导出文件**
   - 在 `src/api/index.ts` 中添加新模块的导出
   - 导出所有类型定义

5. **测试验证**
   - 确保所有接口调用正确
   - 验证类型定义完整
   - 检查是否有遗漏的接口

---

## 统计信息

- **新模块数量**: 6 个（cloudDesk, image, storage, dashboard, system, vmspec）
- **需要补充的模块**: 3 个（vm, user, auth）
- **总接口数量**: 约 150+ 个接口
- **类型定义数量**: 约 80+ 个类型

---

## 后续工作

1. 根据实际使用情况调整接口优先级
2. 与后端确认接口路径和参数格式
3. 逐步迁移并测试每个模块
4. 更新 API 使用文档（USAGE.md）

