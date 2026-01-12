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
  Modal,
  Alert,
} from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import type { BadgeProps, MenuProps } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  PoweroffOutlined,
  DownOutlined,
  DeleteOutlined,
  UserAddOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import { useTableScrollHeight } from "@/hooks/useTableScrollHeight";
import TableToolbar from "@/components/__design-system__/TableToolbar";
import BindUserModal from "./BindUserModal";
import type { CloudDesk } from "@/api/modules/cloudDesk/types";
import {
  startCloudDeskList,
  stopCloudDeskList,
  rebootCloudDeskList,
  deleteCloudDeskList,
  importCloudDesk,
  getImportCloudList,
  detachUser,
} from "@/api/modules/cloudDesk";
import type {
  ImportListResponse,
  ImportCloudDeskType,
} from "@/api/modules/cloudDesk/types";

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

// 状态映射 - 兼容后端返回的大写状态值（如 SHUTOFF、ACTIVE、RUNNING 等）
const statusMap: Record<
  string,
  { status: BadgeProps["status"]; text: string }
> = {
  // 小写状态（兼容）
  running: { status: "success", text: "运行中" },
  stopped: { status: "default", text: "已关机" },
  starting: { status: "processing", text: "启动中" },
  stopping: { status: "processing", text: "关机中" },
  rebooting: { status: "processing", text: "重启中" },
  error: { status: "error", text: "错误" },
  // 大写状态（后端实际返回）
  RUNNING: { status: "success", text: "运行中" },
  SHUTOFF: { status: "default", text: "已关机" },
  ACTIVE: { status: "success", text: "运行中" },
  STARTING: { status: "processing", text: "启动中" },
  STOPPING: { status: "processing", text: "关机中" },
  REBOOTING: { status: "processing", text: "重启中" },
  ERROR: { status: "error", text: "错误" },
  PAUSED: { status: "warning", text: "已暂停" },
  SUSPENDED: { status: "warning", text: "已挂起" },
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
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importList, setImportList] = useState<ImportCloudDeskType[]>([]);
  const [importLoading, setImportLoading] = useState(false);
  const [selectedImportIds, setSelectedImportIds] = useState<string[]>([]);
  const [importSearchText, setImportSearchText] = useState("");
  // 关联用户弹窗状态
  const [bindUserModalVisible, setBindUserModalVisible] = useState(false);
  const [currentDesktop, setCurrentDesktop] = useState<CloudDesk | null>(null);

  // 计算表格滚动高度
  const scrollY = useTableScrollHeight({ pageSize: 10 });

  // 选中的行数据
  const selectedRows = useMemo(() => {
    return desktops.filter(d => selectedRowKeys.includes(d.vm_uid));
  }, [desktops, selectedRowKeys]);

  // 判断所有选中项的状态（兼容大小写状态值）
  const selectedStatus = useMemo(() => {
    if (selectedRows.length === 0) return null;

    const isRunning = (status: string) =>
      status === "running" || status === "RUNNING" || status === "ACTIVE";
    const isStopped = (status: string) =>
      status === "stopped" || status === "SHUTOFF";

    const allRunning = selectedRows.every(d => isRunning(d.status));
    const allStopped = selectedRows.every(d => isStopped(d.status));

    if (allRunning) return "allRunning";
    if (allStopped) return "allStopped";
    return "mixed";
  }, [selectedRows]);

  // 是否有选中行
  const hasSelected = selectedRowKeys.length > 0;

  // 开机操作
  const handleStart = useCallback(
    async (rows?: CloudDesk[]) => {
      const targetRows = rows || selectedRows;
      if (targetRows.length === 0 && !rows) {
        message.warning("请先选择要开机的云桌面");
        return;
      }

      const content =
        targetRows.length === 1
          ? `确定要开机云桌面 "${targetRows[0].vm_name}" 吗？`
          : `确定要开机选中的 ${targetRows.length} 个云桌面吗？`;

      Modal.confirm({
        title: "确认开机",
        content,
        okText: "确定",
        cancelText: "取消",
        onOk: async () => {
          const params = targetRows.map(d => ({
            cluster_id: String(d.cluster_id ?? ""),
            node_name: d.node_name,
            vm_uid: d.vm_uid,
          }));
          try {
            const res = (await startCloudDeskList(params)) as unknown as {
              data: { message: string };
            };
            message.success(res.data.message || "开机成功");
            if (!rows) {
              setSelectedRowKeys([]);
            }
            onRefresh();
          } catch {
            message.error("开机失败");
          }
        },
      });
    },
    [selectedRows, onRefresh]
  );

  // 关机操作
  const handleStop = useCallback(
    async (rows?: CloudDesk[]) => {
      const targetRows = rows || selectedRows;
      if (targetRows.length === 0 && !rows) {
        message.warning("请先选择要关机的云桌面");
        return;
      }

      const content =
        targetRows.length === 1
          ? `确定要关机云桌面 "${targetRows[0].vm_name}" 吗？`
          : `确定要关机选中的 ${targetRows.length} 个云桌面吗？`;

      Modal.confirm({
        title: "确认关机",
        content,
        okText: "确定",
        cancelText: "取消",
        onOk: async () => {
          const params = targetRows.map(d => ({
            cluster_id: String(d.cluster_id ?? ""),
            node_name: d.node_name,
            vm_uid: d.vm_uid,
          }));
          try {
            const res = (await stopCloudDeskList(params)) as unknown as {
              data: { message: string };
            };
            message.success(res.data.message || "关机成功");
            if (!rows) {
              setSelectedRowKeys([]);
            }
            onRefresh();
          } catch {
            message.error("关机失败");
          }
        },
      });
    },
    [selectedRows, onRefresh]
  );

  // 重启操作
  const handleReboot = useCallback(
    async (rows?: CloudDesk[]) => {
      const targetRows = rows || selectedRows;
      if (targetRows.length === 0 && !rows) {
        message.warning("请先选择要重启的云桌面");
        return;
      }

      const content =
        targetRows.length === 1
          ? `确定要重启云桌面 "${targetRows[0].vm_name}" 吗？`
          : `确定要重启选中的 ${targetRows.length} 个云桌面吗？`;

      Modal.confirm({
        title: "确认重启",
        content,
        okText: "确定",
        cancelText: "取消",
        onOk: async () => {
          const params = targetRows.map(d => ({
            cluster_id: String(d.cluster_id ?? ""),
            node_name: d.node_name,
            vm_uid: d.vm_uid,
          }));
          try {
            const res = (await rebootCloudDeskList(params)) as unknown as {
              data: { message: string };
            };
            message.success(res.data.message || "重启成功");
            if (!rows) {
              setSelectedRowKeys([]);
            }
            onRefresh();
          } catch {
            message.error("重启失败");
          }
        },
      });
    },
    [selectedRows, onRefresh]
  );

  // 删除操作
  const handleDelete = useCallback(
    async (rows?: CloudDesk[]) => {
      const targetRows = rows || selectedRows;
      if (targetRows.length === 0 && !rows) {
        message.warning("请先选择要删除的云桌面");
        return;
      }

      Modal.confirm({
        title: "确认删除",
        content: `确定要删除选中的 ${targetRows.length} 个云桌面吗？`,
        okText: "确定",
        cancelText: "取消",
        onOk: async () => {
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
            if (!rows) {
              setSelectedRowKeys([]);
            }
            onRefresh();
          } catch {
            message.error("删除失败");
          }
        },
      });
    },
    [selectedRows, onRefresh]
  );

  // 导入桌面操作
  const handleImport = useCallback(async () => {
    setImportModalVisible(true);
    setImportLoading(true);
    setSelectedImportIds([]);
    try {
      // 后端直接返回 { vms: [...] } 结构
      const res = await getImportCloudList();
      setImportList(res.vms || []);
    } catch {
      message.error("获取可导入桌面列表失败");
    } finally {
      setImportLoading(false);
    }
  }, []);

  // 过滤后的导入列表
  const filteredImportList = useMemo(() => {
    if (!importSearchText) return importList;
    const searchLower = importSearchText.toLowerCase();
    return importList.filter(item => {
      return (
        item.vm_name.toLowerCase().includes(searchLower) ||
        item.cluster_name.toLowerCase().includes(searchLower) ||
        item.node_name.toLowerCase().includes(searchLower)
      );
    });
  }, [importList, importSearchText]);

  // 确认导入桌面
  const handleConfirmImport = useCallback(async () => {
    if (selectedImportIds.length === 0) {
      message.warning("请选择要导入的桌面");
      return;
    }

    const importData: ImportListResponse = {
      import_list: selectedImportIds.map(vmUid => {
        const item = importList.find(i => i.vm_uid === vmUid);
        return {
          vm_uid: item?.vm_uid ?? "",
          vm_name: item?.vm_name ?? "",
          cluster_name: item?.cluster_name ?? "",
          node_name: item?.node_name ?? "",
          ip: item?.ip ?? "",
          status: item?.status ?? "",
          platform_type: item?.platform_type ?? "",
        };
      }),
    };

    try {
      await importCloudDesk(importData);
      message.success("导入成功");
      setImportModalVisible(false);
      setImportList([]);
      setSelectedImportIds([]);
      onRefresh();
    } catch {
      message.error("导入失败");
    }
  }, [importList, selectedImportIds, onRefresh]);

  // 打开关联用户弹窗
  const handleBindUser = useCallback((record: CloudDesk) => {
    setCurrentDesktop(record);
    setBindUserModalVisible(true);
  }, []);

  // 解绑用户
  const handleUnbindUser = useCallback(
    async (record: CloudDesk) => {
      Modal.confirm({
        title: "确认解绑",
        content: `确定要解绑用户 "${record.user_name || record.user_login_name}" 吗？`,
        okText: "确定",
        cancelText: "取消",
        onOk: async () => {
          try {
            await detachUser({ desktop: record.uuid });
            message.success("解绑成功");
            onRefresh();
          } catch {
            message.error("解绑失败");
          }
        },
      });
    },
    [onRefresh]
  );

  // 关联用户成功回调
  const handleBindUserSuccess = useCallback(() => {
    setBindUserModalVisible(false);
    setCurrentDesktop(null);
    onRefresh();
  }, [onRefresh]);

  // 表格列定义
  const columns: ColumnsType<CloudDesk> = [
    {
      title: "名称",
      dataIndex: "vm_name",
      key: "vm_name",
      width: 180,
      fixed: "left",
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
      render: text => text || <Tag color="default">-</Tag>,
    },
    {
      title: "IP 地址",
      dataIndex: "ip",
      key: "ip",
      width: 130,
      render: text => text || <Tag color="default">-</Tag>,
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
      width: 160,
      fixed: "right",
      render: (_, record) => {
        const isRunning =
          record.status === "running" ||
          record.status === "RUNNING" ||
          record.status === "ACTIVE";

        const hasUser = Boolean(record.user_name || record.user_login_name);

        const items: MenuProps["items"] = [
          {
            key: "reboot",
            label: "重启",
            icon: <ReloadOutlined />,
            disabled: !isRunning,
          },
          { type: "divider" },
          {
            key: "bindUser",
            label: "关联用户",
            icon: <UserAddOutlined />,
            disabled: hasUser,
          },
          {
            key: "unbindUser",
            label: "解绑用户",
            icon: <UserAddOutlined />,
            disabled: !hasUser,
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
            case "reboot":
              handleReboot([record]);
              break;
            case "bindUser":
              handleBindUser(record);
              break;
            case "unbindUser":
              handleUnbindUser(record);
              break;
            case "delete":
              handleDelete([record]);
              break;
          }
        };

        return (
          <Space size={4}>
            <Button
              type="link"
              size="small"
              disabled={isRunning}
              onClick={() => handleStart([record])}
            >
              开机
            </Button>
            <Button
              type="link"
              size="small"
              disabled={!isRunning}
              onClick={() => handleStop([record])}
            >
              关机
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
      {/* 搜索和操作工具栏 */}
      <TableToolbar
        left={
          <Space size="small">
            <Input
              placeholder="请输入内容"
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              allowClear
              value={searchText}
              onChange={e => onSearchChange(e.target.value)}
              style={{ width: 240 }}
            />
            <TreeSelect
              placeholder="全部云桌面"
              value={selectedTreeValue}
              onChange={onTreeSelectChange}
              treeData={treeData}
              treeDefaultExpandAll
              showSearch
              allowClear
              treeNodeFilterProp="title"
              style={{ width: 240 }}
            />
          </Space>
        }
        right={
          <Space>
            <Button
              icon={<DeleteOutlined />}
              disabled={!hasSelected}
              onClick={() => handleDelete()}
            >
              删除
            </Button>
            <Button
              icon={<ReloadOutlined />}
              disabled={!hasSelected || selectedStatus !== "allRunning"}
              onClick={() => handleReboot()}
            >
              重启
            </Button>
            <Button
              icon={<PoweroffOutlined />}
              disabled={!hasSelected || selectedStatus !== "allStopped"}
              onClick={() => handleStart()}
            >
              开机
            </Button>
            <Button
              icon={<PoweroffOutlined />}
              disabled={!hasSelected || selectedStatus !== "allRunning"}
              onClick={() => handleStop()}
            >
              关机
            </Button>
            <Button
              type="primary"
              icon={<ImportOutlined />}
              onClick={handleImport}
            >
              导入桌面
            </Button>
          </Space>
        }
        padding={0}
      />

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

      {/* 导入桌面模态框 */}
      <Modal
        title="导入桌面"
        open={importModalVisible}
        onCancel={() => {
          setImportModalVisible(false);
          setImportList([]);
          setSelectedImportIds([]);
          setImportSearchText("");
        }}
        footer={null}
        width={800}
        destroyOnHidden
      >
        {/* 提示信息区 */}
        <Alert
          title="当前只允许关机状态的云主机导入到桌面，如果有其他需要导入的桌面请到云主机模块进行关机操作！"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        {/* 搜索栏 */}
        <Input
          placeholder="请输入内容"
          prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
          allowClear
          value={importSearchText}
          onChange={e => setImportSearchText(e.target.value)}
          style={{ marginBottom: 12 }}
        />

        {/* 统计信息 */}
        <div
          style={{ marginBottom: 8, fontSize: 14, color: "rgba(0,0,0,0.65)" }}
        >
          共 {filteredImportList.length} 项数据 已选 {selectedImportIds.length}{" "}
          项
        </div>

        {/* 数据表格 */}
        <Table
          rowKey="vm_uid"
          columns={[
            {
              title: "名称",
              dataIndex: "vm_name",
              key: "vm_name",
              width: 180,
              ellipsis: true,
            },
            {
              title: "IP 地址",
              dataIndex: "ip",
              key: "ip",
              width: 120,
              render: text => text || "-",
            },
            {
              title: "所属",
              key: "location",
              width: 200,
              render: (_, record) =>
                `${record.cluster_name}/${record.node_name}`,
            },
            {
              title: "所属平台",
              dataIndex: "platform_type",
              key: "platform_type",
              width: 100,
            },
            {
              title: "状态",
              dataIndex: "status",
              key: "status",
              width: 100,
              render: text => text || "-",
            },
          ]}
          dataSource={filteredImportList}
          loading={importLoading}
          rowSelection={{
            selectedRowKeys: selectedImportIds,
            onChange: keys => setSelectedImportIds(keys as string[]),
          }}
          pagination={{
            total: filteredImportList.length,
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: total => `共 ${total} 条`,
          }}
          scroll={{ y: 300 }}
        />

        {/* 底部按钮 */}
        <div style={{ marginTop: 16, textAlign: "right" }}>
          <Space>
            <Button
              onClick={() => {
                setImportModalVisible(false);
                setImportList([]);
                setSelectedImportIds([]);
                setImportSearchText("");
              }}
            >
              取消
            </Button>
            <Button
              type="primary"
              onClick={handleConfirmImport}
              disabled={selectedImportIds.length === 0}
              loading={importLoading}
            >
              导入
            </Button>
          </Space>
        </div>
      </Modal>

      {/* 关联用户弹窗 */}
      <BindUserModal
        open={bindUserModalVisible}
        desktopUid={currentDesktop?.uuid ?? ""}
        desktopName={currentDesktop?.vm_name ?? ""}
        currentUser={
          currentDesktop?.user_name || currentDesktop?.user_login_name
        }
        onCancel={() => {
          setBindUserModalVisible(false);
          setCurrentDesktop(null);
        }}
        onSuccess={handleBindUserSuccess}
      />
    </div>
  );
};

export default DesktopTable;
