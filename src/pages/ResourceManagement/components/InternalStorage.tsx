import React, { useState, useEffect, useRef, useMemo } from "react";
import { Input, Button, Space, Tag, message, Progress } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import TableToolbar from "@/components/__design-system__/TableToolbar";
import StandardTable from "@/components/__design-system__/StandardTable";
import { storageApi } from "@/api";
import type { InternalStorage as InternalStorageApi } from "@/api";
import { calculatePercentage, formatBytesWithUnit } from "@/utils/format";

interface InternalStorageType {
  key: string;
  name: string;
  clusterName: string;
  type: string;
  capacity: {
    usedBytes: number;
    totalBytes: number;
    remainingBytes: number;
    percent: number;
  } | null;
}

const InternalStorage: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [storageData, setStorageData] = useState<InternalStorageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const hasLoadedRef = useRef(false);

  // 数据转换函数：将后端数据转换为前端格式
  const transformStorageData = (
    data: InternalStorageApi[]
  ): InternalStorageType[] => {
    return data.map(item => {
      // 保留原始字节数据，渲染时再格式化
      let capacity: InternalStorageType["capacity"] = null;
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

      return {
        key: item.storage_uid,
        name: item.name || "-",
        clusterName: item.cluster_name || "-",
        type: item.platform_type || "-",
        capacity,
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
        (response as unknown as { cluster_storages?: InternalStorageApi[] })
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
              cluster_storages?: InternalStorageApi[];
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
    return storageData.filter(
      item =>
        item.name?.toLowerCase().includes(searchText.toLowerCase()) ?? false
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
      title: "所属集群",
      dataIndex: "clusterName",
      key: "clusterName",
      render: (text: string) => (text && text !== "-" ? text : "—"),
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      render: (text: string) => (text && text !== "-" ? text : "—"),
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
                  record.capacity.remainingBytes,
                  record.capacity.totalBytes
                )}
                /
                {formatBytesWithUnit(
                  record.capacity.totalBytes,
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
