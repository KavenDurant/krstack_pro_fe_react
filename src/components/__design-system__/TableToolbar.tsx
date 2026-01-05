import React, { type ReactNode } from "react";
import { Space } from "antd";
import { tokens } from "@/styles/tokens";

interface TableToolbarProps {
  left?: ReactNode;
  right?: ReactNode;
  background?: string;
  padding?: number;
}

/**
 * 统一的表格工具栏组件
 * 提供左右布局：左侧搜索/筛选，右侧操作按钮
 */
const TableToolbar = ({
  left,
  right,
  background = tokens.colors.background.container,
  padding = tokens.spacing.lg,
}: TableToolbarProps) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding,
        background,
        marginBottom: tokens.spacing.sm,
        borderRadius: tokens.borderRadius.md,
      }}
    >
      <Space size={tokens.spacing.sm}>{left}</Space>
      <Space size={tokens.spacing.sm}>{right}</Space>
    </div>
  );
};

export default TableToolbar;
