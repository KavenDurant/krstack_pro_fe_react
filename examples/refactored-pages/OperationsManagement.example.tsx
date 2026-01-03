/**
 * 运维管理页面 - 重构示例
 *
 * 对比原文件: src/pages/OperationsManagement/index.tsx
 *
 * 此文件展示如何使用统一的设计规范重构操作日志页面
 */

import React from "react";
import { Layout } from "antd";
import { Input, Select, DatePicker, Button, Badge, Space, Table } from "antd";

const { RangePicker } = DatePicker;
const { Content } = Layout;

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

const OperationsManagementExample: React.FC = () => {
  // 示例列定义
  const columns = [
    { title: "操作时间", dataIndex: "time", key: "time", width: 180 },
    { title: "操作用户", dataIndex: "user", key: "user" },
    {
      title: "操作类型",
      dataIndex: "type",
      key: "type",
      render: (type: string) => {
        const statusMap: Record<string, "success" | "warning" | "error"> = {
          创建: "success",
          修改: "warning",
          删除: "error",
        };
        return <Badge status={statusMap[type]} text={type} />;
      },
    },
    { title: "操作对象", dataIndex: "target", key: "target" },
    {
      title: "操作结果",
      dataIndex: "result",
      key: "result",
      render: (result: string) => (
        <Badge
          status={result === "成功" ? "success" : "error"}
          text={result}
        />
      ),
    },
    {
      title: "操作",
      key: "action",
      render: () => <Button type="link">详情</Button>,
    },
  ];

  // 示例数据
  const mockData = [
    {
      key: "1",
      time: "2026-01-02 12:00:00",
      user: "admin",
      type: "创建",
      target: "虚拟机-001",
      result: "成功",
    },
    {
      key: "2",
      time: "2026-01-02 11:30:00",
      user: "user01",
      type: "修改",
      target: "云桌面-002",
      result: "成功",
    },
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
        {/* 搜索和筛选工具栏 */}
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
              placeholder="搜索操作日志"
              style={{ width: tokens.components.input.width.md }}
            />
            <Select
              placeholder="操作类型"
              style={{ width: tokens.components.input.width.sm }}
              options={[
                { label: "全部", value: "all" },
                { label: "创建", value: "create" },
                { label: "修改", value: "update" },
                { label: "删除", value: "delete" },
              ]}
            />
            <Select
              placeholder="操作结果"
              style={{ width: tokens.components.input.width.sm }}
              options={[
                { label: "全部", value: "all" },
                { label: "成功", value: "success" },
                { label: "失败", value: "failed" },
              ]}
            />
            <RangePicker />
          </Space>
          <Space size={tokens.spacing.sm}>
            <Button>导出日志</Button>
            <Button>清理日志</Button>
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
            共计 {mockData.length} 条日志
          </div>

          {/* 标准表格 */}
          <Table
            columns={columns}
            dataSource={mockData}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共计 ${total} 条日志`,
            }}
          />
        </div>
      </Content>
    </div>
  );
};

export default OperationsManagementExample;

/**
 * 重构说明:
 *
 * 1. 统一布局结构
 *    - 使用 tokens 替代硬编码样式
 *    - 标准的 flex 布局
 *
 * 2. 统一工具栏
 *    - 左侧：搜索 + 多个筛选器
 *    - 右侧：操作按钮
 *    - 使用 Space 统一间距
 *
 * 3. 统一状态显示
 *    - 使用 Badge 组件
 *    - 统一的颜色映射规则
 *
 * 4. 统一表格样式
 *    - 白色背景容器
 *    - 数据统计文本
 *    - 标准分页配置
 */
