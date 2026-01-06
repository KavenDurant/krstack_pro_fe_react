import React, { useState } from "react";
import { Form, Input, Button, message, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  interface LoginFormValues {
    username: string;
    password: string;
    remember?: boolean;
  }

  const onFinish = async (values: LoginFormValues) => {
    try {
      setLoading(true);

      const { authApi } = await import("../../api");
      const { STORAGE_KEY } = await import("../../api/config");

      const response = await authApi.login({
        user_name: values.username,
        password: values.password,
      });

      const data = response.data;

      console.log("✅ Login Success:", {
        jwt_token: data.jwt_token
          ? `${data.jwt_token.substring(0, 20)}...`
          : "null",
        user_name: data.user_name,
      });

      localStorage.setItem(STORAGE_KEY.TOKEN, data.jwt_token);
      localStorage.setItem(STORAGE_KEY.IS_AUTHENTICATED, "true");

      const userInfo = {
        user_id: data.user_id,
        user_name: data.user_name,
        nickname: data.nickname,
        user_type: data.user_type,
      };
      localStorage.setItem(STORAGE_KEY.USER_INFO, JSON.stringify(userInfo));

      console.log("💾 Saved to localStorage:", {
        tokenKey: STORAGE_KEY.TOKEN,
        token:
          localStorage.getItem(STORAGE_KEY.TOKEN)?.substring(0, 20) + "...",
        userInfo: localStorage.getItem(STORAGE_KEY.USER_INFO),
      });

      console.group("🔍 Verification");
      console.log("Can read token?", !!localStorage.getItem(STORAGE_KEY.TOKEN));
      console.log(
        "Token matches?",
        localStorage.getItem(STORAGE_KEY.TOKEN) === data.jwt_token
      );
      console.log("All localStorage keys:", Object.keys(localStorage));
      console.groupEnd();

      message.success("欢迎回来");

      setTimeout(() => {
        navigate("/hosts");
      }, 100);
    } catch (error) {
      console.error("Login error:", error);
      message.error("登录失败，请检查账号密码");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fafafa",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          padding: "64px 48px",
          background: "#ffffff",
          borderRadius: 8,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Title
            level={2}
            style={{
              margin: "0 0 8px",
              fontWeight: 600,
              fontSize: 28,
              color: "#1a1a1a",
              letterSpacing: "-0.5px",
            }}
          >
            KRSTACK PRO
          </Title>
          <Text
            style={{
              color: "#8c8c8c",
              fontSize: 14,
              fontWeight: 400,
            }}
          >
            企业级云管理平台
          </Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          size="large"
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入账号" }]}
            style={{ marginBottom: 20 }}
          >
            <Input
              prefix={
                <UserOutlined style={{ color: "#bfbfbf", fontSize: 16 }} />
              }
              placeholder="账号"
              style={{
                height: 44,
                fontSize: 15,
                borderRadius: 4,
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
            style={{ marginBottom: 8 }}
          >
            <Input.Password
              prefix={
                <LockOutlined style={{ color: "#bfbfbf", fontSize: 16 }} />
              }
              placeholder="密码"
              style={{
                height: 44,
                fontSize: 15,
                borderRadius: 4,
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 32 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{
                height: 44,
                fontSize: 15,
                fontWeight: 500,
                borderRadius: 4,
                border: "none",
              }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <div
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: "1px solid #f0f0f0",
            textAlign: "center",
          }}
        >
          <Text
            style={{
              color: "#bfbfbf",
              fontSize: 12,
            }}
          >
            © 2024 KRStack Inc. All Rights Reserved.
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Login;
