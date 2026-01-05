import React, { useState, useRef, useEffect } from "react";
import { Input, DatePicker, Button, Space, Tag, message } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  SettingOutlined,
  AppstoreOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import TableToolbar from "@/components/__design-system__/TableToolbar";
import StandardTable from "@/components/__design-system__/StandardTable";
import VerticalTabs from "@/components/VerticalTabs";
import { type Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

interface PlatformLogDataType {
  key: string;
  operator: string;
  operation: string;
  target: string;
  result: "success" | "failed";
  time: string;
  ip: string;
}

interface AuditLogDataType {
  key: string;
  operator: string;
  operation: string;
  target: string;
  result: "success" | "failed";
  time: string;
  ip: string;
  auditType: string;
}

const resultMap = {
  success: { color: "green", text: "成功" },
  failed: { color: "red", text: "失败" },
};

const platformLogColumns: ColumnsType<PlatformLogDataType> = [
  {
    title: "操作人",
    dataIndex: "operator",
    key: "operator",
    width: 120,
  },
  {
    title: "操作类型",
    dataIndex: "operation",
    key: "operation",
    width: 150,
  },
  {
    title: "操作对象",
    dataIndex: "target",
    key: "target",
  },
  {
    title: "操作结果",
    dataIndex: "result",
    key: "result",
    width: 100,
    render: (result: keyof typeof resultMap) => {
      const { color, text } = resultMap[result];
      return <Tag color={color}>{text}</Tag>;
    },
  },
  {
    title: "操作时间",
    dataIndex: "time",
    key: "time",
    width: 180,
  },
  {
    title: "操作IP",
    dataIndex: "ip",
    key: "ip",
    width: 150,
  },
];

const auditLogColumns: ColumnsType<AuditLogDataType> = [
  {
    title: "操作人",
    dataIndex: "operator",
    key: "operator",
    width: 120,
  },
  {
    title: "操作类型",
    dataIndex: "operation",
    key: "operation",
    width: 150,
  },
  {
    title: "操作对象",
    dataIndex: "target",
    key: "target",
  },
  {
    title: "审计类型",
    dataIndex: "auditType",
    key: "auditType",
    width: 120,
  },
  {
    title: "操作结果",
    dataIndex: "result",
    key: "result",
    width: 100,
    render: (result: keyof typeof resultMap) => {
      const { color, text } = resultMap[result];
      return <Tag color={color}>{text}</Tag>;
    },
  },
  {
    title: "操作时间",
    dataIndex: "time",
    key: "time",
    width: 180,
  },
  {
    title: "操作IP",
    dataIndex: "ip",
    key: "ip",
    width: 150,
  },
];

const mockPlatformLogData: PlatformLogDataType[] = [
  {
    key: "1",
    operator: "admin",
    operation: "创建虚拟机",
    target: "VM-001",
    result: "success",
    time: "2025-08-11 16:59:05",
    ip: "192.168.1.100",
  },
  {
    key: "2",
    operator: "user01",
    operation: "删除虚拟机",
    target: "VM-002",
    result: "failed",
    time: "2025-08-11 17:05:12",
    ip: "192.168.1.101",
  },
];

const mockAuditLogData: AuditLogDataType[] = [
  {
    key: "1",
    operator: "admin",
    operation: "修改用户权限",
    target: "user:user01",
    auditType: "权限变更",
    result: "success",
    time: "2025-08-11 16:59:05",
    ip: "192.168.1.100",
  },
  {
    key: "2",
    operator: "admin",
    operation: "删除用户",
    target: "user:user02",
    auditType: "用户管理",
    result: "success",
    time: "2025-08-11 17:05:12",
    ip: "192.168.1.100",
  },
];

// 平台日志内容组件
interface PlatformLogContentProps {
  searchText: string;
  setSearchText: (value: string) => void;
  dateRange: [Dayjs | null, Dayjs | null] | null;
  setDateRange: (value: [Dayjs | null, Dayjs | null] | null) => void;
  handleRefresh: () => void;
  dataSource: PlatformLogDataType[];
}

const PlatformLogContent: React.FC<PlatformLogContentProps> = ({
  searchText,
  setSearchText,
  dateRange,
  setDateRange,
  handleRefresh,
  dataSource,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <TableToolbar
        left={
          <Space size="middle">
            <Input
              placeholder="操作人/操作类型"
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              style={{ width: 240 }}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
            <RangePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder={["开始时间", "结束时间"]}
              value={dateRange}
              onChange={value =>
                setDateRange(value as [Dayjs | null, Dayjs | null] | null)
              }
            />
          </Space>
        }
        right={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh} />
            <Button icon={<SettingOutlined />} />
          </Space>
        }
        padding={0}
      />

      <StandardTable<PlatformLogDataType>
        columns={platformLogColumns}
        dataSource={dataSource}
        dataCountUnit="数据"
        pagination={{
          total: dataSource.length,
          defaultPageSize: 10,
          showTotal: total => `共 ${total} 条`,
        }}
        containerStyle={{
          paddingLeft: 0,
        }}
      />
    </div>
  );
};

// 审计日志内容组件
interface AuditLogContentProps {
  searchText: string;
  setSearchText: (value: string) => void;
  dateRange: [Dayjs | null, Dayjs | null] | null;
  setDateRange: (value: [Dayjs | null, Dayjs | null] | null) => void;
  handleRefresh: () => void;
  dataSource: AuditLogDataType[];
}

const AuditLogContent: React.FC<AuditLogContentProps> = ({
  searchText,
  setSearchText,
  dateRange,
  setDateRange,
  handleRefresh,
  dataSource,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <TableToolbar
        left={
          <Space size="middle">
            <Input
              placeholder="操作人/操作类型/审计类型"
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              style={{ width: 240 }}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
            <RangePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder={["开始时间", "结束时间"]}
              value={dateRange}
              onChange={value =>
                setDateRange(value as [Dayjs | null, Dayjs | null] | null)
              }
            />
          </Space>
        }
        right={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh} />
            <Button icon={<SettingOutlined />} />
          </Space>
        }
        padding={0}
      />

      <StandardTable<AuditLogDataType>
        columns={auditLogColumns}
        dataSource={dataSource}
        dataCountUnit="数据"
        pagination={{
          total: dataSource.length,
          defaultPageSize: 10,
          showTotal: total => `共 ${total} 条`,
        }}
        containerStyle={{
          paddingLeft: 0,
        }}
      />
    </div>
  );
};

const OperationLogs: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);
  const hasLoadedRef = useRef(false);
  const [activeTab, setActiveTab] = useState("platform-log");

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleRefresh = () => {
    message.success("刷新成功");
  };

  const loadData = async () => {
    // 数据加载逻辑
  };

  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadData();
    }
  }, []);

  const tabItems = [
    {
      key: "platform-log",
      label: "平台日志",
      icon: <AppstoreOutlined />,
      children: (
        <PlatformLogContent
          searchText={searchText}
          setSearchText={setSearchText}
          dateRange={dateRange}
          setDateRange={setDateRange}
          handleRefresh={handleRefresh}
          dataSource={mockPlatformLogData}
        />
      ),
    },
    {
      key: "audit-log",
      label: "审计日志",
      icon: <SafetyCertificateOutlined />,
      children: (
        <AuditLogContent
          searchText={searchText}
          setSearchText={setSearchText}
          dateRange={dateRange}
          setDateRange={setDateRange}
          handleRefresh={handleRefresh}
          dataSource={mockAuditLogData}
        />
      ),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <VerticalTabs
        items={tabItems}
        activeKey={activeTab}
        onChange={handleTabChange}
        defaultActiveKey="platform-log"
        style={{
          flex: 1,
          height: "100%",
        }}
      />
    </div>
  );
};

export default OperationLogs;
