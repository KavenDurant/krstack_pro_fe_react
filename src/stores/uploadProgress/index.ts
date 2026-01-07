/**
 * 上传进度管理 Store (Zustand)
 */
import { create } from "zustand";
import type { UploadProgressState, UploadTask } from "./types";

export const useUploadProgressStore = create<UploadProgressState>(set => ({
  tasks: [],

  // 添加新任务
  addTask: taskData => {
    const id = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newTask: UploadTask = {
      id,
      fileName: taskData.fileName,
      fileSize: taskData.fileSize,
      progress: 0,
      speed: "0.00 MB/s",
      status: "uploading",
      startTime: Date.now(),
      minimized: false,
    };

    set(state => ({
      tasks: [...state.tasks, newTask],
    }));

    return id;
  },

  // 更新任务
  updateTask: (id, updates) => {
    set(state => ({
      tasks: state.tasks.map(task =>
        task.id === id ? { ...task, ...updates } : task
      ),
    }));
  },

  // 删除任务
  removeTask: id => {
    set(state => ({
      tasks: state.tasks.filter(task => task.id !== id),
    }));
  },

  // 切换最小化状态
  toggleMinimize: id => {
    set(state => ({
      tasks: state.tasks.map(task =>
        task.id === id ? { ...task, minimized: !task.minimized } : task
      ),
    }));
  },

  // 取消任务
  cancelTask: id => {
    set(state => ({
      tasks: state.tasks.map(task =>
        task.id === id ? { ...task, status: "cancelled" } : task
      ),
    }));
  },
}));
