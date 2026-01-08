import React, { useState, useEffect, useRef, useMemo } from "react";
import { Input, Button, Space, Progress, Tag, message, Modal } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  SettingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import TableToolbar from "@/components/__design-system__/TableToolbar";
import StandardTable from "@/components/__design-system__/StandardTable";
import EditExternalStorageModal from "./EditExternalStorageModal";
import { storageApi } from "@/api";
import type { ExternalStorage as ExternalStorageApi } from "@/api";
import { calculatePercentage, formatBytesWithUnit } from "@/utils/format";

interface ExternalStorageType {
  key: string;
  name: string;
  status: "available" | "unavailable";
  capacity: {
    usedBytes: number; // 原始字节数
    totalBytes: number; // 原始字节数
    remainingBytes: number; // 原始字节数
    percent: number;
  } | null;
  path: string;
  clusters: string[];
}

const ExternalStorage: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState("");
  const [storageData, setStorageData] = useState<ExternalStorageType[]>([]);
  const [loading, setLoading] = useState(false);
  const hasLoadedRef = useRef(false);

  // 删除相关状态
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingRecord, setDeletingRecord] =
    useState<ExternalStorageType | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // 编辑相关状态
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] =
    useState<ExternalStorageType | null>(null);

  // 数据转换函数：将后端数据转换为前端格式
  const transformStorageData = (
    data: ExternalStorageApi[]
  ): ExternalStorageType[] => {
    return data.map(item => {
      // 保留原始字节数据，渲染时再格式化
      let capacity: ExternalStorageType["capacity"] = null;
      if (
        item.disk_total !== null &&
        item.disk_total !== undefined &&
        item.disk_used !== null &&
        item.disk_used !== undefined &&
        item.disk_left !== null &&
        item.disk_left !== undefined
      ) {
        const percent = calculatePercentage(item.disk_used, item.disk_total);

        capacity = {
          usedBytes: item.disk_used,
          totalBytes: item.disk_total,
          remainingBytes: item.disk_left,
          percent,
        };
      }

      // 提取集群名称
      const clusters =
        item.clusters && Array.isArray(item.clusters)
          ? item.clusters
              .map(
                (cluster: { cluster_name?: string }) =>
                  cluster.cluster_name || ""
              )
              .filter((name): name is string => Boolean(name))
          : [];

      // 映射状态
      const status: "available" | "unavailable" =
        item.status === "available" ? "available" : "unavailable";

      return {
        key: item.storage_uid,
        name: item.name || "-",
        status,
        capacity,
        path: item.server || "-",
        clusters,
      };
    });
  };

  // 加载外挂存储列表
  const loadExternalStorageList = async () => {
    try {
      setLoading(true);
      const response = await storageApi.getExternalStorageList();

      const storages =
        response.data?.storages ??
        (response as unknown as { storages?: ExternalStorageApi[] }).storages;
      if (storages && Array.isArray(storages)) {
        const transformedData = transformStorageData(storages);
        setStorageData(transformedData);
      } else if (response.code === 200 || response.code === 0) {
        setStorageData([]);
      } else {
        console.error("External storage API error:", response);
        message.error(response.message || "获取外挂存储列表失败");
      }
    } catch (error) {
      const errorObj = error as {
        code?: number;
        message?: string;
        data?: unknown;
      };

      const dataPayload =
        errorObj.data && typeof errorObj.data === "object"
          ? (errorObj.data as { storages?: ExternalStorageApi[] })
          : undefined;

      const storages = dataPayload?.storages;
      if (Array.isArray(storages)) {
        const transformedData = transformStorageData(storages);
        setStorageData(transformedData);
        return;
      }

      message.error(errorObj.message || "获取外挂存储列表失败");
      console.error("External storage API error:", errorObj);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadExternalStorageList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 刷新列表
  const handleRefresh = () => {
    loadExternalStorageList();
  };

  // 编辑存储 - 打开编辑弹窗
  const handleEdit = (record: ExternalStorageType) => {
    setEditingRecord(record);
    setEditModalVisible(true);
  };

  // 关闭编辑弹窗
  const handleEditCancel = () => {
    setEditModalVisible(false);
    setEditingRecord(null);
  };

  // 编辑成功后刷新列表
  const handleEditSuccess = () => {
    loadExternalStorageList();
  };

  // 删除存储 - 打开确认弹窗
  const handleDeleteClick = (record: ExternalStorageType) => {
    setDeletingRecord(record);
    setDeleteModalVisible(true);
  };

  // 确认删除
  const handleDeleteConfirm = async () => {
    if (!deletingRecord) {
      message.error("删除记录不能为空");
      return;
    }

    setDeleteLoading(true);
    try {
      await storageApi.deleteExternalStorage({
        storages: [{ storage_uid: deletingRecord.key }],
      });
      message.success("外挂存储删除成功");
      setDeleteModalVisible(false);
      loadExternalStorageList();
    } catch (error) {
      const errorObj = error as { detail?: string; message?: string };
      message.error(errorObj.detail || errorObj.message || "删除外挂存储失败");
      console.error("删除外挂存储失败:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  // 取消删除
  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setDeletingRecord(null);
  };

  // 过滤数据
  const filteredData = useMemo(() => {
    return storageData.filter(item => {
      const matchName = item.name
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchPath = item.path
        .toLowerCase()
        .includes(searchText.toLowerCase());
      return matchName || matchPath;
    });
  }, [storageData, searchText]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns: ColumnsType<ExternalStorageType> = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      render: text => <a style={{ color: "#1890ff" }}>{text}</a>,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: status => {
        const color = status === "available" ? "success" : "error";
        const text = status === "available" ? "可用" : "不可用";
        return (
          <Tag color={color === "success" ? "green" : "volcano"}>{text}</Tag>
        );
      },
    },
    {
      title: "存储容量",
      key: "capacity",
      width: 300,
      render: (_, record) => {
        if (!record.capacity) {
          return <Tag color="default">暂未提供</Tag>;
        }

        return (
          <div style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                color: "#666",
                marginBottom: 4,
              }}
            >
              <span>
                {formatBytesWithUnit(
                  record.capacity.usedBytes,
                  record.capacity.totalBytes
                )}
                /
                {formatBytesWithUnit(
                  record.capacity.totalBytes,
                  record.capacity.totalBytes
                )}
              </span>
              <span>
                剩余:{" "}
                {formatBytesWithUnit(
                  record.capacity.remainingBytes,
                  record.capacity.totalBytes
                )}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Progress
                percent={record.capacity.percent}
                showInfo={false}
                strokeColor="#52c41a"
                trailColor="#f0f0f0"
                size="small"
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: 12, minWidth: 24, textAlign: "right" }}>
                {record.capacity.percent}%
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: "访问路径",
      dataIndex: "path",
      key: "path",
      render: (text: string) => (text && text !== "-" ? text : "—"),
    },
    {
      title: "关联集群",
      dataIndex: "clusters",
      key: "clusters",
      render: (clusters: string[]) => (
        <Space size={[0, 8]} wrap>
          {clusters.length > 0 ? (
            clusters.map(cluster => (
              <Tag key={cluster} color="blue">
                {cluster}
              </Tag>
            ))
          ) : (
            <span>—</span>
          )}
        </Space>
      ),
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a
            style={{ color: "#1890ff", cursor: "pointer" }}
            onClick={() => handleEdit(record)}
          >
            编辑
          </a>
          <a
            style={{ color: "#ff4d4f", cursor: "pointer" }}
            onClick={() => handleDeleteClick(record)}
          >
            删除
          </a>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "12px",
        overflow: "auto",
      }}
    >
      <TableToolbar
        left={
          <Input
            placeholder="名称/访问路径"
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            style={{ width: 300 }}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        }
        right={
          <Space>
            <Button type="primary" icon={<PlusOutlined />}>
              添加
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
            />
            <Button icon={<SettingOutlined />} />
          </Space>
        }
        padding={0}
      />
      <div style={{ marginTop: 4 }}>
        <StandardTable<ExternalStorageType>
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData}
          selectedCount={selectedRowKeys.length}
          loading={loading}
          pagination={{
            total: filteredData.length,
            defaultPageSize: 10,
          }}
          containerStyle={{
            paddingLeft: 0,
          }}
        />
      </div>

      {/* 删除确认弹窗 */}
      <Modal
        title="删除"
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmLoading={deleteLoading}
        okText="确定"
        cancelText="取消"
        centered
      >
        <p>是否删除存储？</p>
      </Modal>

      {/* 编辑弹窗 */}
      {editingRecord && (
        <EditExternalStorageModal
          open={editModalVisible}
          storageUid={editingRecord.key}
          storageName={editingRecord.name}
          onCancel={handleEditCancel}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default ExternalStorage;
