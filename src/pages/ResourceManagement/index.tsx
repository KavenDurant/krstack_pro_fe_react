import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Layout, Input, Button, Space } from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  SettingOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import PageBreadcrumb from "../../components/PageBreadcrumb";
import ResourceSidebar from "./components/ResourceSidebar";
import ClusterTable from "./components/ClusterTable";
import ClusterDetail from "./components/ClusterDetail";
import PhysicalMachine from "./components/PhysicalMachine";
import StorageManagement from "./components/StorageManagement";
import ImageManagement from "./components/ImageManagement";
import VirtualDiskManagement from "./components/VirtualDiskManagement";
import ClusterAddModal from "./components/ClusterAddModal";
import type { ClusterDataType } from "./components/ClusterTable";

const { Content, Sider } = Layout;

const initialClusterData: ClusterDataType[] = [
  {
    key: "1",
    name: "cluster237",
    status: "running",
    controlAddress: "192.168.1.237",
    platform: "KRCloud",
    technology: "KVM",
    hostCount: 1,
    lastSyncTime: "2025-08-11 16:59:05",
  },
  {
    key: "2",
    name: "cluster180",
    status: "running",
    controlAddress: "192.168.1.180",
    platform: "KRCloud",
    technology: "KVM",
    hostCount: 1,
    lastSyncTime: "2025-08-11 16:59:05",
  },
  {
    key: "3",
    name: "cluster181",
    status: "syncing",
    controlAddress: "192.168.1.181",
    platform: "Zstack",
    technology: "KVM",
    hostCount: 2,
    lastSyncTime: "2025-08-11 16:59:05",
  },
  {
    key: "4",
    name: "cluster223",
    status: "running",
    controlAddress: "192.168.1.223",
    platform: "KRCloud",
    technology: "KVM",
    hostCount: 1,
    lastSyncTime: "2025-08-11 16:59:05",
  },
];

const ResourceManagement: React.FC = () => {
  const location = useLocation();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [clusterData, setClusterData] =
    useState<ClusterDataType[]>(initialClusterData);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCluster, setSelectedCluster] =
    useState<ClusterDataType | null>(null);

  const handleRowSelectChange = (keys: React.Key[]) => {
    setSelectedRowKeys(keys);
  };

  const handleClusterClick = (cluster: ClusterDataType) => {
    setSelectedCluster(cluster);
  };

  const handleBackToList = () => {
    setSelectedCluster(null);
  };

  const handleAddCluster = () => {
    setIsAddModalOpen(true);
  };

  const handleAddSuccess = (newCluster: ClusterDataType) => {
    setClusterData([newCluster, ...clusterData]);
    setIsAddModalOpen(false);
  };

  const renderContent = () => {
    return (
      <div
        style={{
          padding: 12,
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {selectedCluster ? (
          <ClusterDetail cluster={selectedCluster} onBack={handleBackToList} />
        ) : (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Input
                placeholder="名称"
                prefix={<SearchOutlined />}
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                style={{ width: 240 }}
              />
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddCluster}
                >
                  添加集群
                </Button>
                <Button icon={<ReloadOutlined />} />
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
              共计 {clusterData.length} 条数据 已选 {selectedRowKeys.length} 条
            </div>

            <ClusterTable
              dataSource={clusterData}
              selectedRowKeys={selectedRowKeys}
              onSelectChange={handleRowSelectChange}
              onRowClick={handleClusterClick}
            />
          </>
        )}
      </div>
    );
  };

  return (
    <Layout style={{ height: "100%", background: "#fff" }}>
      <Sider width={176} style={{ background: "#fff" }}>
        <ResourceSidebar />
      </Sider>
      <Layout style={{ background: "#fff" }}>
        <Content style={{ display: "flex", flexDirection: "column" }}>
          <PageBreadcrumb />
          {location.pathname.includes("/host") ? (
            <PhysicalMachine />
          ) : location.pathname.includes("storage") ? (
            <StorageManagement />
          ) : location.pathname.includes("image") ? (
            <ImageManagement />
          ) : location.pathname.includes("virtual-disk") ? (
            <VirtualDiskManagement />
          ) : (
            renderContent()
          )}
        </Content>
      </Layout>
      <ClusterAddModal
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </Layout>
  );
};

export default ResourceManagement;
