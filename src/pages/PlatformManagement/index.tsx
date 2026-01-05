import React from "react";
import {
  Layout,
  Card,
  Form,
  Input,
  Select,
  Button,
  Space,
  Divider,
} from "antd";
import PageBreadcrumb from "@/components/PageBreadcrumb";

const { Content } = Layout;

const PlatformManagement: React.FC = () => {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#f0f2f5",
      }}
    >
      <PageBreadcrumb fullWidth />
      <Content style={{ padding: 12, overflow: "auto", flex: 1 }}>
        <Card title="基本设置">
          <Form layout="vertical" style={{ maxWidth: 600 }}>
            <Form.Item label="平台名称" name="platformName">
              <Input
                placeholder="请输入平台名称"
                defaultValue="KRStack Pro 云管理平台"
              />
            </Form.Item>

            <Form.Item label="管理员邮箱" name="adminEmail">
              <Input
                placeholder="请输入管理员邮箱"
                defaultValue="admin@krstack.com"
              />
            </Form.Item>

            <Form.Item label="时区设置" name="timezone">
              <Select defaultValue="Asia/Shanghai">
                <Select.Option value="Asia/Shanghai">
                  中国标准时间 (UTC+8)
                </Select.Option>
                <Select.Option value="America/New_York">
                  美国东部时间 (UTC-5)
                </Select.Option>
                <Select.Option value="Europe/London">
                  格林威治时间 (UTC+0)
                </Select.Option>
              </Select>
            </Form.Item>

            <Divider />

            <Form.Item label="默认虚拟机配置" name="defaultVMConfig">
              <Select defaultValue="standard">
                <Select.Option value="standard">
                  标准配置 (2核4GB)
                </Select.Option>
                <Select.Option value="high">高配 (4核8GB)</Select.Option>
                <Select.Option value="ultra">超高配 (8核16GB)</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="备份策略" name="backupPolicy">
              <Select defaultValue="daily">
                <Select.Option value="daily">每日备份</Select.Option>
                <Select.Option value="weekly">每周备份</Select.Option>
                <Select.Option value="monthly">每月备份</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary">保存设置</Button>
                <Button>重置</Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </div>
  );
};

export default PlatformManagement;
