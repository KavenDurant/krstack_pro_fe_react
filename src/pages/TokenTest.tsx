/**
 * Token 测试页面 - 用于调试
 */
import React, { useEffect, useState } from "react";
import { Card, Button, Space, Typography, Descriptions } from "antd";
import { STORAGE_KEY } from "@/api/config";
import { clusterApi } from "@/api";

const { Title, Text, Paragraph } = Typography;

const TokenTest: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = () => {
    const t = localStorage.getItem(STORAGE_KEY.TOKEN);
    setToken(t);

    console.group("🔍 Token Test Page - Check");
    console.log("Storage Key:", STORAGE_KEY.TOKEN);
    console.log("Token:", t ? `${t.substring(0, 50)}...` : "NULL");
    console.log("Token Length:", t?.length || 0);
    console.log("All localStorage:", Object.keys(localStorage));
    console.groupEnd();
  };

  const testAPI = async () => {
    try {
      setLoading(true);
      setTestResult("Testing...");

      console.log("🧪 Testing API call...");
      const response = await clusterApi.getClusterList();

      console.log("✅ API Test Success:", response);
      setTestResult(`Success! Got ${response.data.list?.length || 0} clusters`);
    } catch (error) {
      console.error("❌ API Test Failed:", error);
      setTestResult(`Failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Title level={3}>Token 调试页面</Title>

        <Descriptions column={1} bordered>
          <Descriptions.Item label="Storage Key">
            <Text code>{STORAGE_KEY.TOKEN}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Token 存在">
            {token ? "✅ Yes" : "❌ No"}
          </Descriptions.Item>
          <Descriptions.Item label="Token 长度">
            {token?.length || 0}
          </Descriptions.Item>
          <Descriptions.Item label="Token 预览">
            <Paragraph code copyable={!!token}>
              {token ? `${token.substring(0, 100)}...` : "No token"}
            </Paragraph>
          </Descriptions.Item>
        </Descriptions>

        <Space style={{ marginTop: 16 }}>
          <Button onClick={checkToken}>刷新检查</Button>
          <Button type="primary" onClick={testAPI} loading={loading}>
            测试 API 调用
          </Button>
          <Button
            danger
            onClick={() => {
              localStorage.clear();
              checkToken();
            }}
          >
            清除所有数据
          </Button>
        </Space>

        {testResult && (
          <Card style={{ marginTop: 16 }} size="small">
            <Text>{testResult}</Text>
          </Card>
        )}

        <Card style={{ marginTop: 16 }} size="small" title="使用说明">
          <ol>
            <li>先登录系统</li>
            <li>然后访问这个页面</li>
            <li>点击"刷新检查"查看 Token 状态</li>
            <li>点击"测试 API 调用"测试接口</li>
            <li>查看浏览器控制台的详细日志</li>
          </ol>
        </Card>
      </Card>
    </div>
  );
};

export default TokenTest;
