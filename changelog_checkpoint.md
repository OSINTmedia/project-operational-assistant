# Changelog Checkpoint

## Current Phase

Phase 2A — Domain and Demo Data Foundation: `In Progress`

Completed micro-phase:

- `Phase 2A.1 — Core Domain Model / Type Contracts`

Next concrete micro-phase:

- `Phase 2A.2 — Persistence Schema and Repository Boundaries`

## Completed Work

- Initialized a React + TypeScript + Vite frontend app in the existing repository without removing documentation files.
- Installed baseline foundation dependencies:
  `react-router-dom`, `zustand`, `dexie`, `react-hook-form`, `zod`, `@hookform/resolvers`, `@tanstack/react-table`, `recharts`, `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`.
- Installed Tailwind foundation tooling with `tailwindcss`, `postcss`, and `autoprefixer`.
- Configured Tailwind with global CSS and a neutral internal dashboard base theme.
- Added GitHub Pages-safe routing with `HashRouter`.
- Added placeholder routes for:
  `/`, `/dashboard`, `/personal`, `/projects`, `/projects/:projectId`, `/teams`, `/issues/:issueId`, `/demo`.
- Added a base app shell with sidebar navigation, main content area, and placeholder role-switch UI.
- Created the planned source structure for app, features, entities, shared, domain, repositories, persistence, and styles.
- Added minimal persistence placeholders:
  `src/persistence/db.ts`, `src/persistence/seedData.ts`, `src/persistence/resetDemoData.ts`.
- Added `typecheck` script and verified build, typecheck, and lint.
- Added shared domain vocabulary contracts for:
  `roles`, `statuses`, `priorities`, `issue types`, `system labels`, `source types`, `dependency types`, `activity action types`, and base primitives.
- Added entity model contracts for:
  `User`, `Team`, `Project`, `Tag`, `Label`, `Issue`, and `ActivityEntry`.
- Added central barrel exports for `src/shared/types` and `src/entities`.

## Changed Files

- `package.json`
- `package-lock.json`
- `index.html`
- `vite.config.ts`
- `postcss.config.cjs`
- `tailwind.config.ts`
- `.oxlintrc.json`
- `tsconfig.json`
- `tsconfig.app.json`
- `tsconfig.node.json`
- `src/App.tsx`
- `src/main.tsx`
- `src/index.css`
- `src/app/layout/AppShell.tsx`
- `src/app/providers/AppProviders.tsx`
- `src/app/router/AppRouter.tsx`
- `src/features/dashboard/DashboardPage.tsx`
- `src/features/demo/DemoPage.tsx`
- `src/features/issues/IssueDetailPage.tsx`
- `src/features/personal/PersonalPage.tsx`
- `src/features/projects/ProjectDetailPage.tsx`
- `src/features/projects/ProjectsPage.tsx`
- `src/features/teams/TeamsPage.tsx`
- `src/persistence/db.ts`
- `src/persistence/resetDemoData.ts`
- `src/persistence/seedData.ts`
- `src/shared/components/PlaceholderPage.tsx`
- `src/shared/constants/navigation.ts`
- `src/shared/types/activityActionType.ts`
- `src/shared/types/dependencyType.ts`
- `src/shared/types/index.ts`
- `src/shared/types/issueType.ts`
- `src/shared/types/labelType.ts`
- `src/shared/types/primitives.ts`
- `src/shared/types/priority.ts`
- `src/shared/types/role.ts`
- `src/shared/types/sourceType.ts`
- `src/shared/types/status.ts`
- `src/shared/types/systemLabel.ts`
- `src/shared/utils/cn.ts`
- `src/styles/globals.css`
- `src/entities/activity/index.ts`
- `src/entities/activity/types.ts`
- `src/entities/index.ts`
- `src/entities/issue/index.ts`
- `src/entities/issue/types.ts`
- `src/entities/project/index.ts`
- `src/entities/project/types.ts`
- `src/entities/tag/index.ts`
- `src/entities/tag/types.ts`
- `src/entities/team/index.ts`
- `src/entities/team/types.ts`
- `src/entities/user/index.ts`
- `src/entities/user/types.ts`
- placeholder `.gitkeep` files across planned source folders

## Important Decisions

- `HashRouter` selected for GitHub Pages compatibility.
- Vite `base` configured for the repository path `/project-operational-assistant/`.
- Foundation remains frontend-only and static SPA only.
- No product features, auth, backend, or real persistence behavior implemented in this step.
- Tailwind configured with classic config + PostCSS setup to keep the foundation explicit and predictable.
- System attention signals remain modeled separately from statuses and tags:
  `Needs Update` and `Ready for Confirmation` are represented as system labels.
- Core domain contracts remain type-only in this slice; no persistence schema, repositories, state, or workflow logic were added.

## Known Issues

- The frozen docs requested as `docs/*.md` currently exist in the repo as `docs/*.txt`.
- Role switching is visual placeholder only; no permission or session behavior exists yet.
- Persistence files are scaffolds only; Dexie schema and seed/reset logic are still TODO.
- `Project.status` currently reuses the shared status vocabulary because the frozen docs define a project status field but not a separate project-status taxonomy.
- Group Issue participant membership and a source/reference field are described in product context, but they are not explicitly defined in the frozen technical field list, so they were not added in `Phase 2A.1`.

## Verification Results

- `npm run build` passed
- `npm run typecheck` passed
- `npm run lint` passed

## Roadmap Update

- `BUILD_PLAN.md` was finalized as the practical implementation roadmap / implementation bible for the Portfolio MVP.
- Future implementation must follow micro-phases rather than umbrella phases.
- Codex work should proceed one micro-phase at a time, with review and commit checkpoints between slices.
- `Phase 2A.1 — Core Domain Model / Type Contracts` is now complete.
- The next allowed implementation slice is `Phase 2A.2 — Persistence Schema and Repository Boundaries`.

## Next Recommended Task

`Phase 2A` is the next active umbrella phase.

Next concrete Codex task:

- `Phase 2A.2 — Persistence Schema and Repository Boundaries`

Scope for the next task only:

- Dexie initial schema
- typed table names
- persistence adapter structure
- repository interfaces / placeholders for:
  - issues
  - projects
  - users
  - teams
  - statuses
  - tags
  - labels
  - activity history
- enforce no direct UI-to-Dexie access

Do not implement the whole of `Phase 2A` in one task.
