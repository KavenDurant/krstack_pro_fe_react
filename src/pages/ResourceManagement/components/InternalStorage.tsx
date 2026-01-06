import React, { useState, useEffect, useRef, useMemo } from "react";
import { Input, Button, Space, Tag, message } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import TableToolbar from "@/components/__design-system__/TableToolbar";
import StandardTable from "@/components/__design-system__/StandardTable";
import { storageApi } from "@/api";
import type { InternalStorage } from "@/api";
import { formatBytesAuto } from "@/utils/format";

interface InternalStorageType {
  key: string;
  name: string;
  status: "available" | "in_use";
  size: string;
  host: string;
  type: string;
}

const InternalStorage: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [storageData, setStorageData] = useState<InternalStorageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const hasLoadedRef = useRef(false);

  // 数据转换函数：将后端数据转换为前端格式
  const transformStorageData = (
    data: InternalStorage[]
  ): InternalStorageType[] => {
    return data.map(item => {
      // 根据 disk_used 判断状态
      const status: "available" | "in_use" =
        item.disk_used > 0 ? "in_use" : "available";

      // 格式化容量
      const size =
        item.disk_total !== null && item.disk_total !== undefined
          ? formatBytesAuto(item.disk_total)
          : "—";

      return {
        key: item.storage_uid,
        name: item.name || "-",
        status,
        size,
        host: item.node_name || "—",
        type: item.platform_type || "—",
      };
    });
  };

  // 加载内置存储列表
  const loadInternalStorageList = async () => {
    try {
      setLoading(true);
      const response = await storageApi.getInternalStorageList();

      // 兼容两种响应格式：
      // 1. 标准格式：{ code, message, data: { cluster_storages } }
      // 2. 直接格式：{ cluster_storages }
      const clusterStorages =
        response.data?.cluster_storages ??
        (response as unknown as { cluster_storages?: InternalStorage[] })
          .cluster_storages;
      if (clusterStorages && Array.isArray(clusterStorages)) {
        const transformedData = transformStorageData(clusterStorages);
        setStorageData(transformedData);
      } else if (response.code === 200 || response.code === 0) {
        // 如果 code 是成功码但数据格式不对，设置为空数组（不显示错误）
        setStorageData([]);
      } else {
        // 只有在 code 不是成功码且没有数据时才显示错误
        console.error("Internal storage API error:", response);
        message.error(response.message || "获取内置存储列表失败");
      }
    } catch (error) {
      const errorObj = error as {
        code?: number;
        message?: string;
        data?: unknown;
      };

      // 尝试从错误响应中提取数据（处理后端返回错误码但仍包含数据的情况）
      const dataPayload =
        errorObj.data && typeof errorObj.data === "object"
          ? (errorObj.data as {
              cluster_storages?: InternalStorage[];
            })
          : undefined;

      const storages = dataPayload?.cluster_storages;
      if (Array.isArray(storages)) {
        const transformedData = transformStorageData(storages);
        setStorageData(transformedData);
        return;
      }

      message.error(errorObj.message || "获取内置存储列表失败");
      console.error("Internal storage API error:", errorObj);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载 - 使用 ref 防止重复请求
  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadInternalStorageList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 刷新列表
  const handleRefresh = () => {
    loadInternalStorageList();
  };

  // 过滤数据
  const filteredData = useMemo(() => {
    return storageData.filter(item =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [storageData, searchText]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns: ColumnsType<InternalStorageType> = [
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
      render: status => (
        <Tag color={status === "available" ? "green" : "blue"}>
          {status === "available" ? "可用" : "使用中"}
        </Tag>
      ),
    },
    {
      title: "容量",
      dataIndex: "size",
      key: "size",
      render: (text: string) => (text && text !== "-" ? text : "—"),
    },
    {
      title: "所属主机",
      dataIndex: "host",
      key: "host",
      render: (text: string) => (text && text !== "-" ? text : "—"),
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      render: (text: string) => (text && text !== "-" ? text : "—"),
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
            placeholder="名称"
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            style={{ width: 300 }}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        }
        right={
          <Space>
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
        <StandardTable<InternalStorageType>
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
    </div>
  );
};

export default InternalStorage;
