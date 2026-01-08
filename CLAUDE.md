# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KRStack Pro Frontend - A cloud management platform built with React 19, TypeScript, Vite, and Ant Design 6.0. The application manages virtual machines, cloud desktops, and infrastructure resources.

## Development Commands

```bash
npm run dev              # Start dev server (Vite)
npm run build            # Type check + production build
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
npm run test             # Run tests (Vitest)
npm run test:watch       # Run tests in watch mode
npm run test:ui          # Run tests with UI
npm run preview          # Preview production build
```

## Architecture

### Routing Structure

- **Two-level navigation**: Top horizontal menu + left sidebar menu
- **MainLayout** (`src/layouts/MainLayout.tsx`): Wraps all authenticated routes with AuthGuard
- **Dynamic sidebar**: Changes based on top navigation selection
- **Route mapping**:
  - `/` → Redirects to `/hosts` (VM Management)
  - `/hosts` → Virtual Machine Management (default)
  - `/cloud-desktop` → Cloud Desktop Management
  - `/resource-management/*` → Resource Overview (with nested routing)
  - `/platform-management/*` → Platform Settings
  - `/operations-management` → Operations Logs
  - `/settings/form` → VM Form Settings

### Nested Routing Pattern

Some pages use nested routing within themselves (e.g., ResourceManagement):
- Route defined with wildcard: `/resource-management/*`
- Component uses `useLocation()` to determine sub-page
- Internal sidebar navigation changes the URL path
- Example: `ResourceSidebar` component handles navigation between `/resource-management`, `/resource-management/host`, etc.

### Page Structure Pattern

Pages follow a consistent layout pattern:

1. **Tree/Filter sidebar** (left, resizable 280-350px) - Uses `ResizableTreePanel` or custom sidebar
2. **Main content area** (right):
   - Breadcrumb navigation (using `PageBreadcrumb`)
   - Statistics cards (if applicable) - using `GrayCard` component
   - Search/filter toolbar
   - Data table with column settings
   - Detail view (replaces table when item selected)

**Key example**: `HostManagement/index.tsx` demonstrates the selection state pattern with:
- `ResourceTree` component (sidebar via `ResizableTreePanel`)
- `StatisticsCards` component
- `SearchFilter` + `HostTable` components
- `HostDetail` component (detail view replaces table)
- Selection state: `{ type: "all" | "cluster" | "host" | "vm", ... }`

### Component Organization

```
src/
├── pages/
│   └── [PageName]/
│       ├── index.tsx              # Main page component
│       └── components/            # Page-specific components
│           ├── [Feature]Tab.tsx   # Tab content components
│           ├── [Feature]Table.tsx # Table components
│           └── [Feature]Types.ts  # Type definitions
├── components/                    # Global shared components
│   ├── LayoutBox/                 # Flex layout wrapper
│   ├── GrayCard/                  # Card with gray background
│   ├── Splitter/                  # Resizable panels wrapper
│   ├── ResizableTreePanel/        # Tree sidebar with resize
│   ├── VerticalTabs/              # Left-aligned tabs
│   └── PageBreadcrumb/            # Breadcrumb navigation
├── layouts/                       # Layout wrappers
│   └── MainLayout.tsx             # Main layout with navigation
├── api/                           # API layer
│   ├── modules/                   # API modules by feature
│   ├── request/                   # Axios instance and interceptors
│   ├── config/                    # API configuration
│   └── types.ts                   # Common API types
├── utils/                         # Utility functions
│   ├── auth.ts                    # Authentication utilities
│   └── format.ts                  # Formatting utilities
└── config/                        # Configuration files
    └── env.ts                     # Environment configuration
```

### State Management

- **React Hooks** for local state (useState, useCallback, useMemo)
- **Zustand** for global state (rarely used - prefer lifting state)
- **useRef pattern** for preventing duplicate data loads on mount (see AGENTS.md)
- **Selection state pattern**: Complex union types for tracking selections (e.g., cluster/host/vm)

### Data Loading Pattern (CRITICAL)

**Always use `useRef` to prevent duplicate loads in React StrictMode:**

```typescript
const [data, setData] = useState([]);
const hasLoadedRef = useRef(false);

const loadData = async () => {
  // NOT wrapped in useCallback to avoid dependency issues
  // ... fetch logic
};

useEffect(() => {
  if (!hasLoadedRef.current) {
    hasLoadedRef.current = true;
    loadData();
  }
}, []); // Empty deps for mount-only
```

### API Architecture

**Modular API structure** organized by feature:
- `src/api/modules/[feature]/index.ts` - API functions
- `src/api/modules/[feature]/types.ts` - Feature-specific types
- Centralized exports in `src/api/index.ts`
- Axios interceptors handle auth tokens and error responses
- Consistent response format: `{ code: number, message: string, data: T }`
- Pagination format: `{ list: T[], total: number, page: number, pageSize: number }`

### Authentication Flow

- `AuthGuard` component wraps all protected routes
- Token stored in localStorage (`token` key)
- User info stored in localStorage (`userInfo` key)
- Auth state flag: `isAuthenticated` in localStorage
- Axios interceptor adds token to all requests
- 401 responses trigger redirect to login

### Type Safety Rules

**CRITICAL**: Never use `any` type. This is enforced in AGENTS.md and .agent/rules.md.

- Use explicit types, union types, or generics
- Use `unknown` if type is truly unknown
- Define type aliases for complex unions (e.g., `type DeviceRow = NetworkDevice | USBDevice | GPUDevice | CdromItem`)
- When using Ant Design Table with union types, specify generic: `<Table<UnionType>>`
- API responses are strongly typed with exported interfaces

### Ant Design 6.0 Specifics

- **Deprecated props to avoid (CRITICAL - ALWAYS UPDATE)**:
  - `tabPosition` → Use CSS or alternative layout (or `tabPlacement="start"` for left tabs)
  - `bodyStyle` → Use `styles={{ body: {...} }}`
  - `bordered` → Use `variant="outlined"` (Card component)
  - `labelStyle` → Use `styles={{ label: {...} }}` (Descriptions component)
  - `contentStyle` → Use `styles={{ content: {...} }}` (Descriptions component)
  - `message` (Alert component) → Use `title` prop instead
  - `width` (Drawer component) → Use `styles={{ wrapper: { width: 600 } }}`
- **Using alpha version** (6.0.0-alpha.5) - some APIs may differ from v5

### Mock Data Pattern

Mock data stored in `src/api/mockData.ts` with typed interfaces. During development, components may use mock data before backend integration.

**Mock Data Warning Pattern**: When a page uses mock data, display an Alert:
```tsx
<Alert type="warning" showIcon style={{ marginBottom: 12 }} title="本页面暂时使用 Mock 数据，非真实后端数据" />
```

## Code Standards

### TypeScript - STRICT RULES

**NEVER use `any` type under any circumstances.**

- Use explicit types, union types, or generics instead
- Use `unknown` if the type is genuinely unknown
- If you encounter type errors, fix them by:
  1. Adding proper type definitions
  2. Using type assertions with specific types
  3. Refactoring the data structure
- Define interfaces for all data structures
- Use type aliases for complex unions

### Using New Components and Libraries - REQUIRED

**Before using any new component, library, or unfamiliar API:**

1. **Check latest documentation** using fetch MCP or web search
2. **Verify compatibility** with current project versions (React 19, Ant Design 6.0)
3. **Check for breaking changes** or deprecated features
4. **Confirm API usage** matches the latest official documentation

**Example scenarios requiring documentation check:**
- Using a new Ant Design component for the first time
- Implementing unfamiliar React 19 features
- Adding third-party libraries
- Using updated APIs in existing libraries

### Component Abstraction - AGGRESSIVE STRATEGY

**Prioritize component abstraction and encapsulation:**

- **Extract aggressively**: Create components even for 2+ occurrences of similar patterns
- **Favor composition**: Build complex UIs from small, composable components
- **Abstract early**: Don't wait for 3+ repetitions - abstract when you see potential reuse
- **Create utility components**: Extract repeated JSX patterns into dedicated components

**Abstraction triggers:**
- Similar UI patterns appearing 2+ times
- Complex logic that could be isolated
- Repeated prop drilling scenarios
- Similar event handlers across components

### Component Reusability - REQUIRED WORKFLOW

**Before implementing any feature, follow this process:**

1. **Search first**: Use Grep/Glob to search for similar functionality in the codebase
2. **Reuse existing**: If a suitable component exists, reuse it
3. **Evaluate encapsulation**: If you find repeated patterns (2+ occurrences), create a shared component
4. **Location strategy**:
   - Used in 2+ pages → `src/components/` (global)
   - Used within one page → `src/pages/[PageName]/components/` (local)
5. **Component design**: Keep components small, focused, and properly typed

**Reusable components available:**
- `LayoutBox` - Flexbox layout wrapper
- `GrayCard` - Card with gray background and title
- `Splitter` - Resizable panel layout
- `ResizableTreePanel` - Tree with resizable sidebar
- `VerticalTabs` - Left-aligned vertical tabs
- `PageBreadcrumb` - Breadcrumb navigation
- `useTableScrollHeight` - Hook for dynamic table scroll height calculation

### UI Spacing Standards

From AGENTS.md - maintain consistent spacing:
- "共计 N 条数据" text: `margin-bottom: 8px` with 14px font size
- Page content area: `padding: 12px`
- Search box to toolbar: `marginBottom: 12px`
- Toolbar to table: `marginBottom: 8px`

### Missing Backend Data Handling

**When backend doesn't provide a field:**
- Display `<Tag color="default">暂未提供</Tag>`
- Never fabricate fake data
- Use Tag component to clearly indicate missing data

### Formatting

- Prettier enforced (2 spaces, double quotes, semicolons)
- Max line width: 80 characters
- Run `npm run format` before committing

### Component Guidelines

- Functional components with TypeScript
- PascalCase for component files
- Break large components into smaller sub-components in `components/` subdirectory
- Use CSS Modules or inline styles (not CSS-in-JS libraries)

## Git Workflow

- **Protected main branch** - no direct pushes
- **Branch naming**:
  - `feature/description` - New features
  - `fix/description` - Bug fixes
  - `refactor/description` - Code refactoring
- **Commit format**: `type: description` (e.g., `feat: add user login`)
- **All changes via Pull Requests**

### Commit Message Rules - NO AI TRACES

**CRITICAL: Remove all AI-generated signatures from commit messages.**

When creating commits, **NEVER include**:
- ❌ "🤖 Generated with [Claude Code](https://claude.com/claude-code)"
- ❌ "Co-Authored-By: Claude <noreply@anthropic.com>"
- ❌ Any other AI tool attribution or signature

**Correct commit message format:**
```
type: brief description

Optional detailed explanation of changes.
```

### PR Requirements

Must include:
- Clear title: `type: brief description (max 50 chars)`
- Description with: 功能描述, 主要变更, 技术方案, 测试 checklist
- **No AI attribution in PR description**
- Pre-merge checks:
  - [ ] `npm run format` executed
  - [ ] `npm run build` passes
  - [ ] `npm run lint` passes
  - [ ] No TypeScript errors
  - [ ] No AI traces in commit messages

## Key Dependencies

- **React 19.2.0** - Latest React with new features
- **Ant Design 6.0.0-alpha.5** - UI component library (alpha version, many APIs changed from v5)
- **React Router DOM 7.9.6** - Client-side routing
- **ECharts 6.0.0** - Data visualization
- **Zustand 5.0.9** - Global state management (use sparingly)
- **@dnd-kit** - Drag and drop functionality (used in FormSettings)
- **Axios** - HTTP client with interceptors
- **Vitest** - Testing framework
- **uuid** - Unique ID generation

## Important Files

- `AGENTS.md` - AI assistant rules (no `any` types, data loading patterns, spacing standards)
- `src/router.tsx` - Route definitions with nested routing
- `src/layouts/MainLayout.tsx` - Main layout with two-level navigation
- `src/api/index.ts` - Centralized API exports
- `src/api/request/instance.ts` - Axios instance with auth/error interceptors
- `src/utils/format.ts` - Byte formatting, percentage calculation, date formatting
- `src/hooks/useTableScrollHeight.ts` - Dynamic table scroll height calculation
- `src/components/` - Reusable components (check before creating new ones)
