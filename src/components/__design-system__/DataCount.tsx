import React from "react";
import { tokens } from "../../styles/tokens";

interface DataCountProps {
  total: number;
  selected?: number;
  unit?: string;
}

/**
 * 统一的数据统计文本组件
 * 显示格式：共计 N 条数据 已选 N 条
 */
const DataCount = ({ total, selected, unit = "数据" }: DataCountProps) => {
  return (
    <div
      style={{
        fontSize: tokens.typography.fontSize.xs,
        color: tokens.colors.text.secondary,
        marginBottom: tokens.spacing.sm,
      }}
    >
      共计 {total} 条{unit}
      {selected !== undefined && selected > 0 && ` 已选 ${selected} 条`}
    </div>
  );
};

export default DataCount;
