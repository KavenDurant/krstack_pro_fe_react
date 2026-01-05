import React, { useState } from "react";
import { Tag, message, Button } from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  SafetyOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import BreadcrumbContainer from "@/components/BreadcrumbContainer";
import LayoutBox from "@/components/LayoutBox";

interface BackupRecord {
  id: string;
  name: string;
  backupTime: string;
  size: string;
  operator: string;
  operatorType: "user" | "system";
}

const mockBackupData: BackupRecord[] = [
  {
    id: "1",
    name: "backup_2025-09-31 23:59:59",
    backupTime: "2025-09-31 23:59:59",
    size: "23.67MB",
    operator: "用户1",
    operatorType: "user",
  },
  {
    id: "2",
    name: "backup_auto_2025-09-31 23:59:59",
    backupTime: "2025-09-31 23:59:59",
    size: "6.89MB",
    operator: "系统策略",
    operatorType: "system",
  },
];

const DataManagement: React.FC = () => {
  const [data] = useState<BackupRecord[]>(mockBackupData);

  const handleBackup = () => {
    message.success("备份任务已创建");
  };

  return (
    <LayoutBox>
      <BreadcrumbContainer items={[{ label: "平台数据管理" }]} />
      <LayoutBox padding={12} gap={12}>
        <div style={{ marginBottom: 12 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleBackup}
            style={{ marginRight: 8 }}
          >
            备份平台数据
          </Button>
          <Button icon={<DeleteOutlined />} style={{ marginRight: 8 }}>
            删除
          </Button>
          <Button icon={<UploadOutlined />} style={{ marginRight: 8 }}>
            上传备份
          </Button>
          <Button icon={<SafetyOutlined />}>备份策略</Button>
        </div>
        <div>
          {data.map(item => (
            <div
              key={item.id}
              style={{
                padding: 12,
                marginBottom: 8,
                border: "1px solid #f0f0f0",
                borderRadius: 4,
              }}
            >
              <div>
                <strong>{item.name}</strong>
              </div>
              <div>
                备份时间: {item.backupTime} | 大小: {item.size} | 操作人:{" "}
                {item.operatorType === "system" ? (
                  <Tag color="blue">{item.operator}</Tag>
                ) : (
                  item.operator
                )}
              </div>
            </div>
          ))}
        </div>
      </LayoutBox>
    </LayoutBox>
  );
};

export default DataManagement;
