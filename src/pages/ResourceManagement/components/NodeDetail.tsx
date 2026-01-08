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

interface NodeDetailProps {
  node: Node;
  onBack: () => void;
}

const NodeDetail: React.FC<NodeDetailProps> = ({ node, onBack }) => {
  const [nodeDetail, setNodeDetail] = useState<NodeDetailType | null>(null);
  const [vmList, setVmList] = useState<VMInfo[]>([]);
  const [usbList, setUsbList] = useState<unknown[]>([]);
  const [gpuList, setGpuList] = useState<unknown[]>([]);
  const [storageList, setStorageList] = useState<unknown[]>([]);
  const [networkSettings, setNetworkSettings] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("basic");
  const hasLoadedDetailRef = useRef(false);
  const hasLoadedVMsRef = useRef(false);
  const hasLoadedDevicesRef = useRef(false);
  const hasLoadedStorageRef = useRef(false);
  const hasLoadedNetworkSettingsRef = useRef(false);
  const hasLoadedPerformanceRef = useRef(false);

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
      setLoading(true);
      if (import.meta.env.DEV) {
        const vms = Array.from({ length: 100 }).map((_, index) => {
          const vmIdValue = 100 + index;
          const running = index % 4 === 0;

          return {
            nodeUid: node.uid,
            id: `qemu/${vmIdValue}`,
            name: `mock-vm-${vmIdValue}`,
            vmId: vmIdValue,
            vmUid: btoa(
              JSON.stringify({
                cluster_id: 2,
                node_name: "host237",
                vm_id: vmIdValue,
              })
            ),
            status: (running ? "Running" : "Stopped") as "Running" | "Stopped",
            clusterId: 2,
            nodeName: "host237",
            cpuTotal: [2, 4, 8][index % 3],
            memTotal: [2147483648, 4294967296, 8589934592, 10737418240][
              index % 4
            ],
            ip: running ? `192.168.1.${index + 10}` : "",
            osType: index % 3 === 0 ? "Windows" : "Linux",
          };
        });

        setVmList(vms);
        return;
      }
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
      setLoading(false);
    }
  };

  // 加载关联设备（USB + GPU）
  const loadDevices = async () => {
    try {
      setLoading(true);
      const [usbResponse, gpuResponse] = await Promise.all([
        nodeApi.getUSBList(node.uid),
        nodeApi.getGPUList(node.uid),
      ]);

      if (usbResponse.code === 200) {
        setUsbList(usbResponse.data);
      }
      if (gpuResponse.code === 200) {
        setGpuList(gpuResponse.data);
      }
    } catch (error) {
      message.error("获取设备信息失败");
      console.error("Failed to load devices:", error);
    } finally {
      setLoading(false);
    }
  };

  // 加载存储列表
  const loadStorageList = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  // 加载网络设置
  const loadNetworkSettings = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  // 初始加载基本信息
  useEffect(() => {
    if (!hasLoadedDetailRef.current) {
      hasLoadedDetailRef.current = true;
      loadNodeDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tab 切换时加载数据
  const handleTabChange = (key: string) => {
    setActiveTab(key);

    if (key === "basic") {
      loadNodeDetail();
    } else if (key === "vms" && !hasLoadedVMsRef.current) {
      hasLoadedVMsRef.current = true;
      loadVMList();
    } else if (key === "devices" && !hasLoadedDevicesRef.current) {
      hasLoadedDevicesRef.current = true;
      loadDevices();
    } else if (key === "storage" && !hasLoadedStorageRef.current) {
      hasLoadedStorageRef.current = true;
      loadStorageList();
    } else if (
      key === "network-settings" &&
      !hasLoadedNetworkSettingsRef.current
    ) {
      hasLoadedNetworkSettingsRef.current = true;
      loadNetworkSettings();
    } else if (key === "performance" && !hasLoadedPerformanceRef.current) {
      hasLoadedPerformanceRef.current = true;
    }
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

  // USB 设备列定义
  const usbColumns: ColumnsType<unknown> = [
    {
      title: "设备名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "制造商",
      dataIndex: "manufacturer",
      key: "manufacturer",
      render: (value: string) => value || <Tag color="default">暂未提供</Tag>,
    },
    {
      title: "产品",
      dataIndex: "product",
      key: "product",
      render: (value: string) => value || <Tag color="default">暂未提供</Tag>,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (value: string) => (
        <Tag color={value === "normal" ? "success" : "default"}>
          {value === "normal" ? "正常" : value === "occupied" ? "占用" : value}
        </Tag>
      ),
    },
  ];

  // GPU 设备列定义
  const gpuColumns: ColumnsType<unknown> = [
    {
      title: "设备名称",
      dataIndex: "deviceName",
      key: "deviceName",
    },
    {
      title: "制造商",
      dataIndex: "manufacturer",
      key: "manufacturer",
      render: (value: string) => value || <Tag color="default">暂未提供</Tag>,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (value: string) => (
        <Tag color={value === "normal" ? "success" : "default"}>
          {value === "normal" ? "正常" : value === "occupied" ? "占用" : value}
        </Tag>
      ),
    },
  ];

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
      title: "总容量",
      dataIndex: "diskTotal",
      key: "diskTotal",
      render: (value: number) =>
        value !== undefined ? (
          `${formatBytesAuto(value)}`
        ) : (
          <Tag color="default">暂未提供</Tag>
        ),
    },
    {
      title: "已使用",
      dataIndex: "diskUsed",
      key: "diskUsed",
      render: (value: number) =>
        value !== undefined ? (
          `${formatBytesAuto(value)}`
        ) : (
          <Tag color="default">暂未提供</Tag>
        ),
    },
    {
      title: "剩余",
      dataIndex: "diskLeft",
      key: "diskLeft",
      render: (value: number) =>
        value !== undefined ? (
          `${formatBytesAuto(value)}`
        ) : (
          <Tag color="default">暂未提供</Tag>
        ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (value: string) => (
        <Tag color={value === "available" ? "success" : "default"}>
          {value === "available" ? "可用" : value}
        </Tag>
      ),
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
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "40px 0",
              }}
            >
              加载中...
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
      children: (
        <div style={{ padding: "0 0" }}>
          <Card
            title="USB 设备"
            variant="outlined"
            style={{ marginBottom: 16 }}
            className="node-detail-card"
          >
            <div
              style={{
                fontSize: 12,
                color: "#666",
                margin: "0 0 8px 0",
                lineHeight: 1.4,
              }}
            >
              共计 {usbList.length} 条数据
            </div>
            <Table
              columns={usbColumns}
              dataSource={usbList}
              rowKey="uid"
              pagination={false}
              size="small"
              loading={loading}
            />
          </Card>
          <Card
            title="GPU 设备"
            variant="outlined"
            className="node-detail-card"
          >
            <div
              style={{
                fontSize: 12,
                color: "#666",
                margin: "0 0 8px 0",
                lineHeight: 1.4,
              }}
            >
              共计 {gpuList.length} 条数据
            </div>
            <Table
              columns={gpuColumns}
              dataSource={gpuList}
              rowKey="id"
              pagination={false}
              size="small"
              loading={loading}
            />
          </Card>
        </div>
      ),
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
            loading={loading}
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
            loading={loading}
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
            padding: 8px 0 0 0;
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
      />
    </div>
  );
};

export default NodeDetail;
