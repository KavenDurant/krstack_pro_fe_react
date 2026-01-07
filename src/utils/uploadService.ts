/**
 * 上传服务 - 处理文件上传逻辑
 */
import { imageApi } from "@/api";
import { useUploadProgressStore } from "@/stores/uploadProgress";
import { message } from "antd";

interface UploadParams {
  taskId: string;
  file: File;
  storageType: "internal" | "external";
  storageUid: string;
  system: string;
}

/**
 * 执行文件上传
 */
export const executeUpload = async (params: UploadParams): Promise<void> => {
  const { taskId, file, storageType, storageUid, system } = params;
  const { updateTask } = useUploadProgressStore.getState();

  // 分片上传配置
  const chunkSize = 49 * 1024 * 1024; // 49MB
  const fileSize = file.size;
  const chunkCount = Math.ceil(fileSize / chunkSize);
  const startTime = Date.now();
  let totalLoaded = 0; // 累计已上传的字节数
  let lastProgressTime = Date.now(); // 上次进度更新时间
  let lastProgressLoaded = 0; // 上次进度更新时的累计已加载量
  let uploadAborted = false;
  let currentSpeed = "0.00 MB/s"; // 当前显示的速度，避免频繁变化

  // 计算上传速度（基于累计已上传量）
  const calculateSpeed = (currentTotalLoaded: number): string => {
    const now = Date.now();
    const timeDiff = (now - lastProgressTime) / 1000; // 秒
    const loadedDiff = currentTotalLoaded - lastProgressLoaded; // 字节

    // 只有当时间差大于0.2秒且加载量有增加时才更新速度（避免频繁变化）
    if (timeDiff >= 0.2 && loadedDiff > 0) {
      const speed = loadedDiff / timeDiff; // 字节/秒
      const speedMB = speed / 1024 / 1024;
      currentSpeed = `${speedMB.toFixed(2)} MB/s`;
      lastProgressTime = now;
      lastProgressLoaded = currentTotalLoaded;
      return currentSpeed;
    }

    // 如果时间差太小，使用基于总时间的平均速度（避免跳到0）
    if (currentTotalLoaded > 0) {
      const totalDuration = (now - startTime) / 1000;
      if (totalDuration >= 0.5) {
        // 至少0.5秒后才显示平均速度，避免初始阶段显示异常值
        const avgSpeed = currentTotalLoaded / totalDuration;
        const speedMB = avgSpeed / 1024 / 1024;
        currentSpeed = `${speedMB.toFixed(2)} MB/s`;
        return currentSpeed;
      }
    }

    // 返回上次的速度，避免跳到0
    return currentSpeed;
  };

  try {
    // 更新状态为上传中
    updateTask(taskId, { status: "uploading" });

    for (let i = 0; i < chunkCount; i++) {
      // 检查是否已取消
      const currentTask = useUploadProgressStore
        .getState()
        .tasks.find(t => t.id === taskId);
      if (!currentTask || currentTask.status === "cancelled") {
        uploadAborted = true;
        break;
      }

      const start = i * chunkSize;
      const end = Math.min(fileSize, start + chunkSize);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append("file", chunk);
      formData.append("file_name", file.name);
      formData.append("start_time", String(new Date(startTime)));
      formData.append("system", system);
      formData.append("chunk_end_flag", String(chunkCount === i + 1));

      // 记录当前分片开始时的累计值
      const chunkStartLoaded = totalLoaded;

      // 上传分片
      await imageApi.uploadImage(storageType, storageUid, formData, {
        onUploadProgress: (progressEvent: {
          loaded: number;
          total?: number;
          timeStamp?: number;
        }) => {
          if (uploadAborted) return;

          // 当前分片的已加载量 + 之前所有分片的累计量 = 总累计量
          const currentTotalLoaded = chunkStartLoaded + progressEvent.loaded;
          // 计算进度百分比，使用 Math.floor 确保不会提前显示100%
          // 只有在所有分片都上传完成后才可能达到100%
          const percent = Math.min(
            Math.floor((currentTotalLoaded * 100) / fileSize),
            99 // 在上传过程中最多显示99%，只有全部完成才显示100%
          );

          // 计算速度（基于累计已上传量）
          const speed = calculateSpeed(currentTotalLoaded);

          // 更新进度
          updateTask(taskId, {
            progress: percent,
            speed,
          });
        },
      });

      // 分片上传完成，更新累计已上传量
      // 注意：这里使用 chunk.size 而不是 progressEvent.total，因为 chunk.size 是实际的分片大小
      totalLoaded += chunk.size;

      // 计算最终进度
      // 如果是最后一个分片，确保显示100%，否则最多显示99%
      const isLastChunk = i === chunkCount - 1;
      const finalPercent = isLastChunk
        ? 100 // 最后一个分片完成后，直接显示100%
        : Math.min(
            Math.floor((totalLoaded * 100) / fileSize),
            99 // 非最后一个分片，最多显示99%
          );

      // 计算整体平均速度
      const duration = (Date.now() - startTime) / 1000;
      if (duration > 0) {
        const avgSpeed = totalLoaded / duration;
        const speedMB = avgSpeed / 1024 / 1024;
        currentSpeed = `${speedMB.toFixed(2)} MB/s`;
        updateTask(taskId, {
          progress: finalPercent,
          speed: currentSpeed,
        });
        // 更新速度计算的基准值，为下一个分片做准备
        lastProgressLoaded = totalLoaded;
        lastProgressTime = Date.now();
      }
    }

    if (!uploadAborted) {
      // 检查是否所有分片都已上传完成
      // 由于浮点数精度问题，使用 Math.abs 来判断是否接近文件大小
      const isComplete = Math.abs(totalLoaded - fileSize) < 1024; // 允许1KB的误差

      if (isComplete || totalLoaded >= fileSize) {
        // 上传成功，确保进度为100%
        updateTask(taskId, {
          status: "success",
          progress: 100,
          speed: "0.00 MB/s", // 上传完成，速度归零
        });

        message.success("镜像上传成功！");

        // 3秒后自动关闭
        setTimeout(() => {
          useUploadProgressStore.getState().removeTask(taskId);
        }, 3000);
      } else {
        // 上传未完成，但循环已结束（可能是错误）
        updateTask(taskId, {
          status: "error",
          error: "上传未完成，请重试",
        });
        message.error("上传未完成，请重试");
      }
    } else if (uploadAborted) {
      // 上传已取消
      updateTask(taskId, {
        status: "cancelled",
      });
    }
  } catch (error) {
    const errorObj = error as {
      response?: { status?: number };
      message?: string;
      error?: string;
    };

    let errorMessage = "上传失败，请重试";

    if (errorObj.response?.status === 500) {
      errorMessage =
        "服务器内部错误，可能是存储空间不足或存储路径不正确，请联系管理员";
    } else if (errorObj.message?.includes("timeout")) {
      errorMessage = "上传超时，请检查网络连接并重试";
    } else if (
      errorObj.error?.includes("指定的储存不存在") ||
      errorObj.error?.includes("指定的存储不存在")
    ) {
      errorMessage = "指定存储异常，请前往存储管理检查外挂存储是否存在！";
    }

    // 更新为失败状态
    updateTask(taskId, {
      status: "error",
      error: errorMessage,
    });

    message.error(errorMessage);
    console.error("上传失败:", error);
  }
};
