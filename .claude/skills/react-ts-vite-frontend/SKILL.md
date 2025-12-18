---
name: react-ts-vite-frontend
description: Skill for understanding, refactoring, and extending this React + TypeScript + Vite SPA frontend (components, routing, state, and API calls) whenever the user asks for UI changes, bug fixes, or new frontend features in this project.
---

# React TS Vite Frontend

## Instructions

This Skill is used **only** when the user is working inside this React + TypeScript + Vite frontend repository.

When using this Skill, you (Claude) should:

1. **Confirm scope**
   - First, infer whether the request is about this frontend project (mentions of React, Vite, TypeScript, this repo’s files, or paths like `src/...`).
   - If the request is clearly about some other project or generic frontend concepts, do **not** apply this Skill’s assumptions.

2. **Understand the existing code**
   - Before proposing changes, scan the relevant parts of the codebase:
     - Check `src/main.tsx`, `src/App.tsx`, and any routing setup (for example `src/router`, `src/routes`, or similar).
     - Inspect involved components, hooks, and utilities under `src/components`, `src/pages`, `src/hooks`, `src/utils`, or equivalent folders.
   - Build a quick mental model:
     - How routing works (React Router or other).
     - How global state is handled (Context, Redux, Zustand, etc.).
     - How API calls are done (custom `api` module, `fetch`, Axios, etc.).
   - Prefer following **existing patterns** over introducing new libraries or architectures unless the user explicitly asks.

3. **Plan before coding**
   - When the user asks for a new feature or change:
     - Summarize the current behavior and constraints you see in the code.
     - Propose a short, concrete implementation plan (1–5 steps).
   - Keep the plan aligned with:
     - Current folder structure.
     - Current naming conventions (component names, file names, type names).
     - Existing UI patterns and styling solution (CSS Modules, Tailwind, styled-components, etc.).

4. **Implement changes safely**
   - Prefer **minimal, focused changes** that solve the user’s need without unnecessary refactors.
   - When editing code:
     - Use strict, explicit TypeScript types.
     - Keep React components typed with `FC` or explicit props interfaces as used in the repo.
     - Ensure hooks are used correctly (`useState`, `useEffect`, `useMemo`, etc.).
   - When touching routing:
     - Add new routes consistent with existing route configuration.
     - Ensure navigation works (links, redirects, layout wrappers).
   - When calling APIs:
     - Reuse existing API utilities (e.g. `apiClient`, `useQuery` hooks) when present.
     - Handle loading, error, and empty states in a way that matches existing UI patterns.

5. **Respect TypeScript and types**
   - Keep the project compiling under TypeScript.
   - Update or create interfaces/types in shared `types` modules if the repo uses them (for example `src/types` or `src/domain`).
   - **CRITICAL (KRStack Pro)**: NEVER use `any` type under ANY circumstances. This is a strict project rule.
   - Use explicit types, union types, or generics instead.
   - Use `unknown` if the type is genuinely unknown.
   - Define type aliases for complex unions (e.g., `type DeviceRow = NetworkDevice | USBDevice`).

6. **Error handling, UX, and accessibility**
   - When adding UI:
     - Use semantic HTML where possible.
     - Ensure important interactive elements are keyboard-accessible.
     - Provide user-friendly error and empty states, matching existing design patterns.
   - When dealing with async flows, avoid leaving the user without feedback (use spinners, skeletons, or messages consistent with the rest of the app).

7. **Testing and validation**
   - If the project already has tests (e.g. Vitest, React Testing Library, Cypress):
     - Extend or add tests for new behavior instead of leaving it untested.
     - Follow existing test patterns and file locations (e.g. `*.test.tsx`, `__tests__` folders).
   - When you show code, ensure it is syntactically correct and consistent with the test setup.

8. **Code style and conventions**
   - Preserve existing formatting and style choices (e.g. ESLint/Prettier rules).
   - Reuse existing components, hooks, and design tokens instead of duplicating logic.
   - Avoid large, unrelated refactors in the same change unless the user explicitly requests them.

9. **Communicate clearly with the user**
   - When you propose changes:
     - Explain briefly *where* files should go and *why* they follow the current structure.
     - If there are multiple possible patterns in the repo, explicitly say which one you chose and why.
   - If the user shares specific files or snippets:
     - Reference line numbers or key blocks when explaining your changes.
     - Make sure your response is directly applicable to their code snippet or file.

10. **Stay within this project's context**
    - This Skill is for the **frontend React + TS + Vite** code only.
    - For backend APIs, deployment config, or CI/CD, fall back to general knowledge unless there is matching code/config in this repo.
    - Do not assume external services or tools that are not present in the codebase.

## KRStack Pro Specific Rules

### Component Reusability - REQUIRED
1. **Search before implementing**: Use Grep/Glob to find similar functionality
2. **Reuse existing components** when suitable
3. **Extract aggressively**: Create components for 2+ occurrences of similar patterns
4. **Location strategy**:
   - Used in 2+ pages → `src/components/` (global)
   - Used within one page → `src/pages/[PageName]/components/` (local)

### State Management Strategy
- **Current**: React Hooks for local state (temporary)
- **Future**: Redux Toolkit for global state (preferred)
- When implementing features, consider if state should be global
- Prepare component structure for easy Redux migration

### Ant Design 6.0 Specifics
- Using alpha version (6.0.0-alpha.5) - APIs may differ from v5
- **Avoid deprecated props**: `tabPosition`, `bodyStyle`
- Use `styles={{ body: {...} }}` instead of `bodyStyle`
- When using Table with union types, specify generic: `<Table<UnionType>>`

### UI Spacing Standards - CRITICAL
**MUST check and enforce when working on any UI:**
- Content area padding: `12px`
- Search input bottom margin: `12px` (between search and toolbar)
- Toolbar bottom margin: `8px` (between toolbar and table)
- Data count text margin: `8px` (e.g., "共计 N 条数据")

**Action required**: When editing any page component, scan for spacing violations and fix them.

### Documentation Check - REQUIRED
Before using new components/libraries:
1. Check latest documentation (use WebFetch or WebSearch)
2. Verify compatibility with React 19 and Ant Design 6.0
3. Check for breaking changes or deprecated features
4. Confirm API usage matches latest official docs

### Git Workflow
- **NO AI attribution** in commits (no Claude signatures)
- Commit format: `type: description`
- All changes via Pull Requests
- Run `npm run format` before committing

## Examples

### Example 1 — Add a new page and route

**User request**

> 在当前前端里增加一个 `/profile` 页面，用来展示当前用户信息，保持和现有页面一样的布局和路由风格。

**How to respond using this Skill**

1. Inspect existing routing (for example in `src/router.tsx` or `src/App.tsx`) to see how routes and layouts are defined.
2. Identify where other page components live (e.g. `src/pages/Dashboard`, `src/pages/Settings`).
3. Propose:
   - A new `ProfilePage` component file in the same `src/pages` convention.
   - A new route entry for `/profile` following the same layout/wrapper.
4. Provide:
   - The new `ProfilePage.tsx` code with typed props.
   - The diff or snippet showing how to register the new route.

---

### Example 2 — Wire up a new API call

**User request**

> 后端增加了 `/api/todos` 接口，帮我在前端加一个列表页面，展示 todos，并且有加载中和错误状态。

**How to respond using this Skill**

1. Find how existing API calls are implemented:
   - Check for `api.ts`, `apiClient.ts`, `services`, or hooks like `useTodos`.
2. Follow the same pattern:
   - Add a typed client method or hook for `/api/todos`.
   - Define a `Todo` TypeScript interface in the shared types file if one exists.
3. Implement a new React component/page that:
   - Uses the API helper/hook.
   - Shows loading and error states consistent with other pages.
   - Renders the list of todos.

---

### Example 3 — Refactor a component safely

**User request**

> 这个大组件太复杂了，帮我拆成几个小组件，但不要影响现有行为。

**How to respond using this Skill**

1. Inspect the component file and understand:
   - Its props and responsibilities.
   - Internal state and side effects.
2. Identify logical subparts (header, list, filters, dialogs, etc.).
3. Extract them into new, typed child components under the same folder, matching naming conventions.
4. Keep the public API (props) of the original component stable so external callers do not break.
5. If tests exist, update or add tests to cover the refactored behavior without changing what the user sees.
