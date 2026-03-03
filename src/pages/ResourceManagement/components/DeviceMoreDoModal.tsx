/**
 * 设备更多操作弹窗 - 用于卸载 GPU/USB 设备
 */
import React, { useState } from "react";
import { Modal, Table, Button, message, Tag, Space } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { vmApi } from "@/api";

interface VMUseItem {
  name: string;
  vmUid: string;
  status: string;
  // GPU 专用
  gpuUid?: string;
  gpuId?: string;
  // USB 专用
  usbUid?: string;
  usbId?: string;
}

interface DeviceData {
  uid: string;
  id: string;
  deviceName?: string;
  name?: string;
  manufacturer?: string;
  status: string;
  vmUse: VMUseItem[];
}

interface DeviceMoreDoModalProps {
  open: boolean;
  deviceType: "gpu" | "usb";
  deviceData: DeviceData | null;
  onClose: () => void;
  onSuccess: () => void;
}

const DeviceMoreDoModal: React.FC<DeviceMoreDoModalProps> = ({
  open,
  deviceType,
  deviceData,
  onClose,
  onSuccess,
}) => {
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const handleUnmount = async (record: VMUseItem) => {
    const loadingKey = record.vmUid;

    Modal.confirm({
      title: "确认卸载",
      icon: <ExclamationCircleOutlined />,
      content: `确定要卸载该${deviceType === "gpu" ? "GPU" : "USB"}设备吗？`,
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        try {
          setLoadingMap(prev => ({ ...prev, [loadingKey]: true }));

          if (deviceType === "gpu") {
            await vmApi.unmountGPU(record.vmUid, record.gpuUid || "");
          } else {
            await vmApi.unmountUSB(record.vmUid, record.usbUid || "");
          }

          message.success("卸载成功");
          onSuccess();
        } catch (error) {
          message.error("卸载失败");
          console.error("Failed to unmount device:", error);
        } finally {
          setLoadingMap(prev => ({ ...prev, [loadingKey]: false }));
        }
      },
    });
  };

  const renderStatus = (status: string) => {
    if (status === "normal" || status === "pending") {
      return <span style={{ color: "#85868b" }}>未使用</span>;
    }
    if (status === "occupied") {
      return <span style={{ color: "#61c839" }}>使用中</span>;
    }
    return <span>{status}</span>;
  };

  const columns: ColumnsType<VMUseItem> = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      render: (text: string) => text || <Tag color="default">暂未提供</Tag>,
    },
    {
      title: deviceType === "gpu" ? "GPU使用情况" : "USB使用情况",
      dataIndex: "status",
      key: "status",
      render: renderStatus,
    },
    {
      title: "操作",
      key: "action",
      width: 100,
      render: (_: unknown, record: VMUseItem) => (
        <Button
          danger
          type="primary"
          size="small"
          loading={loadingMap[record.vmUid]}
          onClick={() => handleUnmount(record)}
        >
          卸载
        </Button>
      ),
    },
  ];

  const getTitle = () => {
    if (deviceType === "gpu") {
      return `已加载的云主机 - ${deviceData?.deviceName || deviceData?.id || ""}`;
    }
    return `已加载的云主机 - ${deviceData?.name || deviceData?.id || ""}`;
  };

  // 只有数据超过 5 条时才显示滚动条
  const showScroll = (deviceData?.vmUse?.length || 0) > 5;

  return (
    <Modal
      open={open}
      title={getTitle()}
      onCancel={onClose}
      footer={null}
      width={700}
      destroyOnHidden
    >
      <div style={{ marginBottom: 12 }}>
        <Space>
          <span>设备ID: {deviceData?.id}</span>
          <span>制造商: {deviceData?.manufacturer || "未知"}</span>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={deviceData?.vmUse || []}
        rowKey="vmUid"
        pagination={false}
        scroll={showScroll ? { y: 300 } : undefined}
        size="small"
      />
    </Modal>
  );
};

export default DeviceMoreDoModal;
