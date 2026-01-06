/**
 * 许可管理相关类型定义
 */

// 平台许可信息
export interface PlatformLicense {
  license_type: string;
  expire_date: string;
  max_vms: number;
  max_desktops: number;
  [key: string]: unknown;
}

// 桌面许可信息
export interface DesktopLicense {
  license_type: string;
  expire_date: string;
  max_desktops: number;
  used_desktops: number;
  [key: string]: unknown;
}
