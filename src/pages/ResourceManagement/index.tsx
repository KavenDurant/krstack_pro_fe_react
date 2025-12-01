import React, { useState } from "react";
import { Layout, Tabs, Input, Button, Space } from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  SettingOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import ResourceSidebar from "./components/ResourceSidebar";
import ClusterTable from "./components/ClusterTable";
import type { ClusterDataType } from "./components/ClusterTable";

const { Content, Sider } = Layout;

const mockClusterData: ClusterDataType[] = [
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
  const [selectedMenu, setSelectedMenu] = useState("cluster");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const handleMenuSelect = (key: string) => {
    setSelectedMenu(key);
  };

  const handleRowSelectChange = (keys: React.Key[]) => {
    setSelectedRowKeys(keys);
  };

  const tabItems = [
    {
      key: "hardware",
      label: "硬件管理",
    },
    {
      key: "cluster",
      label: "集群管理",
    },
  ];

  return (
    <Layout style={{ height: "100%", background: "#fff" }}>
      <Sider width={176} style={{ background: "#fff" }}>
        <ResourceSidebar
          onSelect={handleMenuSelect}
          selectedKey={selectedMenu}
        />
      </Sider>
      <Layout style={{ background: "#fff" }}>
        <Content style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ borderBottom: "1px solid #f0f0f0" }}>
            <Tabs
              items={tabItems}
              style={{ marginBottom: 0, paddingLeft: 16 }}
            />
          </div>

          <div
            style={{
              padding: "16px",
              flex: 1,
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <Input
                placeholder="名称"
                prefix={<SearchOutlined />}
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                style={{ width: 240 }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <div style={{ fontSize: 14, color: "#666" }}>
                共计 {mockClusterData.length} 条数据 已选 x 条
              </div>
              <Space>
                <Button type="primary" icon={<PlusOutlined />}>
                  添加集群
                </Button>
                <Button icon={<ReloadOutlined />} />
                <Button icon={<SettingOutlined />} />
              </Space>
            </div>

            <ClusterTable
              dataSource={mockClusterData}
              selectedRowKeys={selectedRowKeys}
              onSelectChange={handleRowSelectChange}
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ResourceManagement;
