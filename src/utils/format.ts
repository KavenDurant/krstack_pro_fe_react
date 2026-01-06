/**
 * 格式化工具函数
 */

/**
 * 字节转换为合适的单位
 * @param bytes 字节数
 * @param decimals 小数位数，默认 2
 * @returns 格式化后的字符串，如 "1.23 GB"
 */
export const formatBytes = (
  bytes: number | undefined,
  decimals: number = 2
): string => {
  if (bytes === undefined || bytes === null) {
    return "-";
  }

  if (bytes === 0) {
    return "0 Bytes";
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * 字节转换为 GB
 * @param bytes 字节数
 * @param decimals 小数位数，默认 2
 * @returns GB 数值
 */
export const bytesToGB = (
  bytes: number | undefined,
  decimals: number = 2
): number => {
  if (bytes === undefined || bytes === null) {
    return 0;
  }

  return parseFloat((bytes / 1024 / 1024 / 1024).toFixed(decimals));
};

/**
 * 字节转换为 TB
 * @param bytes 字节数
 * @param decimals 小数位数，默认 2
 * @returns TB 数值
 */
export const bytesToTB = (
  bytes: number | undefined,
  decimals: number = 2
): number => {
  if (bytes === undefined || bytes === null) {
    return 0;
  }

  return parseFloat((bytes / 1024 / 1024 / 1024 / 1024).toFixed(decimals));
};

/**
 * MB 转换为 GB
 * @param mb MB 数值
 * @param decimals 小数位数，默认 2
 * @returns GB 数值
 */
export const mbToGB = (
  mb: number | undefined,
  decimals: number = 2
): number => {
  if (mb === undefined || mb === null) {
    return 0;
  }

  return parseFloat((mb / 1024).toFixed(decimals));
};

/**
 * 格式化字节为带单位的字符串（自动选择合适单位）
 * @param bytes 字节数
 * @param decimals 小数位数，默认 2
 * @returns 格式化后的字符串，如 "1.23 GB"
 */
export const formatBytesAuto = (
  bytes: number | undefined,
  decimals: number = 2
): string => {
  if (bytes === undefined || bytes === null) {
    return "-";
  }

  const gb = bytes / 1024 / 1024 / 1024;
  const tb = bytes / 1024 / 1024 / 1024 / 1024;

  // 如果大于等于 1TB，使用 TB
  if (tb >= 1) {
    return `${tb.toFixed(decimals)} TB`;
  }

  // 否则使用 GB
  return `${gb.toFixed(decimals)} GB`;
};

/**
 * 根据参考字节数确定单位，并格式化指定字节数
 * @param bytes 要格式化的字节数
 * @param referenceBytes 参考字节数（用于确定单位）
 * @param decimals 小数位数，默认 2
 * @returns 格式化后的字符串，如 "1.23 GB"
 */
export const formatBytesWithUnit = (
  bytes: number | undefined,
  referenceBytes: number | undefined,
  decimals: number = 2
): string => {
  if (
    bytes === undefined ||
    bytes === null ||
    referenceBytes === undefined ||
    referenceBytes === null
  ) {
    return "-";
  }

  const refTB = referenceBytes / 1024 / 1024 / 1024 / 1024;

  // 如果参考值大于等于 1TB，使用 TB
  if (refTB >= 1) {
    const tb = bytes / 1024 / 1024 / 1024 / 1024;
    return `${tb.toFixed(decimals)} TB`;
  }

  // 否则使用 GB
  const gb = bytes / 1024 / 1024 / 1024;
  return `${gb.toFixed(decimals)} GB`;
};

/**
 * 格式化百分比
 * @param value 数值
 * @param total 总数
 * @param decimals 小数位数，默认 1
 * @returns 百分比字符串，如 "45.5%"
 */
export const formatPercentage = (
  value: number | undefined,
  total: number | undefined,
  decimals: number = 1
): string => {
  if (
    value === undefined ||
    value === null ||
    total === undefined ||
    total === null ||
    total === 0
  ) {
    return "0%";
  }

  const percentage = (value / total) * 100;
  return `${percentage.toFixed(decimals)}%`;
};

/**
 * 计算百分比数值
 * @param value 数值
 * @param total 总数
 * @param decimals 小数位数，默认 1
 * @returns 百分比数值
 */
export const calculatePercentage = (
  value: number | undefined,
  total: number | undefined,
  decimals: number = 1
): number => {
  if (
    value === undefined ||
    value === null ||
    total === undefined ||
    total === null ||
    total === 0
  ) {
    return 0;
  }

  const percentage = (value / total) * 100;
  return parseFloat(percentage.toFixed(decimals));
};

/**
 * 智能格式化文件大小（小于1GB显示MB，否则显示GB）
 * @param bytes 字节数
 * @param decimals 小数位数，默认 2
 * @returns 格式化后的字符串，如 "973MB" 或 "20 GB"
 */
export const formatFileSize = (
  bytes: number | undefined | null,
  decimals: number = 2
): string => {
  if (bytes === undefined || bytes === null || bytes === 0) {
    return "-";
  }

  const gb = bytes / 1024 / 1024 / 1024;
  const mb = bytes / 1024 / 1024;

  // 如果小于1GB，使用MB
  if (gb < 1) {
    return `${mb.toFixed(decimals)}MB`;
  }

  // 否则使用GB
  return `${gb.toFixed(decimals)} GB`;
};

/**
 * 格式化日期时间
 * @param dateString 日期字符串
 * @returns 格式化后的日期时间字符串，如 "2025-08-01 14:44:31"
 */
export const formatDateTime = (
  dateString: string | undefined | null
): string => {
  if (!dateString) {
    return "-";
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "-";
    }
    return date
      .toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(/\//g, "-");
  } catch {
    return "-";
  }
};
