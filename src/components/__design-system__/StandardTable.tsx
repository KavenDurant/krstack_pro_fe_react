import { Table, type TableProps } from "antd";
import DataCount from "./DataCount";
import { tokens } from "../../styles/tokens";

interface StandardTableProps<T> extends TableProps<T> {
  showDataCount?: boolean;
  dataCountUnit?: string;
  selectedCount?: number;
  containerStyle?: React.CSSProperties;
}

/**
 * 标准化的表格组件
 * 包含数据统计、统一的分页格式
 */
function StandardTable<T extends object>({
  showDataCount = true,
  dataCountUnit = "数据",
  selectedCount,
  pagination,
  dataSource,
  containerStyle,
  ...restProps
}: StandardTableProps<T>) {
  const total = dataSource?.length || 0;

  const defaultPagination = {
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number) => `共计 ${total} 条${dataCountUnit}`,
    ...pagination,
  };

  return (
    <div
      style={{
        background: tokens.colors.background.container,
        padding: tokens.spacing.lg,
        borderRadius: tokens.borderRadius.md,
        ...containerStyle,
      }}
    >
      {showDataCount && (
        <DataCount
          total={total}
          selected={selectedCount}
          unit={dataCountUnit}
        />
      )}
      <Table<T>
        {...restProps}
        dataSource={dataSource}
        pagination={defaultPagination}
      />
    </div>
  );
}

export default StandardTable;
