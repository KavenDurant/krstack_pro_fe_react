import React from "react";
import { Input, Select, Button, Space, Dropdown } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  ReloadOutlined,
  ExportOutlined,
  PoweroffOutlined,
  DownOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const DesktopFilter: React.FC = () => {
  return (
    <div
      style={{
        background: "#fff",
        padding: "16px",
        marginBottom: 16,
        borderRadius: 4,
      }}
    >
      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        <Space wrap>
          <Input
            placeholder="搜索云桌面名称"
            prefix={<SearchOutlined />}
            style={{ width: 240 }}
          />
          <Select placeholder="状态" style={{ width: 120 }}>
            <Select.Option value="running">运行中</Select.Option>
            <Select.Option value="stopped">已关机</Select.Option>
          </Select>
          <Select placeholder="用户组" style={{ width: 120 }}>
            <Select.Option value="group1">开发组</Select.Option>
            <Select.Option value="group2">测试组</Select.Option>
          </Select>
          <Button icon={<SearchOutlined />}>查询</Button>
          <Button>重置</Button>
        </Space>
        <Space wrap>
          <Dropdown menu={{ items: [{ key: "1", label: "批量操作" }] }}>
            <Button>
              更多操作 <DownOutlined />
            </Button>
          </Dropdown>
          <Button icon={<ExportOutlined />}>导出</Button>
          <Button icon={<ReloadOutlined />}>重启</Button>
          <Button icon={<PoweroffOutlined />}>关机</Button>
          <Button type="primary" icon={<PlusOutlined />}>
            新建云桌面
          </Button>
          <Button icon={<ReloadOutlined />} />
          <Button icon={<SettingOutlined />} />
        </Space>
      </Space>
    </div>
  );
};

export default DesktopFilter;
