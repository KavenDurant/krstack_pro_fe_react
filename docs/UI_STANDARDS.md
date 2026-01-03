# UI/UX 设计规范

本文档定义了 KRStack Pro Frontend 的统一设计标准和组件使用规范。

## 设计 Token

所有设计 token 定义在 [src/styles/tokens.ts](../src/styles/tokens.ts)

### 颜色系统

```typescript
// 主题色
tokens.colors.primary    // #1890ff
tokens.colors.success    // #52c41a
tokens.colors.warning    // #faad14
tokens.colors.error      // #ff4d4f

// 文本颜色
tokens.colors.text.primary    // 主要文本
tokens.colors.text.secondary  // 次要文本
tokens.colors.text.tertiary   // 辅助文本
tokens.colors.text.disabled   // 禁用文本

// 背景颜色
tokens.colors.background.page       // 页面背景 #f0f2f5
tokens.colors.background.container  // 容器背景 #ffffff
```

### 间距系统

基于 8px 网格系统：

```typescript
tokens.spacing.xs   // 4px
tokens.spacing.sm   // 8px
tokens.spacing.md   // 12px
tokens.spacing.lg   // 16px
tokens.spacing.xl   // 24px
tokens.spacing.xxl  // 32px
```

### 字体系统

```typescript
// 字号
tokens.typography.fontSize.xs   // 12px - 辅助文本
tokens.typography.fontSize.sm   // 14px - 正文
tokens.typography.fontSize.md   // 16px - 小标题
tokens.typography.fontSize.lg   // 18px - 标题

// 字重
tokens.typography.fontWeight.normal    // 400
tokens.typography.fontWeight.medium    // 500
tokens.typography.fontWeight.semibold  // 600
```

---

## 标准组件

### 1. PageLayout - 页面布局

统一的页面布局组件，包含面包屑和内容区域。

```tsx
import PageLayout from "@/components/PageLayout";

<PageLayout>
  {/* 页面内容 */}
</PageLayout>
```

**Props:**
- `breadcrumbItems?: { title: string }[]` - 自定义面包屑
- `showBreadcrumb?: boolean` - 是否显示面包屑（默认 true）
- `contentPadding?: number` - 内容区域内边距（默认 12px）
- `background?: string` - 背景色（默认 #f0f2f5）

**使用场景:**
- 所有标准页面
- 需要面包屑导航的页面

---

### 2. TableToolbar - 表格工具栏

统一的表格工具栏，左侧搜索/筛选，右侧操作按钮。

```tsx
import TableToolbar from "@/components/TableToolbar";

<TableToolbar
  left={
    <>
      <Input.Search placeholder="搜索" style={{ width: 240 }} />
      <Select placeholder="状态筛选" style={{ width: 120 }} />
    </>
  }
  right={
    <>
      <Button type="primary">新建</Button>
      <Button>导出</Button>
    </>
  }
/>
```

**Props:**
- `left?: ReactNode` - 左侧内容（搜索/筛选）
- `right?: ReactNode` - 右侧内容（操作按钮）
- `background?: string` - 背景色
- `padding?: number` - 内边距

**使用场景:**
- 所有数据表格上方
- 需要搜索和操作按钮的列表页

---

### 3. StandardTable - 标准表格

标准化的表格组件，包含数据统计和统一分页。

```tsx
import StandardTable from "@/components/StandardTable";

<StandardTable
  columns={columns}
  dataSource={data}
  dataCountUnit="虚拟机"
  selectedCount={selectedRows.length}
/>
```

**Props:**
- 继承所有 Ant Design Table props
- `showDataCount?: boolean` - 显示数据统计（默认 true）
- `dataCountUnit?: string` - 数据单位（默认"数据"）
- `selectedCount?: number` - 已选数量

**特性:**
- 自动显示"共计 N 条数据"
- 统一的分页格式
- 标准的容器样式

---

### 4. DataCount - 数据统计

统一的数据统计文本组件。

```tsx
import DataCount from "@/components/DataCount";

<DataCount total={100} selected={5} unit="虚拟机" />
// 输出: 共计 100 条虚拟机 已选 5 条
```

**Props:**
- `total: number` - 总数
- `selected?: number` - 已选数量
- `unit?: string` - 单位（默认"数据"）

---

### 5. StandardForm - 标准表单

标准化的表单组件，统一布局和宽度。

```tsx
import StandardForm from "@/components/StandardForm";

<StandardForm width="md" onFinish={handleSubmit}>
  <Form.Item label="名称" name="name">
    <Input />
  </Form.Item>
</StandardForm>
```

**Props:**
- 继承所有 Ant Design Form props
- `width?: "sm" | "md" | "lg" | "full"` - 表单宽度
  - sm: 400px
  - md: 600px（默认）
  - lg: 800px
  - full: 100%

---

## 输入框宽度标准

统一的输入框宽度规范：

```typescript
// 使用 tokens
tokens.components.input.width.sm  // 200px - 短输入（状态、类型）
tokens.components.input.width.md  // 240px - 中等输入（名称、搜索）
tokens.components.input.width.lg  // 300px - 长输入（描述、地址）
```

**示例:**

```tsx
// 搜索框
<Input.Search
  placeholder="搜索"
  style={{ width: tokens.components.input.width.md }}
/>

// 下拉选择
<Select
  placeholder="状态"
  style={{ width: tokens.components.input.width.sm }}
/>

// 长文本输入
<Input
  placeholder="描述"
  style={{ width: tokens.components.input.width.lg }}
/>
```

---

## 按钮组规范

使用 `Space` 组件统一按钮间距：

```tsx
import { Space, Button } from "antd";
import { tokens } from "@/styles/tokens";

<Space size={tokens.spacing.sm}>
  <Button type="primary">确定</Button>
  <Button>取消</Button>
</Space>
```

**禁止使用:**
```tsx
// ❌ 不要使用 marginRight
<Button style={{ marginRight: 8 }}>按钮</Button>
```

---

## 状态显示规范

统一使用 `Badge` 组件显示状态：

```tsx
import { Badge } from "antd";

// 运行中
<Badge status="success" text="运行中" />

// 已停止
<Badge status="default" text="已停止" />

// 错误
<Badge status="error" text="错误" />

// 警告
<Badge status="warning" text="警告" />
```

**状态颜色映射:**
- success (绿色): 运行中、正常、已启用
- default (灰色): 已停止、未启用、待处理
- error (红色): 错误、失败、异常
- warning (橙色): 警告、即将到期

---

## 表格操作列规范

统一使用 `Button type="link"` 或 `Space` 包裹多个操作：

```tsx
// 单个操作
{
  title: "操作",
  key: "action",
  render: (_, record) => (
    <Button type="link" onClick={() => handleEdit(record)}>
      编辑
    </Button>
  ),
}

// 多个操作
{
  title: "操作",
  key: "action",
  render: (_, record) => (
    <Space size={0} split={<Divider type="vertical" />}>
      <Button type="link">编辑</Button>
      <Button type="link">删除</Button>
      <Button type="link">详情</Button>
    </Space>
  ),
}
```

---

## 卡片组件规范

使用 Ant Design 6.0 新 API：

```tsx
import { Card } from "antd";
import { tokens } from "@/styles/tokens";

<Card
  title="标题"
  styles={{
    body: { padding: tokens.spacing.lg },
    header: { background: tokens.colors.background.hover },
  }}
>
  内容
</Card>
```

**禁止使用已废弃的 props:**
- ❌ `bodyStyle` → 使用 `styles.body`
- ❌ `headStyle` → 使用 `styles.header`
- ❌ `bordered` → 使用 `variant="outlined"`

---

## 分页配置规范

统一的分页配置：

```tsx
const pagination = {
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共计 ${total} 条数据`,
  pageSizeOptions: [10, 20, 50, 100],
};
```

---

## 迁移指南

### 从旧布局迁移到 PageLayout

**Before:**
```tsx
<div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
  <PageBreadcrumb />
  <Content style={{ padding: 12, overflow: "auto", flex: 1 }}>
    {children}
  </Content>
</div>
```

**After:**
```tsx
<PageLayout>
  {children}
</PageLayout>
```

### 从自定义工具栏迁移到 TableToolbar

**Before:**
```tsx
<div style={{ display: "flex", justifyContent: "space-between", padding: 16 }}>
  <div>
    <Input.Search />
    <Select />
  </div>
  <div>
    <Button>新建</Button>
  </div>
</div>
```

**After:**
```tsx
<TableToolbar
  left={<><Input.Search /><Select /></>}
  right={<Button>新建</Button>}
/>
```

---

## 检查清单

在提交代码前，确保：

- [ ] 使用 `tokens` 而非硬编码的颜色和间距值
- [ ] 页面使用 `PageLayout` 组件
- [ ] 表格使用 `StandardTable` 或 `TableToolbar`
- [ ] 表单使用 `StandardForm`
- [ ] 输入框宽度符合标准（200/240/300px）
- [ ] 按钮组使用 `Space` 而非 `marginRight`
- [ ] 状态显示使用 `Badge` 组件
- [ ] 无 Ant Design 已废弃的 props
- [ ] 运行 `npm run lint` 无错误
- [ ] 运行 `npm run format` 格式化代码
