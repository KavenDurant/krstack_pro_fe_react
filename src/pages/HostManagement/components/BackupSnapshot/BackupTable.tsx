import React, { useMemo } from "react";
import { Button, Dropdown, Input, Space, Table } from "antd";
import type { MenuProps } from "antd";
import {
  MoreOutlined,
  PlusOutlined,
  ReloadOutlined,
  SettingOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { BackupItem } from "./BackupTypes";

interface BackupTableProps {
  data: BackupItem[];
  onCreate?: () => void;
  onRefresh?: () => void;
  onSettings?: () => void;
}

const actionMenu: MenuProps = {
  items: [
    { key: "download", label: "下载" },
    { key: "delete", label: "删除" },
  ],
};

const BackupTable: React.FC<BackupTableProps> = ({
  data,
  onCreate,
  onRefresh,
  onSettings,
}) => {
  const columns: ColumnsType<BackupItem> = useMemo(
    () => [
      {
        title: "名称",
        dataIndex: "name",
        key: "name",
        width: 320,
        fixed: "left",
      },
      { title: "格式", dataIndex: "format", key: "format", width: 100 },
      {
        title: "存储位置",
        dataIndex: "location",
        key: "location",
        width: 200,
        render: value => <span title={value}>{value}</span>,
      },
      {
        title: "备份日期",
        dataIndex: "backupTime",
        key: "backupTime",
        width: 200,
      },
      { title: "备注", dataIndex: "note", key: "note", width: 200 },
      {
        title: "操作",
        key: "action",
        width: 180,
        fixed: "right",
        render: () => (
          <Space size="middle">
            <Button type="link" style={{ padding: 0 }}>
              备注
            </Button>
            <Button type="link" style={{ padding: 0 }}>
              恢复
            </Button>
            <Dropdown
              menu={actionMenu}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Button type="link" style={{ padding: 0 }}>
                更多 <MoreOutlined />
              </Button>
            </Dropdown>
          </Space>
        ),
      },
    ],
    []
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 0,
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          paddingBottom: 16,
        }}
      >
        <Input
          placeholder="名称"
          prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
          style={{ width: 300 }}
        />
        <Space size={8}>
          <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
            创建备份
          </Button>
          <Button icon={<ReloadOutlined />} onClick={onRefresh} />
          <Button icon={<SettingOutlined />} onClick={onSettings} />
        </Space>
      </div>

      <div style={{ color: "#666", marginBottom: 8 }}>
        共计 {data.length} 条数据
      </div>

      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="key"
        size="middle"
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

export default BackupTable;
