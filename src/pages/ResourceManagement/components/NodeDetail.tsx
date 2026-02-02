import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Tabs,
  Descriptions,
  Card,
  Table,
  Tag,
  message,
  Space,
  Modal,
  Spin,
  Progress,
} from "antd";
import {
  ArrowLeftOutlined,
  PoweroffOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { nodeApi } from "@/api";
import type { Node, NodeDetail as NodeDetailType, VMInfo } from "@/api";
import { formatBytesAuto } from "@/utils/format";
import PerformanceMonitor from "./PerformanceMonitor";
import VMCard from "./VMCard";
import DeviceManagement from "./DeviceManagement";

interface NodeDetailProps {
  node: Node;
  onBack: () => void;
}

const NodeDetail: React.FC<NodeDetailProps> = ({ node, onBack }) => {
  const [nodeDetail, setNodeDetail] = useState<NodeDetailType | null>(null);
  const [vmList, setVmList] = useState<VMInfo[]>([]);
  const [storageList, setStorageList] = useState<unknown[]>([]);
  const [networkSettings, setNetworkSettings] = useState<unknown[]>([]);
  const [vmLoading, setVmLoading] = useState(false);
  const [storageLoading, setStorageLoading] = useState(false);
  const [networkLoading, setNetworkLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("basic");

  const networkLoadingRef = useRef(false);

  // 加载物理机详情
  const loadNodeDetail = async () => {
    try {
      const response = await nodeApi.getNodeDetail(node.uid);
      if (response.code === 200) {
        setNodeDetail(response.data);
      } else {
        message.error(response.message || "获取物理机详情失败");
      }
    } catch (error) {
      message.error("获取物理机详情失败");
      console.error("Failed to load node detail:", error);
    }
  };

  // 加载虚拟机列表
  const loadVMList = async () => {
    try {
      setVmLoading(true);
      const response = await nodeApi.getNodeVMs(node.uid);
      if (response.code === 200) {
        setVmList(response.data);
      } else {
        message.error(response.message || "获取虚拟机列表失败");
      }
    } catch (error) {
      message.error("获取虚拟机列表失败");
      console.error("Failed to load VM list:", error);
    } finally {
      setVmLoading(false);
    }
  };

  // 加载存储列表
  const loadStorageList = async () => {
    try {
      setStorageLoading(true);
      const response = await nodeApi.getStorageList(node.uid);
      if (response.code === 200) {
        setStorageList(response.data);
      } else {
        message.error(response.message || "获取存储信息失败");
      }
    } catch (error) {
      message.error("获取存储信息失败");
      console.error("Failed to load storage list:", error);
    } finally {
      setStorageLoading(false);
    }
  };

  // 加载网络设置
  const loadNetworkSettings = async () => {
    if (networkLoadingRef.current) return;

    try {
      networkLoadingRef.current = true;
      setNetworkLoading(true);
      const response = await nodeApi.getNetworkSettings(node.uid);
      if (response.code === 200) {
        setNetworkSettings(response.data);
      } else {
        message.error(response.message || "获取网络设置失败");
      }
    } catch (error) {
      message.error("获取网络设置失败");
      console.error("Failed to load network settings:", error);
    } finally {
      setNetworkLoading(false);
      networkLoadingRef.current = false;
    }
  };

  // Tab 切换时按需加载数据 - 每次切换都重新加载
  useEffect(() => {
    if (activeTab === "basic") {
      loadNodeDetail();
    } else if (activeTab === "vms") {
      loadVMList();
    } else if (activeTab === "storage") {
      loadStorageList();
    } else if (activeTab === "network-settings") {
      loadNetworkSettings();
    }
    // devices, performance 和 shell tab 不需要在这里加载数据
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, node.uid]);

  // Tab 切换处理
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  // 处理重启
  const handleReboot = async (uid: string, name: string) => {
    Modal.confirm({
      title: "确认重启",
      icon: <ExclamationCircleOutlined />,
      content: `确定要重启物理机 ${name} 吗？`,
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        try {
          const response = await nodeApi.rebootNode(uid);
          if (response.code === 200) {
            message.success("重启指令已发送");
            loadNodeDetail();
          } else {
            message.error(response.message || "重启失败");
          }
        } catch (error) {
          message.error("重启失败");
          console.error("Failed to reboot node:", error);
        }
      },
    });
  };

  // 处理关机
  const handleShutdown = async (uid: string, name: string) => {
    Modal.confirm({
      title: "确认关机",
      icon: <ExclamationCircleOutlined />,
      content: `确定要关闭物理机 ${name} 吗？`,
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        try {
          const response = await nodeApi.shutdownNode(uid);
          if (response.code === 200) {
            message.success("关机指令已发送");
            loadNodeDetail();
          } else {
            message.error(response.message || "关机失败");
          }
        } catch (error) {
          message.error("关机失败");
          console.error("Failed to shutdown node:", error);
        }
      },
    });
  };

  // 渲染状态
  const renderStatus = (status: string) => {
    let color = "default";
    let text;

    switch (status) {
      case "online":
        color = "success";
        text = "在线";
        break;
      case "offline":
        color = "default";
        text = "离线";
        break;
      case "rebooting":
        color = "processing";
        text = "重启中";
        break;
      case "shutting_down":
        color = "processing";
        text = "关机中";
        break;
      default:
        color = "default";
        text = "未知";
    }

    return <Tag color={color}>{text}</Tag>;
  };

  // 存储使用进度条渲染（参考：已用/总容量、剩余、进度条+百分比）
  const renderStorageUsage = (record: {
    diskTotal?: number;
    diskUsed?: number;
    diskLeft?: number;
  }) => {
    const total = record.diskTotal;
    const used = record.diskUsed;
    const left = record.diskLeft;

    if (total === undefined || total === 0 || used === undefined) {
      return <Tag color="default">暂未提供</Tag>;
    }

    const percent = Math.round((used / total) * 100);
    const leftDisplay = left !== undefined ? left : Math.max(0, total - used);

    return (
      <div style={{ minWidth: 160 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            marginBottom: 4,
          }}
        >
          <span>
            {formatBytesAuto(used)}/{formatBytesAuto(total)}
          </span>
          <span>剩余: {formatBytesAuto(leftDisplay)}</span>
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

  // 存储列定义
  const storageColumns: ColumnsType<unknown> = [
    {
      title: "存储名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "存储使用",
      key: "storageUsage",
      render: (_: unknown, record: unknown) => {
        const r = record as Record<string, unknown>;
        return renderStorageUsage({
          diskTotal: r.diskTotal as number | undefined,
          diskUsed: r.diskUsed as number | undefined,
          diskLeft: r.diskLeft as number | undefined,
        });
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (value: string) => {
        if (value === "available") {
          return <Tag color="success">可用</Tag>;
        }
        if (value === "enabled" || value === "active") {
          return <Tag color="processing">启用</Tag>;
        }
        return <Tag color="default">不可用</Tag>;
      },
    },
    {
      title: "共享",
      dataIndex: "shared",
      key: "shared",
      render: (value: boolean) => (value ? "是" : "否"),
    },
  ];

  // 网络设置列定义
  const networkSettingsColumns: ColumnsType<unknown> = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "激活",
      dataIndex: "active",
      key: "active",
      render: (value: boolean) => (
        <Tag color={value ? "success" : "default"}>{value ? "是" : "否"}</Tag>
      ),
    },
    {
      title: "自动启动",
      dataIndex: "autostart",
      key: "autostart",
      render: (value: boolean | null) =>
        value === null ? (
          <Tag color="default">暂未提供</Tag>
        ) : (
          <Tag color={value ? "success" : "default"}>{value ? "是" : "否"}</Tag>
        ),
    },
    {
      title: "VLAN",
      dataIndex: "vlanAware",
      key: "vlanAware",
      render: (value: boolean | null) =>
        value === null ? (
          <Tag color="default">暂未提供</Tag>
        ) : (
          <Tag color={value ? "success" : "default"}>{value ? "是" : "否"}</Tag>
        ),
    },
    {
      title: "端口",
      dataIndex: "port",
      key: "port",
      render: (value: string | null) =>
        value || <Tag color="default">暂未提供</Tag>,
    },
    {
      title: "CIDR",
      dataIndex: "cidr",
      key: "cidr",
      render: (value: string | null) =>
        value || <Tag color="default">暂未提供</Tag>,
    },
    {
      title: "网关",
      dataIndex: "gateway",
      key: "gateway",
      render: (value: string | null) =>
        value || <Tag color="default">暂未提供</Tag>,
    },
  ];

  const items = [
    {
      key: "basic",
      label: "基本信息",
      children: (
        <div style={{ display: "flex", gap: 10 }}>
          <Card
            variant="outlined"
            style={{ width: "40%" }}
            className="node-detail-card"
          >
            <Descriptions
              title="基本信息"
              column={1}
              size="small"
              styles={{
                label: { width: 120, color: "#666" },
                content: { color: "#333" },
              }}
            >
              <Descriptions.Item label="物理机名称">
                {nodeDetail?.name || node.name}
              </Descriptions.Item>
              <Descriptions.Item label="物理机 UID">
                {nodeDetail?.uid || node.uid}
              </Descriptions.Item>
              <Descriptions.Item label="IP 地址">
                {nodeDetail?.ip || node.ip}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                {renderStatus(nodeDetail?.status || node.status)}
              </Descriptions.Item>
              <Descriptions.Item label="所属集群">
                {nodeDetail?.clusterName || node.clusterName}
              </Descriptions.Item>
              <Descriptions.Item label="运行时长">
                {nodeDetail?.uptime || <Tag color="default">暂未提供</Tag>}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card
            variant="outlined"
            style={{ flex: 1 }}
            className="node-detail-card"
          >
            <Descriptions
              title="资源信息"
              column={1}
              size="small"
              styles={{ label: { width: 120, color: "#666" } }}
            >
              <Descriptions.Item label="CPU 总量">
                {nodeDetail?.cpuTotal !== undefined ? (
                  `${nodeDetail.cpuTotal} 核`
                ) : (
                  <Tag color="default">暂未提供</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="内存总量">
                {nodeDetail?.memTotal !== undefined ? (
                  `${formatBytesAuto(nodeDetail.memTotal)}`
                ) : (
                  <Tag color="default">暂未提供</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="存储总量">
                {nodeDetail?.diskTotal !== undefined ? (
                  `${formatBytesAuto(nodeDetail.diskTotal)}`
                ) : (
                  <Tag color="default">暂未提供</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="存储已用">
                {nodeDetail?.diskUsed !== undefined ? (
                  `${formatBytesAuto(nodeDetail.diskUsed)}`
                ) : (
                  <Tag color="default">暂未提供</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="虚拟机数量">
                {nodeDetail?.vmCount !== undefined ? (
                  <a style={{ color: "#1890ff" }}>{nodeDetail.vmCount}</a>
                ) : (
                  <Tag color="default">暂未提供</Tag>
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      ),
    },
    {
      key: "vms",
      label: "虚拟机",
      children: (
        <div style={{ padding: "0 0", height: "100%", overflow: "auto" }}>
          <div
            style={{
              fontSize: 12,
              color: "#666",
              margin: "0 0 8px 0",
              lineHeight: 1.4,
            }}
          >
            共计 {vmList.length} 条数据
          </div>
          {vmLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "40px 0",
              }}
            >
              <Spin size="large" />
            </div>
          ) : vmList.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 0",
                color: "#999",
              }}
            >
              暂无虚拟机
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 10,
                paddingBottom: 20,
              }}
            >
              {vmList.map(vm => (
                <VMCard key={vm.id} vm={vm} />
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "devices",
      label: "关联设备",
      children: <DeviceManagement nodeUid={node.uid} />,
    },
    {
      key: "storage",
      label: "存储详情",
      children: (
        <div style={{ padding: "0 0" }}>
          <div
            style={{
              fontSize: 12,
              color: "#666",
              margin: "0 0 8px 0",
              lineHeight: 1.4,
            }}
          >
            共计 {storageList.length} 条数据
          </div>
          <Table
            columns={storageColumns}
            dataSource={storageList}
            rowKey="storageUid"
            pagination={false}
            size="small"
            loading={storageLoading}
          />
        </div>
      ),
    },
    {
      key: "network-settings",
      label: "网络设置",
      children: (
        <div style={{ padding: "0 0" }}>
          <div
            style={{
              fontSize: 12,
              color: "#666",
              margin: "0 0 8px 0",
              lineHeight: 1.4,
            }}
          >
            共计 {networkSettings.length} 条数据
          </div>
          <Table
            columns={networkSettingsColumns}
            dataSource={networkSettings}
            rowKey="name"
            pagination={false}
            size="small"
            loading={networkLoading}
          />
        </div>
      ),
    },
    {
      key: "performance",
      label: "性能监控",
      children: <PerformanceMonitor nodeUid={node.uid} />,
    },
    {
      key: "shell",
      label: "Shell",
      children: (
        <div
          style={{
            padding: 20,
            textAlign: "center",
            color: "#999",
          }}
        >
          <Tag color="default">Shell 功能开发中</Tag>
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={onBack}
            style={{ padding: "4px 8px" }}
          />
          <span style={{ fontSize: 16, fontWeight: 500 }}>
            {nodeDetail?.name || node.name}
          </span>
          {renderStatus(nodeDetail?.status || node.status)}
        </div>
        <Space>
          <Button
            icon={<SyncOutlined />}
            onClick={() => handleReboot(node.uid, node.name)}
          >
            重启
          </Button>
          <Button
            icon={<PoweroffOutlined />}
            onClick={() => handleShutdown(node.uid, node.name)}
          >
            关机
          </Button>
        </Space>
      </div>

      <style>
        {`
          .node-detail-tabs {
            display: flex;
            flex-direction: column;
            flex: 1;
            overflow: hidden;
          }
          .node-detail-tabs > .ant-tabs-nav {
            margin: 0;
            flex-shrink: 0;
          }
          .node-detail-tabs > .ant-tabs-content-holder {
            flex: 1;
            overflow: hidden;
            padding: 8px 0 30px 0;
            min-height: 0;
          }
          .node-detail-tabs .ant-tabs-content {
            height: 100%;
          }
          .node-detail-tabs .ant-tabs-tabpane {
            height: 100%;
            overflow: auto;
          }
          .node-detail-card {
            background: rgba(245, 245, 245, 0.3);
          }
        `}
      </style>
      <Tabs
        type="card"
        items={items}
        className="node-detail-tabs"
        activeKey={activeTab}
        onChange={handleTabChange}
        destroyInactiveTabPane
      />
    </div>
  );
};

export default NodeDetail;
