import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { Layout, Tabs, message } from "antd";
import { DesktopOutlined, SettingOutlined } from "@ant-design/icons";
import PageBreadcrumb from "@/components/PageBreadcrumb";
import DesktopTable from "./components/DesktopTable";
import DesktopPolicy from "./components/DesktopPolicy";
import { getCloudDeskList } from "@/api/modules/cloudDesk";
import type { CloudDesk, AncestorTree } from "@/api/modules/cloudDesk/types";

const { Content } = Layout;

// 树形选择器数据类型
interface TreeSelectNode {
  title: string;
  value: string | number;
  key: string;
  children?: TreeSelectNode[];
}

const CloudDesktop: React.FC = () => {
  const [activeTab, setActiveTab] = useState("desktop");
  const [loading, setLoading] = useState(false);
  const [desktops, setDesktops] = useState<CloudDesk[]>([]);
  const [treeData, setTreeData] = useState<TreeSelectNode[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedTreeValue, setSelectedTreeValue] = useState<
    string | number | undefined
  >();

  const hasLoadedRef = useRef(false);

  // 加载云桌面数据
  const loadCloudDeskData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCloudDeskList();
      if (res.code === 200 && res.data) {
        setDesktops(res.data.desktops || []);

        // 构建树形选择器数据
        const treeNodes: TreeSelectNode[] = [
          {
            title: "全部云桌面",
            value: "all",
            key: "all",
            children: (res.data.ancestor_trees || []).map(
              (cluster: AncestorTree) => ({
                title: cluster.label,
                value: cluster.value,
                key: String(cluster.value),
                children: cluster.children?.map((node: AncestorTree) => ({
                  title: node.label,
                  value: node.label,
                  key: `${cluster.value}-${node.label}`,
                })),
              })
            ),
          },
        ];
        setTreeData(treeNodes);
      }
    } catch {
      message.error("加载云桌面数据失败");
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始化加载数据
  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadCloudDeskData();
    }
  }, [loadCloudDeskData]);

  // 过滤后的数据
  const filteredDesktops = useMemo(() => {
    let result = desktops;

    // 树形选择过滤
    if (selectedTreeValue && selectedTreeValue !== "all") {
      if (typeof selectedTreeValue === "number") {
        // 集群级别过滤
        const selectedCluster = treeData[0]?.children?.find(
          (cluster: TreeSelectNode) => cluster.value === selectedTreeValue
        );
        const clusterName = selectedCluster?.title;
        result = result.filter(
          (item: CloudDesk) => item.cluster_name === clusterName
        );
      } else {
        // 节点级别过滤
        result = result.filter(
          (item: CloudDesk) => item.node_name === selectedTreeValue
        );
      }
    }

    // 文本搜索过滤（搜索虚拟机名称或用户名）
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter((item: CloudDesk) => {
        return (
          (item.vm_name && item.vm_name.toLowerCase().includes(searchLower)) ||
          (item.user_name && item.user_name.toLowerCase().includes(searchLower))
        );
      });
    }

    return result;
  }, [desktops, selectedTreeValue, searchText, treeData]);

  const handleTabChange = useCallback((key: string) => {
    setActiveTab(key);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchText(value);
  }, []);

  const handleTreeSelectChange = useCallback(
    (value: string | number | undefined) => {
      setSelectedTreeValue(value);
    },
    []
  );

  const handleRefresh = useCallback(() => {
    hasLoadedRef.current = false;
    loadCloudDeskData();
  }, [loadCloudDeskData]);

  const breadcrumbItems = useMemo(
    () => [
      { title: "云桌面管理" },
      { title: activeTab === "desktop" ? "云桌面" : "桌面策略" },
    ],
    [activeTab]
  );

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
      }}
    >
      <PageBreadcrumb customItems={breadcrumbItems} />
      <Content
        style={{
          overflow: "hidden",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ height: "100%", background: "#fff" }}>
          <style>
            {`
              .cloud-desktop-tabs .ant-tabs-tabpane {
                padding-left: 0 !important;
              }
              .cloud-desktop-tabs .ant-tabs-content-holder {
                flex: 1;
                padding: 12px;
                overflow: auto;
              }
              .cloud-desktop-tabs .tab-label {
                display: flex;
                align-items: center;
                gap: 8px;
              }
              .cloud-desktop-tabs .tab-label .tab-icon {
                display: flex;
                align-items: center;
                font-size: 16px;
              }
            `}
          </style>
          <Tabs
            tabPlacement="start"
            activeKey={activeTab}
            onChange={handleTabChange}
            style={{ height: "100%" }}
            className="cloud-desktop-tabs"
            items={[
              {
                key: "desktop",
                label: (
                  <span className="tab-label">
                    <span className="tab-icon">
                      <DesktopOutlined />
                    </span>
                    <span>云桌面</span>
                  </span>
                ),
                children: (
                  <DesktopTable
                    desktops={filteredDesktops}
                    loading={loading}
                    searchText={searchText}
                    selectedTreeValue={selectedTreeValue}
                    treeData={treeData}
                    onSearchChange={handleSearchChange}
                    onTreeSelectChange={handleTreeSelectChange}
                    onRefresh={handleRefresh}
                  />
                ),
              },
              {
                key: "policy",
                label: (
                  <span className="tab-label">
                    <span className="tab-icon">
                      <SettingOutlined />
                    </span>
                    <span>桌面策略</span>
                  </span>
                ),
                children: <DesktopPolicy />,
              },
            ]}
          />
        </div>
      </Content>
    </div>
  );
};

export default CloudDesktop;
