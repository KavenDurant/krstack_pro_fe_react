import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Layout, Input, Button, Space, message } from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  SettingOutlined,
  SearchOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import ResourceSidebar from "./components/ResourceSidebar";
import ClusterTable from "./components/ClusterTable";
import ClusterDetail from "./components/ClusterDetail";
import PhysicalMachine from "./components/PhysicalMachine";
import StorageManagement from "./components/StorageManagement";
import ImageManagement from "./components/ImageManagement";
import VirtualDiskManagement from "./components/VirtualDiskManagement";
import ClusterAddModal from "./components/ClusterAddModal";
import { clusterApi } from "@/api";
import type { Cluster } from "@/api";

const { Content, Sider } = Layout;

// 路由路径常量
const ROUTES = {
  HOST: "/host",
  STORAGE: "/storage",
  IMAGE: "/image",
  VIRTUAL_DISK: "/virtual-disk",
} as const;

// 检查是否为集群列表页面
const isClusterListPage = (pathname: string): boolean => {
  return !Object.values(ROUTES).some(route => pathname.includes(route));
};

const ResourceManagement: React.FC = () => {
  const location = useLocation();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [clusterData, setClusterData] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  // 加载集群列表
  const loadClusterList = useCallback(async () => {
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
  }, []);

  // 初始加载和路由变化时加载
  useEffect(() => {
    // 只在集群管理页面时加载数据
    if (isClusterListPage(location.pathname)) {
      loadClusterList();
    }
  }, [location.pathname, loadClusterList]);

  const handleRowSelectChange = useCallback((keys: React.Key[]) => {
    setSelectedRowKeys(keys);
  }, []);

  const handleClusterClick = useCallback((cluster: Cluster) => {
    setSelectedCluster(cluster);
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedCluster(null);
    // 返回列表时重新加载数据
    loadClusterList();
  }, [loadClusterList]);

  const handleAddCluster = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  const handleAddSuccess = useCallback(() => {
    setIsAddModalOpen(false);
    loadClusterList();
  }, [loadClusterList]);

  const handleRefresh = useCallback(() => {
    loadClusterList();
  }, [loadClusterList]);

  const handleDelete = useCallback(
    async (id: string) => {
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
    },
    [loadClusterList]
  );

  // 过滤集群数据
  const filteredData = useMemo(
    () =>
      clusterData.filter(cluster =>
        cluster.name.toLowerCase().includes(searchValue.toLowerCase())
      ),
    [clusterData, searchValue]
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

  // 更精确的路由匹配逻辑
  const isStorageRoute = (pathname: string): boolean => {
    return (
      pathname.includes("/storage") ||
      pathname.includes("/external-storage") ||
      pathname.includes("/internal-storage")
    );
  };

  const isImageRoute = (pathname: string): boolean => {
    return (
      pathname.includes("/image") ||
      pathname.includes("/system-image") ||
      pathname.includes("/template-image")
    );
  };

  return (
    <Layout style={{ height: "100%", background: "#fff" }}>
      <Sider
        width={200}
        collapsedWidth={80}
        collapsible
        collapsed={collapsed}
        onCollapse={value => setCollapsed(value)}
        trigger={
          <div
            style={{
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fff",
              borderTop: "1px solid #f0f0f0",
              borderRight: "1px solid #f0f0f0",
              cursor: "pointer",
              color: "rgba(0, 0, 0, 0.65)",
              fontSize: 16,
            }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
        }
        style={{ background: "#fff" }}
      >
        <ResourceSidebar />
      </Sider>
      <Layout style={{ background: "#fff" }}>
        <Content style={{ display: "flex", flexDirection: "column" }}>
          <PageBreadcrumb />
          {location.pathname.includes(ROUTES.HOST) ? (
            <PhysicalMachine />
          ) : isStorageRoute(location.pathname) ? (
            <StorageManagement />
          ) : isImageRoute(location.pathname) ? (
            <ImageManagement />
          ) : location.pathname.includes(ROUTES.VIRTUAL_DISK) ? (
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
