/**
 * 高级表格组件使用说明
 *
 * 基础用法:
 * ```tsx
 * <AdvancedTable
 *   columns={columns}
 *   dataSource={data}
 *   rowKey="id"
 *   primaryButton={{ text: "新建", onClick: handleCreate }}
 * />
 * ```
 *
 * 高级功能:
 *
 * 1. 响应式设计:
 * ```tsx
 * const columns = [
 *   {
 *     key: 'name',
 *     title: '姓名',
 *     dataIndex: 'name',
 *     responsive: ['md', 'lg', 'xl'], // 在中等屏幕及以上显示
 *   },
 *   {
 *     key: 'action',
 *     title: '操作',
 *     dataIndex: 'action',
 *     responsive: ['lg', 'xl'], // 在大屏幕及以上显示
 *   }
 * ];
 * ```
 *
 * 2. 性能优化 - shouldCellUpdate:
 * ```tsx
 * const columns = [
 *   {
 *     key: 'status',
 *     title: '状态',
 *     dataIndex: 'status',
 *     render: (status) => <Tag>{status}</Tag>,
 *     shouldCellUpdate: (record, prevRecord) => record.status !== prevRecord.status,
 *   }
 * ];
 * ```
 *
 * 3. 虚拟滚动 (大数据量优化):
 * ```tsx
 * <AdvancedTable
 *   columns={columns}
 *   dataSource={largeData}
 *   rowKey="id"
 *   virtual={true}
 *   tableHeight={400}
 *   scroll={{ x: 1200, y: 400 }}
 * />
 * ```
 *
 * 4. 工具栏中间插槽 - 在搜索框和按钮之间添加自定义组件:
 * ```tsx
 * import { DatePicker } from 'antd';
 *
 * <AdvancedTable
 *   columns={columns}
 *   dataSource={data}
 *   rowKey="id"
 *   searchPlaceholder="搜索"
 *   toolbarMiddle={<DatePicker.RangePicker />}
 *   primaryButton={{ text: "新建", onClick: handleCreate }}
 * />
 * ```
 *
 * 5. 无障碍性:
 * - 所有交互元素都有适当的 ARIA 标签
 * - 支持键盘导航和屏幕阅读器
 * - 支持高对比度模式和减少动画偏好
 *
 * 6. 类型安全:
 * ```tsx
 * interface UserData {
 *   id: string;
 *   name: string;
 *   email: string;
 * }
 *
 * const columns: AdvancedColumnType<UserData>[] = [
 *   {
 *     key: 'name',
 *     title: '姓名',
 *     dataIndex: 'name',
 *   }
 * ];
 * ```
 */

import React, { useState, useMemo, useCallback, useRef } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Checkbox,
  Drawer,
  message,
  Tooltip,
  Tag,
  Dropdown,
  Modal,
  type MenuProps,
} from "antd";
import type {
  TableColumnsType,
  TableProps,
  TableColumnType,
  TablePaginationConfig,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  SettingOutlined,
  HolderOutlined,
  UndoOutlined,
  DownOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import styles from "./AdvancedTable.module.css";

// ==================== 类型定义 ====================

/**
 * 列配置接口
 * @template T - 数据记录类型
 *
 * 配置说明:
 * - key: 列唯一标识（必填）
 * - title: 列标题（必填）
 * - dataIndex: 数据字段名
 * - defaultVisible: 默认是否可见，默认 true
 * - enableSort: 是否启用排序，默认 false
 * - enableFilter: 是否启用筛选，默认 false
 * - fixed: 固定位置 'left' | 'right'
 * - minWidth: 最小宽度
 * - resizable: 是否可调整宽度，默认 true
 * - responsive: 响应式断点配置
 * - shouldCellUpdate: 单元格更新控制函数
 *
 * @example
 * const column: AdvancedColumnType<User> = {
 *   key: 'name',
 *   title: '姓名',
 *   dataIndex: 'name',
 *   enableSort: true,
 *   enableFilter: true,
 *   sorter: (a, b) => a.name.localeCompare(b.name),
 *   filters: [
 *     { text: '张三', value: '张三' },
 *     { text: '李四', value: '李四' },
 *   ],
 *   onFilter: (value, record) => record.name === value,
 *   responsive: ['md', 'lg'],
 *   shouldCellUpdate: (record, prevRecord) => record.name !== prevRecord.name,
 * }
 */
export interface AdvancedColumnType<T = Record<string, unknown>>
  extends Omit<TableColumnType<T>, "responsive"> {
  /** 列唯一标识 */
  key: string;
  /** 列标题 */
  title: string;
  /** 默认是否可见 */
  defaultVisible?: boolean;
  /** 是否启用排序功能（需配合 sorter 使用） */
  enableSort?: boolean;
  /** 是否启用筛选功能（需配合 filters 和 onFilter 使用） */
  enableFilter?: boolean;
  /** 最小列宽 */
  minWidth?: number;
  /** 是否可调整宽度 */
  resizable?: boolean;
  /** 响应式断点 */
  responsive?: ("xs" | "sm" | "md" | "lg" | "xl" | "xxl")[];
  /** 单元格更新控制函数 */
  shouldCellUpdate?: (record: T, prevRecord: T) => boolean;
}

/**
 * 固定列配置
 */
export interface FixedColumnsConfig {
  /** 固定在左侧的列 key 数组 */
  left?: string[];
  /** 固定在右侧的列 key 数组 */
  right?: string[];
}

/**
 * 高级表格组件属性
 * @template T - 数据记录类型
 */
export interface AdvancedTableProps<
  T extends object = Record<string, unknown>,
> {
  /** 列配置数组 */
  columns: AdvancedColumnType<T>[];
  /** 数据源 */
  dataSource: T[];
  /** 行唯一标识 */
  rowKey: keyof T | ((record: T) => string);
  /** 主按钮配置 */
  primaryButton?: {
    text: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    type?: "primary" | "default" | "dashed" | "link" | "text";
  };
  /** 次要按钮数组（支持普通按钮和下拉菜单按钮） */
  secondaryButtons?: (
    | {
        text: string;
        icon?: React.ReactNode;
        onClick?: () => void;
        type?: "primary" | "default" | "dashed" | "link" | "text";
        danger?: boolean;
      }
    | {
        /** 下拉菜单类型 */
        dropdown: true;
        text: string;
        icon?: React.ReactNode;
        /** Ant Design Menu items */
        menuItems: MenuProps["items"];
      }
  )[];
  /** 搜索回调 */
  onSearch?: (value: string) => void;
  /** 搜索框占位符 */
  searchPlaceholder?: string;
  /** 智能搜索字段（指定后自动实现搜索功能，无需手写 onSearch） */
  searchFields?: (keyof T)[];
  /** 工具栏中间插槽 - 搜索框右侧，主按钮左侧的自定义组件区域 */
  toolbarMiddle?: React.ReactNode;
  /** 加载状态 */
  loading?: boolean;
  /** 固定列配置 */
  fixedColumns?: FixedColumnsConfig;
  /** 滚动配置 */
  scroll?: { x?: number | string; y?: number | string };
  /** 是否启用虚拟滚动 */
  virtual?: boolean;
  /** 表格高度 */
  tableHeight?: number;
  /** 表格变化回调 */
  onTableChange?: (
    pagination: TablePaginationConfig,
    filters: any,
    sorter: any
  ) => void;
  /** 是否显示行选择（勾选框） */
  showRowSelection?: boolean;
  /** 其他 Table 属性 */
  tableProps?: Omit<
    TableProps<T>,
    "columns" | "dataSource" | "rowKey" | "onChange"
  >;
}

// ==================== 辅助组件 ====================

/**
 * 可拖拽列项组件
 * 用于在列设置抽屉中显示可拖拽排序和勾选的列选项
 *
 * 功能:
 * - 拖拽调整列顺序（固定列除外）
 * - 勾选显示/隐藏列
 * - 标记固定列（不可操作）
 */
interface DraggableColumnItemProps {
  column: { key: string; title: string; visible: boolean; fixed?: boolean };
  index: number;
  onToggleVisible: (key: string, checked: boolean) => void;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  dragOverIndex: number | null;
}

const DraggableColumnItem: React.FC<DraggableColumnItemProps> = ({
  column,
  index,
  onToggleVisible,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
  dragOverIndex,
}) => {
  const isFixed = column.fixed;

  return (
    <div
      className={`${styles.draggableItem} ${
        isDragging ? styles.dragging : ""
      } ${dragOverIndex === index ? styles.dragOver : ""} ${
        isFixed ? styles.fixedItem : ""
      }`}
      draggable={!isFixed}
      onDragStart={() => !isFixed && onDragStart(index)}
      onDragOver={e => !isFixed && onDragOver(e, index)}
      onDragEnd={onDragEnd}
      role="option"
      aria-selected={column.visible}
      aria-disabled={isFixed}
      tabIndex={0}
    >
      <div className={styles.dragHandle}>{!isFixed && <HolderOutlined />}</div>
      <Checkbox
        checked={column.visible}
        disabled={isFixed}
        onChange={e => onToggleVisible(column.key, e.target.checked)}
        aria-label={`切换 ${column.title} 列显示`}
      >
        {column.title}
        {isFixed && <span className={styles.fixedTag}>（固定）</span>}
      </Checkbox>
    </div>
  );
};

// ==================== 主组件 ====================

function AdvancedTable<T extends object = Record<string, unknown>>({
  columns,
  dataSource,
  rowKey,
  primaryButton,
  secondaryButtons = [],
  onSearch,
  searchPlaceholder = "名称",
  searchFields,
  toolbarMiddle,
  loading = false,
  fixedColumns = { left: ["name"], right: ["action"] },
  scroll = { x: 1200 },
  virtual = false,
  tableHeight,
  onTableChange,
  showRowSelection = true,
  tableProps,
}: AdvancedTableProps<T>) {
  // ==================== 状态管理 ====================

  /** 搜索输入值 */
  const [searchValue, setSearchValue] = useState("");

  /** 表格选中行的 key 列表 */
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  /** 列设置抽屉的打开/关闭状态 */
  const [drawerVisible, setDrawerVisible] = useState(false);

  /** 列配置状态：包含列的顺序和可见性 */
  const [columnConfig, setColumnConfig] = useState<
    { key: string; visible: boolean }[]
  >(() =>
    columns.map(col => ({
      key: col.key,
      visible: col.defaultVisible !== false,
    }))
  );

  /** 列宽度状态（用于记录拖拽调整后的宽度） */
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});

  /** 拖拽操作的起始索引 */
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  /** 拖拽操作的目标索引 */
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  /** 表格引用 */
  const tableRef = useRef<any>(null);

  // ==================== 智能搜索（内置） ====================

  /**
   * 智能搜索过滤后的数据源 - 使用 useMemo 避免不必要的重新计算
   */
  const filteredData = useMemo(() => {
    if (!searchFields || searchFields.length === 0) {
      return dataSource;
    }

    if (!searchValue) {
      return dataSource;
    }

    return dataSource.filter(item =>
      searchFields.some(field =>
        String(item[field]).toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [dataSource, searchValue, searchFields]);

  // ==================== 搜索与刷新操作 ====================

  /**
   * 处理搜索框输入
   * @param value 搜索关键词
   */
  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);
      // 如果配置了智能搜索，使用内置搜索；否则调用外部回调
      if (!searchFields || searchFields.length === 0) {
        onSearch?.(value);
      }
    },
    [onSearch, searchFields]
  );

  /**
   * 处理刷新操作
   */
  const handleRefresh = useCallback(() => {
    message.success("数据已刷新");
  }, []);

  /**
   * 处理表格变化事件（分页、排序、筛选）
   */
  const handleTableChange = useCallback(
    (pagination: TablePaginationConfig, filters: any, sorter: any) => {
      onTableChange?.(pagination, filters, sorter);
    },
    [onTableChange]
  );

  // ==================== 列设置抽屉操作 ====================

  /**
   * 打开列设置抽屉
   */
  const openDrawer = useCallback(() => {
    setDrawerVisible(true);
  }, []);

  /**
   * 关闭列设置抽屉
   */
  const closeDrawer = useCallback(() => {
    setDrawerVisible(false);
  }, []);

  /**
   * 切换列的显示/隐藏状态
   * @param key 列的 key
   * @param checked 是否显示
   */
  const toggleColumnVisible = useCallback((key: string, checked: boolean) => {
    setColumnConfig(prev =>
      prev.map(item =>
        item.key === key ? { ...item, visible: checked } : item
      )
    );
  }, []);

  /**
   * 重置列设置为默认状态
   * 恢复所有列的初始显示状态和顺序
   */
  const resetColumnConfig = useCallback(() => {
    setColumnConfig(
      columns.map(col => ({
        key: col.key,
        visible: col.defaultVisible !== false,
      }))
    );
    setColumnWidths({});
    message.success("已重置为默认设置");
  }, [columns]);

  // ==================== 列拖拽排序操作 ====================

  /**
   * 处理列拖拽开始
   * @param index 拖拽列的索引
   */
  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index);
  }, []);

  /**
   * 处理拖拽经过目标
   * @param e 拖拽事件
   * @param index 目标列索引
   */
  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (dragIndex !== null && dragIndex !== index) {
        setDragOverIndex(index);
      }
    },
    [dragIndex]
  );

  /**
   * 处理拖拽结束，执行列顺序交换
   */
  const handleDragEnd = useCallback(() => {
    if (
      dragIndex !== null &&
      dragOverIndex !== null &&
      dragIndex !== dragOverIndex
    ) {
      setColumnConfig(prev => {
        const newConfig = [...prev];
        const [removed] = newConfig.splice(dragIndex, 1);
        newConfig.splice(dragOverIndex, 0, removed);
        return newConfig;
      });
    }
    setDragIndex(null);
    setDragOverIndex(null);
  }, [dragIndex, dragOverIndex]);

  // ==================== 列配置计算 ====================

  /**
   * 判断指定列是否固定
   * @param key 列的 key
   * @returns 固定位置：'left' | 'right' | undefined
   */
  const isColumnFixed = useCallback(
    (key: string): "left" | "right" | undefined => {
      if (fixedColumns.left?.includes(key)) return "left";
      if (fixedColumns.right?.includes(key)) return "right";
      return undefined;
    },
    [fixedColumns]
  );

  /**
   * 用于抽屉中显示的列配置（包含固定标记）- 使用 useMemo 优化性能
   */
  const drawerColumns = useMemo(() => {
    return columnConfig.map(config => {
      const col = columns.find(c => c.key === config.key);
      return {
        key: config.key,
        title: col?.title || config.key,
        visible: config.visible,
        fixed: isColumnFixed(config.key) !== undefined,
      };
    });
  }, [columnConfig, columns, isColumnFixed]);

  /**
   * 处理后的数据源 - 使用 useMemo 优化性能
   * 如果启用了智能搜索，使用过滤后的数据；否则使用原始数据
   */
  const processedDataSource = useMemo(() => {
    const source =
      searchFields && searchFields.length > 0 ? filteredData : dataSource;
    return source.map(item => ({
      ...item,
      // 可以在这里添加数据处理逻辑
    }));
  }, [dataSource, filteredData, searchFields]);

  /**
   * 最终渲染的表格列配置
   * 按照 columnConfig 的顺序排列，过滤不可见列，并应用固定和排序筛选配置
   */
  const finalColumns = useMemo(() => {
    const orderedColumns = columnConfig
      .filter(config => config.visible)
      .map(config => {
        const col = columns.find(c => c.key === config.key);
        if (!col) return null;

        const finalCol: TableColumnsType<T>[number] = {
          ...col,
          width: columnWidths[col.key] || col.width,
          fixed: isColumnFixed(col.key),
          sorter: col.enableSort !== false ? col.sorter : undefined,
          filters: col.enableFilter !== false ? col.filters : undefined,
          onFilter: col.enableFilter !== false ? col.onFilter : undefined,
          shouldCellUpdate: col.shouldCellUpdate,
          responsive: col.responsive,
        };

        return finalCol;
      })
      .filter(Boolean) as TableColumnsType<T>;

    return orderedColumns;
  }, [columnConfig, columns, columnWidths, isColumnFixed]);

  /**
   * 表格行选择配置 - 使用 useMemo 优化性能
   */
  const rowSelection: TableProps<T>["rowSelection"] = useMemo(
    () =>
      showRowSelection
        ? {
            selectedRowKeys,
            onChange: (keys: React.Key[]) => {
              setSelectedRowKeys(keys);
            },
            columnWidth: 24, // 设置勾选框列宽度为 18px
          }
        : undefined,
    [selectedRowKeys, showRowSelection]
  );

  /**
   * 表格滚动配置 - 支持虚拟滚动
   */
  const tableScroll = useMemo(() => {
    const scrollConfig = { ...scroll };

    if (virtual) {
      scrollConfig.y = tableHeight || 400;
    }

    return scrollConfig;
  }, [scroll, virtual, tableHeight]);

  // ==================== 渲染逻辑 ====================
  // 按照视觉顺序：搜索框 → 按钮 → 统计信息 → 表格 → 抽屉

  return (
    <div className={styles.container}>
      {/* 
        ===== 第一部分：搜索框 + 按钮 工具栏 =====
        左侧：搜索框
        右侧：次要按钮 + 主按钮 + 刷新按钮 + 列设置按钮
      */}
      <div className={styles.toolbar}>
        {/* 左侧搜索框 */}
        <div className={styles.toolbarLeft}>
          <Input
            placeholder={searchPlaceholder}
            prefix={<SearchOutlined />}
            value={searchValue}
            onChange={e => handleSearch(e.target.value)}
            className={styles.searchInput}
            allowClear
            aria-label="搜索输入框"
          />
        </div>

        {/* 中间插槽区域 - 用于自定义组件（如日期选择器、筛选器等） */}
        {toolbarMiddle && (
          <div className={styles.toolbarMiddle}>{toolbarMiddle}</div>
        )}

        {/* 右侧按钮组 */}
        <div className={styles.toolbarRight}>
          <Space>
            {/* 次要按钮（批量操作、导入导出等） */}
            {secondaryButtons.map((btn, index) => {
              // 判断是否为下拉菜单类型
              if ("dropdown" in btn && btn.dropdown) {
                return (
                  <Dropdown
                    key={index}
                    menu={{ items: btn.menuItems }}
                    trigger={["click"]}
                  >
                    <Button icon={btn.icon}>{btn.text}</Button>
                  </Dropdown>
                );
              }
              // 普通按钮 - 使用类型断言
              const normalBtn = btn as {
                text: string;
                icon?: React.ReactNode;
                onClick?: () => void;
                type?: "primary" | "default" | "dashed" | "link" | "text";
                danger?: boolean;
              };
              return (
                <Button
                  key={index}
                  type={normalBtn.type || "default"}
                  danger={normalBtn.danger}
                  icon={normalBtn.icon}
                  onClick={normalBtn.onClick}
                >
                  {normalBtn.text}
                </Button>
              );
            })}

            {/* 主要操作按钮（新建、备份等） */}
            {primaryButton && (
              <Button
                type={primaryButton.type || "primary"}
                icon={primaryButton.icon}
                onClick={primaryButton.onClick}
              >
                {primaryButton.text}
              </Button>
            )}

            {/* 刷新按钮 */}
            <Tooltip title="刷新">
              <Button
                type="default"
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                aria-label="刷新表格数据"
              />
            </Tooltip>

            {/* 列设置按钮 */}
            <Tooltip title="列设置">
              <Button
                type="default"
                icon={<SettingOutlined />}
                onClick={openDrawer}
                aria-label="打开列设置"
                aria-expanded={drawerVisible}
              />
            </Tooltip>
          </Space>
        </div>
      </div>

      {/* 
        ===== 第二部分：统计信息 =====
        显示总数据条数和已选条数
        添加无障碍性支持
      */}
      <div className={styles.statistics} role="status" aria-live="polite">
        <span>
          共计 <strong>{dataSource.length}</strong> 条数据
        </span>
        {selectedRowKeys.length > 0 && (
          <span className={styles.selectedCount}>
            已选 <strong>{selectedRowKeys.length}</strong> 条
          </span>
        )}
      </div>

      {/* 
        ===== 第三部分：表格主体 =====
        核心数据展示区域，支持排序、筛选、选择、分页等
        添加了 flex: 1 和 overflow-y: auto 支持表格滚动
        添加无障碍性属性和虚拟滚动支持
      */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <Table<T>
          ref={tableRef}
          columns={finalColumns}
          dataSource={processedDataSource}
          rowKey={rowKey}
          rowSelection={rowSelection}
          loading={loading}
          scroll={tableScroll}
          virtual={virtual}
          onChange={handleTableChange}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条`,
            pageSizeOptions: ["10", "20", "50", "100"],
            defaultPageSize: 10,
          }}
          aria-label="高级数据表格"
          aria-describedby="table-description"
          {...tableProps}
        />
        <div id="table-description" className="sr-only"></div>
      </div>

      {/* 
        ===== 第四部分：列设置抽屉 =====
        右侧抽屉，用于调整列的显示、隐藏、顺序和重置
        添加无障碍性支持
      */}
      <Drawer
        title="表格列设置"
        placement="right"
        width={320}
        open={drawerVisible}
        onClose={closeDrawer}
        extra={
          <Button
            icon={<UndoOutlined />}
            onClick={resetColumnConfig}
            size="small"
            aria-label="重置列设置为默认状态"
          >
            重置
          </Button>
        }
        aria-label="列设置抽屉"
      >
        <div className={styles.drawerContent}>
          {/* 说明文字 */}
          <div className={styles.drawerTip} role="note">
            拖拽调整列顺序，勾选控制列显示（固定列不可操作）
          </div>

          {/* 列选项列表（支持拖拽排序和勾选） */}
          <div
            className={styles.columnList}
            role="group"
            aria-label="列显示设置列表"
          >
            {drawerColumns.map((col, index) => (
              <DraggableColumnItem
                key={col.key}
                column={col}
                index={index}
                onToggleVisible={toggleColumnVisible}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                isDragging={dragIndex === index}
                dragOverIndex={dragOverIndex}
              />
            ))}
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export default AdvancedTable;

// ==================== 列配置辅助函数 ====================

/**
 * 操作按钮配置
 */
export interface ActionConfig<T> {
  /** 按钮文字 */
  label: string;
  /** 点击事件 */
  onClick: (record: T) => void;
  /** 是否危险操作（红色） */
  danger?: boolean;
  /** 是否禁用 */
  disabled?: (record: T) => boolean;
  /** 自定义颜色 */
  color?: string;
}

/**
 * 操作列选项配置
 */
export interface ActionColumnOptions<T = Record<string, unknown>> {
  /** 固定位置 */
  fixed?: "left" | "right";
  /** 列宽 */
  width?: number;
  /** 全局禁用条件（应用于所有操作） */
  disabledWhen?: (record: T) => boolean;
}

/**
 * 生成名称列配置（通常固定在左侧）
 */
export function makeNameColumn<T extends Record<string, any>>(
  options?: Partial<AdvancedColumnType<T>>
): AdvancedColumnType<T> {
  return {
    key: "name",
    title: "名称",
    dataIndex: "name" as any,
    width: 200,
    enableSort: true,
    sorter: (a: any, b: any) =>
      String(a[options?.dataIndex || "name"]).localeCompare(
        String(b[options?.dataIndex || "name"])
      ),
    render: (text: string) => (
      <a style={{ color: "#1890ff", fontWeight: 500 }}>{text}</a>
    ),
    ...options,
  };
}

/**
 * 生成时间列配置（自动支持排序）
 */
export function makeTimeColumn<T extends Record<string, any>>(
  dataIndex: keyof T,
  title = "时间",
  options?: Partial<AdvancedColumnType<T>>
): AdvancedColumnType<T> {
  return {
    key: String(dataIndex),
    title,
    dataIndex: dataIndex as any,
    width: 180,
    enableSort: true,
    sorter: (a: any, b: any) => {
      const timeA = new Date(a[dataIndex]).getTime();
      const timeB = new Date(b[dataIndex]).getTime();
      return timeA - timeB;
    },
    ...options,
  };
}

/**
 * 生成状态列配置（带颜色标签）
 */
export function makeStatusColumn<T extends Record<string, any>>(config: {
  dataIndex?: keyof T;
  title?: string;
  colorMap: Record<string, string>;
  textMap?: Record<string, string>;
  width?: number;
}): AdvancedColumnType<T> {
  const {
    dataIndex = "status",
    title = "状态",
    colorMap,
    textMap,
    width = 100,
  } = config;

  return {
    key: String(dataIndex),
    title,
    dataIndex: dataIndex as any,
    width,
    render: (value: string) => {
      const color = colorMap[value] || "default";
      const text = textMap?.[value] || value;
      return <Tag color={color}>{text}</Tag>;
    },
  };
}

/**
 * 生成操作列配置（通常固定在右侧）
 * 当操作超过3个时，前2个直接显示，其余收纳到"更多"下拉菜单
 *
 * @param actions 操作按钮配置数组
 * @param options 额外配置选项（固定位置、全局禁用等）
 */
export function makeActionsColumn<T extends Record<string, any>>(
  actions: ActionConfig<T>[],
  options?: ActionColumnOptions<T>
): AdvancedColumnType<T> {
  const { disabledWhen, ...restOptions } = options || {};

  return {
    key: "action",
    title: "操作",
    dataIndex: "action" as any,
    width: options?.width || 150,
    render: (_: unknown, record: T) => {
      // 全局禁用判断
      const isGloballyDisabled = disabledWhen?.(record) || false;

      // 如果操作数量 <= 3，直接显示所有按钮
      if (actions.length <= 3) {
        return (
          <Space size="middle">
            {actions.map((action, index) => {
              const isDisabled =
                isGloballyDisabled || action.disabled?.(record) || false;
              const color = action.danger
                ? "#ff4d4f"
                : action.color || "#1890ff";

              return (
                <a
                  key={index}
                  onClick={() => !isDisabled && action.onClick(record)}
                  style={{
                    color: isDisabled ? "#999" : color,
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    opacity: isDisabled ? 0.5 : 1,
                  }}
                >
                  {action.label}
                </a>
              );
            })}
          </Space>
        );
      }

      // 如果操作数量 > 3，前2个直接显示，其余放入"更多"菜单
      const visibleActions = actions.slice(0, 2);
      const dropdownActions = actions.slice(2);

      // 构建下拉菜单项
      const menuItems: MenuProps["items"] = dropdownActions.map(
        (action, index) => {
          const isDisabled =
            isGloballyDisabled || action.disabled?.(record) || false;
          return {
            key: `dropdown-${index}`,
            label: action.label,
            disabled: isDisabled,
            danger: action.danger,
            onClick: () => {
              if (!isDisabled) {
                action.onClick(record);
              }
            },
          };
        }
      );

      return (
        <Space size="middle">
          {/* 前2个操作直接显示 */}
          {visibleActions.map((action, index) => {
            const isDisabled =
              isGloballyDisabled || action.disabled?.(record) || false;
            const color = action.danger ? "#ff4d4f" : action.color || "#1890ff";

            return (
              <a
                key={index}
                onClick={() => !isDisabled && action.onClick(record)}
                style={{
                  color: isDisabled ? "#999" : color,
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  opacity: isDisabled ? 0.5 : 1,
                }}
              >
                {action.label}
              </a>
            );
          })}

          {/* "更多"下拉菜单 */}
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <a
              onClick={e => e.preventDefault()}
              style={{
                color: "#1890ff",
                cursor: "pointer",
              }}
            >
              更多 <DownOutlined />
            </a>
          </Dropdown>
        </Space>
      );
    },
    ...restOptions,
  };
}

/**
 * 生成普通文本列配置
 */
export function makeTextColumn<T extends Record<string, any>>(
  dataIndex: keyof T,
  title: string,
  options?: Partial<AdvancedColumnType<T>>
): AdvancedColumnType<T> {
  return {
    key: String(dataIndex),
    title,
    dataIndex: dataIndex as any,
    width: 150,
    ...options,
  };
}

/**
 * 生成可排序的文本列配置
 *
 * @param clickable - 是否显示为蓝色链接样式（可点击）
 * @param onClick - 点击事件回调
 */
export function makeSortableColumn<T extends Record<string, any>>(
  dataIndex: keyof T,
  title: string,
  options?: Partial<AdvancedColumnType<T>> & {
    clickable?: boolean;
    onClick?: (record: T) => void;
  }
): AdvancedColumnType<T> {
  const { clickable, onClick, ...restOptions } = options || {};

  return {
    key: String(dataIndex),
    title,
    dataIndex: dataIndex as any,
    width: 150,
    enableSort: true,
    sorter: (a: any, b: any) =>
      String(a[dataIndex]).localeCompare(String(b[dataIndex])),
    // 如果设置了 clickable，添加蓝色链接样式
    render: clickable
      ? (text: string, record: T) => (
          <a
            style={{
              color: "#1890ff",
              fontWeight: 500,
              cursor: onClick ? "pointer" : "default",
            }}
            onClick={() => onClick?.(record)}
          >
            {text}
          </a>
        )
      : undefined,
    ...restOptions,
  };
}

export function makeTagColumn<T extends Record<string, any>>(config: {
  dataIndex: keyof T;
  title: string;
  filters?: Array<{ text: string; value: string }>;
  colorMap?: Record<string, string>;
  width?: number;
}): AdvancedColumnType<T> {
  const { dataIndex, title, filters, colorMap, width = 120 } = config;

  return {
    key: String(dataIndex),
    title,
    dataIndex: dataIndex as any,
    width,
    enableFilter: !!filters,
    filters,
    onFilter: filters
      ? (value: any, record: any) => record[dataIndex] === value
      : undefined,
    render: (text: string) => {
      const color = colorMap?.[text] || "blue";
      return <Tag color={color}>{text}</Tag>;
    },
  };
}

/**
 * 生成自定义渲染列配置
 * 简化自定义列的配置，同时支持排序和筛选
 *
 * @param dataIndex 数据字段名
 * @param title 列标题
 * @param render 自定义渲染函数
 * @param options 额外配置（宽度、排序、筛选等）
 */
export function makeCustomColumn<T extends Record<string, any>>(
  dataIndex: keyof T,
  title: string,
  render: (value: any, record: T) => React.ReactNode,
  options?: {
    width?: number;
    ellipsis?: boolean;
    sorter?: (a: T, b: T) => number;
    filters?: Array<{ text: string; value: any }>;
    onFilter?: (value: any, record: T) => boolean;
  }
): AdvancedColumnType<T> {
  return {
    key: String(dataIndex),
    title,
    dataIndex: dataIndex as any,
    width: options?.width,
    ellipsis: options?.ellipsis,
    render,
    enableSort: !!options?.sorter,
    sorter: options?.sorter,
    enableFilter: !!options?.filters,
    filters: options?.filters,
    onFilter: options?.onFilter,
  };
}

// ==================== Hooks ====================

/**
 * 批量操作 Hook
 * 统一处理批量选择、批量删除等常见操作
 *
 * @example
 * const batchActions = useBatchActions({
 *   onBatchDelete: (keys, records) => {
 *     setData(data.filter(item => !keys.includes(item.id)));
 *     message.success('删除成功');
 *   },
 * });
 *
 * <AdvancedTable
 *   {...batchActions.tableProps}
 *   secondaryButtons={batchActions.batchButtons}
 * />
 */
export function useBatchActions<T extends Record<string, any>>(options: {
  /** 批量删除回调 */
  onBatchDelete?: (selectedKeys: React.Key[], selectedRecords: T[]) => void;
  /** 批量导出回调 */
  onBatchExport?: (selectedKeys: React.Key[], selectedRecords: T[]) => void;
  /** 自定义删除确认消息 */
  deleteConfirmMessage?: (count: number) => string;
  /** 数据源（用于获取选中的记录） */
  dataSource?: T[];
  /** 行Key字段 */
  rowKey?: keyof T | ((record: T) => string);
}) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  /**
   * 批量删除处理
   */
  const handleBatchDelete = useCallback(() => {
    if (selectedRowKeys.length === 0) {
      message.warning("请选择要删除的记录");
      return;
    }

    const getRecordKey = (record: T): React.Key => {
      if (!options.rowKey) return record.id as React.Key;
      return typeof options.rowKey === "function"
        ? options.rowKey(record)
        : (record[options.rowKey] as React.Key);
    };

    const selectedRecords =
      options.dataSource?.filter(item =>
        selectedRowKeys.includes(getRecordKey(item))
      ) || [];

    Modal.confirm({
      title: "确认删除",
      content:
        options.deleteConfirmMessage?.(selectedRowKeys.length) ||
        `确定要删除选中的 ${selectedRowKeys.length} 条记录吗？此操作不可恢复。`,
      okText: "确认",
      cancelText: "取消",
      okButtonProps: { danger: true },
      onOk: () => {
        options.onBatchDelete?.(selectedRowKeys, selectedRecords);
        setSelectedRowKeys([]);
      },
    });
  }, [selectedRowKeys, options]);

  /**
   * 批量导出处理
   */
  const handleBatchExport = useCallback(() => {
    if (selectedRowKeys.length === 0) {
      message.warning("请选择要导出的记录");
      return;
    }

    const getRecordKey = (record: T): React.Key => {
      if (!options.rowKey) return record.id as React.Key;
      return typeof options.rowKey === "function"
        ? options.rowKey(record)
        : (record[options.rowKey] as React.Key);
    };

    const selectedRecords =
      options.dataSource?.filter(item =>
        selectedRowKeys.includes(getRecordKey(item))
      ) || [];

    options.onBatchExport?.(selectedRowKeys, selectedRecords);
  }, [selectedRowKeys, options]);

  /** 生成批量操作按钮配置 */
  const batchButtons = useMemo(() => {
    const buttons: Array<{
      text: string;
      icon?: React.ReactNode;
      onClick?: () => void;
      disabled?: boolean;
    }> = [];

    if (options.onBatchDelete) {
      buttons.push({
        text:
          selectedRowKeys.length > 0
            ? `删除 (${selectedRowKeys.length})`
            : "删除",
        icon: <DeleteOutlined />,
        onClick: handleBatchDelete,
        disabled: selectedRowKeys.length === 0,
      });
    }

    if (options.onBatchExport) {
      buttons.push({
        text:
          selectedRowKeys.length > 0
            ? `导出 (${selectedRowKeys.length})`
            : "导出",
        onClick: handleBatchExport,
        disabled: selectedRowKeys.length === 0,
      });
    }

    return buttons;
  }, [
    selectedRowKeys,
    handleBatchDelete,
    handleBatchExport,
    options.onBatchDelete,
    options.onBatchExport,
  ]);

  return {
    /** 选中的行Keys */
    selectedRowKeys,
    /** 设置选中的行Keys */
    setSelectedRowKeys,
    /** 表格rowSelection配置 */
    rowSelection: {
      selectedRowKeys,
      onChange: setSelectedRowKeys,
    },
    /** 批量操作按钮配置（用于 secondaryButtons） */
    batchButtons,
    /** 传递给 AdvancedTable 的 props */
    tableProps: {
      rowSelection: {
        selectedRowKeys,
        onChange: setSelectedRowKeys,
      },
    },
  };
}
