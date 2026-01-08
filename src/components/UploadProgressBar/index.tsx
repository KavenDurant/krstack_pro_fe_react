/**
 * 全局上传进度条组件
 */
import React from "react";
import { Card, Progress, Space, Button, Tag, Tooltip } from "antd";
import {
  CloseOutlined,
  MinusOutlined,
  UpOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useUploadProgressStore } from "@/stores/uploadProgress";
import type { UploadTask } from "@/stores/uploadProgress/types";
import { formatFileSize } from "@/utils/format";
import "./index.less";

const UploadProgressBar: React.FC = () => {
  const { tasks, updateTask, removeTask, toggleMinimize, cancelTask } =
    useUploadProgressStore();

  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="upload-progress-container">
      {tasks.map(task => (
        <UploadTaskItem
          key={task.id}
          task={task}
          onUpdate={updates => updateTask(task.id, updates)}
          onRemove={() => removeTask(task.id)}
          onToggleMinimize={() => toggleMinimize(task.id)}
          onCancel={() => cancelTask(task.id)}
        />
      ))}
    </div>
  );
};

interface UploadTaskItemProps {
  task: UploadTask;
  onUpdate: (updates: Partial<UploadTask>) => void;
  onRemove: () => void;
  onToggleMinimize: () => void;
  onCancel: () => void;
}

const UploadTaskItem: React.FC<UploadTaskItemProps> = ({
  task,
  onRemove,
  onToggleMinimize,
  onCancel,
}) => {
  const getStatusConfig = () => {
    switch (task.status) {
      case "uploading":
        return {
          color: "#1890ff",
          icon: <LoadingOutlined spin />,
          text: "上传中",
        };
      case "success":
        return {
          color: "#52c41a",
          icon: <CheckCircleOutlined />,
          text: "上传成功",
        };
      case "error":
        return {
          color: "#ff4d4f",
          icon: <CloseCircleOutlined />,
          text: "上传失败",
        };
      case "cancelled":
        return {
          color: "#d9d9d9",
          icon: <CloseCircleOutlined />,
          text: "已取消",
        };
      default:
        return {
          color: "#1890ff",
          icon: <LoadingOutlined spin />,
          text: "上传中",
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <Card
      className={`upload-progress-card ${task.minimized ? "minimized" : ""}`}
      size="small"
      style={{
        marginBottom: 8,
        borderRadius: 6,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
      }}
    >
      {task.minimized ? (
        // 最小化状态
        <div className="upload-progress-minimized">
          <Space>
            <span className="file-icon">📄</span>
            <span className="file-name" title={task.fileName}>
              {task.fileName}
            </span>
            <Progress
              percent={task.progress}
              size="small"
              strokeColor={statusConfig.color}
              style={{ width: 100, margin: "0 8px" }}
              showInfo={false}
            />
            <span className="progress-text">{task.progress.toFixed(1)}%</span>
          </Space>
          <Space>
            <Button
              type="text"
              size="small"
              icon={<UpOutlined />}
              onClick={onToggleMinimize}
            />
            <Button
              type="text"
              size="small"
              icon={<CloseOutlined />}
              onClick={onRemove}
            />
          </Space>
        </div>
      ) : (
        // 展开状态
        <div className="upload-progress-expanded">
          <div className="upload-progress-header">
            <Space>
              <span className="upload-title">上传镜像</span>
              <Tag color={statusConfig.color} icon={statusConfig.icon}>
                {statusConfig.text}
              </Tag>
            </Space>
            <Space>
              <Button
                type="text"
                size="small"
                icon={<MinusOutlined />}
                onClick={onToggleMinimize}
                title="最小化"
              />
              {task.status === "uploading" && (
                <Button
                  type="text"
                  size="small"
                  danger
                  onClick={onCancel}
                  title="取消上传"
                >
                  取消
                </Button>
              )}
              <Button
                type="text"
                size="small"
                icon={<CloseOutlined />}
                onClick={onRemove}
                title="关闭"
              />
            </Space>
          </div>

          <div className="upload-progress-content">
            <div className="file-info">
              <span className="file-icon">📄</span>
              <Tooltip title={task.fileName}>
                <span className="file-name">{task.fileName}</span>
              </Tooltip>
              <span className="file-size">
                ({formatFileSize(task.fileSize)})
              </span>
            </div>

            <Progress
              percent={task.progress}
              strokeColor={statusConfig.color}
              format={percent => `${percent?.toFixed(2)}%`}
              style={{ margin: "12px 0" }}
            />

            <div className="upload-progress-info">
              <Space split={<span style={{ color: "#d9d9d9" }}>|</span>}>
                <span>
                  <strong>速度:</strong> {task.speed}
                </span>
                {task.status === "uploading" && (
                  <span>
                    <strong>状态:</strong> 上传中...
                  </span>
                )}
                {task.status === "error" && task.error && (
                  <span style={{ color: "#ff4d4f" }}>
                    <strong>错误:</strong> {task.error}
                  </span>
                )}
              </Space>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default UploadProgressBar;
