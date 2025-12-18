import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Layout, Input, Button, Space, message } from "antd";
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
import { clusterApi } from "../../api";
import type { Cluster } from "../../api";

const { Content, Sider } = Layout;

const ResourceManagement: React.FC = () => {
  const location = useLocation();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [clusterData, setClusterData] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);

  // 加载集群列表
  const loadClusterList = async () => {
    try {
      setLoading(true);
      const response = await clusterApi.getClusterList();
      if (response.code === 200) {
        setClusterData(response.data.list);
      } else {
        message.error(response.message || "获取集群列表失败");
      }
    } catch (error) {
      message.error("获取集群列表失败");
      console.error("Failed to load cluster list:", error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadClusterList();
  }, []);

  const handleRowSelectChange = (keys: React.Key[]) => {
    setSelectedRowKeys(keys);
  };

  const handleClusterClick = (cluster: Cluster) => {
    setSelectedCluster(cluster);
  };

  const handleBackToList = () => {
    setSelectedCluster(null);
    // 返回列表时重新加载数据
    loadClusterList();
  };

  const handleAddCluster = () => {
    setIsAddModalOpen(true);
  };

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    loadClusterList();
  };

  const handleRefresh = () => {
    loadClusterList();
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await clusterApi.deleteCluster(id);
      if (response.code === 200) {
        message.success("删除成功");
        loadClusterList();
      } else {
        message.error(response.message || "删除失败");
      }
    } catch (error) {
      message.error("删除失败");
      console.error("Failed to delete cluster:", error);
    }
  };

  // 过滤集群数据
  const filteredData = clusterData.filter(cluster =>
    cluster.name.toLowerCase().includes(searchValue.toLowerCase())
  );

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

            <ClusterTable
              dataSource={filteredData}
              selectedRowKeys={selectedRowKeys}
              onSelectChange={handleRowSelectChange}
              onRowClick={handleClusterClick}
              onDelete={handleDelete}
              loading={loading}
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
