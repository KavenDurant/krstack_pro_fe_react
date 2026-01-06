/**
 * 许可管理相关 API
 */
import { get } from "@/api/request/index";
import type { ApiResponse } from "@/api/types";
import type { PlatformLicense, DesktopLicense } from "./types";

const URL = {
  platformLicense: "system/license",
  desktopLicense: "system/desktop_license",
} as const;

/**
 * 获取平台许可信息
 */
export const getPlatformLicense = async (): Promise<
  ApiResponse<PlatformLicense>
> => {
  return get<PlatformLicense>(URL.platformLicense);
};

/**
 * 获取桌面许可信息
 */
export const getDesktopLicense = async (): Promise<
  ApiResponse<DesktopLicense>
> => {
  return get<DesktopLicense>(URL.desktopLicense);
};
