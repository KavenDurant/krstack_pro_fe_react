/**
 * 上传进度相关类型定义
 */

export type UploadStatus = "uploading" | "success" | "error" | "cancelled";

export interface UploadTask {
  id: string; // 任务唯一标识
  fileName: string; // 文件名
  fileSize: number; // 文件大小（字节）
  progress: number; // 进度百分比 0-100
  speed: string; // 上传速度，如 "12.5 MB/s"
  status: UploadStatus; // 上传状态
  error?: string; // 错误信息
  startTime: number; // 开始时间戳
  minimized: boolean; // 是否最小化
}

export interface UploadProgressState {
  tasks: UploadTask[]; // 上传任务列表（支持多个任务）
  addTask: (
    task: Omit<
      UploadTask,
      "id" | "progress" | "speed" | "status" | "startTime" | "minimized"
    >
  ) => string;
  updateTask: (id: string, updates: Partial<UploadTask>) => void;
  removeTask: (id: string) => void;
  toggleMinimize: (id: string) => void;
  cancelTask: (id: string) => void;
}
