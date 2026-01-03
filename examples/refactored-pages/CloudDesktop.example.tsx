/**
 * 云桌面管理页面 - 重构示例
 *
 * 对比原文件: src/pages/CloudDesktop/index.tsx
 *
 * 此文件展示如何使用统一的设计规范重构现有页面
 */

import React from "react";
import { Layout } from "antd";
import { Input, Select, Button, Space, Table, Badge } from "antd";

// 假设从参考组件中复制的代码
const tokens = {
  spacing: { sm: 8, md: 12, lg: 16 },
  colors: {
    background: { page: "#f0f2f5", container: "#ffffff" },
    text: { secondary: "#00000073" },
  },
  components: { input: { width: { sm: 200, md: 240 } } },
  typography: { fontSize: { xs: 12 } },
  borderRadius: { md: 4 },
};

const { Content } = Layout;

const CloudDesktopExample: React.FC = () => {
  // 示例数据
  const columns = [
    { title: "名称", dataIndex: "name", key: "name" },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Badge
          status={status === "运行中" ? "success" : "default"}
          text={status}
        />
      ),
    },
    { title: "IP地址", dataIndex: "ip", key: "ip" },
    {
      title: "操作",
      key: "action",
      render: () => <Button type="link">详情</Button>,
    },
  ];

  const mockData = [
    { key: "1", name: "桌面-001", status: "运行中", ip: "192.168.1.100" },
    { key: "2", name: "桌面-002", status: "已停止", ip: "192.168.1.101" },
  ];

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: tokens.colors.background.page,
      }}
    >
      {/* 面包屑区域 - 使用现有的 PageBreadcrumb 组件 */}
      {/* <PageBreadcrumb fullWidth /> */}

      <Content style={{ padding: tokens.spacing.md, overflow: "auto", flex: 1 }}>
        {/* 工具栏：搜索 + 筛选 + 操作按钮 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: tokens.spacing.lg,
            background: tokens.colors.background.container,
            marginBottom: tokens.spacing.md,
            borderRadius: tokens.borderRadius.md,
          }}
        >
          <Space size={tokens.spacing.sm}>
            <Input.Search
              placeholder="搜索云桌面"
              style={{ width: tokens.components.input.width.md }}
            />
            <Select
              placeholder="状态筛选"
              style={{ width: tokens.components.input.width.sm }}
              options={[
                { label: "全部", value: "all" },
                { label: "运行中", value: "running" },
                { label: "已停止", value: "stopped" },
              ]}
            />
          </Space>
          <Space size={tokens.spacing.sm}>
            <Button type="primary">新建云桌面</Button>
            <Button>批量操作</Button>
          </Space>
        </div>

        {/* 表格容器 */}
        <div
          style={{
            background: tokens.colors.background.container,
            padding: tokens.spacing.lg,
            borderRadius: tokens.borderRadius.md,
          }}
        >
          {/* 数据统计 */}
          <div
            style={{
              fontSize: tokens.typography.fontSize.xs,
              color: tokens.colors.text.secondary,
              marginBottom: tokens.spacing.sm,
            }}
          >
            共计 {mockData.length} 条云桌面
          </div>

          {/* 表格 */}
          <Table
            columns={columns}
            dataSource={mockData}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共计 ${total} 条云桌面`,
            }}
          />
        </div>
      </Content>
    </div>
  );
};

export default CloudDesktopExample;

/**
 * 重构说明:
 *
 * 1. 使用 tokens 替代硬编码值
 *    - padding: 12 → tokens.spacing.md
 *    - background: "#f0f2f5" → tokens.colors.background.page
 *
 * 2. 统一工具栏布局
 *    - 左侧：搜索 + 筛选
 *    - 右侧：操作按钮
 *    - 使用 Space 组件统一间距
 *
 * 3. 统一表格容器
 *    - 白色背景 + 圆角
 *    - 数据统计文本
 *    - 标准分页配置
 *
 * 4. 统一状态显示
 *    - 使用 Badge 组件
 *    - 统一颜色映射
 */
