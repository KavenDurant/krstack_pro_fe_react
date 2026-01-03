# 页面重构示例

此文件夹包含使用新的标准组件重构后的页面示例。

## 📋 重构对比

### 云桌面管理页面

**原代码问题:**
- 硬编码样式值 (`padding: 12`, `background: "#f0f2f5"`)
- 重复的布局代码
- 不统一的间距

**重构后改进:**
- ✅ 使用 `PageLayout` 统一页面结构
- ✅ 使用 `TableToolbar` 统一工具栏布局
- ✅ 使用 `StandardTable` 自动处理分页和数据统计
- ✅ 使用 `tokens` 替代所有硬编码值
- ✅ 代码减少 40%

## 🚀 如何应用

1. 阅读 [docs/UI_STANDARDS.md](../../docs/UI_STANDARDS.md)
2. 对比示例代码与原页面
3. 复制需要的代码片段
4. 根据实际需求调整

## 📝 迁移检查清单

- [ ] 使用 `PageLayout` 替代自定义布局
- [ ] 使用 `TableToolbar` 替代自定义工具栏
- [ ] 使用 `StandardTable` 替代普通 Table
- [ ] 使用 `tokens` 替代硬编码值
- [ ] 输入框宽度符合标准 (200/240/300px)
- [ ] 按钮组使用 `Space` 组件
- [ ] 状态显示使用 `Badge` 组件
