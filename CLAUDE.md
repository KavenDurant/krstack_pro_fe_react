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
npm run preview          # Preview production build
```

## Architecture

### Routing Structure

- **Two-level navigation**: Top horizontal menu + left sidebar menu
- **MainLayout** (`src/layouts/MainLayout.tsx`): Wraps all authenticated routes with AuthGuard
- **Dynamic sidebar**: Changes based on top navigation selection
- **Route mapping**:
  - `/hosts` → Virtual Machine Management (default)
  - `/cloud-desktop` → Cloud Desktop Management
  - `/resource-management` → Resource Overview
  - `/platform-management` → Platform Settings
  - `/operations-management` → Operations Logs
  - `/settings/form` → VM Form Settings

### Page Structure Pattern

Pages follow a consistent layout pattern:

1. **Tree/Filter sidebar** (left, resizable 280-350px)
2. **Main content area** (right):
   - Statistics cards (if applicable)
   - Search/filter toolbar
   - Data table with column settings
   - Detail view (replaces table when item selected)

Example: `HostManagement/index.tsx` demonstrates this pattern with:
- `ResourceTree` component (sidebar)
- `StatisticsCards` component
- `SearchFilter` + `HostTable` components
- `HostDetail` component (detail view)

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
└── layouts/                       # Layout wrappers
```

### State Management

- **React Hooks** for local state (useState, useCallback, useMemo)
- **No global state library** - state lifted to parent components when needed
- **Selection state pattern**: Used in HostManagement to track tree selection and navigate between list/detail views

### Type Safety Rules

**CRITICAL**: Never use `any` type. This is enforced in AGENTS.md and .agent/rules.md.

- Use explicit types, union types, or generics
- Use `unknown` if type is truly unknown
- Define type aliases for complex unions (e.g., `type DeviceRow = NetworkDevice | USBDevice | GPUDevice | CdromItem`)
- When using Ant Design Table with union types, specify generic: `<Table<UnionType>>`

### Ant Design 6.0 Specifics

- **Deprecated props to avoid (CRITICAL - ALWAYS UPDATE)**:
  - `tabPosition` → Use CSS or alternative layout
  - `bodyStyle` → Use `styles={{ body: {...} }}`
  - `bordered` → Use `variant="outlined"` (Card component)
  - `labelStyle` → Use `styles={{ label: {...} }}` (Descriptions component)
  - `contentStyle` → Use `styles={{ content: {...} }}` (Descriptions component)
- **Using alpha version** (6.0.0-alpha.5) - some APIs may differ from v5

### Mock Data Pattern

Mock data stored in `src/api/mockData.ts` with typed interfaces. Components import and transform mock data as needed.

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

1. **Check latest documentation** using fetch MCP or duckduckgo MCP
2. **Verify compatibility** with current project versions (React 19, Ant Design 6.0)
3. **Check for breaking changes** or deprecated features
4. **Confirm API usage** matches the latest official documentation

**Example scenarios requiring documentation check:**
- Using a new Ant Design component for the first time
- Implementing unfamiliar React 19 features
- Adding third-party libraries
- Using updated APIs in existing libraries

### Test-Driven Development - REQUIRED

 

### Component Abstraction - AGGRESSIVE STRATEGY

**Prioritize component abstraction and encapsulation:**

- **Extract aggressively**: Create components even for 2+ occurrences of similar patterns
- **Favor composition**: Build complex UIs from small, composable components
- **Abstract early**: Don't wait for 3+ repetitions - abstract when you see potential reuse
- **Sacrifice readability for reusability**: Acceptable to add abstraction layers for better maintainability
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

**Examples of reusable patterns to look for:**
- Table toolbars (search + action buttons)
- Status tags with consistent styling
- Modal forms with similar layouts
- Data display cards

### Formatting

- Prettier enforced (2 spaces, double quotes, semicolons)
- Max line width: 80 characters
- Run `npm run format` before committing

### Component Guidelines

- Functional components with TypeScript
- PascalCase for component files
- Break large components into smaller sub-components in `components/` subdirectory
- Keep consistent spacing: "共计 N 条数据" text uses `margin-bottom: 8px`

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

**Example:**
```
fix: 修复 DeviceManagement 组件类型错误

- 修复 Table 组件的 TypeScript 类型推断问题
- 移除已弃用的 tabPosition 属性
- 将 bodyStyle 替换为 styles.body
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
- **Ant Design 6.0.0-alpha.5** - UI component library (alpha version)
- **React Router DOM 7.9.6** - Client-side routing
- **ECharts 6.0.0** - Data visualization
- **@dnd-kit** - Drag and drop functionality (used in FormSettings)

## Important Files

- `AGENTS.md` - AI assistant rules (no `any` types, component structure)
- `.agent/rules.md` - Detailed development workflow and testing requirements
- `src/router.tsx` - Route definitions
- `src/layouts/MainLayout.tsx` - Main layout with navigation
