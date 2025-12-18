
---

### `examples.md`

```md
# Skill Usage Examples — React TS Vite Frontend

These examples show how the `react-ts-vite-frontend` Skill should be used by Claude in realistic scenarios.

---

## Example A — Simple UI change

**User**

> 把首页上的 “Create” 按钮改成 “新建任务”，并且点击后跳转到 `/tasks/new` 路由。

**Claude (using this Skill)**

1. Locate the home page component (for example `src/pages/Home/HomePage.tsx`).
2. Find the `Create` button:
   - Update the label text to `"新建任务"`.
   - Wrap or replace it with a link/navigation component consistent with existing router usage.
3. Update or add a route for `/tasks/new` if it does not exist, following the current routing setup.
4. Show the user:
   - The updated button JSX snippet.
   - Any new or changed route definitions.

---

## Example B — Add a typed API hook

**User**

> 后端新增了 `/api/projects/:id` 接口，帮我在前端加一个 hook：`useProject(id)`，返回 loading/error/data。

**Claude**

1. Check existing API helpers (e.g. `src/api/projects.ts`).
2. Define a `Project` TypeScript interface in the shared types file if missing.
3. Implement `useProject` following the same pattern as other hooks:
   - Input: `id: string`.
   - Output: `{ data, isLoading, error }` or whatever convention the repo uses.
4. Provide the full hook implementation code and an example usage inside a component.

---

## Example C — New page with form

**User**

> 帮我加一个 “创建项目” 页面，有表单字段：name, description，提交后调用 `/api/projects` POST 接口。

**Claude**

1. Inspect existing forms to see:
   - Whether a form library is used (e.g. `react-hook-form`, `Formik`) or custom form handling.
2. Create a `CreateProjectPage` component in the same `src/pages` structure.
3. Implement:
   - Typed form state (interfaces for the form values).
   - Validation rules consistent with existing patterns.
   - Submission handler that calls the API helper for `/api/projects`.
   - Success / error UI matching existing UX decisions (e.g. toast, redirect).
4. Register a new route (e.g. `/projects/new`) using the same pattern as other pages.

---

You can extend this file with your own real conversations and solutions. Claude will then have concrete patterns from your actual project to mimic.

---

## KRStack Pro Specific Examples

### Example D — Add a new management page (KRStack Pro pattern)

**User**

> 添加一个存储管理页面，包含左侧资源树、统计卡片、搜索过滤和数据表格

**Claude (using this Skill)**

1. Reference the existing pattern in `src/pages/HostManagement/index.tsx`
2. Create `src/pages/StorageManagement/` directory structure:
   ```
   StorageManagement/
     index.tsx                    # Main page with layout
     components/
       ResourceTree.tsx           # Left sidebar tree
       StatisticsCards.tsx        # Top statistics cards
       SearchFilter.tsx           # Search and filter toolbar
       StorageTable.tsx           # Data table
       StorageDetail.tsx          # Detail view (replaces table)
       StorageTypes.ts            # Type definitions
   ```
3. Add mock data to `src/api/mockData.ts` with typed interface
4. Register route in `src/router.tsx` following existing pattern
5. Add navigation item to MainLayout if needed

**Key points:**
- Follow the same resizable sidebar pattern (280-350px)
- Use selection state to toggle between table and detail view
- Ensure all types are explicit (no `any`)
- Reuse existing components where possible (check with Grep first)

---

### Example E — Handle union types in Ant Design Table

**User**

> DeviceManagement 组件中有多种设备类型（网络设备、USB设备、GPU设备），如何正确处理 Table 的类型？

**Claude**

1. Define a union type for all device types:
   ```typescript
   type DeviceRow = NetworkDevice | USBDevice | GPUDevice | CdromItem;
   ```
2. Specify the generic type in Table component:
   ```typescript
   <Table<DeviceRow>
     columns={columns}
     dataSource={devices}
   />
   ```
3. Use type guards in render functions when needed:
   ```typescript
   render: (_, record) => {
     if ('ipAddress' in record) {
       // NetworkDevice specific logic
     }
   }
   ```

---

### Example F — Prepare component for Redux migration

**User**

> 实现一个用户信息组件，但要考虑后续迁移到 Redux

**Claude**

1. Create component with local state first:
   ```typescript
   const UserProfile: React.FC = () => {
     const [user, setUser] = useState<User | null>(null);
     // ... component logic
   };
   ```
2. Structure to make Redux migration easy:
   - Keep state logic separate from UI rendering
   - Use clear action-like functions (e.g., `updateUser`, `clearUser`)
   - Avoid deeply nested state updates
3. Add comment for future migration:
   ```typescript
   // TODO: Migrate to Redux when global state is set up
   // This state should be in store.user slice
   ```
