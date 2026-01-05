import React, { useState, useRef, useEffect } from "react";
import { Input, DatePicker, Button, Space, Tag, message } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  SettingOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import TableToolbar from "../../../components/__design-system__/TableToolbar";
import StandardTable from "../../../components/__design-system__/StandardTable";
import VerticalTabs from "../../../components/VerticalTabs";
import { type Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

interface TaskLogDataType {
  key: string;
  taskName: string;
  taskType: string;
  status: "running" | "success" | "failed" | "pending";
  startTime: string;
  endTime: string;
  duration: string;
  operator: string;
}

const statusMap = {
  running: { color: "processing", text: "执行中" },
  success: { color: "success", text: "成功" },
  failed: { color: "error", text: "失败" },
  pending: { color: "default", text: "待执行" },
};

const taskLogColumns: ColumnsType<TaskLogDataType> = [
  {
    title: "任务名称",
    dataIndex: "taskName",
    key: "taskName",
    width: 200,
  },
  {
    title: "任务类型",
    dataIndex: "taskType",
    key: "taskType",
    width: 150,
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: 100,
    render: (status: keyof typeof statusMap) => {
      const { color, text } = statusMap[status];
      return <Tag color={color}>{text}</Tag>;
    },
  },
  {
    title: "开始时间",
    dataIndex: "startTime",
    key: "startTime",
    width: 180,
  },
  {
    title: "结束时间",
    dataIndex: "endTime",
    key: "endTime",
    width: 180,
  },
  {
    title: "耗时",
    dataIndex: "duration",
    key: "duration",
    width: 120,
  },
  {
    title: "操作人",
    dataIndex: "operator",
    key: "operator",
    width: 120,
  },
];

interface ScheduledTaskDataType {
  key: string;
  taskName: string;
  cron: string;
  status: "enabled" | "disabled";
  lastRunTime: string;
  nextRunTime: string;
  runCount: number;
}

const scheduledTaskColumns: ColumnsType<ScheduledTaskDataType> = [
  {
    title: "任务名称",
    dataIndex: "taskName",
    key: "taskName",
    width: 200,
  },
  {
    title: "Cron表达式",
    dataIndex: "cron",
    key: "cron",
    width: 150,
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: 100,
    render: (status: "enabled" | "disabled") => {
      return (
        <Tag color={status === "enabled" ? "success" : "default"}>
          {status === "enabled" ? "启用" : "禁用"}
        </Tag>
      );
    },
  },
  {
    title: "上次执行时间",
    dataIndex: "lastRunTime",
    key: "lastRunTime",
    width: 180,
  },
  {
    title: "下次执行时间",
    dataIndex: "nextRunTime",
    key: "nextRunTime",
    width: 180,
  },
  {
    title: "执行次数",
    dataIndex: "runCount",
    key: "runCount",
    width: 120,
  },
];

const mockTaskLogData: TaskLogDataType[] = [
  {
    key: "1",
    taskName: "备份虚拟机",
    taskType: "备份任务",
    status: "success",
    startTime: "2025-08-11 16:00:00",
    endTime: "2025-08-11 16:30:00",
    duration: "30分钟",
    operator: "admin",
  },
  {
    key: "2",
    taskName: "清理临时文件",
    taskType: "维护任务",
    status: "running",
    startTime: "2025-08-11 17:00:00",
    endTime: "-",
    duration: "进行中",
    operator: "system",
  },
];

const mockScheduledTaskData: ScheduledTaskDataType[] = [
  {
    key: "1",
    taskName: "每日备份",
    cron: "0 2 * * *",
    status: "enabled",
    lastRunTime: "2025-08-11 02:00:00",
    nextRunTime: "2025-08-12 02:00:00",
    runCount: 365,
  },
  {
    key: "2",
    taskName: "每周清理",
    cron: "0 3 * * 0",
    status: "enabled",
    lastRunTime: "2025-08-11 03:00:00",
    nextRunTime: "2025-08-18 03:00:00",
    runCount: 52,
  },
];

// 任务日志内容组件
interface TaskLogContentProps {
  searchText: string;
  setSearchText: (value: string) => void;
  dateRange: [Dayjs | null, Dayjs | null] | null;
  setDateRange: (value: [Dayjs | null, Dayjs | null] | null) => void;
  handleRefresh: () => void;
  dataSource: TaskLogDataType[];
}

const TaskLogContent: React.FC<TaskLogContentProps> = ({
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
              placeholder="任务名称/任务类型"
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

      <StandardTable<TaskLogDataType>
        columns={taskLogColumns}
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

// 定时任务内容组件
interface ScheduledTaskContentProps {
  searchText: string;
  setSearchText: (value: string) => void;
  handleRefresh: () => void;
  dataSource: ScheduledTaskDataType[];
}

const ScheduledTaskContent: React.FC<ScheduledTaskContentProps> = ({
  searchText,
  setSearchText,
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
              placeholder="任务名称"
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              style={{ width: 240 }}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
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

      <StandardTable<ScheduledTaskDataType>
        columns={scheduledTaskColumns}
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

const TaskLogs: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);
  const hasLoadedRef = useRef(false);
  const [activeTab, setActiveTab] = useState("task-log");

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
      key: "task-log",
      label: "任务日志",
      icon: <FileTextOutlined />,
      children: (
        <TaskLogContent
          searchText={searchText}
          setSearchText={setSearchText}
          dateRange={dateRange}
          setDateRange={setDateRange}
          handleRefresh={handleRefresh}
          dataSource={mockTaskLogData}
        />
      ),
    },
    {
      key: "scheduled-task",
      label: "定时任务",
      icon: <ClockCircleOutlined />,
      children: (
        <ScheduledTaskContent
          searchText={searchText}
          setSearchText={setSearchText}
          handleRefresh={handleRefresh}
          dataSource={mockScheduledTaskData}
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
        defaultActiveKey="task-log"
        style={{
          flex: 1,
          height: "100%",
        }}
      />
    </div>
  );
};

export default TaskLogs;
