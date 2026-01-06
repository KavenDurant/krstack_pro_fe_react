import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Button,
  Tabs,
  Progress,
  Descriptions,
  Card,
  Table,
  Input,
  Space,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  SearchOutlined,
  PlayCircleFilled,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { clusterApi } from "@/api";
import type { Cluster, ClusterDetail as ClusterDetailType } from "@/api";
import { bytesToGB, calculatePercentage } from "@/utils/format";

interface ClusterDetailProps {
  cluster: Cluster;
  onBack: () => void;
}

interface PhysicalMachineType {
  key: string;
  name: string;
  status: string;
  ip: string;
  cpuTotal: number;
  memTotal: number;
}

const columns: ColumnsType<PhysicalMachineType> = [
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
    render: (status: string) => (
      <Space>
        <PlayCircleFilled
          style={{ color: status === "online" ? "#52c41a" : "#999" }}
        />
        <span>{status === "online" ? "在线" : "离线"}</span>
      </Space>
    ),
  },
  {
    title: "IP 地址",
    dataIndex: "ip",
    key: "ip",
  },
  {
    title: "CPU 总量 (核)",
    dataIndex: "cpuTotal",
    key: "cpuTotal",
    render: (value: number) => value.toFixed(1),
  },
  {
    title: "内存总量 (GB)",
    dataIndex: "memTotal",
    key: "memTotal",
    render: (value: number) => bytesToGB(value),
  },
];

const ClusterDetail: React.FC<ClusterDetailProps> = ({ cluster, onBack }) => {
  const [physicalMachines, setPhysicalMachines] = useState<
    PhysicalMachineType[]
  >([]);
  const [clusterDetail, setClusterDetail] = useState<ClusterDetailType | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState<string>("basic");
  const isInitializedRef = useRef(false);

  // 加载集群详情
  const loadClusterDetail = useCallback(async () => {
    try {
      const response = await clusterApi.getClusterDetail(cluster.uid);
      if (response.code === 200) {
        setClusterDetail(response.data);
      } else {
        message.error(response.message || "获取集群详情失败");
      }
    } catch (error) {
      message.error("获取集群详情失败");
      console.error("Failed to load cluster detail:", error);
    }
  }, [cluster.uid]);

  // 加载物理机列表
  const loadPhysicalMachines = useCallback(async () => {
    try {
      setLoading(true);
      const response = await clusterApi.getPhysicalList(cluster.uid);

      if (response && response.code === 200) {
        // 直接使用后端返回的数据
        const machines: PhysicalMachineType[] = response.data.map(
          (node, index) => ({
            key: node.ip || `node-${index}`,
            name: node.name,
            status: node.status,
            ip: node.ip,
            cpuTotal: node.cpuTotal,
            memTotal: node.memTotal,
          })
        );
        setPhysicalMachines(machines);
      } else {
        message.error(response.message || "获取物理机列表失败");
      }
    } catch (error) {
      console.error("Failed to load physical machines:", error);
      message.error("获取物理机列表失败");
    } finally {
      setLoading(false);
    }
  }, [cluster.uid]);

  // 初始加载基本信息
  useEffect(() => {
    loadClusterDetail();
    isInitializedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tab 切换时重新加载数据
  const handleTabChange = (key: string) => {
    setActiveTab(key);

    // 跳过初始化时的调用，只处理用户主动切换
    if (!isInitializedRef.current) {
      return;
    }

    // 每次切换都重新加载对应 Tab 的数据
    if (key === "basic") {
      loadClusterDetail();
    } else if (key === "hosts") {
      loadPhysicalMachines();
    }
  };

  // 过滤物理机数据
  const filteredMachines = physicalMachines.filter(machine =>
    machine.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  const items = [
    {
      key: "basic",
      label: "基本信息",
      children: (
        <div style={{ display: "flex", gap: 10 }}>
          <Card
            variant="outlined"
            style={{ width: "30%" }}
            className="cluster-detail-card"
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
              <Descriptions.Item label="集群名称">
                {clusterDetail?.name || cluster.name}
              </Descriptions.Item>
              <Descriptions.Item label="集群 UID">
                {clusterDetail?.uid || cluster.uid}
              </Descriptions.Item>
              <Descriptions.Item label="IP 地址">
                {cluster.ip}
              </Descriptions.Item>
              <Descriptions.Item label="虚拟化类型">
                {clusterDetail?.vtType || cluster.vtType}
              </Descriptions.Item>
              <Descriptions.Item label="节点数量">
                <a style={{ color: "#1890ff" }}>{cluster.nodesNum}</a>
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {new Date(
                  clusterDetail?.createdAt || cluster.createdAt
                ).toLocaleString("zh-CN")}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card
            variant="outlined"
            style={{ flex: 1 }}
            className="cluster-detail-card"
          >
            <Descriptions
              title="集群资源使用概览"
              column={1}
              size="small"
              styles={{ label: { width: 100, color: "#666" } }}
            >
              <Descriptions.Item label="集群存储">
                <div style={{ width: "100%" }}>
                  {clusterDetail ? (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 8,
                          fontSize: 13,
                          lineHeight: 1.4,
                        }}
                      >
                        <span>
                          剩余:
                          {(
                            (clusterDetail.diskTotal - clusterDetail.diskUsed) /
                            1024 /
                            1024 /
                            1024
                          ).toFixed(2)}
                          GB
                        </span>
                        <span>
                          {calculatePercentage(
                            clusterDetail.diskUsed,
                            clusterDetail.diskTotal
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        percent={calculatePercentage(
                          clusterDetail.diskUsed,
                          clusterDetail.diskTotal
                        )}
                        strokeColor="#52c41a"
                        showInfo={false}
                        size="small"
                      />
                      <div
                        style={{ fontSize: 12, color: "#999", marginTop: 4 }}
                      >
                        {bytesToGB(clusterDetail.diskUsed)}
                        GB/
                        {bytesToGB(clusterDetail.diskTotal)}
                        GB
                      </div>
                    </>
                  ) : (
                    <span>加载中...</span>
                  )}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="CPU使用率">
                <div style={{ width: "100%" }}>
                  {clusterDetail ? (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          marginBottom: 8,
                          fontSize: 13,
                          lineHeight: 1.4,
                        }}
                      >
                        <span>
                          {calculatePercentage(
                            clusterDetail.cpuUsed,
                            clusterDetail.cpuTotal
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        percent={calculatePercentage(
                          clusterDetail.cpuUsed,
                          clusterDetail.cpuTotal
                        )}
                        strokeColor="#52c41a"
                        showInfo={false}
                        size="small"
                      />
                      <div
                        style={{ fontSize: 12, color: "#999", marginTop: 4 }}
                      >
                        {clusterDetail.cpuUsed.toFixed(2)}/
                        {clusterDetail.cpuTotal.toFixed(2)} 核
                      </div>
                    </>
                  ) : (
                    <span>加载中...</span>
                  )}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="内存使用率">
                <div style={{ width: "100%" }}>
                  {clusterDetail ? (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 8,
                          fontSize: 13,
                          lineHeight: 1.4,
                        }}
                      >
                        <span>
                          剩余:
                          {(
                            (clusterDetail.memTotal - clusterDetail.memUsed) /
                            1024 /
                            1024 /
                            1024
                          ).toFixed(2)}
                          GB
                        </span>
                        <span>
                          {calculatePercentage(
                            clusterDetail.memUsed,
                            clusterDetail.memTotal
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        percent={calculatePercentage(
                          clusterDetail.memUsed,
                          clusterDetail.memTotal
                        )}
                        strokeColor="#52c41a"
                        showInfo={false}
                        size="small"
                      />
                      <div
                        style={{ fontSize: 12, color: "#999", marginTop: 4 }}
                      >
                        {bytesToGB(clusterDetail.memUsed)}
                        GB/
                        {bytesToGB(clusterDetail.memTotal)}
                        GB
                      </div>
                    </>
                  ) : (
                    <span>加载中...</span>
                  )}
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      ),
    },
    {
      key: "hosts",
      label: "物理机",
      children: (
        <div style={{ padding: "0 0" }}>
          <div style={{ marginBottom: 16 }}>
            <Input
              placeholder="名称"
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              style={{ width: 240 }}
            />
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#666",
              margin: "0 0 8px 0",
              lineHeight: 1.4,
            }}
          >
            共计 {filteredMachines.length} 条数据
          </div>
          <Table
            columns={columns}
            dataSource={filteredMachines}
            pagination={false}
            size="small"
            loading={loading}
          />
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          style={{ padding: "4px 8px" }}
        />
        <span style={{ fontSize: 16, fontWeight: 500 }}>{cluster.name}</span>
      </div>

      <style>
        {`
          .cluster-detail-tabs {
            display: flex;
            flex-direction: column;
            flex: 1;
            overflow: hidden;
          }
          .cluster-detail-tabs > .ant-tabs-nav {
            margin: 0;
          }
          .cluster-detail-tabs > .ant-tabs-content-holder {
            flex: 1;
            overflow: auto;
            padding: 8px 0 0 0;
          }
          .cluster-detail-tabs .ant-tabs-content {
            height: 100%;
          }
          .cluster-detail-tabs .ant-tabs-tabpane {
            height: 100%;
          }
          .cluster-detail-card {
            background: rgba(245, 245, 245, 0.3);
          }
        `}
      </style>
      <Tabs
        type="card"
        items={items}
        className="cluster-detail-tabs"
        activeKey={activeTab}
        onChange={handleTabChange}
      />
    </div>
  );
};

export default ClusterDetail;
