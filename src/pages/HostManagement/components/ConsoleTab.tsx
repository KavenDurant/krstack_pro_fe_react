import React, { useState } from "react";
import { Button, Input, Card, Typography, Space } from "antd";
import { KeyOutlined } from "@ant-design/icons";

const { Text } = Typography;

const ConsoleTab: React.FC = () => {
  const [password, setPassword] = useState("");

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Top Alert Bar */}
      <div
        style={{
          backgroundColor: "#e6f7ff", // Light blue background for info
          borderBottom: "1px solid #91d5ff",
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#1890ff",
        }}
      >
        <span>虚拟机性能CPU运行在不支持虚拟机扩展的主机上</span>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Floating Keyboard Button */}
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 10,
          }}
        >
          <Button
            type="primary"
            shape="circle"
            icon={<KeyOutlined rotate={90} />} // Using KeyOutlined as placeholder for Keyboard
            size="large"
            style={{ width: 48, height: 48, fontSize: 24 }}
          />
        </div>

        {/* Password Modal */}
        <Card
          style={{
            width: 400,
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            borderRadius: 8,
          }}
          bodyStyle={{ padding: "32px 24px" }}
        >
          <div style={{ marginBottom: 24 }}>
            <Text strong style={{ fontSize: 16 }}>
              访问密码
            </Text>
          </div>

          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Input.Password
              placeholder="请输入密码"
              value={password}
              onChange={e => setPassword(e.target.value)}
              size="large"
            />
            <Button type="primary" block size="large">
              确定
            </Button>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default ConsoleTab;
