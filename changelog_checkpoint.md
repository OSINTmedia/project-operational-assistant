# Changelog Checkpoint

## Current Phase

Phase 4 — Dashboard and Operational Metrics: `In progress`

Completed micro-phase:

- `Phase 4.5 — Dashboard Filters and Click-throughs`

Next concrete micro-phase:

- `Phase 4.6 — Phase 4 Dashboard Audit`

## Documentation Trust Order

Use the project docs in this order when deciding what is current and what should be built next:

1. `changelog_checkpoint.md` for the live handoff, latest completed micro-phase, and next concrete micro-phase
2. `BUILD_PLAN.md` for roadmap order, scope boundaries, and acceptance criteria
3. `DEVELOPMENT_NOTES.md` for meaningful implementation decisions and trade-offs
4. frozen docs in `docs/` for product and technical context only
5. `README.md` for public portfolio presentation only, not implementation guidance

## Documentation Interpretation Notes

- `Phase 3` is complete enough to begin dashboard work; do not continue screen-scope work unless a later task explicitly reopens a blocking screen defect.
- Older completed sections in `BUILD_PLAN.md` still contain some historical micro-phase `Planned` labels. Treat those as historical plan artifacts, not active next-step guidance.
- Frozen docs intentionally remain broader than the live implementation state. They describe product intent and constraints, not the live completion checkpoint.
- `README.md` may summarize progress at a high level, but the live implementation state and next concrete micro-phase must always come from this file first.

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
- Replaced the Demo page placeholder with a real Phase 3.1 controls surface for:
  demo role switching, safe local demo reset, and concise visitor-facing demo context.
- Moved demo reset execution behind the Zustand app-state layer so feature UI triggers local reseeding without reading persistence internals directly.
- Extracted a reusable role-switcher component and applied it to both the sidebar shell and Demo page to keep demo identity controls synchronized.
- Added reset-in-progress, reset-error, and last-reset UI state for the local demo controls without introducing real auth or backend behavior.
- Verified the remaining Dashboard, Personal, Projects, Project Detail, Issue Detail, and Team Workspace screens remain outside this slice and untouched as placeholders.
- Replaced the Personal page placeholder with a real Phase 3.2 relationship-based screen for:
  assigned issues, created issues, curated issues, needs-update items, and lightweight confirmation placeholders.
- Added a scoped Personal read-model hook that loads issue, project, and label data through repository boundaries and groups it for screen rendering without introducing direct persistence access.
- Kept the Personal screen read-oriented and linked issue cards to the existing issue-detail route without adding advanced filters, quick actions, or dashboard logic.
- Limited the `Needs Update` section to issues that are actually related to the current demo user, preserving the screen's personal-work focus instead of turning it into a global alert board.
- Replaced the Projects page placeholder with a real Phase 3.3 list and navigation surface for:
  project summaries, coherent issue counts, visible project-level context, and click-through into the existing project-detail route.
- Added a scoped Projects read-model hook that loads projects, issues, teams, users, and labels through repository boundaries and derives screen-level summary data without introducing direct persistence access.
- Kept the Projects screen globally visible across demo roles in this slice, using role switching only for current identity display rather than introducing role-based project access semantics or team-scoped hiding.
- Replaced the Project Detail placeholder with a real Phase 3.4A read-only detail shell for:
  project header/context, summary counts, Back to Projects navigation, and controlled invalid-project handling.
- Added a scoped Project Detail read-model hook that loads selected-project context and issue-derived counts through repository boundaries without rendering the full issue list yet.
- Reserved the issue-list section explicitly for `Phase 3.4B` so the route is now usable without drifting into Issue Detail, issue actions, or create/edit scope.
- Extended the scoped Project Detail read-model hook to shape selected-project issue summaries through repository boundaries, including owner, curator, label, and tag resolution for read-only rendering.
- Replaced the reserved Project Detail issue-list container with a real Phase 3.4B read-only issue list for:
  title, type, status, priority, owner, curator when present, labels, tags, and updated date.
- Added Project Detail issue navigation to the existing Issue Detail route without introducing Issue Detail implementation, issue mutation actions, or create/edit scope.
- Added lightweight, local Project Detail filters for:
  status, priority, type, and attention/system labels.
- Added filtered visibility counts, reset-filter behavior, and a distinct filtered-empty state so Project Detail is coherent without introducing broader table-engine complexity.
- Added a project-context-first Create Issue entry point from Project Detail into a dedicated create-shell route.
- Added a structured Issue create form shell with:
  Title and Description as the only open-text fields, and structured controls for Project, Status, Type, Priority, Owner, Curator, Tags, Labels, and Dependency.
- Added local create-form shell option loading through repository/read-model boundaries without wiring real submit, persistence writes, or activity-history writes yet.
- Wired the Create Issue form to the existing domain create service with minimal required-field validation and project-context-first redirect behavior after success.
- Kept creation writes behind repository and domain-service boundaries, including issue creation activity history, without broadening into edit mode or Issue Detail work.
- Added a dedicated Issue Edit route and prefill screen that loads persisted issue values through repository-backed reads without enabling save behavior yet.
- Extracted shared structured issue form controls so create and edit surfaces stay aligned while system labels remain read-only context instead of editable label inputs.
- Added a narrow issue-edit save orchestration helper that composes existing domain update operations instead of bypassing them with direct UI-side persistence writes.
- Wired the Issue Edit form to save structured changes for:
  title, description, status, priority, owner, curator, type, tags, labels, and dependency.
- Preserved system-label semantics during edit save by carrying read-only system label ids through prefill and merging them back into saved issue labels instead of exposing them as editable inputs.
- Kept edit-save behavior repository-backed and activity-safe:
  direct field updates preserve `updatedAt` / `updatedBy`, while status, priority, owner, curator, tag, and label changes still flow through their existing domain helpers where available.
- Returned edit-save users to the relevant Project Detail route after success so updated issue values are immediately visible in the project issue list without requiring Issue Detail implementation first.
- Tightened create and edit submit gating through one shared blocking-state helper instead of leaving required-field checks duplicated and partially inconsistent across the two form surfaces.
- Added controlled empty-state behavior for missing projects, statuses, owners, curators, tags, and editable labels so create/edit forms degrade predictably instead of rendering ambiguous blank controls.
- Updated outdated edit-page copy so the screen accurately reflects real save behavior rather than the older prefill-only state.
- Replaced the Issue Detail placeholder with a real structured read-first issue screen that renders owner, curator, status, priority, tags, labels, dependency context, timestamps, and activity history.
- Added a scoped Issue Detail read-model hook that loads issue, project, team, user, label, tag, status, and activity-history data through repository boundaries.
- Kept Issue Detail read-oriented while preserving the existing narrow edit entry point and controlled loading / error / missing states.
- Replaced the Team Workspace placeholder with a real lightweight visibility surface for:
  team members, team issues, group issues, and team-level status summary.
- Added a scoped Team Workspace read-model hook that loads team, user, issue, project, label, and status data through repository boundaries.
- Kept the `/teams` route read-oriented as a lightweight multi-team workspace, prioritizing the current demo user's team first without introducing org hierarchy, permissions, or department-management behavior.
- Completed a strict code-first audit of all Phase 3 screens against actual routes, feature code, repository boundaries, persistence behavior, and verification commands instead of trusting roadmap docs alone.
- Confirmed Phase 3 screens are coherent enough to begin dashboard metrics work:
  no direct Dexie access exists in `src/app` or `src/features`, no backend/auth/integration behavior slipped in, and no accidental dashboard metrics implementation exists yet.
- Added a dedicated `dashboardMetrics` domain module for portfolio-dashboard counts without introducing UI cards, charts, filters, or repository-layer rewrites.
- Implemented narrow dashboard metric calculations for:
  `total`, `open`, `done`, `waiting`, `blocked`, `delayed`, and `needs update` issue counts.
- Kept `open issues` aligned with the approved Phase 4.1 semantics:
  issues not in `Done` and not in `Canceled`.
- Kept `needs update` counts aligned with the current persisted data model by resolving the `Needs Update` system label record and counting issues carrying that persisted label id.
- Replaced the Dashboard placeholder with a real top-level metric card surface backed by the completed domain metric calculations.
- Added a feature-scoped dashboard read-model hook that loads issue and label data through repository boundaries and maps it into role-aware dashboard card data.
- Rendered the first dashboard cards for:
  `total`, `open`, `done`, `waiting`, `blocked`, `delayed`, and `needs update`.
- Kept the first dashboard UI slice free of charts, distributions, saved filters, click-through behavior, and employee-scoring semantics.
- Added domain-level dashboard distribution calculations for:
  `issues by status`, `issues by priority`, `issues by project`, and `issues by owner`.
- Extended the dashboard feature hook so it loads project, status, and user reference data through repository boundaries and exposes distribution-ready dashboard data for the upcoming chart slice.
- Kept the distribution slice data-only:
  no charts, no chart styling, no cross-screen search polish, and no click-through behavior were added early.
- Added a feature-local dashboard chart layer using Recharts without widening the repository, persistence, or route boundaries.
- Rendered the first operational dashboard visuals for:
  `status`, `priority`, and `project` distributions.
- Kept the first chart slice readable and portfolio-grade without introducing click-through behavior, saved dashboards, employee scoring, or broader dashboard analytics.
- Added structured dashboard filters for:
  `status`, `priority`, `project`, and `Needs Update` attention visibility.
- Added a filtered operational queue directly on the Dashboard without introducing saved filters, notification workflows, or a new global issue-list route.
- Added dashboard click-through behavior into the existing project list, project detail, and issue detail routes so the dashboard is actionable without widening routing scope.

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
- `src/features/demo/DemoRoleSwitcher.tsx`
- `src/features/issues/IssueDetailPage.tsx`
- `src/features/issues/IssueEditPage.tsx`
- `src/features/issues/IssueFormFields.tsx`
- `src/features/issues/issueFormValidation.ts`
- `src/features/issues/IssueDetailPage.tsx`
- `src/features/issues/useIssueDetailView.ts`
- `src/features/issues/useIssueEditFormPrefill.ts`
- `src/domain/issueRules/saveIssueEdits.ts`
- `src/features/personal/PersonalPage.tsx`
- `src/features/personal/usePersonalView.ts`
- `src/features/projects/ProjectDetailPage.tsx`
- `src/features/projects/ProjectsPage.tsx`
- `src/features/projects/useProjectDetailView.ts`
- `src/features/projects/useProjectsListView.ts`
- `src/features/teams/TeamsPage.tsx`
- `src/features/teams/useTeamWorkspaceView.ts`
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
- `src/domain/dashboardMetrics/calculateDashboardMetrics.ts`
- `src/domain/dashboardMetrics/calculateDashboardDistributions.ts`
- `src/domain/dashboardMetrics/index.ts`
- `src/domain/dashboardMetrics/types.ts`
- `src/features/dashboard/DashboardPage.tsx`
- `src/features/dashboard/DashboardCharts.tsx`
- `src/features/dashboard/useDashboardMetrics.ts`
- `BUILD_PLAN.md`
- `changelog_checkpoint.md`
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
- Demo reset now executes through app-state orchestration rather than feature-level persistence calls, keeping the Demo page inside the intended UI/state boundary.
- Demo role switching now uses one reusable UI control across the sidebar and Demo page so visible identity state stays consistent without adding auth-like complexity.
- Personal issue grouping now stays in a screen-scoped read-model hook instead of widening the shared repository API prematurely, keeping Phase 3.2 small while still respecting repository boundaries.

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
- Dashboard metrics now follow that same persisted-label resolution path for `Needs Update` counts, so missing or malformed system label seed records would break that metric calculation rather than silently drifting to a second label-identity model.
- Domain-level errors for issue operations are still plain `Error` objects rather than richer typed error shapes.
- `BUILD_PLAN.md` still retains historical `Planned` labels inside completed `Phase 2A` micro-phase entries, even though the umbrella phase is correctly marked complete.
- The Demo controls slice intentionally exposes reset only; the separate `Load Seed Data` wording in frozen technical planning remains deferred unless a later roadmap slice explicitly requires a dedicated control.
- The Personal screen currently groups repository reads in-memory for created/curated/needs-update relationships because the shared issue repository still exposes only the narrower Phase 2B read methods.
- Blocked / delayed related-to-me visibility described in frozen product docs remains deferred because it is outside the narrower approved scope of `Phase 3.2`.
- Personal issue cards currently navigate to the existing placeholder Issue Detail route. This is an acceptable deferred behavior for `Phase 3.6 — Issue Detail View`, but it remains a small current UX limitation until that route is implemented.
- Project Detail issue links currently navigate to the existing placeholder Issue Detail route. This remains an acceptable deferred behavior until `Phase 3.6 — Issue Detail View`.
- Project Detail filters remain intentionally local to this screen. No shared list/filter infrastructure exists yet, which is acceptable until a later broader slice actually requires it.
- The Create Issue shell currently starts from Project Detail context only. A broader global create entry remains deferred unless a later slice explicitly requires it.
- Issue creation currently returns users to Project Detail after success; broader post-create navigation patterns remain deferred until later create/edit slices require them.
- The first Issue Detail slice is intentionally read-first; broader quick-action polish remains deferred.
- The Issue Edit surface currently enters from the Issue Detail screen, but broader edit-entry patterns can still be revisited later if the workflow surface grows.
- The first edit-save success path currently returns users to Project Detail rather than back into Issue Detail. This remains acceptable for now, but the navigation can be revisited if a later workflow slice requires a richer post-save detail surface.
- Direct edit-save orchestration currently writes one generic `issue-updated` activity entry for changed freeform / structural fields, while status, priority, owner, curator, tag, and label updates continue to use their more specific existing activity helpers.
- Create and edit validation is intentionally MVP-level and controlled at the screen/domain boundary; advanced inline form UX and richer field-level guidance remain deferred.
- Dependency target rendering in Issue Detail falls back to raw ids when the target does not resolve cleanly to a known issue, user, or team record.
- Team Workspace currently uses the existing `/teams` route as a lightweight multi-team overview rather than a dedicated `/teams/:teamId` drill-in surface.
- `Issue Create` currently falls back to the first available project if the route carries an invalid `projectId`, rather than surfacing a controlled invalid-project route state.
- The dashboard now combines top-level metric cards, compact charts, and a local filtered operational queue, but it still does not provide saved filters or broader report-style workflows.
- Dashboard click-through behavior currently targets the existing issue detail, project detail, and projects list routes; no dedicated global issue-list surface exists yet.
- Dashboard chart rendering increases the existing build chunk-size warning pressure, but the current warning remains non-blocking for the portfolio MVP.
- The existing build chunk-size warning remains non-blocking and has grown slightly as the dashboard surface expanded.

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
- `Phase 3.1 — Demo Controls and Role Switch UI` is now complete.
- `Phase 3.2 — Personal View` is now complete.
- `Phase 3.3 — Projects List View` is now complete.
- `Phase 3.4 — Project Detail View` has been split into `3.4A`, `3.4B`, and `3.4C` to keep the read-only detail work, issue-list rendering, and lightweight filter cleanup in separate scoped slices.
- `Phase 3.4A — Project Detail Header and Summary` is now complete.
- `Phase 3.4B — Read-only Project Issue List` is now complete.
- `Phase 3.4C — Basic Structured Filters, Empty States, and Audit Cleanup` is now complete.
- `Phase 3.4 — Project Detail View` is now complete.
- `Phase 3.5 — Issue Create/Edit Form` has been split into `3.5A`, `3.5B`, `3.5C`, `3.5D`, and `3.5E` so create-shell UI, create wiring, edit prefill, edit save behavior, and final validation/audit do not collapse into one oversized slice.
- `Phase 3.5A — Create Issue Form UI Shell Only` is now complete.
- `Phase 3.5B — Wire Create Issue to Domain Service` is now complete.
- `Phase 3.5C — Edit Issue Form Route and Prefill` is now complete.
- `Phase 3.5D — Save Edit Changes and Verify History` is now complete.
- `Phase 3.5E — Final Form Validation, Empty States, and Self-Audit` is now complete.
- `Phase 3.5 — Issue Create/Edit Form` is now complete.
- `Phase 3.6 — Issue Detail View` is now complete.
- `Phase 3.7 — Team Workspace View` is now complete.
- `Phase 3.8 — Phase 3 Screen Audit` is now complete.
- `Phase 4.1 — Dashboard Metrics Domain Functions` is now complete.
- `Phase 4.2 — Dashboard Metric Cards` is now complete.
- `Phase 4.3 — Status / Priority / Project / Owner Distributions` is now complete.
- `Phase 4.4 — Dashboard Charts` is now complete.
- `Phase 4.5 — Dashboard Filters and Click-throughs` is now complete.
- The full `Phase 2A` to `Phase 2B` transition audit passed against the live repository state.
- The next allowed implementation slice is `Phase 4.6 — Phase 4 Dashboard Audit`.

## Next Recommended Task

`Phase 4` is the next active umbrella phase.

Next concrete Codex task:

- `Phase 4.6 — Phase 4 Dashboard Audit`

Scope for the next task only:

- verify the dashboard is operational clarity, not employee scoring
- verify dashboard metrics and interactions match frozen product rules
- verify performance, build, typecheck, and lint before polish or deployment work

Do not implement the whole of `Phase 4` in one task.
