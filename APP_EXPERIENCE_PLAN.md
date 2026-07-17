# App Experience Plan - Phase 5.9 Corrective UX Roadmap

Status: active planning document  
Source diagnosis: `design_review_V2.md`  
Execution state: `5.9B - Dashboard Action-first Recomposition` complete; `5.9C - Project and Personal Density Pass` is next
Phase 6 status: blocked until the Phase 6 gate checklist in this document passes

## 1. Purpose

This file turns `design_review_V2.md` into the working execution plan for corrective Phase 5.9.

Document roles:

- `design_review_V2.md` is the audit, diagnosis, and UX evidence record.
- `APP_EXPERIENCE_PLAN.md` is the implementation roadmap and phase-status tracker.
- `BUILD_PLAN.md` remains the master roadmap and scope-control source.
- `changelog_checkpoint.md` remains the live handoff state for the next concrete micro-phase.
- Frozen docs in `docs/` remain reference material and must not be edited for Phase 5.9 unless separately approved.

This plan is not a product-scope expansion. It is a controlled correction pass for navigation, wayfinding, first-viewport usefulness, compact layout, and assistant-like actionability.

## 2. Current Verdict

Accepted Phase 5.9 verdict:

- Phase 6 must not begin yet.
- The current app is functionally useful but still too heavy and navigation-heavy.
- The primary weakness is route-hopping and wayfinding, not only visual density.
- Dashboard still behaves too much like a reporting surface instead of an assistant home.
- First viewport utility is weak on the main work screens.
- Mobile risk is high because desktop layouts already stack too much content.
- `/personal` remains in scope and must not be removed or deprecated without separate explicit approval.

The next target is **5.9C - Project and Personal Density Pass**.

## 3. Phase 5.9 Operating Principles

- Navigation clarity before visual polish.
- Return context before AppShell redesign.
- Action queue before charts and static summaries.
- In-place filtering before route jumps.
- Preview before full detail when the user is only inspecting.
- Full route only when the user needs deeper reading or meaningful action.
- Compact layout without hiding critical context.
- Mobile survival after major desktop order/layout changes.
- Preserve MVP scope.
- Preserve `HashRouter` and GitHub Pages static SPA compatibility.
- Preserve local-first architecture and repository/state/domain boundaries.
- Keep UI out of persistence internals.
- Keep `Needs Update` and `Ready for Confirmation` as system labels, not statuses or tags.

Not allowed:

- backend
- real auth
- notification hub
- employee scoring
- workflow engine
- organization workspace
- new data model
- broad AppShell redesign
- full product redesign
- brand redesign
- animation pass
- Jira/Asana/Trello/CRM/helpdesk drift
- command palette unless separately approved
- removing `/personal` without separate explicit approval

## 4. UX Success Metrics

Phase 5.9 is successful only if behavior improves, not merely if spacing gets smaller.

- Dashboard first viewport shows the Operational Queue or its first actionable rows on a standard desktop viewport.
- Common user workflow reaches the relevant work item in 2-3 route transitions where possible.
- Issue Detail/Edit always show a visible source-aware return destination.
- A direct Back/Return control exists on deep work routes; browser back is not the only recovery path.
- Mobile first viewport is not consumed entirely by headers/cards/filters.
- Summary cards filter, preview, or route to a precise work surface.
- Charts do not appear above the main action queue.
- Dashboard, Personal, Project Detail, and Issue Detail answer: where am I, what matters, what can I do next?
- Compactness does not remove readable labels, focus visibility, keyboard order, or usable tap targets.

## 5. Route / Filter / Preview / Detail Decision Rule

Use this hierarchy during implementation:

- Use an in-place filter when the user is narrowing an existing list.
- Use preview or inline inspection when the user is inspecting before deciding.
- Use full Issue Detail route only for deep reading, broader context, or meaningful action.
- Use Edit route only when field changes are required.
- Use Project Detail route when project context is the user's active frame.
- Do not make every summary card a route jump. A summary card should first try to filter, preview, or focus the current work surface.

## 6. Compactness Guardrail

Do not solve density by hiding everything.

Critical information must remain visible:

- selected demo user / role
- current route/source context
- source-aware return destination
- primary action queue
- next safe action
- save/cancel controls on forms

Use collapses, tabs, or disclosures only for secondary information:

- charts
- long metadata
- activity history
- helper copy
- advanced form fields
- secondary project/team details

## 7. Sidebar and AppShell Boundary

The sidebar can support wayfinding, but it must not become a second dashboard.

Allowed in sidebar:

- primary navigation
- current section indication
- selected demo user / role
- concise My Work / Needs Update / Ready for Confirmation counters
- lightweight wayfinding cues

Not allowed in sidebar without separate explicit approval:

- full issue lists
- complex filters
- charts
- project metadata panels
- command palette behavior
- large dashboard/reporting blocks

AppShell compression is a support slice. It must not distract from the first priority: route return clarity.

## 8. Phase Status Board

| Phase | Name | Status | Primary risk addressed | Notes |
|---|---|---|---|---|
| 5.9A1 | Route Wayfinding and Return Context | Complete | User gets lost across deep routes | Implementation and self-audit passed |
| 5.9A2 | Compact AppShell and Header Compression | Complete | Shell/header duplication pushes work down | Implementation and self-audit passed |
| 5.9B | Dashboard Action-first Recomposition | Complete | Dashboard is report-first, not assistant-first | Implementation and self-audit passed |
| 5.9C | Project and Personal Density Pass | Next | Work lists appear too low | Uses patterns proven in Dashboard |
| 5.9D | Issue Detail and Form Compression | Pending | Issue/work forms feel like long documents | Depends on A1 return context |
| 5.9E | Mobile Survival Pass | Pending | Endless stacked mobile scrolling | Must happen after main layout changes |
| 5.9F | Final Compact UX Audit | Pending | Phase 6 readiness uncertainty | Audit-only |

## 9. Phase Dependency Map

- 5.9A1 must happen before Issue Detail/Form compression because return/source behavior affects deep pages.
- 5.9A2 may happen after or alongside A1, but it must not delay A1.
- 5.9B must happen before mobile survival because Dashboard order determines mobile stacking.
- 5.9C and 5.9D should happen after Dashboard because compact work-surface patterns should be proven on the primary assistant home first.
- 5.9E must happen after the major desktop/layout changes.
- 5.9F must remain audit-only.

Recommended order:

1. 5.9A1 - Route Wayfinding and Return Context
2. 5.9A2 - Compact AppShell and Header Compression
3. 5.9B - Dashboard Action-first Recomposition
4. 5.9C - Project and Personal Density Pass
5. 5.9D - Issue Detail and Form Compression
6. 5.9E - Mobile Survival Pass
7. 5.9F - Final Compact UX Audit

## 10. Micro-phase Execution Plan

### 5.9A1 - Route Wayfinding and Return Context

Goal:

Make every deep work route answer where the user is, where they came from, and how they return.

Scope:

- Improve source-aware return labels on Issue Detail/Edit.
- Add visible Back/Return controls where current flow relies too much on browser back.
- Clarify current-location context on Issue Detail, Issue Edit, Issue Create, Project Detail, and Teams.
- Preserve the existing route model and bounded route-state helper.
- Clarify Dashboard vs Personal return destinations when opening issues from either surface.

Exclusions:

- no AppShell redesign
- no route removal
- no `/personal` removal
- no backend/auth
- no command palette
- no global navigation-history framework

Likely files:

- `src/features/issues/issueNavigationState.ts`
- `src/features/issues/IssueDetailPage.tsx`
- `src/features/issues/IssueEditPage.tsx`
- `src/features/issues/IssueCreatePage.tsx`
- `src/features/projects/ProjectDetailPage.tsx`
- `src/features/teams/TeamsPage.tsx`
- issue links in Dashboard, Personal, Project Detail, and Teams

Acceptance criteria:

- Issue Detail/Edit always show a visible source-aware return destination.
- Deep routes expose a semantic Back/Return control.
- Dashboard -> Issue -> Edit -> return is predictable.
- Personal -> Issue -> Edit -> return is predictable.
- Project Detail -> Issue -> Edit -> return is predictable.
- Teams -> Issue -> return is predictable.
- No routes are added or removed.

Manual test:

- Manager: Dashboard -> Issue Detail -> Edit -> save/cancel -> return.
- Project Manager: Projects -> Project Detail -> Issue Detail -> Edit -> return.
- User: Personal -> confirmation issue -> return.
- Teams: Teams -> Issue Detail -> return.

Verification:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit:

- `feat: clarify route return context`

Risk level: Medium.

### 5.9A2 - Compact AppShell and Header Compression

Status: `Complete`

Goal:

Reduce repeated shell/page context without turning the sidebar into a second dashboard.

Scope:

- Compact AppShell topbar only where it supports wayfinding.
- Make selected user/role persistent but concise.
- Reduce duplicate Dashboard/Personal/page-header context.
- Move only lightweight counters/context into shell areas.

Exclusions:

- no broad AppShell redesign
- no sidebar issue lists
- no sidebar charts
- no complex sidebar filters
- no global create issue unless separately approved

Likely files:

- `src/app/layout/AppShell.tsx`
- `src/shared/constants/navigation.ts`
- `src/features/demo/DemoRoleSwitcher.tsx`
- page headers if duplicate context must be reduced

Acceptance criteria:

- Current role/user remains visible without consuming the main work area.
- Topbar/page header does not repeat the same context.
- Sidebar remains navigation-first.
- Mobile shell remains usable.

Manual test:

- Switch demo roles.
- Visit Dashboard, Personal, Projects, Project Detail, Issue Detail, Teams, Demo.
- Confirm current context is visible and the first work area starts earlier.

Verification:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit:

- `feat: compact app shell orientation`

Risk level: Medium.

### 5.9B - Dashboard Action-first Recomposition

Status: Complete. Implementation and self-audit passed.

Goal:

Make Dashboard behave like an assistant home rather than a reporting surface.

Scope:

- Move Operational Queue and filters above charts.
- Convert Assistant Home cards into filters, previews, or precise work-surface routes.
- Convert Workspace Risk cards into queue filters or top issue previews.
- Demote charts and metric cards.
- Preserve existing hooks/repositories/state boundaries.

Exclusions:

- no new data model
- no backend
- no notifications
- no workflow engine
- no saved dashboard/report system

Likely files:

- `src/features/dashboard/DashboardPage.tsx`
- `src/features/dashboard/DashboardCharts.tsx`
- `src/features/dashboard/useDashboardMetrics.ts`

Acceptance criteria:

- Operational Queue or first actionable rows are visible in the first desktop viewport.
- Charts do not appear above the main action queue.
- Summary cards either filter, preview, or route to a precise work surface.
- Dashboard supports action without unnecessary route-hopping.

Manual test:

- Filter blocked/delayed/Needs Update from Dashboard.
- Open or preview an issue.
- Return to Dashboard context.
- Switch role/user and confirm action cards still make sense.

Verification:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit:

- `feat: make dashboard action-first`

Risk level: Medium.

### 5.9C - Project and Personal Density Pass

Goal:

Make work lists visible earlier and reduce duplicate summary blocks.

Scope:

- Personal: prioritize Needs Update, Ready for Confirmation, and assigned/curated work over metric cards.
- Projects: compact project index and expose risk/action counts inline.
- Project Detail: show issue queue earlier, make filters a toolbar/disclosure, compact project metadata.

Exclusions:

- no project permissions
- no team workflow engine
- no new project data model
- no removal of `/personal`

Likely files:

- `src/features/personal/PersonalPage.tsx`
- `src/features/personal/usePersonalView.ts`
- `src/features/projects/ProjectsPage.tsx`
- `src/features/projects/ProjectDetailPage.tsx`
- project hooks

Acceptance criteria:

- Personal makes selected user's next work obvious in under 60 seconds.
- Project Detail shows issues in the first viewport.
- Projects remains a compact project chooser, not a reporting dashboard.
- Dashboard and Personal responsibilities are visually distinct.

Manual test:

- User finds Needs Update and Ready for Confirmation work from Personal.
- PM finds delayed/blocking project issues from Project Detail.
- Manager scans Projects without getting pulled into unrelated details.

Verification:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit:

- `feat: compact personal and project work surfaces`

Risk level: Medium.

### 5.9D - Issue Detail and Form Compression

Goal:

Turn Issue Detail/Edit/Create into focused work surfaces.

Scope:

- Issue Detail: title/status/source/action strip first.
- Compact metadata; collapse or demote long history/dependencies.
- Create/Edit: required fields first; advanced fields secondary.
- Keep save/cancel/return controls visible and predictable.

Exclusions:

- no comments
- no notification subscriptions
- no workflow automation
- no permissions
- no Jira-style expansion

Likely files:

- `src/features/issues/IssueDetailPage.tsx`
- `src/features/issues/IssueCreatePage.tsx`
- `src/features/issues/IssueEditPage.tsx`
- `src/features/issues/IssueFormFields.tsx`
- issue hooks

Acceptance criteria:

- Primary safe action is visible before deep scroll.
- Metadata/history does not dominate the work surface.
- Save/cancel/return behavior is clear on desktop and mobile.
- Form no longer feels like a long admin document for simple edits.

Manual test:

- Open Needs Update issue.
- Identify next safe action.
- Edit required fields.
- Save/cancel and return to source context.

Verification:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit:

- `feat: compact issue work and edit flows`

Risk level: Medium.

### 5.9E - Mobile Survival Pass

Goal:

Prevent endless stacked scrolling and hidden actions on small screens.

Scope:

- Dashboard mobile queue-first layout.
- Compact mobile headers.
- Sticky or persistent issue/form actions where needed.
- Filter disclosures/tabs where appropriate.
- Validate tap targets, focus order, and readable labels.

Exclusions:

- no separate mobile product
- no native app pattern rewrite
- no bottom navigation redesign unless separately approved
- no unrelated visual redesign

Likely files:

- `src/app/layout/AppShell.tsx`
- Dashboard feature files
- Personal feature files
- Projects feature files
- Issues feature files
- Teams feature files
- shared components/CSS touched by earlier phases

Acceptance criteria:

- Dashboard, Personal, Project Detail, Issue Detail, and forms are usable at mobile width.
- Mobile first viewport is not consumed entirely by headers/cards/filters.
- Primary action and current context remain discoverable.
- Compactness does not remove labels or keyboard accessibility.

Manual test:

- 375px mobile.
- 768px tablet.
- desktop.
- Keyboard tab through nav, filters, issue actions, and forms.

Verification:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit:

- `feat: improve compact mobile work flows`

Risk level: Medium-high.

### 5.9F - Final Compact UX Audit

Goal:

Verify the corrected MVP before Phase 6.

Scope:

- Repeat first-60-seconds test.
- Repeat Manager/Project Manager/User workflow traces.
- Repeat desktop/tablet/mobile checks.
- Verify no scope creep.
- Verify docs match implementation reality.

Exclusions:

- no new feature implementation
- no deployment work
- no release/portfolio polish beyond audit findings

Likely files:

- `APP_EXPERIENCE_PLAN.md`
- `design_review_V2.md` only if findings changed materially
- `changelog_checkpoint.md`
- `DEVELOPMENT_NOTES.md` only if a meaningful decision occurred

Acceptance criteria:

- No P0 findings remain.
- P1 findings are fixed or explicitly accepted as MVP debt.
- Dashboard is action-first.
- Route return context is clear.
- First viewport is useful on Dashboard, Personal, Project Detail, and Issue Detail.
- Mobile survival pass is complete.
- Final compact UX audit passes.

Manual test:

- Full Manager workflow.
- Full Project Manager workflow.
- Full User workflow.
- Mobile/tablet/desktop walkthrough.

Verification:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit:

- `docs: verify compact ux readiness`

Risk level: Low. This phase is audit-only.

## 11. Workflow Verification Matrix

Use this matrix after each implementation slice, scaled to the slice risk.

| Role | Dashboard | Personal | Projects | Project Detail | Issue Detail | Edit/Create | Teams | Demo role switch |
|---|---|---|---|---|---|---|---|---|
| Manager | Can I identify blocked/delayed/Needs Update work and act? | Is Personal clearly secondary to workspace triage? | Can I scan project risk compactly? | Can I recover project context? | Can I inspect without losing source? | Does save/cancel return predictably? | Is team context secondary and clear? | Does switching Manager perspective update work context? |
| Project Manager | Can I identify project-specific issues quickly? | Do curated/created/assigned groupings help? | Can I find the right project? | Are project issues visible before heavy scroll? | Can I understand owner/curator/status quickly? | Can I return to project context? | Can I see team context without route confusion? | Does selected PM context remain visible? |
| User | Can I see what belongs to me? | Can I find assigned, Needs Update, and Ready for Confirmation work? | Are Projects understandable but not required for my next action? | Can I understand issue context if I land here? | Can I act or confirm without guessing? | Does edit stay structured and recoverable? | Can I understand team work without getting lost? | Does role switching clearly change my work? |

Questions for every walkthrough:

- Do I know where I am?
- Do I know where I came from?
- Do I know how to return?
- Do I know what belongs to me?
- Do I know what needs update?
- Do I know what needs confirmation?
- Can I inspect without losing context?
- Can I act without reading the whole page?

Viewport checks:

- Desktop: first viewport utility, work queue priority, route context, action visibility.
- Tablet: wrapping, filters, nav, action groups.
- Mobile: nav clarity, first viewport, stacked-card burden, sticky actions, text overlap, tap targets.

## 12. Phase 6 Gate Checklist

Phase 6 may begin only when:

- No P0 findings remain.
- P1 findings are fixed or explicitly accepted as MVP debt.
- Dashboard is action-first.
- Route return context is clear on Issue Detail/Edit and other deep routes.
- First viewport is useful on Dashboard, Personal, Project Detail, and Issue Detail.
- Mobile survival pass is complete.
- Summary cards filter, preview, or route to precise work surfaces.
- Charts do not appear above the main action queue.
- Final compact UX audit passes.
- `npm run build`, `npm run typecheck`, and `npm run lint` pass after implementation slices.
- `APP_EXPERIENCE_PLAN.md`, `changelog_checkpoint.md`, and `DEVELOPMENT_NOTES.md` reflect the final Phase 5.9 state where applicable.

If any P0 remains, Phase 6 is blocked. If any P1 remains, it must be explicitly accepted as MVP debt before Phase 6.

## 13. Documentation Rules During Phase 5.9

- Update this file when a micro-phase status changes.
- Update `changelog_checkpoint.md` after implementation/audit handoff work.
- Update `DEVELOPMENT_NOTES.md` only for meaningful implementation decisions or architecture/product constraints.
- Do not edit frozen docs in `docs/` unless separately approved.
- Do not edit README for Phase 5.9 unless separately approved.
- Do not commit or push without explicit approval.

## 14. Prompt Workflow Templates

### Next-step report prompt

Read `changelog_checkpoint.md`, `BUILD_PLAN.md`, `APP_EXPERIENCE_PLAN.md`, `design_review_V2.md`, and relevant source files for `{MICRO_PHASE}` only. Report scope, exclusions, likely files, acceptance criteria, verification commands, and proposed commit. Do not edit files.

### Implementation approval prompt

Approved. Proceed to `{MICRO_PHASE}` only. Implement the approved scope, preserve local-first boundaries, avoid MVP scope creep, run verification, report changes, and do not commit.

### Self-audit prompt

Audit `{MICRO_PHASE}` against `design_review_V2.md`, this plan, accessibility, mobile risk, local-first architecture, MVP scope, and verification results. Update handoff docs only if needed. Do not commit.

### Git checkpoint prompt

Run `git status --short`, `git diff --stat`, and targeted diffs for changed files. Report changed files, verification results, docs status, source-code status, and proposed commit. Do not commit.

### Commit approval prompt

Approved. Commit and push with the approved message. Report commit hash, branch, and final status.

## 15. Next Concrete Step

Next phase: **5.9C - Project and Personal Density Pass**

Recommended implementation prompt:

```text
Implement Phase 5.9C only. Make Personal prioritize Needs Update, Ready for Confirmation, and assigned/curated work over metric cards; make Projects a compact project chooser with risk/action counts inline; and make Project Detail show the issue queue earlier while compacting filters/project metadata. Preserve Dashboard 5.9B behavior, 5.9A1 return context, 5.9A2 AppShell compression, HashRouter, /personal, local-first boundaries, and system-label semantics. Do not implement Issue/Form compression, mobile survival pass, backend/auth/notifications/workflow engine, project permissions, team workflow engine, new project model, route removal, or Phase 6 work. Do not commit or push.
```

Suggested commit for completed 5.9B after audit/checkpoint approval:

```text
feat: make dashboard action-first
```
