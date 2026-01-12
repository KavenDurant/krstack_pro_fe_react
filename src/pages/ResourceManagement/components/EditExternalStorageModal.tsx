import React, { useEffect, useState } from "react";
import {
  Modal,
  Table,
  Button,
  Tag,
  message,
  Space,
  Tooltip,
  Alert,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { InfoCircleOutlined } from "@ant-design/icons";
import { storageApi } from "@/api";
import type { ClusterEditList } from "@/api";

interface EditExternalStorageModalProps {
  open: boolean;
  storageUid: string;
  storageName: string;
  onCancel: () => void;
  onSuccess?: () => void;
}

interface ClusterEditListItem extends ClusterEditList {
  loading?: boolean;
}

const EditExternalStorageModal: React.FC<EditExternalStorageModalProps> = ({
  open,
  storageUid,
  storageName,
  onCancel,
  onSuccess,
}) => {
  const [clusterList, setClusterList] = useState<ClusterEditListItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 加载集群列表
  const loadClusterList = async () => {
    if (!storageUid) return;

    setLoading(true);
    try {
      const response = await storageApi.getExternalStorageEditList(storageUid);

      const clusters = response.data as ClusterEditList[];

      if (Array.isArray(clusters)) {
        // 过滤掉没有名称的集群，并添加 loading 字段
        const filteredClusters = clusters
          .filter(
            cluster => cluster.cluster_name && cluster.cluster_name !== ""
          )
          .map(cluster => ({
            ...cluster,
            loading: false,
          }));
        setClusterList(filteredClusters);
      } else {
        setClusterList([]);
      }
    } catch (error) {
      const errorObj = error as { detail?: string; message?: string };
      message.error(errorObj.detail || errorObj.message || "获取集群列表失败");
      console.error("获取集群列表失败:", error);
      setClusterList([]);
    } finally {
      setLoading(false);
    }
  };

  // 挂载/卸载操作
  const handleMountToggle = async (record: ClusterEditListItem) => {
    const { cluster_uid, mount_status, platform_type } = record;

    // ZStack 平台暂不支持
    if (platform_type === "zstack") {
      message.warning("ZStack 平台暂不支持挂载/卸载操作");
      return;
    }

    // 更新当前行的 loading 状态
    setClusterList(prev =>
      prev.map(item =>
        item.cluster_uid === cluster_uid ? { ...item, loading: true } : item
      )
    );

    try {
      if (mount_status) {
        // 卸载
        await storageApi.unmountStorage({
          storage_uid: storageUid,
          cluster_uid,
        });
        message.success("卸载成功");
      } else {
        // 挂载
        await storageApi.mountStorage({
          storage_uid: storageUid,
          cluster_uid,
        });
        message.success("挂载成功");
      }

      // 重新加载列表
      await loadClusterList();

      // 通知父组件刷新
      onSuccess?.();
    } catch (error) {
      const errorObj = error as { detail?: string; message?: string };
      message.error(
        errorObj.detail ||
          errorObj.message ||
          (mount_status ? "卸载失败" : "挂载失败")
      );
      console.error("挂载/卸载失败:", error);

      // 恢复 loading 状态
      setClusterList(prev =>
        prev.map(item =>
          item.cluster_uid === cluster_uid ? { ...item, loading: false } : item
        )
      );
    }
  };

  // 弹窗打开时加载数据
  useEffect(() => {
    if (open) {
      loadClusterList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, storageUid]);

  const columns: ColumnsType<ClusterEditListItem> = [
    {
      title: "集群名称",
      dataIndex: "cluster_name",
      key: "cluster_name",
      ellipsis: true,
    },
    {
      title: (
        <Space>
          <span>挂载状态</span>
          <Tooltip title="外挂存储挂载对应的集群后，集群下所有物理机都会挂载该外挂存储，卸载和删除同理。">
            <InfoCircleOutlined style={{ color: "#1890ff", cursor: "help" }} />
          </Tooltip>
        </Space>
      ),
      dataIndex: "mount_status",
      key: "mount_status",
      width: 120,
      render: (mountStatus, record) => {
        if (record.platform_type === "zstack") {
          return (
            <Tag color="default" style={{ fontSize: 13 }}>
              暂未支持
            </Tag>
          );
        }
        return mountStatus ? (
          <Tag color="success" style={{ fontSize: 13 }}>
            已挂载
          </Tag>
        ) : (
          <Tag color="default" style={{ fontSize: 13 }}>
            已卸载
          </Tag>
        );
      },
    },
    {
      title: "操作",
      key: "action",
      width: 100,
      align: "center",
      render: (_, record) => {
        const { mount_status, platform_type, loading: recordLoading } = record;

        // ZStack 平台禁用按钮
        const disabled = platform_type === "zstack";

        return (
          <Button
            type={mount_status ? "primary" : "primary"}
            danger={mount_status}
            loading={recordLoading}
            disabled={disabled}
            onClick={() => handleMountToggle(record)}
            style={{
              minWidth: 80,
              height: 32,
              borderRadius: 4,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {mount_status ? "卸载" : "挂载"}
          </Button>
        );
      },
    },
  ];

  return (
    <Modal
      title={
        <Space>
          <span>编辑外挂存储</span>
          <span style={{ color: "#1890ff", fontWeight: 500 }}>
            {storageName}
          </span>
        </Space>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width={800}
      destroyOnHidden
      styles={{
        body: { paddingTop: 16 },
      }}
    >
      <Alert
        title="外挂存储挂载对应的集群后，集群下所有物理机都会挂载该外挂存储；卸载和删除同理。"
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <Table
        columns={columns}
        dataSource={clusterList}
        loading={loading}
        pagination={false}
        rowKey="cluster_uid"
        size="middle"
        tableLayout="auto"
      />
    </Modal>
  );
};

export default EditExternalStorageModal;
