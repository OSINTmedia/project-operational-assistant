# App Experience Plan — Phase 5.8 Execution Roadmap

## 1. Purpose

This file translates `design_review.md` into a practical execution roadmap for `Phase 5.8 — App Experience Refinement Before Final QA`.

Document roles:

- `design_review.md` is the diagnosis and inspection act.
- `APP_EXPERIENCE_PLAN.md` is the execution plan for app-experience reconstruction.
- `BUILD_PLAN.md` remains the master roadmap and scope-control source.
- `changelog_checkpoint.md` remains the live handoff state for the next concrete micro-phase.

This plan is not a product-scope expansion. It organizes already-approved app-experience work into smaller implementation slices so each change can be reviewed, verified, and committed without starting the whole umbrella phase.

## 2. Current Verdict

The accepted design review verdict is:

- The app is functionally complete but not assistant-like yet.
- The user's complaint is mostly valid.
- Main friction comes from page hopping, context loss, and weak selected-user action visibility.
- The route tree is coherent and should be preserved.
- Missing drawers or modals globally is not inherently the first problem.
- Drawers, previews, collapsibles, and show/hide patterns should be introduced selectively where they reduce friction without hiding critical context.

The first priority is not a broad interaction-pattern pass. The first priority is helping the selected demo user understand what matters now.

## 3. Phase 5.8 Operating Principles

- Assistant-like before decorative.
- Selected-user next actions before drawers.
- Context recovery before visual redesign.
- Scoped inline inspection before route replacement.
- Mobile usability after interaction changes.
- Preserve MVP scope.
- Preserve local-first architecture.
- Preserve `HashRouter` and GitHub Pages static SPA compatibility.
- Keep UI out of persistence internals.
- Keep data access behind repository/state/domain boundaries.
- Keep `Needs Update` and `Ready for Confirmation` as system labels, not statuses or tags.
- No backend, real authentication, notification hub, organization workspace, employee scoring, workflow engine, enterprise permissions, or broad product-scope expansion.

## 4. Refined Phase 5.8 Micro-phase Map

### 5.8B1 — Dashboard Assistant Home and Selected-user Action Summary

Goal:

Make Dashboard answer what matters for the selected demo user now.

Scope:

- add a selected-user action summary on Dashboard
- surface assigned / curated / needs-update / confirmation-needed / blocked / delayed relevant counts where supported by existing data
- separate "My next actions" from "Workspace risks"
- keep all data local to existing repositories/hooks
- no real permissions

Exclusions:

- no notification system
- no real auth
- no workflow engine
- no employee scoring
- no broad dashboard redesign
- no drawer/modal work yet

Acceptance criteria:

- selected user can identify relevant next actions within 10 seconds
- needs-update and confirmation-needed items are visible without route hunting
- Dashboard feels more like an assistant home, not only charts
- `npm run build`, `npm run typecheck`, and `npm run lint` pass

Likely files:

- `src/features/dashboard/DashboardPage.tsx`
- `src/features/dashboard/useDashboardMetrics.ts`
- possibly `src/features/personal/usePersonalView.ts` if reusable logic is needed
- no persistence/domain schema changes unless a tiny read-model helper is justified

Manual test:

- switch Manager / Project Manager / User
- open Dashboard
- ask: "what should this user inspect or act on next?"
- verify `Needs Update` and confirmation-needed work are discoverable without route hunting

Risk level:

- Medium. The change touches the main demo entry point and must not become employee scoring, notifications, or permission behavior.

Suggested commit:

- `feat: add dashboard assistant action summary`

### 5.8B2 — AppShell Selected-user Orientation

Goal:

Improve global orientation so the selected user/role context is visible as operational context, not only demo metadata.

Scope:

- improve shell/topbar selected-user context
- reduce dominance of generic demo/auth-exclusion copy if it competes with task orientation
- add compact links or cues to Dashboard/Personal only if clearly useful
- preserve existing role-switch behavior

Exclusions:

- no real auth
- no permissions
- no new user picker unless separately approved
- no app shell redesign from scratch

Acceptance criteria:

- user always knows whose perspective is active
- shell helps orient the user without becoming noisy
- mobile shell remains usable
- `npm run build`, `npm run typecheck`, and `npm run lint` pass

Likely files:

- `src/app/layout/AppShell.tsx`
- `src/features/demo/DemoRoleSwitcher.tsx` if needed
- `src/shared/constants/navigation.ts` only if labels need adjustment

Manual test:

- switch role from shell
- confirm current role/user is obvious from every main route
- verify mobile navigation remains comfortable

Risk level:

- Low/Medium. The slice is mostly presentation/orientation, but the shell is visible everywhere.

Suggested commit:

- `feat: improve selected user orientation`

### 5.8C1 — Breadcrumbs and Context Headers

Goal:

Reduce "where am I?" confusion on Project Detail, Issue Detail, Edit, Create, and Teams.

Scope:

- add or refine contextual headers / breadcrumbs / back labels
- clarify project / issue / team context
- keep route model stable
- no source-aware return logic yet unless tiny and unavoidable

Exclusions:

- no router rewrite
- no new global issue-list route
- no drawer/modal implementation

Acceptance criteria:

- major routes explain where the user is
- back/context actions are predictable
- `npm run build`, `npm run typecheck`, and `npm run lint` pass

Likely files:

- `src/features/projects/ProjectDetailPage.tsx`
- `src/features/issues/IssueDetailPage.tsx`
- `src/features/issues/IssueCreatePage.tsx`
- `src/features/issues/IssueEditPage.tsx`
- `src/features/teams/TeamsPage.tsx`

Manual test:

- Projects -> Project Detail
- Project Detail -> Issue Detail
- Issue Detail -> Edit
- Teams -> Issue Detail
- verify each screen explains current context before the user scans the full page

Risk level:

- Medium. Context headers are low-risk, but route labels can become misleading if they imply unsupported navigation state.

Suggested commit:

- `feat: add contextual navigation headers`

### 5.8C2 — Source-aware Return Flow

Goal:

Fix the most confusing route-return behavior, especially Dashboard/Personal/Teams -> Issue Detail -> Edit.

Scope:

- evaluate and implement narrow source-aware return behavior
- avoid losing Personal/Dashboard/Teams context after edit
- preserve Project Detail return where project context is the true origin
- avoid storing complex navigation state globally unless necessary

Exclusions:

- no full router rewrite
- no global navigation history system
- no new global issue-list route
- no workflow engine

Acceptance criteria:

- Dashboard -> Issue -> Edit does not unexpectedly dump the user into unrelated context
- Personal -> Issue -> Edit does not unexpectedly dump the user into Project Detail without explanation
- Teams -> Issue retains team/project context clearly
- `npm run build`, `npm run typecheck`, and `npm run lint` pass

Likely files:

- `src/features/issues/IssueDetailPage.tsx`
- `src/features/issues/IssueEditPage.tsx`
- `src/features/dashboard/DashboardPage.tsx`
- `src/features/personal/PersonalPage.tsx`
- `src/features/teams/TeamsPage.tsx`

Manual test:

- Dashboard -> Issue Detail -> Edit -> Save
- Personal -> Issue Detail -> Edit -> Save
- Teams -> Issue Detail -> Back/Edit
- Project Detail -> Issue Detail -> Edit -> Save

Risk level:

- Medium/High. Return-state behavior can be useful, but overbuilding it would drift into a navigation-state framework.

Suggested commit:

- `feat: preserve issue navigation context`

### 5.8D1 — Project Detail Issue Preview / Inline Inspection

Goal:

Reduce route-hopping when inspecting issues from Project Detail.

Scope:

- add one scoped preview/inline inspection pattern for Project Detail issue cards
- keep full Issue Detail route for deep inspection and activity history
- preview should be read-oriented or very limited-action only
- maintain accessibility if drawer/panel is used

Exclusions:

- no universal modal/drawer framework
- no replacing Issue Detail
- no complex state machine
- no new workflow types

Acceptance criteria:

- user can inspect key issue context without leaving Project Detail
- full Issue Detail remains available
- keyboard/focus behavior is acceptable if a drawer is used
- `npm run build`, `npm run typecheck`, and `npm run lint` pass

Likely files:

- `src/features/projects/ProjectDetailPage.tsx`
- `src/features/projects/useProjectDetailView.ts`
- maybe a small shared component only if justified

Manual test:

- open Project Detail
- inspect several issues
- verify project filters/context remain visible or recoverable
- open full Issue Detail only when deeper inspection is needed

Risk level:

- Medium/High. This is the first possible preview/drawer/inline-inspection slice, so it must stay scoped to Project Detail.

Suggested commit:

- `feat: add project issue preview`

### 5.8D2 — Dashboard Queue Preview / Reduced Route-hopping

Goal:

Make Dashboard issue inspection faster without forcing every item into Issue Detail.

Scope:

- add scoped dashboard issue preview or expandable details
- preserve existing links to Issue Detail
- support selected-user action summary from 5.8B1
- keep interaction accessible

Exclusions:

- no replacing Dashboard queue with a new global issue list
- no saved filters
- no command palette
- no universal drawer system unless already justified by 5.8D1

Acceptance criteria:

- Dashboard queue supports lightweight issue inspection
- route-hopping is reduced for common scan behavior
- full Issue Detail remains available
- `npm run build`, `npm run typecheck`, and `npm run lint` pass

Likely files:

- `src/features/dashboard/DashboardPage.tsx`
- `src/features/dashboard/useDashboardMetrics.ts`
- shared preview component if already introduced

Manual test:

- filter/search Dashboard queue
- preview an issue
- open full issue only when deep inspection is needed
- verify the selected-user action summary still reads clearly

Risk level:

- Medium/High. The Dashboard is the entry point, so previews must not overload the page.

Suggested commit:

- `feat: add dashboard issue preview`

### 5.8E — Responsive Interaction and Working-layout Pass

Goal:

Validate and refine desktop/tablet/mobile usability after 5.8B-5.8D changes.

Scope:

- test 390px, 768px, and desktop widths
- refine Dashboard, Project Detail, Issue Detail, Create/Edit, Teams
- fix responsive issues exposed by new assistant/context/preview patterns
- keep changes scoped to usability

Exclusions:

- no separate mobile product
- no unrelated visual redesign
- no new feature behavior

Acceptance criteria:

- major workflows remain usable on mobile/tablet
- no text overlap
- actions remain visible and tappable
- `npm run build`, `npm run typecheck`, and `npm run lint` pass

Likely files:

- `src/app/layout/AppShell.tsx`
- Dashboard feature files
- Projects feature files
- Issues feature files
- Teams feature files
- shared components introduced in 5.8

Manual test:

- role switch
- dashboard action summary
- dashboard preview
- project issue preview
- issue edit flow
- quick actions
- create/edit forms

Risk level:

- Medium. Responsive changes should fix friction caused by 5.8, not restart Phase 5 visual polish.

Suggested commit:

- `style: refine responsive app experience`

### 5.8F — Final App Experience Audit

Goal:

Verify app is ready to enter Phase 6.

Scope:

- repeat role-based walkthroughs
- repeat viewport checks
- verify no scope creep
- verify no backend/auth/notification/org/employee-scoring behavior
- update handoff docs

Exclusions:

- no new feature implementation
- no deployment work
- no final release docs unless needed for handoff metadata

Acceptance criteria:

- selected user sees next actions quickly
- Dashboard works as assistant home
- confirmation/update responsibilities are discoverable
- list -> detail -> edit -> return flows are predictable
- route tree remains stable
- `npm run build`, `npm run typecheck`, and `npm run lint` pass

Likely files:

- `changelog_checkpoint.md`
- `DEVELOPMENT_NOTES.md` only if a meaningful decision occurred
- possibly `APP_EXPERIENCE_PLAN.md` if the audit updates the execution record

Manual test:

- repeat Manager, Project Manager, and User role walkthroughs
- repeat desktop, tablet, and mobile viewport checks
- verify scope exclusions from this plan

Risk level:

- Low. This should be an audit and handoff slice, not implementation.

Suggested commit:

- `chore: audit app experience refinement`

## 5. Priority Order

Recommended execution order:

1. 5.8B1 — Dashboard Assistant Home and Selected-user Action Summary
2. 5.8B2 — AppShell Selected-user Orientation
3. 5.8C1 — Breadcrumbs and Context Headers
4. 5.8C2 — Source-aware Return Flow
5. 5.8D1 — Project Detail Issue Preview / Inline Inspection
6. 5.8D2 — Dashboard Queue Preview / Reduced Route-hopping
7. 5.8E — Responsive Interaction and Working-layout Pass
8. 5.8F — Final App Experience Audit

Reasoning:

- Do not start with drawers.
- First fix selected-user next-action clarity.
- Then improve global and route-level context recovery.
- Then reduce route-hopping with scoped preview/inline patterns.
- Then verify responsive behavior after interaction changes are real.

## 6. Prompt Workflow Templates

Use these templates for each implementation slice by replacing `{MICRO_PHASE}` and `{MICRO_PHASE_SCOPE}` with the approved slice details from this plan.

| Slice | A. Next-step report prompt | B. Implementation approval prompt | C. Self-audit prompt | D. Git checkpoint prompt | E. Commit approval prompt |
|---|---|---|---|---|---|
| 5.8B1 | Read `changelog_checkpoint.md`, `BUILD_PLAN.md`, `APP_EXPERIENCE_PLAN.md`, `design_review.md`, and identify `{MICRO_PHASE}` only. Report scope, exclusions, likely files, acceptance criteria, verification commands, and proposed commit. Do not edit files. | Approved. Proceed to `{MICRO_PHASE}` only. Implement selected-user Dashboard action summary, keep data behind hooks/repositories, run build/typecheck/lint, report changes, and do not commit. | Audit `{MICRO_PHASE}` against scope, product constraints, architecture boundaries, system-label semantics, and verification results. Update handoff docs only if needed. Do not commit. | Confirm docs and code match reality. Run `git status`, `git diff --stat`, and targeted diffs. Report changed files, verification, documentation status, and proposed commit. Do not commit. | Approved. Commit and push with the approved message. Report commit hash, branch, and final status. |
| 5.8B2 | Read live docs and identify `{MICRO_PHASE}` AppShell orientation only. Report shell/demo role scope and exclusions. | Approved. Improve selected-user orientation in shell only. Preserve role switch behavior and avoid auth/permissions. Run verification. | Audit shell orientation, responsive behavior, role context, and scope boundaries. | Prepare checkpoint with targeted diffs and docs status. | Commit/push only after explicit approval. |
| 5.8C1 | Identify breadcrumb/context-header slice only. Report affected routes and no source-aware return logic unless approved. | Approved. Add contextual headers/back labels only. Preserve routes. Run verification. | Audit route context clarity, no router rewrite, no drawer/modal work. | Prepare checkpoint with changed files and verification. | Commit/push only after explicit approval. |
| 5.8C2 | Identify source-aware return-flow slice only. Report narrow strategy and risks. | Approved. Implement narrow return behavior for Dashboard/Personal/Teams/Project flows without global history framework. Run verification. | Audit return paths and absence of workflow-engine/router rewrite. | Prepare checkpoint with targeted route diffs. | Commit/push only after explicit approval. |
| 5.8D1 | Identify Project Detail issue preview slice only. Report preview pattern choice and accessibility risks. | Approved. Add scoped Project Detail preview/inline inspection. Preserve full Issue Detail. Run verification. | Audit preview scope, keyboard/focus behavior, and no universal modal framework. | Prepare checkpoint with changed files and manual test notes. | Commit/push only after explicit approval. |
| 5.8D2 | Identify Dashboard queue preview slice only. Report dependency on 5.8B1 and any reusable preview code. | Approved. Add scoped Dashboard issue preview/expansion. Preserve full Issue Detail and filters. Run verification. | Audit Dashboard clarity, preview accessibility, and no global issue-list route. | Prepare checkpoint with targeted diffs and verification. | Commit/push only after explicit approval. |
| 5.8E | Identify responsive working-layout pass only. Report viewport targets and affected screens. | Approved. Fix only responsive issues exposed by Phase 5.8 changes. Run verification. | Audit desktop/tablet/mobile workflows, text overlap, tap targets, and no unrelated redesign. | Prepare checkpoint with style/layout diffs and verification. | Commit/push only after explicit approval. |
| 5.8F | Identify final app-experience audit only. Report audit checklist and docs likely to update. | Approved. Run final Phase 5.8 audit, update handoff docs if needed, no feature implementation. | Audit the audit output, verification commands, docs freshness, and Phase 6 readiness. | Prepare checkpoint with docs/code status. | Commit/push only after explicit approval. |

## 7. Manual Verification Matrix

Use this matrix after each implementation slice, scaling the depth to the slice risk.

| Role | Dashboard | Personal | Projects | Project Detail | Issue Detail | Edit | Teams | Demo role switch |
|---|---|---|---|---|---|---|---|---|
| Manager | Do I know operational risk and what matters now? | Is Personal clearly secondary to operational overview? | Can I scan portfolio health? | Can I recover project context? | Can I inspect without employee-scoring interpretation? | Does save/return make sense? | Can I understand team context? | Does switching Manager context update the work I see? |
| Project Manager | Do I know my project/work responsibilities? | Do curated/created/assigned groupings help? | Can I find the right project? | Can I inspect and create project issues predictably? | Can I understand owner/curator/status quickly? | Can I return to the expected context? | Can I see group/curator context? | Does the selected PM perspective feel obvious? |
| User | Do I know what belongs to me? | Can I find assigned, needs-update, and confirmation work? | Are Projects understandable but not required for my next action? | Can I understand issue context if I arrive here? | Can I act or confirm without guessing? | Does edit stay structured and recoverable? | Can I understand team work without getting lost? | Does role switching clearly change my work context? |

Questions for every walkthrough:

- Do I know where I am?
- Do I know what belongs to me?
- Do I know what needs update?
- Do I know what needs confirmation?
- Can I inspect without losing context?
- Can I return predictably?

Viewport checks:

- Desktop: verify hierarchy, dashboards, routes, and full action surfaces.
- Tablet: verify wrapping, navigation, filters, and action groups.
- Mobile: verify nav comfort, filter/search controls, issue cards, forms, quick actions, and no text overlap.

## 8. Scope Guardrails

Do not implement the following in Phase 5.8:

- no backend
- no real auth
- no notification hub
- no organization workspace
- no employee scoring
- no workflow engine
- no broad permissions
- no full redesign
- no replacing all routes
- no large component library rewrite
- no new project/issue data model
- no command palette unless explicitly approved later
- no saved report/dashboard system
- no external integrations
- no attachments

Allowed work:

- clarify existing data
- improve selected-user action visibility
- improve route and context orientation
- reduce route-hopping where justified
- use scoped inline/preview/drawer/collapsible patterns only after the relevant slice is approved
- improve responsive usability caused or exposed by app-experience changes

## 9. Definition of Done for Phase 5.8

Phase 5.8 is complete when:

- Dashboard behaves like an assistant home.
- Selected-user next actions are visible.
- `Needs Update` and confirmation-needed responsibilities are discoverable without route hunting.
- Context-aware navigation makes major routes understandable.
- Route-hopping is reduced where justified without replacing the route model.
- Mobile and tablet workflows remain usable.
- No product-scope creep was introduced.
- No backend, real auth, notification hub, organization workspace, employee scoring, workflow engine, or new project/issue data model was added.
- `Needs Update` and `Ready for Confirmation` remain system labels.
- `npm run build`, `npm run typecheck`, and `npm run lint` pass for implementation slices.
- `changelog_checkpoint.md` and `DEVELOPMENT_NOTES.md` reflect the actual final state.
- The project is ready to enter `Phase 6 — Quality and Final Review`.
