import React, { useState, useEffect, useMemo } from "react";
import { Table, Input, Button, Modal, message, Tooltip } from "antd";
import { useLocation } from "react-router-dom";
import {
  SearchOutlined,
  ReloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { imageApi } from "@/api";
import type { TemplateImage } from "@/api/modules/image/types";
import { formatFileSize } from "@/utils/format";

interface ImageType {
  key: string;
  name: string;
  os: string;
  format: string;
  size: string;
  location: string;
  cluster_name: string;
  node: string;
  image_uid: string;
}

const TemplateImages: React.FC = () => {
  const location = useLocation();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<TemplateImage[]>([]);
  const [imageData, setImageData] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const transformImageData = (data: TemplateImage[]): ImageType[] => {
    return data.map(item => ({
      key: item.image_uid,
      name: item.name || "-",
      os: item.os_type || "—",
      format: item.format || "—",
      size: item.size ? formatFileSize(item.size) : "—",
      location: `${item.cluster_name} / ${item.node}`,
      cluster_name: item.cluster_name || "",
      node: item.node || "",
      image_uid: item.image_uid,
    }));
  };

  const loadTemplateImageList = async () => {
    try {
      setLoading(true);
      const response = await imageApi.getTemplateImageList();
      if (response && "images" in response && Array.isArray(response.images)) {
        const transformedData = transformImageData(response.images);
        setImageData(transformedData);
      } else {
        setImageData([]);
      }
    } catch (error) {
      message.error("获取模板镜像列表失败");
      console.error("Failed to load template image list:", error);
      setImageData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.pathname.includes("template-image")) {
      loadTemplateImageList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleRefresh = () => {
    loadTemplateImageList();
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

      const response = await imageApi.deleteTemplateImage(deleteParams);

      if (response.code === 200 && response.data) {
        const { delete_images_succeed, delete_images_failed } = response.data;

        if (
          delete_images_succeed.length === deleteParams.images.length &&
          delete_images_failed.length === 0
        ) {
          message.success("删除模板镜像成功");
        } else if (delete_images_failed.length === deleteParams.images.length) {
          message.error(
            "全部模板镜像删除失败，可能是被云主机引用或模版镜像相关存储不存在！"
          );
        } else if (delete_images_failed.length > 0) {
          message.warning("部分模板镜像删除失败，可能是被云主机引用！");
        }

        setSelectedRowKeys([]);
        setSelectedRows([]);
        loadTemplateImageList();
      } else {
        message.error(response.message || "删除失败");
      }
    } catch (error) {
      message.error("删除模板镜像失败");
      console.error("Failed to delete template images:", error);
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
        node: record.node,
      } as TemplateImage,
    ]);
    setDeleteModalVisible(true);
  };

  const filteredData = useMemo(() => {
    return imageData.filter(item =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [imageData, searchText]);

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
            node: row.node,
          }) as TemplateImage
      )
    );
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns: ColumnsType<ImageType> = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      width: 160,
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
      width: 90,
      render: (text: string) => (text && text !== "-" ? text : "—"),
    },
    {
      title: "存放位置",
      dataIndex: "location",
      key: "node",
      width: 200,
      render: (text: string, record: ImageType) => (
        <Tooltip
          title={`${record.cluster_name} / ${record.node}`}
          placement="topLeft"
        >
          <span>{text || "—"}</span>
        </Tooltip>
      ),
    },
    {
      title: "操作",
      key: "operation",
      width: 100,
      align: "left" as const,
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
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
          />
        </div>
      </div>

      <div
        style={{
          fontSize: 14,
          color: "rgba(0, 0, 0, 0.6)",
          marginBottom: 8,
        }}
      >
        共&nbsp;
        <span style={{ color: "#1890ff" }}>{imageData.length}</span>
        &nbsp;项数据&nbsp;&nbsp;已选&nbsp;
        <span style={{ color: "#1890ff" }}>{selectedRowKeys.length}</span>
        &nbsp;项
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={false}
        scroll={{ y: "calc(100vh - 350px)", x: 800 }}
        rowKey="key"
      />

      <Modal
        title="删除"
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="确定"
        cancelText="取消"
        confirmLoading={deleteLoading}
      >
        <p>是否要删除模板镜像？</p>
      </Modal>
    </div>
  );
};

export default TemplateImages;
