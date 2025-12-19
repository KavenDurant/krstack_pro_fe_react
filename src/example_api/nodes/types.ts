export interface NodeRowData {
  cluster_id: number // 集群 ID
  cluster_name: string // 集群名称
  ip: string // 节点 IP 地址
  name: string // 节点名称
  node_uid: string // 节点唯一标识符
  status: string // 节点状态，例如 "online"
}
export interface NodeTreeType {
  label: string
  value: number
}

export interface TreeNode {
  value: number | string // 节点值，可能是数字或字符串
  label: string // 节点显示的标签
  children?: TreeNode[] // 子节点，递归结构，可能为空
}
export interface VMResponse {
  vms: VM[]
}
export interface VM {
  node_uid: string
  id: string
  name: string
  vm_id: number
  status: 'Running' | 'Stopped'
  cluster_id: number
  node_name: string
  cpu_total: number
  mem_total: number
  ip: string
  os_type: 'Windows' | 'Other'
}
export interface VMDetails {
  id: string // 虚拟机唯一标识符
  name: string // 虚拟机名称
  vm_uid: string // 虚拟机的唯一 UID
  status: 'stopped' | 'running' // 虚拟机状态 (e.g., "Stopped", "Running")
  cluster_id: number // 所属集群 ID
  cluster_name: string // 所属集群名称
  node_name: string // 节点名称
  cpu_total: number // CPU 核心总数
  mem_total: number // 内存总量（单位：字节）
  ip: string // 虚拟机 IP 地址
  os_type: string // 操作系统类型 (e.g., "Linux", "Windows")
}
export interface Storage {
  name: string // 存储名称
  storage_uid: string // 存储唯一标识符
  disk_total: number // 磁盘总容量（单位：字节）
  disk_used: number // 磁盘已使用容量（单位：字节）
  disk_left: number // 磁盘剩余容量（单位：字节）
  type: string // 存储类型（例如：LocalStorage 或 NFS）
  status: string // 存储状态（例如：available）
  shared: boolean // 是否为共享存储
  cluster_id?: number
}
export interface NetworkSettingInterface {
  name: string
  type: string
  active: boolean
  autostart: boolean | null
  vlan_aware: boolean | null
  port: string | null
  bond_mode: string | null
  cidr: string | null
  gateway: string | null
  comments: string | null
}
export interface NetworkBridge {
  uid: string
  name: string
  type: 'bridge' // 类型固定为 "bridge"
  status: 'normal' | 'down' | 'error' | string // 限定状态值
  ip: string
  ports: string
}
export interface GpuVmUse {
  name: string // 虚拟机名称
  vm_uid: string // 虚拟机唯一标识符
  gpu_id: string // GPU ID
  gpu_name: string // GPU 名称
  status: string // GPU 状态
}
export interface Gpu {
  id: string // GPU 唯一标识符
  status: string // GPU 状态 (normal/occupied)
  device_name: string // 设备名称
  manufacturer: string // 制造商
  vm_use: GpuVmUse[] // 使用该 GPU 的虚拟机信息
}
export interface USB {
  uid: string // 唯一标识符
  id: string // 设备标识符
  name: string // 设备名称
  host: string // 设备主机标识符
  manufacturer: string // 制造商
  product: string // 产品名称
  status: 'normal' | 'occupied' | string // 设备状态
  vm_use: UsbVmUse[] // 使用该USB设备的虚拟机信息
}
export interface UsbVmUse {
  name: string // 虚拟机名称
  vm_uid: string // 虚拟机唯一标识符
  usb_uid: string // USB设备唯一标识符
  usb_id: string // USB设备ID
  usb_name: string // USB设备名称
  status: string // 状态
}
export interface NetworkInterface {
  uid: string // 网络接口的唯一标识符
  name: string // 网络接口名称
  type: string // 网络接口类型，例如 "bridge"
  status: string // 网络接口状态，例如 "normal"
  ip: string // 网络接口的 IP 地址
  ports: string // 连接的端口信息
}
export interface UsbDevice {
  uid: string
  id: string
  name: string
  host: string
  manufacturer: string
  product: string
  status: string
}
