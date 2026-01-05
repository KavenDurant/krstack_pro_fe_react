import React, { useState, useRef, useEffect } from "react";
import { Input, DatePicker, Button, Space, Tag, Alert, message } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  AlertOutlined,
  HistoryOutlined,
  SettingOutlined as PolicyOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import TableToolbar from "@/components/__design-system__/TableToolbar";
import StandardTable from "@/components/__design-system__/StandardTable";
import VerticalTabs from "@/components/VerticalTabs";
import { type Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

interface AlarmDataType {
  key: string;
  content: string;
  time: string;
  level: "urgent" | "important" | "warning" | "info";
  status: "read" | "unread" | "resolved";
}

const levelMap = {
  urgent: { color: "red", text: "紧急" },
  important: { color: "orange", text: "重要" },
  warning: { color: "gold", text: "警告" },
  info: { color: "blue", text: "信息" },
};

const columns: ColumnsType<AlarmDataType> = [
  {
    title: "告警内容",
    dataIndex: "content",
    key: "content",
  },
  {
    title: "告警时间",
    dataIndex: "time",
    key: "time",
    width: 180,
  },
  {
    title: "告警级别",
    dataIndex: "level",
    key: "level",
    width: 120,
    render: (level: keyof typeof levelMap) => {
      const { color, text } = levelMap[level];
      return <Tag color={color}>{text}</Tag>;
    },
  },
  {
    title: "操作",
    key: "status",
    width: 100,
    render: (_, record) => {
      const statusMap = {
        read: { color: "blue", text: "已读" },
        unread: { color: "default", text: "未读" },
        resolved: { color: "green", text: "已解决" },
      };
      const { color, text } = statusMap[record.status];
      return <Tag color={color}>{text}</Tag>;
    },
  },
];

const mockData: AlarmDataType[] = [
  {
    key: "1",
    content: "云桌面服务许可即将在10天后过期,请及时续签授权许可...",
    time: "2025-08-11 16:59:05",
    level: "urgent",
    status: "read",
  },
  {
    key: "2",
    content: "云通面服务许可即将在10天后过期,请及时续签授权许可...",
    time: "2025-08-11 16:59:05",
    level: "important",
    status: "read",
  },
];

// 告警内容组件
interface AlertContentProps {
  searchText: string;
  setSearchText: (value: string) => void;
  dateRange: [Dayjs | null, Dayjs | null] | null;
  setDateRange: (value: [Dayjs | null, Dayjs | null] | null) => void;
  handleRefresh: () => void;
  dataSource: AlarmDataType[];
}

const AlertContent: React.FC<AlertContentProps> = ({
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
      <Alert
        title="当前系统为准点触发告警!已读未解决告警会在下一轮告警继续触发!"
        type="info"
        icon={<InfoCircleOutlined />}
        style={{ marginBottom: 12 }}
      />

      <TableToolbar
        left={
          <Space size="middle">
            <Input
              placeholder="告警内容"
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

      <StandardTable<AlarmDataType>
        columns={columns}
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

const AlertMessages: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);
  const hasLoadedRef = useRef(false);
  const [activeTab, setActiveTab] = useState("current");

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
      key: "current",
      label: "当前告警",
      icon: <AlertOutlined />,
      children: (
        <AlertContent
          searchText={searchText}
          setSearchText={setSearchText}
          dateRange={dateRange}
          setDateRange={setDateRange}
          handleRefresh={handleRefresh}
          dataSource={mockData}
        />
      ),
    },
    {
      key: "history",
      label: "历史告警",
      icon: <HistoryOutlined />,
      children: (
        <AlertContent
          searchText={searchText}
          setSearchText={setSearchText}
          dateRange={dateRange}
          setDateRange={setDateRange}
          handleRefresh={handleRefresh}
          dataSource={mockData}
        />
      ),
    },
    {
      key: "policy",
      label: "告警策略",
      icon: <PolicyOutlined />,
      children: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "#999",
          }}
        >
          告警策略配置内容
        </div>
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
        defaultActiveKey="current"
        style={{
          flex: 1,
          height: "100%",
        }}
      />
    </div>
  );
};

export default AlertMessages;
