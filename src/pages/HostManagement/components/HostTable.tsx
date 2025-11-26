import React from "react";
import { Table, Tag, Space, Button, Dropdown } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import {
  DesktopOutlined,
  WindowsOutlined,
  AppleOutlined,
  DownOutlined,
  PlayCircleFilled,
  PauseCircleFilled,
  QuestionCircleFilled,
  ClockCircleFilled,
} from "@ant-design/icons";

export interface HostDataType {
  key: string;
  name: string;
  status:
    | "running"
    | "stopped"
    | "backup"
    | "starting"
    | "restarting"
    | "migrating"
    | "offline"
    | "unknown";
  console: boolean;
  tags: string[];
  platform: string;
  location: string;
  os?: "Windows" | "Linux" | "Debian" | string;
  ip: string;
  clusterId?: number;
  clusterName?: string;
  nodeName?: string;
}

const statusMap = {
  running: {
    icon: <PlayCircleFilled style={{ color: "#52c41a" }} />,
    text: "运行中",
  },
  stopped: {
    icon: <PauseCircleFilled style={{ color: "#d9d9d9" }} />,
    text: "已关机",
  },
  backup: {
    icon: <ClockCircleFilled style={{ color: "#faad14" }} />,
    text: "备份中",
  },
  starting: {
    icon: <ClockCircleFilled style={{ color: "#1890ff" }} />,
    text: "开机中",
  },
  restarting: {
    icon: <ClockCircleFilled style={{ color: "#1890ff" }} />,
    text: "重启中",
  },
  migrating: {
    icon: <ClockCircleFilled style={{ color: "#1890ff" }} />,
    text: "克隆中",
  },
  offline: {
    icon: <PauseCircleFilled style={{ color: "#bfbfbf" }} />,
    text: "离线",
  },
  unknown: {
    icon: <QuestionCircleFilled style={{ color: "#faad14" }} />,
    text: "未知",
  },
};

const columns: ColumnsType<HostDataType> = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
    width: 150,
    render: text => <a>{text}</a>,
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: 120,
    render: (status: keyof typeof statusMap) => {
      const { icon, text } = statusMap[status] || statusMap.unknown;
      return (
        <Space>
          {icon}
          <span>{text}</span>
        </Space>
      );
    },
  },
  {
    title: "控制台",
    dataIndex: "console",
    key: "console",
    width: 80,
    render: () => (
      <DesktopOutlined style={{ color: "#1890ff", fontSize: "16px" }} />
    ),
  },
  {
    title: "标签",
    dataIndex: "tags",
    key: "tags",
    width: 200,
    render: (tags: string[]) => (
      <>
        {tags.map(tag => {
          let color = "blue";
          if (tag === "MeshFlowServer") color = "gold";
          if (tag === "CC生产节点") color = "cyan";
          if (tag === "云桌面") color = "geekblue";

          return (
            <Tag color={color} key={tag}>
              {tag}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "所属平台",
    dataIndex: "platform",
    key: "platform",
    width: 150,
    render: text => <span>{text}</span>,
  },
  {
    title: "所在位置",
    dataIndex: "location",
    key: "location",
    width: 150,
    render: text => <span style={{ color: "#666" }}>{text}</span>,
  },
  {
    title: "操作系统",
    dataIndex: "os",
    key: "os",
    width: 120,
    render: os => {
      if (!os) return <span style={{ color: "#999" }}>-</span>;
      return (
        <Space>
          {os === "Windows" && <WindowsOutlined style={{ color: "#1890ff" }} />}
          {os === "Debian" && (
            <span style={{ color: "#f5222d", fontWeight: "bold" }}>Debian</span>
          )}
          {/* Fallback or other OS icons can be added here */}
          {os !== "Windows" && os !== "Debian" && <AppleOutlined />}
          {os}
        </Space>
      );
    },
  },
  {
    title: "IP",
    dataIndex: "ip",
    key: "ip",
    width: 140,
  },
  {
    title: "操作",
    key: "action",
    width: 220,
    render: () => {
      const items: MenuProps["items"] = [
        { key: "1", label: "重启" },
        { key: "2", label: "克隆" },
        { key: "3", label: "标签设置" },
        { key: "4", label: "转换模板" },
        { key: "5", label: "删除", danger: true },
      ];

      return (
        <Space size="small">
          <Button type="link" size="small">
            开机
          </Button>
          <Button type="link" size="small" danger>
            关机
          </Button>
          <Dropdown menu={{ items }}>
            <Button type="link" size="small">
              更多 <DownOutlined />
            </Button>
          </Dropdown>
        </Space>
      );
    },
  },
];

import type { ColumnConfig } from "./ColumnSettingsDrawer";

interface HostTableProps {
  columnsConfig?: ColumnConfig[];
  onHostClick?: (record: HostDataType) => void;
  data: HostDataType[];
}

const HostTable: React.FC<HostTableProps> = ({
  columnsConfig,
  onHostClick,
  data,
}) => {
  const tableWrapperRef = React.useRef<HTMLDivElement | null>(null);
  const [tableHeight, setTableHeight] = React.useState<number>(400);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);

  React.useEffect(() => {
    const recalc = () => {
      const wrap = tableWrapperRef.current;
      if (!wrap) return;
      const available = wrap.clientHeight;
      // Leave room for table header + pagination to avoid clipping
      const bodyHeight = Math.max(240, available - 120);
      setTableHeight(bodyHeight);
    };
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, []);

  React.useEffect(() => {
    setSelectedRowKeys([]);
  }, [data]);

  // Filter and sort columns based on config
  const tableColumns = React.useMemo(() => {
    if (!columnsConfig) return columns; // Fallback to default

    const visibleKeys = new Set(
      columnsConfig.filter(c => c.visible).map(c => c.key)
    );

    // Create a map of key -> column definition for easy lookup
    // We need to modify the 'name' column render function to use onHostClick
    const colMap = new Map(
      columns.map(col => {
        if (col.key === "name") {
          return [
            col.key,
            {
              ...col,
              render: (text: string, record: HostDataType) => (
                <a
                  onClick={e => {
                    e.preventDefault();
                    onHostClick?.(record);
                  }}
                >
                  {text}
                </a>
              ),
            },
          ];
        }
        return [col.key as string, col];
      })
    );

    // Map config order to actual table columns
    return columnsConfig
      .filter(c => visibleKeys.has(c.key))
      .map(c => {
        const colDef = colMap.get(c.key);
        if (!colDef) return null;

        // Apply fixed property based on key
        // 'name' is fixed to left, 'action' is fixed to right
        if (c.key === "name") {
          return { ...colDef, fixed: "left" };
        }
        if (c.key === "action") {
          return { ...colDef, fixed: "right" };
        }
        return colDef;
      })
      .filter(Boolean) as ColumnsType<HostDataType>;
  }, [columnsConfig]);

  return (
    <div
      ref={tableWrapperRef}
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <div
        style={{
          fontSize: 12,
          color: "#666",
          margin: "0 0 8px 0",
          lineHeight: 1.4,
        }}
      >
        共计 {data.length} 条数据 已选 {selectedRowKeys.length} 条
      </div>
      <Table
        columns={tableColumns}
        dataSource={data}
        rowSelection={{
          type: "checkbox",
          fixed: true,
          selectedRowKeys,
          onChange: keys => setSelectedRowKeys(keys),
        }}
        pagination={{
          total: data.length,
          showTotal: total => `共计 ${total} 条数据`,
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
        expandable={{
          expandedRowRender: record => (
            <p style={{ margin: 0 }}>{record.name} 详细信息...</p>
          ),
          fixed: "left",
        }}
        scroll={{ x: "max-content", y: tableHeight }}
        style={{ flex: 1 }}
      />
    </div>
  );
};

export default HostTable;
