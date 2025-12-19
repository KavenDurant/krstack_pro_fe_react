import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Progress,
  message,
  Modal,
  Tag,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  SettingOutlined,
  PoweroffOutlined,
  PlayCircleFilled,
  SyncOutlined,
  LaptopOutlined,
  DatabaseOutlined,
  AppstoreOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { DataNode } from "antd/es/tree";
import ResizableTreePanel from "@/components/ResizableTreePanel";
import NodeDetail from "./NodeDetail";
import { nodeApi } from "../../../api";
import type { Node } from "../../../api";
import type { NodeStatus } from "../../../api/modules/node/types";

// 常量定义
const BYTES_TO_TB = 1024 * 1024 * 1024 * 1024;
const MB_TO_GB = 1024;

// 状态配置映射
const STATUS_CONFIG: Record<
  NodeStatus,
  { icon: React.ReactNode; color: string; text: string }
> = {
  online: {
    icon: <PlayCircleFilled />,
    color: "#52c41a",
    text: "在线",
  },
  offline: {
    icon: <PoweroffOutlined />,
    color: "#999",
    text: "离线",
  },
  rebooting: {
    icon: <SyncOutlined spin />,
    color: "#1890ff",
    text: "重启中",
  },
  shutting_down: {
    icon: <PoweroffOutlined />,
    color: "#1890ff",
    text: "关机中",
  },
};

// 渲染状态
const renderStatus = (status: NodeStatus) => {
  const config = STATUS_CONFIG[status] || {
    icon: <PoweroffOutlined />,
    color: "#333",
    text: "未知",
  };

  return (
    <Space style={{ color: config.color }}>
      {config.icon}
      <span>{config.text}</span>
    </Space>
  );
};

// 渲染存储信息
const renderStorage = (diskTotal: number | undefined, record: Node) => {
  if (diskTotal === undefined || record.diskUsed === undefined) {
    return <Tag color="default">暂未提供</Tag>;
  }

  const usedTB = record.diskUsed / BYTES_TO_TB;
  const totalTB = diskTotal / BYTES_TO_TB;
  const leftTB = totalTB - usedTB;
  const percent = Math.round((usedTB / totalTB) * 100);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
        }}
      >
        <span>
          {usedTB.toFixed(2)}TB/{totalTB.toFixed(2)}TB
        </span>
        <span>剩余:{leftTB.toFixed(2)}TB</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Progress
          percent={percent}
          showInfo={false}
          strokeColor="#52c41a"
          size="small"
          style={{ flex: 1 }}
        />
        <span style={{ fontSize: 12 }}>{percent}%</span>
      </div>
    </div>
  );
};

const PhysicalMachine: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedTreeKey, setSelectedTreeKey] = useState<React.Key>("all");
  const [nodeData, setNodeData] = useState<Node[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const hasLoadedRef = useRef(false);

  // 构建树形数据 - 使用 useMemo 避免不必要的重新计算
  const treeData = useMemo(() => {
    const clusterMap = new Map<number, { name: string; nodes: Node[] }>();

    nodeData.forEach(node => {
      if (!clusterMap.has(node.clusterId)) {
        clusterMap.set(node.clusterId, {
          name: node.clusterName,
          nodes: [],
        });
      }
      clusterMap.get(node.clusterId)?.nodes.push(node);
    });

    const children: DataNode[] = Array.from(clusterMap.entries()).map(
      ([clusterId, cluster]) => ({
        title: cluster.name,
        key: `cluster-${clusterId}`,
        icon: <DatabaseOutlined />,
        children: cluster.nodes.map(node => ({
          title: node.name,
          key: node.uid,
          icon: <LaptopOutlined />,
        })),
      })
    );

    return [
      {
        title: "全部物理机",
        key: "all",
        icon: <AppstoreOutlined />,
        children,
      },
    ];
  }, [nodeData]);

  // 加载物理机列表
  const loadNodeList = async () => {
    try {
      setLoading(true);
      const response = await nodeApi.getNodeList();
      if (response.code === 200) {
        setNodeData(response.data.list);
      } else {
        message.error(response.message || "获取物理机列表失败");
      }
    } catch (error) {
      message.error("获取物理机列表失败");
      console.error("Failed to load node list:", error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载 - 只在组件挂载时执行一次
  // 使用 ref 防止 React StrictMode 在开发环境下的重复调用
  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadNodeList();
    }
  }, []);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // 通用确认操作处理
  const handleConfirmAction = async (
    title: string,
    content: string,
    action: () => Promise<void>,
    successMessage: string,
    errorMessage: string
  ) => {
    Modal.confirm({
      title,
      icon: <ExclamationCircleOutlined />,
      content,
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        try {
          await action();
          message.success(successMessage);
          loadNodeList();
        } catch (error) {
          message.error(errorMessage);
          console.error(`Action failed:`, error);
        }
      },
    });
  };

  // 处理关机
  const handleShutdown = async (uid: string, name: string) => {
    await handleConfirmAction(
      "确认关机",
      `确定要关闭物理机 ${name} 吗？`,
      async () => {
        const response = await nodeApi.shutdownNode(uid);
        if (response.code !== 200) {
          throw new Error(response.message || "关机失败");
        }
      },
      "关机指令已发送",
      "关机失败"
    );
  };

  // 处理重启
  const handleReboot = async (uid: string, name: string) => {
    await handleConfirmAction(
      "确认重启",
      `确定要重启物理机 ${name} 吗？`,
      async () => {
        const response = await nodeApi.rebootNode(uid);
        if (response.code !== 200) {
          throw new Error(response.message || "重启失败");
        }
      },
      "重启指令已发送",
      "重启失败"
    );
  };

  // 批量关机
  const handleBatchShutdown = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("请先选择要关机的物理机");
      return;
    }

    handleConfirmAction(
      "确认批量关机",
      `确定要关闭选中的 ${selectedRowKeys.length} 台物理机吗？`,
      async () => {
        const promises = selectedRowKeys.map(key =>
          nodeApi.shutdownNode(key as string)
        );
        await Promise.all(promises);
        setSelectedRowKeys([]);
      },
      "批量关机指令已发送",
      "批量关机失败"
    );
  };

  // 批量重启
  const handleBatchReboot = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("请先选择要重启的物理机");
      return;
    }

    handleConfirmAction(
      "确认批量重启",
      `确定要重启选中的 ${selectedRowKeys.length} 台物理机吗？`,
      async () => {
        const promises = selectedRowKeys.map(key =>
          nodeApi.rebootNode(key as string)
        );
        await Promise.all(promises);
        setSelectedRowKeys([]);
      },
      "批量重启指令已发送",
      "批量重启失败"
    );
  };

  // 刷新列表
  const handleRefresh = () => {
    loadNodeList();
  };
  const filteredData = useMemo(() => {
    return nodeData.filter(node => {
      const matchSearch =
        node.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        node.ip.toLowerCase().includes(searchValue.toLowerCase());

      // 根据树选择过滤
      if (selectedTreeKey === "all") {
        return matchSearch;
      } else if (String(selectedTreeKey).startsWith("cluster-")) {
        const clusterId = Number(
          String(selectedTreeKey).replace("cluster-", "")
        );
        return matchSearch && node.clusterId === clusterId;
      } else {
        return matchSearch && node.uid === selectedTreeKey;
      }
    });
  }, [nodeData, searchValue, selectedTreeKey]);

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
  };
  const handleBackToList = () => {
    setSelectedNode(null);
    loadNodeList();
  };

  const columns: ColumnsType<Node> = useMemo(
    () => [
      {
        title: "名称",
        dataIndex: "name",
        key: "name",
        render: (text: string, record: Node) => (
          <a
            style={{ color: "#1890ff" }}
            onClick={() => handleNodeClick(record)}
          >
            {text}
          </a>
        ),
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        render: renderStatus,
      },
      { title: "IP", dataIndex: "ip", key: "ip" },
      {
        title: "CPU (核)",
        dataIndex: "cpuTotal",
        key: "cpuTotal",
        render: (value: number | undefined) =>
          value !== undefined ? value : <Tag color="default">暂未提供</Tag>,
      },
      {
        title: "内存 (GB)",
        dataIndex: "memTotal",
        key: "memTotal",
        render: (value: number | undefined) =>
          value !== undefined ? (
            (value / MB_TO_GB).toFixed(2)
          ) : (
            <Tag color="default">暂未提供</Tag>
          ),
      },
      {
        title: "本机存储",
        dataIndex: "diskTotal",
        key: "storage",
        width: 200,
        render: renderStorage,
      },
      {
        title: "关联虚拟机数量",
        dataIndex: "vmCount",
        key: "vmCount",
        render: (value: number | undefined) =>
          value !== undefined ? value : <Tag color="default">暂未提供</Tag>,
      },
      {
        title: "运行时长",
        dataIndex: "uptime",
        key: "uptime",
        render: (value: string | undefined) =>
          value ? value : <Tag color="default">暂未提供</Tag>,
      },
      {
        title: "操作",
        key: "action",
        render: (_: unknown, record: Node) => (
          <Space size="middle">
            <a
              style={{ color: "#1890ff" }}
              onClick={() => handleShutdown(record.uid, record.name)}
            >
              关机
            </a>
            <a
              style={{ color: "#1890ff" }}
              onClick={() => handleReboot(record.uid, record.name)}
            >
              重启
            </a>
          </Space>
        ),
      },
    ],
    [handleShutdown, handleReboot]
  );

  // 如果选中了物理机，显示详情页
  if (selectedNode) {
    return <NodeDetail node={selectedNode} onBack={handleBackToList} />;
  }

  return (
    <ResizableTreePanel
      treeData={treeData}
      selectedKey={selectedTreeKey}
      onSelect={keys => setSelectedTreeKey(keys[0])}
    >
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Input
            placeholder="名称/IP"
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            style={{ width: 300 }}
          />
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleBatchReboot}>
              重启
            </Button>
            <Button icon={<PoweroffOutlined />} onClick={handleBatchShutdown}>
              关机
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
            />
            <Button icon={<SettingOutlined />} />
          </Space>
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
          pagination={false}
        />
      </div>
    </ResizableTreePanel>
  );
};

export default PhysicalMachine;
