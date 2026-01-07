import React, { useState, useEffect, useRef, useMemo } from "react";
import { useTableScrollHeight } from "@/hooks";
import { Table, Input, Button, Space, Modal, message, Tooltip } from "antd";
import { useLocation } from "react-router-dom";
import {
  SearchOutlined,
  ReloadOutlined,
  DeleteOutlined,
  WindowsOutlined,
  CodeOutlined,
  AppleOutlined,
  AndroidOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { imageApi } from "@/api";
import type { SystemImage } from "@/api/modules/image/types";
import { formatFileSize, formatDateTime } from "@/utils/format";
import UploadImageModal from "./UploadImageModal";

interface ImageType {
  key: string;
  name: string;
  os: string;
  format: string;
  size: string;
  location: string;
  uploadTime: string;
  cluster_name: string;
  storage: string;
  image_uid: string;
}

const SystemImages: React.FC = () => {
  const location = useLocation();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<SystemImage[]>([]);
  const [imageData, setImageData] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const pollingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const transformImageData = (data: SystemImage[]): ImageType[] => {
    return data.map(item => ({
      key: item.image_uid,
      name: item.name || "-",
      os: item.os_type || "—",
      format: item.format || "—",
      size: item.size ? formatFileSize(item.size) : "—",
      location: `${item.cluster_name}/${item.storage}`,
      uploadTime: item.updated_at ? formatDateTime(item.updated_at) : "—",
      cluster_name: item.cluster_name || "",
      storage: item.storage || "",
      image_uid: item.image_uid,
    }));
  };

  const loadSystemImageList = async () => {
    try {
      setLoading(true);
      const response = await imageApi.getSystemImageList();
      if (response && "images" in response && Array.isArray(response.images)) {
        const transformedData = transformImageData(response.images);
        setImageData(transformedData);
      } else {
        setImageData([]);
      }
    } catch (error) {
      message.error("获取系统镜像列表失败");
      console.error("Failed to load system image list:", error);
      setImageData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.pathname.includes("system-image")) {
      loadSystemImageList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const startPolling = () => {
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
    }
    const timer = setInterval(() => {
      if (location.pathname.includes("system-image")) {
        loadSystemImageList();
      }
    }, 60000);
    pollingTimerRef.current = timer;
  };

  const stopPolling = () => {
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
      pollingTimerRef.current = null;
    }
  };

  useEffect(() => {
    // 只在系统镜像页面启动定时刷新
    if (location.pathname.includes("system-image")) {
      startPolling();
    }
    return () => {
      stopPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleRefresh = () => {
    loadSystemImageList();
  };

  const handleDelete = async () => {
    if (selectedRows.length === 0) {
      message.warning("请先选择要删除的镜像");
      return;
    }

    setDeleteLoading(true);
    try {
      const deleteParams = {
        images: selectedRows.map(row => ({ image_uid: row.image_uid })),
      };

      const response = await imageApi.deleteSystemImage(deleteParams);

      if (response.code === 200 && response.data) {
        const { delete_images_succeed, delete_images_failed } = response.data;

        if (
          delete_images_succeed.length === deleteParams.images.length &&
          delete_images_failed.length === 0
        ) {
          message.success("删除系统镜像成功");
        } else if (delete_images_failed.length === deleteParams.images.length) {
          message.error(
            "全部系统镜像删除失败，可能是被云主机引用或系统镜像相关存储不存在！"
          );
        } else if (delete_images_failed.length > 0) {
          message.warning("部分系统镜像删除失败，可能是被云主机引用！");
        }

        setSelectedRowKeys([]);
        setSelectedRows([]);
        loadSystemImageList();
      } else {
        message.error(response.message || "删除失败");
      }
    } catch (error) {
      message.error("删除系统镜像失败");
      console.error("Failed to delete system images:", error);
    } finally {
      setDeleteLoading(false);
      setDeleteModalVisible(false);
    }
  };

  const handleDeleteSingle = (record: ImageType) => {
    setSelectedRows([
      {
        image_uid: record.image_uid,
        name: record.name,
        cluster_name: record.cluster_name,
        storage: record.storage,
      } as SystemImage,
    ]);
    setDeleteModalVisible(true);
  };

  const filteredData = useMemo(() => {
    return imageData.filter(item =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [imageData, searchText]);

  // 动态计算表格滚动区域高度
  const tableScrollY = useTableScrollHeight({ pageSize: pagination.pageSize });

  // 搜索时重置到第1页
  useEffect(() => {
    setPagination(prev => ({ ...prev, current: 1 }));
  }, [searchText]);

  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    newSelectedRows: ImageType[]
  ) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(
      newSelectedRows.map(
        row =>
          ({
            image_uid: row.image_uid,
            name: row.name,
            cluster_name: row.cluster_name,
            storage: row.storage,
          }) as SystemImage
      )
    );
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const getOsIcon = (os: string) => {
    const lowerOs = os.toLowerCase();
    if (lowerOs.includes("windows"))
      return <WindowsOutlined style={{ color: "#0078d4" }} />;
    if (lowerOs.includes("apple") || lowerOs.includes("mac"))
      return <AppleOutlined />;
    if (lowerOs.includes("android")) return <AndroidOutlined />;
    return <CodeOutlined style={{ color: "#f34b7d" }} />;
  };

  const columns: ColumnsType<ImageType> = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      width: 250,
      fixed: "left",
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text || "-"} placement="topLeft">
          <span style={{ color: "#333" }}>{text || "-"}</span>
        </Tooltip>
      ),
    },
    {
      title: "格式",
      dataIndex: "format",
      key: "format",
      width: 100,
      render: (text: string) => (text && text !== "-" ? text : "—"),
    },
    {
      title: "容量",
      dataIndex: "size",
      key: "size",
      width: 100,
      render: (text: string) => (text && text !== "-" ? text : "—"),
    },
    {
      title: "存放位置",
      dataIndex: "location",
      key: "location",
      width: 210,
      render: (text: string, record: ImageType) => (
        <Tooltip
          title={`${record.cluster_name}/${record.storage}`}
          placement="topLeft"
        >
          <span>{text || "—"}</span>
        </Tooltip>
      ),
    },
    {
      title: "上传时间",
      dataIndex: "uploadTime",
      key: "uploadTime",
      width: 180,
      render: (text: string) => (text && text !== "-" ? text : "—"),
    },
    {
      title: "操作系统",
      dataIndex: "os",
      key: "os",
      width: 150,
      render: (text: string) => {
        if (!text || text === "-" || text === "—" || text === "unknown") {
          return "其他";
        }
        return (
          <Space>
            {getOsIcon(text)}
            <span>{text}</span>
          </Space>
        );
      },
    },
    {
      title: "操作",
      key: "operation",
      width: 100,
      fixed: "right",
      align: "center" as const,
      render: (_: unknown, record: ImageType) => (
        <span
          style={{ color: "#1890ff", cursor: "pointer" }}
          onClick={() => handleDeleteSingle(record)}
        >
          删除
        </span>
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
        background: "#fff",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          paddingBottom: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Input
          placeholder="请输入内容"
          prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
          style={{ width: 280 }}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          allowClear
        />
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            icon={<DeleteOutlined />}
            disabled={selectedRowKeys.length === 0}
            onClick={() => setDeleteModalVisible(true)}
          >
            删除
          </Button>
          <Button type="primary" onClick={() => setUploadModalVisible(true)}>
            上传
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
          />
        </div>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
        }}
      >
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `共 ${total} 条数据，当前显示 ${range[0]}-${range[1]} 条`,
            pageSizeOptions: ["10", "20", "50", "100"],
            onChange: (page, pageSize) => {
              setPagination({ current: page, pageSize });
            },
          }}
          scroll={{
            x: 1100,
            ...(tableScrollY ? { y: tableScrollY } : {}),
          }}
          rowKey="key"
        />
      </div>

      <Modal
        title="删除"
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="确定"
        cancelText="取消"
        confirmLoading={deleteLoading}
      >
        <p>是否要删除系统镜像？</p>
      </Modal>

      <UploadImageModal
        open={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        onSuccess={() => {
          setUploadModalVisible(false);
          // 上传成功后立即刷新列表
          loadSystemImageList();
        }}
      />
    </div>
  );
};

export default SystemImages;
