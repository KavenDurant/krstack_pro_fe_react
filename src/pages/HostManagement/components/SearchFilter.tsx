import React from "react";
import { Input, Button, Space, Row, Col, Select, Dropdown } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  DownOutlined,
  ExportOutlined,
  ReloadOutlined,
  PoweroffOutlined,
  UpCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";

interface SearchFilterProps {
  onSettingsClick?: () => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onSettingsClick }) => {
  return (
    <div
      style={{
        padding: "10px 16px",
        margin: "8px 0",
      }}
    >
      <Row justify="space-between" align="middle">
        <Col>
          <Space>
            <Input
              placeholder="名称/IP"
              suffix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
              style={{ width: 200 }}
            />
            <Select defaultValue="status" style={{ width: 120 }}>
              <Select.Option value="status">状态</Select.Option>
            </Select>
          </Space>
        </Col>
        <Col>
          <Space>
            <Dropdown menu={{ items: [{ key: "1", label: "批量操作" }] }}>
              <Button>
                业务操作 <DownOutlined />
              </Button>
            </Dropdown>
            <Button icon={<ExportOutlined />}>导出</Button>
            <Button icon={<ReloadOutlined />}>重置</Button>
            <Button icon={<PoweroffOutlined />}>关机</Button>
            <Button icon={<UpCircleOutlined />}>开机</Button>
            <Button type="primary" icon={<PlusOutlined />}>
              新建
            </Button>
            <Button icon={<ReloadOutlined />} />
            <Button icon={<SettingOutlined />} onClick={onSettingsClick} />
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default SearchFilter;
