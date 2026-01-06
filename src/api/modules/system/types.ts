/**
 * 系统服务相关类型定义
 */

// 系统信息
export interface SystemInfo {
  [key: string]: unknown;
}

// 诊断日志文件信息
export interface DiagnosisLogFile {
  file_name: string;
  size: number;
  created_at: string;
  [key: string]: unknown;
}

// 自动快照功能标志
export interface FeatureFlag {
  flag_name: string;
  enable: boolean;
  [key: string]: unknown;
}

// 自动快照配置
export interface AutomaticSnapshotConfig {
  enable: boolean;
  execution_plan: string;
  retention_time: number | null;
  retention_num: number | null;
  [key: string]: unknown;
}
