# Changelog Checkpoint

## Current Phase

Phase 3 — Main Screens: `Next active phase`

Completed micro-phase:

- `Phase 2B.8 — Pre-Phase 3 Domain Hardening`

Next concrete micro-phase:

- `Phase 3.1 — Demo Controls and Role Switch UI`

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
- Added typed persistence table names and persistence record contracts for:
  `users`, `teams`, `projects`, `issues`, `tags`, `labels`, `statuses`, and `activity history`.
- Implemented the initial Dexie schema for the current typed entities.
- Added a generic IndexedDB table adapter and repository boundary factory.
- Added repository placeholders for:
  `issues`, `projects`, `users`, `teams`, `statuses`, `tags`, `labels`, and `activity history`.
- Replaced the placeholder seed scaffold with a typed demo dataset for:
  `users`, `teams`, `projects`, `statuses`, `tags`, `labels`, `issues`, and `activity history`.
- Added dataset coverage for MVP-specific scenarios:
  `owner`, `curator`, `group issue`, `needs update`, `ready for confirmation`, `ownership transfer`, and `confirmation-required` examples.
- Added persistence lifecycle helpers for:
  first-load demo seeding, persisted demo data reads, persisted demo data writes, and safe demo data clearing.
- Implemented first-load seed initialization and reset reseeding behavior for the local browser demo.
- Added a lightweight Zustand app-state slice for:
  current demo user, selected demo role, app lifecycle status, and initialization error state.
- Wired app startup to initialize seeded local demo data before route rendering.
- Replaced the static role-switch placeholder with state-backed demo role switching in the app shell.
- Audited the full `Phase 2A` foundation against the roadmap and frozen docs.
- Verified all `Phase 2A` acceptance criteria are satisfied.
- Verified no direct UI-to-Dexie access has slipped into app or feature code.
- Verified no `Phase 2B`, `Phase 3`, or `Phase 4` feature work slipped in ahead of schedule.
- Expanded the issue repository from a structural placeholder into explicit issue operations for:
  create, update, list by project, list by owner, list by team, and list by status.
- Kept issue record updates activity-safe at the repository boundary:
  updates preserve `id`, `createdBy`, and `createdAt`, and do not write `activityHistory`.
- Added an issue creation service foundation in the domain layer.
- Encoded default creation rules for:
  owner, curator, status, priority, dependency type, and completion timestamp.
- Added a basic validation boundary for required issue creation fields before repository writes.
- Added structured issue state update operations for:
  status, priority, `updatedAt`, `updatedBy`, and completion timestamp handling.
- Added activity history writes for issue status and priority changes through repository-backed domain logic.
- Added structured responsibility update operations for:
  owner transfer, curator change, `updatedAt`, and `updatedBy`.
- Added activity history writes for owner and curator changes through repository-backed domain logic.
- Enforced the group-issue curator rule:
  group issues cannot have a null curator.
- Added structured issue classification operations for:
  tag add, tag remove, label add, and label remove.
- Added duplicate-prevention behavior for assigned tag ids and label ids.
- Preserved system-label semantics in mutation logic so `Needs Update` and `Ready for Confirmation` remain labels, not statuses or tags.
- Added lightweight attention and confirmation operations for:
  needs-update refresh, ready-for-confirmation marking, confirmation, and reopen-from-confirmation.
- Kept `Needs Update` and `Ready for Confirmation` modeled as system labels rather than statuses.
- Added repository-backed activity history writes for issue confirmation and reopen-from-confirmation transitions.
- Audited `Phase 2B` issue-domain behavior against the frozen product, technical, and user-journey docs.
- Verified no direct UI-to-Dexie access has slipped into app, feature, or screen code.
- Verified no backend, real auth, notification behavior, or screen-scope feature work slipped into `Phase 2B`.
- Cleared the codebase to begin `Phase 3` screen work.
- Completed a full evidence-based `Phase 2A` to `Phase 2B` transition audit against actual source, repository state, and verification commands.
- Confirmed the repository is ready to begin `Phase 3` screen work with only non-blocking deferred notes remaining.
- Hardened issue activity history coverage for:
  issue creation, label add/remove, ready-for-confirmation, confirmation, and reopen-from-confirmation.
- Normalized activity payloads to typed value objects with stable `kind`, `id`, and `label` fields for later Issue Detail rendering.
- Added minimal `participantIds` modeling to issues so group issue screens can render participants without inventing team/org behavior later.

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
- `src/app/state/useDemoAppState.ts`
- `src/app/router/AppRouter.tsx`
- `src/features/dashboard/DashboardPage.tsx`
- `src/features/demo/DemoPage.tsx`
- `src/features/issues/IssueDetailPage.tsx`
- `src/features/personal/PersonalPage.tsx`
- `src/features/projects/ProjectDetailPage.tsx`
- `src/features/projects/ProjectsPage.tsx`
- `src/features/teams/TeamsPage.tsx`
- `src/persistence/db.ts`
- `src/persistence/demoDataLifecycle.ts`
- `src/persistence/indexedDbAdapter.ts`
- `src/persistence/records.ts`
- `src/persistence/resetDemoData.ts`
- `src/persistence/seedData.ts`
- `src/persistence/tableNames.ts`
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
- `src/repositories/activityHistoryRepository.ts`
- `src/repositories/createEntityRepository.ts`
- `src/repositories/index.ts`
- `src/repositories/issueRepository.ts`
- `src/repositories/labelRepository.ts`
- `src/repositories/projectRepository.ts`
- `src/repositories/statusRepository.ts`
- `src/repositories/tagRepository.ts`
- `src/repositories/teamRepository.ts`
- `src/repositories/userRepository.ts`
- `src/domain/issueRules/createIssue.ts`
- `src/domain/issueRules/activityHistory.ts`
- `src/domain/issueRules/index.ts`
- `src/domain/issueRules/updateIssueClassification.ts`
- `src/domain/issueRules/updateIssueAttention.ts`
- `src/domain/issueRules/updateIssueResponsibility.ts`
- `src/domain/issueRules/updateIssueState.ts`
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
- Dexie remains confined to the persistence/repository boundary; no UI route or feature code reads from Dexie directly.
- Repository placeholders remain structural only in this slice:
  basic entity access methods exist, but no issue-domain workflow behavior was added.
- The demo seed dataset remains structural only in this slice:
  data collections were added, but no first-load bootstrap or reset wiring was introduced.
- First-load and reset behavior still execute through persistence helpers:
  app initialization now triggers local demo bootstrap through the app-state layer without introducing auth or feature workflow logic.
- Demo identity remains app-state only in this slice:
  role switching and current-user context exist without introducing real auth, sessions, or protected routes.
- `Phase 2A` is complete and the codebase is cleared to start `Phase 2B` issue operations.
- Status and priority update behavior now lives in domain/application code and writes activity history through repositories rather than UI code.
- Ownership and curator changes now live in domain/application code, stay repository-backed, and preserve group-issue curator rules without introducing UI or notification behavior.
- Tag and label mutations now live in domain/application code, keep duplicate assignment out of issue state, and preserve the separation between tags, labels, and system labels.
- Attention and confirmation logic now lives in domain/application code, resolves persisted system labels through the label repository, and keeps confirmation lightweight rather than workflow-heavy.
- Activity history payloads now use a typed, UI-friendly shape instead of ad hoc strings, without turning the model into event sourcing.
- Group issues now carry minimal `participantIds` data so later detail/list screens can show participants without changing team/org scope.

## Known Issues

- Some older task instructions still reference frozen docs as `docs/*.txt`, while the repository now stores them as `docs/*.md`.
- `Project.status` currently reuses the shared status vocabulary because the frozen docs define a project status field but not a separate project-status taxonomy.
- Group Issue participant membership and a source/reference field are described in product context, but they are not explicitly defined in the frozen technical field list, so they were not added in `Phase 2A.1`.
- `Issue.statusId` currently remains typed to the default status union from `Phase 2A.1`, while persisted statuses allow room for future custom records. This should be revisited when status management and seed data are implemented.
- `docs/Technical_Planning_v1.md` contains an internal inconsistency around the number of demo users. The current dataset follows the role breakdown rather than the contradictory total count.
- Demo role switching currently selects the first seeded user for a role. A richer per-user picker is intentionally deferred.
- Issue repository updates currently throw a generic error for a missing issue id; higher-level domain error shaping is still deferred.
- Group issue participants are modeled minimally as `participantIds`, but no participant-management workflow exists yet.
- Activity history entries for status/priority/label/tag/confirmation mutations are normalized, but some older seed examples still reflect legacy action coverage rather than every newer domain operation.
- Duplicate prevention in `Phase 2B.5` works at assignment time by id; tag-creation/name-normalization rules are still deferred.
- `Needs Update` resolution currently depends on persisted system label records by name/type because exported shared label ids do not match the seeded persisted label ids.
- Domain-level errors for issue operations are still plain `Error` objects rather than richer typed error shapes.
- `BUILD_PLAN.md` still retains historical `Planned` labels inside completed `Phase 2A` micro-phase entries, even though the umbrella phase is correctly marked complete.

## Verification Results

- `npm run build` passed
- `npm run typecheck` passed
- `npm run lint` passed

## Roadmap Update

- `BUILD_PLAN.md` was finalized as the practical implementation roadmap / implementation bible for the Portfolio MVP.
- Future implementation must follow micro-phases rather than umbrella phases.
- Codex work should proceed one micro-phase at a time, with review and commit checkpoints between slices.
- `Phase 2A — Domain and Demo Data Foundation` is now complete.
- `Phase 2A.6 — Phase 2A Integration Audit` is now complete.
- `Phase 2B.1 — Issue Repository Operations` is now complete.
- `Phase 2B.2 — Issue Creation Service Foundation` is now complete.
- `Phase 2B.3 — Status and Priority Update Operations` is now complete.
- `Phase 2B.4 — Ownership and Curator Operations` is now complete.
- `Phase 2B.5 — Tag and Label Operations` is now complete.
- `Phase 2B.6 — Needs Update and Confirmation Logic Foundation` is now complete.
- `Phase 2B.7 — Phase 2B Audit` is now complete.
- `Phase 2B.8 — Pre-Phase 3 Domain Hardening` is now complete.
- `Phase 2B — Issue Core Operations` is now complete.
- The full `Phase 2A` to `Phase 2B` transition audit passed against the live repository state.
- The next allowed implementation slice is `Phase 3.1 — Demo Controls and Role Switch UI`.

## Next Recommended Task

`Phase 3` is the next active umbrella phase.

Next concrete Codex task:

- `Phase 3.1 — Demo Controls and Role Switch UI`

Scope for the next task only:

- demo page controls
- role switch UI connected to app state
- reset data action exposed safely

Do not implement the whole of `Phase 3` in one task.
