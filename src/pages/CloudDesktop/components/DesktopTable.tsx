import React, { useMemo, useCallback, useState } from "react";
import {
  Table,
  Input,
  TreeSelect,
  Button,
  Space,
  Tag,
  Dropdown,
  Badge,
  message,
} from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import type { BadgeProps, MenuProps } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  ReloadOutlined,
  ExportOutlined,
  PoweroffOutlined,
  DownOutlined,
  SyncOutlined,
  DeleteOutlined,
  UserAddOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { useTableScrollHeight } from "@/hooks/useTableScrollHeight";
import type { CloudDesk } from "@/api/modules/cloudDesk/types";
import {
  startCloudDeskList,
  stopCloudDeskList,
  rebootCloudDeskList,
  deleteCloudDeskList,
} from "@/api/modules/cloudDesk";

interface TreeSelectNode {
  title: string;
  value: string | number;
  key: string;
  children?: TreeSelectNode[];
}

interface DesktopTableProps {
  desktops: CloudDesk[];
  loading: boolean;
  searchText: string;
  selectedTreeValue: string | number | undefined;
  treeData: TreeSelectNode[];
  onSearchChange: (value: string) => void;
  onTreeSelectChange: (value: string | number | undefined) => void;
  onRefresh: () => void;
}

// 状态映射
const statusMap: Record<
  string,
  { status: BadgeProps["status"]; text: string }
> = {
  running: { status: "success", text: "运行中" },
  stopped: { status: "default", text: "已关机" },
  starting: { status: "processing", text: "启动中" },
  stopping: { status: "processing", text: "关机中" },
  rebooting: { status: "processing", text: "重启中" },
  error: { status: "error", text: "错误" },
};

// 会话状态映射
const sessionStatusMap: Record<
  string,
  { status: BadgeProps["status"]; text: string }
> = {
  active: { status: "success", text: "已连接" },
  disconnected: { status: "default", text: "未连接" },
};

const DesktopTable: React.FC<DesktopTableProps> = ({
  desktops,
  loading,
  searchText,
  selectedTreeValue,
  treeData,
  onSearchChange,
  onTreeSelectChange,
  onRefresh,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 计算表格滚动高度
  const scrollY = useTableScrollHeight({ pageSize: 10 });

  // 选中的行数据
  const selectedRows = useMemo(() => {
    return desktops.filter(d => selectedRowKeys.includes(d.vm_uid));
  }, [desktops, selectedRowKeys]);

  // 判断所有选中项的状态
  const selectedStatus = useMemo(() => {
    if (selectedRows.length === 0) return null;

    const allRunning = selectedRows.every(d => d.status === "running");
    const allStopped = selectedRows.every(d => d.status === "stopped");

    if (allRunning) return "allRunning";
    if (allStopped) return "allStopped";
    return "mixed";
  }, [selectedRows]);

  // 开机操作
  const handleStart = useCallback(async () => {
    const params = selectedRows.map(d => ({
      cluster_id: String(d.cluster_id ?? ""),
      node_name: d.node_name,
      vm_uid: d.vm_uid,
    }));
    try {
      await startCloudDeskList(params);
      message.success("开机成功");
      onRefresh();
    } catch {
      message.error("开机失败");
    }
  }, [selectedRows, onRefresh]);

  // 关机操作
  const handleStop = useCallback(async () => {
    const params = selectedRows.map(d => ({
      cluster_id: String(d.cluster_id ?? ""),
      node_name: d.node_name,
      vm_uid: d.vm_uid,
    }));
    try {
      await stopCloudDeskList(params);
      message.success("关机成功");
      onRefresh();
    } catch {
      message.error("关机失败");
    }
  }, [selectedRows, onRefresh]);

  // 重启操作
  const handleReboot = useCallback(
    async (rows?: CloudDesk[]) => {
      const targetRows = rows || selectedRows;
      const params = targetRows.map(d => ({
        cluster_id: String(d.cluster_id ?? ""),
        node_name: d.node_name,
        vm_uid: d.vm_uid,
      }));
      try {
        await rebootCloudDeskList(params);
        message.success("重启成功");
        onRefresh();
      } catch {
        message.error("重启失败");
      }
    },
    [selectedRows, onRefresh]
  );

  // 删除操作
  const handleDelete = useCallback(
    async (rows?: CloudDesk[]) => {
      const targetRows = rows || selectedRows;
      const params = {
        delete_desktops: targetRows.map(d => ({
          cluster_id: String(d.cluster_id ?? ""),
          node_name: d.node_name,
          vm_uid: d.vm_uid,
        })),
        delete_vm_model: false,
      };
      try {
        await deleteCloudDeskList(params);
        message.success("删除成功");
        setSelectedRowKeys([]);
        onRefresh();
      } catch {
        message.error("删除失败");
      }
    },
    [selectedRows, onRefresh]
  );

  // 表格列定义
  const columns: ColumnsType<CloudDesk> = [
    {
      title: "名称",
      dataIndex: "vm_name",
      key: "vm_name",
      width: 180,
      sorter: (a, b) => (a.vm_name || "").localeCompare(b.vm_name || ""),
      render: text => text || <Tag color="default">暂未提供</Tag>,
    },
    {
      title: "关联用户",
      dataIndex: "user_name",
      key: "user_name",
      width: 120,
      render: text => text || <Tag color="default">未关联</Tag>,
    },
    {
      title: "类型",
      dataIndex: "desktop_type",
      key: "desktop_type",
      width: 100,
      render: text => text || <Tag color="default">暂未提供</Tag>,
    },
    {
      title: "会话状态",
      dataIndex: "session_status",
      key: "session_status",
      width: 100,
      render: status => {
        const config = sessionStatusMap[status] || {
          status: "default" as BadgeProps["status"],
          text: status || "未知",
        };
        return <Badge status={config.status} text={config.text} />;
      },
    },
    {
      title: "桌面状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      filters: Object.entries(statusMap).map(([value, { text }]) => ({
        text,
        value,
      })),
      onFilter: (value, record) => record.status === value,
      render: status => {
        const config = statusMap[status] || {
          status: "default" as BadgeProps["status"],
          text: status || "未知",
        };
        return <Badge status={config.status} text={config.text} />;
      },
    },
    {
      title: "所属平台",
      dataIndex: "platform_type",
      key: "platform_type",
      width: 120,
      sorter: (a, b) =>
        (a.platform_type || "").localeCompare(b.platform_type || ""),
      render: text => text || <Tag color="default">暂未提供</Tag>,
    },
    {
      title: "IP 地址",
      dataIndex: "ip",
      key: "ip",
      width: 130,
      render: text => text || <Tag color="default">暂未提供</Tag>,
    },
    {
      title: "位置",
      key: "location",
      width: 180,
      render: (_, record) => `${record.cluster_name}/${record.node_name}`,
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      fixed: "right",
      render: (_, record) => {
        const items: MenuProps["items"] = [
          {
            key: "connect",
            label: "连接",
            icon: <LinkOutlined />,
            disabled: record.status !== "running",
          },
          {
            key: "reboot",
            label: "重启",
            icon: <ReloadOutlined />,
            disabled: record.status !== "running",
          },
          { type: "divider" },
          {
            key: "bindUser",
            label: "关联用户",
            icon: <UserAddOutlined />,
          },
          {
            key: "unbindUser",
            label: "解绑用户",
            icon: <UserAddOutlined />,
            disabled: !record.uuid,
          },
          { type: "divider" },
          {
            key: "delete",
            label: "删除",
            icon: <DeleteOutlined />,
            danger: true,
          },
        ];

        const handleMenuClick: MenuProps["onClick"] = e => {
          switch (e.key) {
            case "connect":
              message.info("连接云桌面: " + record.vm_name);
              break;
            case "reboot":
              handleReboot([record]);
              break;
            case "bindUser":
              message.info("关联用户: " + record.vm_name);
              break;
            case "unbindUser":
              message.info("解绑用户: " + record.vm_name);
              break;
            case "delete":
              handleDelete([record]);
              break;
          }
        };

        return (
          <Space size="small">
            <Button
              type="link"
              size="small"
              disabled={record.status !== "running"}
              onClick={() => message.info("连接云桌面: " + record.vm_name)}
            >
              连接
            </Button>
            <Dropdown menu={{ items, onClick: handleMenuClick }}>
              <Button type="link" size="small">
                更多 <DownOutlined />
              </Button>
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  // 批量操作菜单
  const batchOperationItems: MenuProps["items"] = [
    {
      key: "start",
      label: "开机",
      disabled: selectedStatus !== "allStopped" && selectedStatus !== null,
    },
    {
      key: "stop",
      label: "关机",
      disabled: selectedStatus !== "allRunning" && selectedStatus !== null,
    },
    {
      key: "reboot",
      label: "重启",
      disabled: selectedStatus !== "allRunning" && selectedStatus !== null,
    },
    { type: "divider" },
    {
      key: "delete",
      label: "删除",
      danger: true,
      disabled: selectedRowKeys.length === 0,
    },
  ];

  const handleBatchOperation: MenuProps["onClick"] = e => {
    switch (e.key) {
      case "start":
        handleStart();
        break;
      case "stop":
        handleStop();
        break;
      case "reboot":
        handleReboot();
        break;
      case "delete":
        handleDelete();
        break;
    }
  };

  // 行选择配置
  const rowSelection: TableProps<CloudDesk>["rowSelection"] = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <div
      style={{
        height: "100%",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 搜索栏 */}
      <div style={{ marginBottom: 12 }}>
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          {/* 第一行：搜索和筛选 */}
          <Space wrap>
            <Input
              placeholder="搜索云桌面名称或用户"
              prefix={<SearchOutlined />}
              allowClear
              value={searchText}
              onChange={e => onSearchChange(e.target.value)}
              style={{ width: 200 }}
            />
            <TreeSelect
              placeholder="全部云桌面"
              value={selectedTreeValue}
              onChange={onTreeSelectChange}
              treeData={treeData}
              treeDefaultExpandAll
              showSearch
              allowClear
              filterTreeNode={(input, treeNode) =>
                String(treeNode.title)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              style={{ width: 200 }}
            />
          </Space>

          {/* 第二行：操作按钮 */}
          <Space wrap>
            <Dropdown
              menu={{
                items: batchOperationItems,
                onClick: handleBatchOperation,
              }}
            >
              <Button>
                批量操作 <DownOutlined />
              </Button>
            </Dropdown>
            <Button icon={<ExportOutlined />}>导出</Button>
            <Button
              icon={<SyncOutlined />}
              onClick={onRefresh}
              loading={loading}
            >
              刷新
            </Button>
            <Button
              icon={<PoweroffOutlined />}
              disabled={selectedStatus !== "allRunning"}
            >
              关机
            </Button>
            <Button
              icon={<ReloadOutlined />}
              disabled={selectedStatus !== "allStopped"}
            >
              开机
            </Button>
            <Button type="primary" icon={<PlusOutlined />}>
              新建云桌面
            </Button>
          </Space>
        </Space>
      </div>

      {/* 数据统计 */}
      <div style={{ marginBottom: 8, fontSize: 14, color: "rgba(0,0,0,0.65)" }}>
        共计 {desktops.length} 条数据
        {selectedRowKeys.length > 0 && `，已选择 ${selectedRowKeys.length} 条`}
      </div>

      {/* 表格 */}
      <Table
        rowKey="vm_uid"
        columns={columns}
        dataSource={desktops}
        loading={loading}
        rowSelection={rowSelection}
        scroll={{ x: 1200, y: scrollY }}
        pagination={{
          total: desktops.length,
          showTotal: total => `共计 ${total} 条数据`,
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
      />
    </div>
  );
};

export default DesktopTable;
