import React, { useState, useEffect, useRef, useMemo } from "react";
import { Table, Input, Button, Space, Dropdown, message } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  SettingOutlined,
  PlusOutlined,
  DownOutlined,
  DeleteOutlined,
  WindowsOutlined,
  CodeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { imageApi } from "@/api";
import type { TemplateImage } from "@/api";
import { formatFileSize, formatDateTime } from "@/utils/format";

interface ImageType {
  key: string;
  name: string;
  os: string;
  format: string;
  size: string;
  location: string;
  uploadTime: string;
}

const TemplateImages: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [imageData, setImageData] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const hasLoadedRef = useRef(false);

  // 数据转换函数：将后端数据转换为前端格式
  const transformImageData = (data: TemplateImage[]): ImageType[] => {
    return data.map(item => ({
      key: item.image_uid,
      name: item.name || "-",
      os: item.os_type || "—",
      format: item.format || "—",
      size: item.size ? formatFileSize(item.size) : "—",
      location: item.storage || "—",
      uploadTime: item.updated_at ? formatDateTime(item.updated_at) : "—",
    }));
  };

  // 加载模板镜像列表
  const loadTemplateImageList = async () => {
    try {
      setLoading(true);
      const response = await imageApi.getTemplateImageList();
      if (response.code === 200) {
        const transformedData = transformImageData(response.data);
        setImageData(transformedData);
      } else {
        message.error(response.message || "获取模板镜像列表失败");
      }
    } catch (error) {
      message.error("获取模板镜像列表失败");
      console.error("Failed to load template image list:", error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载 - 使用 ref 防止重复请求
  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadTemplateImageList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 刷新列表
  const handleRefresh = () => {
    loadTemplateImageList();
  };

  // 过滤数据
  const filteredData = useMemo(() => {
    return imageData.filter(item =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [imageData, searchText]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const getOsIcon = (os: string) => {
    const lowerOs = os.toLowerCase();
    if (lowerOs.includes("windows"))
      return <WindowsOutlined style={{ color: "#0078d4" }} />;
    return <CodeOutlined style={{ color: "#f34b7d" }} />;
  };

  const columns: ColumnsType<ImageType> = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      render: text => <span style={{ color: "#333" }}>{text}</span>,
    },
    {
      title: "操作系统",
      dataIndex: "os",
      key: "os",
      render: (text: string) => {
        if (!text || text === "-" || text === "—") {
          return "—";
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
      title: "格式",
      dataIndex: "format",
      key: "format",
      render: (text: string) => (text && text !== "-" ? text : "—"),
    },
    {
      title: "大小",
      dataIndex: "size",
      key: "size",
      render: (text: string) => (text && text !== "-" ? text : "—"),
    },
    {
      title: "存放位置",
      dataIndex: "location",
      key: "location",
      render: (text: string) => (text && text !== "-" ? text : "—"),
    },
    {
      title: "上传时间",
      dataIndex: "uploadTime",
      key: "uploadTime",
      render: (text: string) => (text && text !== "-" ? text : "—"),
    },
    {
      title: "操作",
      key: "action",
      render: () => (
        <Space size="middle">
          <a style={{ color: "#1890ff" }}>编辑</a>
          <a style={{ color: "#1890ff" }}>删除</a>
          <Dropdown
            menu={{
              items: [
                { key: "download", label: "下载" },
                { key: "sync", label: "同步" },
              ],
            }}
          >
            <a style={{ color: "#1890ff" }} onClick={e => e.preventDefault()}>
              更多 <DownOutlined style={{ fontSize: 10 }} />
            </a>
          </Dropdown>
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
        padding: 16,
        background: "#fff",
      }}
    >
      <div
        style={{
          paddingBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Input
          placeholder="名称"
          prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
          style={{ width: 300 }}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <Button icon={<DeleteOutlined />} disabled>
            删除
          </Button>
          <Button type="primary" icon={<PlusOutlined />}>
            上传
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
          />
          <Button icon={<SettingOutlined />} />
        </div>
      </div>

      <div
        style={{
          fontSize: 12,
          color: "#666",
          margin: "0 0 8px 0",
          lineHeight: 1.4,
        }}
      >
        共计 {filteredData.length} 条数据 已选 {selectedRowKeys.length} 条
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={{
          total: filteredData.length,
          showTotal: total => `共 ${total} 条`,
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
      />
    </div>
  );
};

export default TemplateImages;
