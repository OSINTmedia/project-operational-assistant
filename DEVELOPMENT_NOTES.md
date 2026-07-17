# Development Notes

## Purpose

This file captures implementation decisions, trade-offs, lessons learned, problems encountered, and reasoning that should not clutter README.md.

---

## Decision Log

### 2026-07-17 — Keep Phase 5.9C as a work-surface density pass

**Context:**
`Phase 5.9C` needed to make Personal, Projects, and Project Detail show useful work earlier without starting Issue/Form compression, mobile survival work, or a broader navigation redesign.

**Decision:**
Reorder and compress existing presentation surfaces only. Personal now prioritizes Needs Update, Ready for Confirmation, assigned, and curated work before monitoring-only created work. Projects now behaves more like a compact chooser with inline risk/action counts. Project Detail now places the issue queue directly after a compressed project context header and compact filter toolbar.

**Reasoning:**
The problem was first-viewport usefulness and duplicated summary weight, not missing data or workflow capability. Existing hooks already expose enough counts and issue summaries, so the correction can stay in page composition and Tailwind density changes while keeping data access behind repositories/hooks.

**Alternatives considered:**
Adding project-level permissions, adding new project risk models, moving project context into AppShell, adding a drawer/table framework, or beginning Issue Detail/Form compression during the same slice.

**Impact:**
5.9C improves Personal and project work-surface density while preserving `HashRouter`, existing routes, `/personal`, 5.9A1 return behavior, 5.9A2 AppShell compression, 5.9B Dashboard behavior, local-first architecture, repository/domain separation, and system-label semantics. No backend, auth, notifications, workflow engine, project permissions, team workflow engine, data model, persistence, repository, or route-tree changes were introduced.

### 2026-07-17 — Keep Phase 5.9B as Dashboard-local action filtering

**Context:**
`Phase 5.9B` needed to make Dashboard start with actionable work instead of static reporting, while preserving the route model, local-first boundaries, and the already completed 5.9A1/5.9A2 navigation and shell corrections.

**Decision:**
Move the Operational Queue above metrics, charts, and explainer content, and convert selected-user action cards plus workspace risk cards into Dashboard-local queue preset buttons. The queue presets filter existing Dashboard issue summaries in place for assigned, curated, needs-update, confirmation, blocked, delayed, and workspace Needs Update views.

**Reasoning:**
The problem was Dashboard composition and actionability, not missing product scope. Local queue presets reduce route-hopping and make summary cards useful without adding saved reports, notification behavior, workflow rules, new routes, or backend state. Extending the Dashboard read model with existing issue fields keeps filtering inside the existing hook/view boundary instead of reaching into persistence from the UI.

**Alternatives considered:**
Adding saved dashboard filters, adding a new report/dashboard model, routing each card to a separate page, adding a drawer/modal framework, or delaying actionability until the Project/Personal density pass.

**Impact:**
5.9B makes Dashboard more action-first while preserving `HashRouter`, existing routes, `/personal`, 5.9A1 return behavior, 5.9A2 AppShell compression, local-first architecture, repository/domain separation, and system-label semantics. No backend, auth, notifications, workflow engine, data model, persistence, repository, or route-tree changes were introduced.

### 2026-07-17 — Keep Phase 5.9A2 as AppShell compression only

**Context:**
`Phase 5.9A2` needed to reduce repeated shell/topbar context and reclaim first-viewport space without starting Dashboard recomposition or a broader layout redesign.

**Decision:**
Compact the existing AppShell instead of redesigning navigation. The main topbar now uses a shorter selected-user/status row, the duplicated Dashboard/Personal quick-link block was removed from the topbar, sidebar shell spacing was tightened, and sidebar demo-perspective copy was shortened.

**Reasoning:**
Dashboard and Personal already exist in primary navigation, so repeating them as large topbar actions consumed vertical space without improving wayfinding. A smaller persistent current-user/status row keeps orientation visible while moving real work higher in the viewport. This stays inside the approved AppShell/header slice and avoids changing route behavior or page-level workflows.

**Alternatives considered:**
Adding sidebar counters, adding a global create issue action, moving more project/work state into the shell, creating a new mobile navigation pattern, or starting Dashboard action-first recomposition.

**Impact:**
5.9A2 improves shell density while preserving `HashRouter`, existing routes, `/personal`, 5.9A1 return behavior, local-first boundaries, repository/domain separation, and system-label semantics. No backend, auth, notifications, workflow engine, data model, persistence, repository, or route-tree changes were introduced.

### 2026-07-17 — Keep Phase 5.9A1 as route-context clarification only

**Context:**
`Phase 5.9A1` needed to make deep routes answer where the user is, where they came from, how to return, and what happens after edit/save/cancel.

**Decision:**
Improve the existing React Router state flow and visible link/copy affordances rather than adding a new navigation framework. Dashboard, Personal, Project Detail, and Team Workspace now pass clearer source labels into Issue Detail. Issue Detail and Issue Edit now explain the source/project context and edit save/cancel behavior more explicitly. Issue Create cancel/submit behavior now targets the selected project context consistently.

**Reasoning:**
The existing `issueNavigationState.ts` helper already provided a bounded source-aware return model. The problem was mostly visible clarity and destination wording, not missing architecture. Small link/copy improvements address the approved wayfinding pain with lower risk than query-string contracts, global navigation history, AppShell changes, or route redesign.

**Alternatives considered:**
Adding a global navigation stack, moving route context into AppShell, starting Dashboard recomposition, or adding URL query contracts for return state.

**Impact:**
5.9A1 improves deep-route wayfinding while preserving `HashRouter`, existing routes, `/personal`, local-first boundaries, repository/domain separation, and system-label semantics. No backend, auth, notifications, workflow engine, data model, persistence, repository, or route-tree changes were introduced.

### 2026-07-17 — Promote Phase 5.9 as the active corrective UX roadmap

**Context:**
`BUILD_PLAN.md`, `changelog_checkpoint.md`, and `README.md` still described `Phase 5.8F — Final App Experience Audit` as the next step because those docs were written before the deeper `design_review_V2.md` audit and the rewritten `APP_EXPERIENCE_PLAN.md`.

**Decision:**
Treat the core MVP as built and portfolio-polished, then continue with `Phase 5.9 — Compact Assistant UX and Actionability Refinement` before Phase 6. The next implementation slice is `Phase 5.9A1 — Route Wayfinding and Return Context`. `design_review_V2.md` is the current UX diagnosis, and `APP_EXPERIENCE_PLAN.md` is the active Phase 5.9 execution plan.

**Reasoning:**
The newer review reframed the remaining problem as route-hopping, unclear return context, weak first viewport, static summaries, visual density, and mobile risk. Running a final Phase 5.8 audit would not address those P0/P1 issues. Phase 5.9 keeps the work bounded while aligning docs around the actual next correction.

**Alternatives considered:**
Proceeding with `Phase 5.8F`, editing only `APP_EXPERIENCE_PLAN.md`, or moving directly to Phase 6.

**Impact:**
Project documentation now speaks one active roadmap: Phase 5.9 corrective UX work first, Phase 6 later. No source code, frozen docs, backend/auth behavior, notification behavior, workflow engine, data model, route removal, or `/personal` removal was introduced by this documentation sync.

### 2026-07-15 — Keep Phase 5.8E responsive pass as targeted layout repair

**Context:**
`Phase 5.8E` needed to validate mobile and tablet usability after assistant-home, context-header, source-aware return, and inline-preview changes increased screen density.

**Decision:**
Use small presentation-layer layout refinements: safer badge and breadcrumb wrapping, full-width mobile preview/action links, tablet two-column form fields, checkbox alignment, quick-action label wrapping, and Team Workspace tap-target improvements. Do not add collapsible form sections, a mobile drawer, a new preview framework, or a broader dashboard/app redesign in this slice.

**Reasoning:**
The approved problem was responsive working-layout comfort, not new interaction behavior. The current screens could be made more robust with low-risk class changes while preserving existing routes, data flow, domain behavior, and accessibility expectations around visible actions.

**Alternatives considered:**
Adding collapsible mobile filters, adding advanced-field collapse to forms, introducing a mobile drawer, or redesigning dense screens more broadly.

**Impact:**
Phase 5.8E improves smaller-screen readability and action comfort without changing the domain model, persistence schema, repository boundaries, routing, authentication model, notification behavior, employee-scoring semantics, or system-label treatment.

### 2026-07-15 — Keep Dashboard queue preview local

**Context:**
`Phase 5.8D2` needed to reduce Dashboard queue route-hopping after the Project Detail preview pattern had already proved useful.

**Decision:**
Add a Dashboard-local inline preview on queue issue cards and extend only the Dashboard read model with preview fields. Do not introduce a shared preview component, drawer/modal framework, saved filters, command palette, or global issue-list route in this slice.

**Reasoning:**
The approved problem was lightweight Dashboard inspection, not a broader interaction-system rewrite. A local inline preview preserves Dashboard filters and selected-user context with lower accessibility and architecture risk than a drawer framework or shared abstraction.

**Alternatives considered:**
Reusing the Project Detail preview as a shared component, adding a dashboard drawer, replacing Dashboard queue navigation with a global issue list, or waiting for the responsive pass.

**Impact:**
Dashboard issue inspection is faster while full Issue Detail remains available for activity history and deep work. The route tree, local-first repository boundaries, system-label semantics, and MVP scope remain unchanged.

### 2026-07-15 — Use scoped inline preview before drawer framework

**Context:**
`Phase 5.8D1` needed to reduce Project Detail route-hopping for lightweight issue inspection without starting the broader `Phase 5.8D` interaction-pattern pass.

**Decision:**
Use one Project Detail inline preview pattern on issue cards and keep `Open full issue` as the deep-work route. Extend only the Project Detail read model with preview fields already available through existing repository-backed reads.

**Reasoning:**
Inline expansion solves the approved `F-04` design-review finding with lower accessibility and architecture risk than introducing a drawer/modal framework. It preserves project filters and context during lightweight inspection while leaving activity history, edit flow, and structured issue actions on the full Issue Detail route.

**Alternatives considered:**
Adding a reusable drawer framework, replacing Issue Detail with previews, adding Dashboard/Team previews in the same slice, or preserving full Project Detail filter state through route/query contracts.

**Impact:**
Project Detail now supports context-preserving issue inspection without changing routes, repositories, persistence schema, domain models, authentication, permissions, notifications, workflow behavior, or system-label semantics.

### 2026-07-15 — Use route-local state for source-aware issue return context

**Context:**
`Phase 5.8C2` needed to fix Dashboard, Personal, Team Workspace, and Project Detail issue flows losing their origin after users drilled into Issue Detail and Edit.

**Decision:**
Use a small feature-local issue navigation-state helper around React Router `location.state`. Source issue links pass a validated `issueReturnContext` into Issue Detail, Issue Detail forwards that context into Issue Edit, and non-project-origin edit saves return to Issue Detail with the original source preserved as the back path. Project-origin flows still return to Project Detail.

**Reasoning:**
Route-local state solves the approved context-recovery problem without adding global navigation history, saved filters, URL query contracts, router replacement, persistence changes, or a workflow engine. Direct refresh or missing state safely falls back to Project Detail context.

**Alternatives considered:**
Adding a global navigation store, encoding source context in query parameters, preserving full Dashboard/Project filter state, or waiting for the later preview/drawer slice.

**Impact:**
List-to-detail-to-edit flows are more predictable for Dashboard, Personal, Teams, and Project Detail while the route tree, domain model, repository boundaries, local-first persistence, and MVP exclusions remain unchanged.

### 2026-07-15 — Keep context breadcrumbs static before return-flow logic

**Context:**
`Phase 5.8C1` needed to reduce "where am I?" confusion on Project Detail, Issue Detail, Issue Create, Issue Edit, and Team Workspace before the broader source-aware return-flow slice.

**Decision:**
Add a small presentational `ContextBreadcrumbs` component and use already-loaded route/read-model context for static breadcrumbs and clearer back labels. Do not introduce source-aware origin state, a global navigation history model, router changes, drawer/modal behavior, or edit-save return changes in this slice.

**Reasoning:**
Static route context solves the first orientation problem with low architecture risk. Source-aware return behavior is more complex and belongs in `Phase 5.8C2`, where Dashboard, Personal, Teams, Project Detail, Issue Detail, and Issue Edit flows can be handled deliberately.

**Alternatives considered:**
Bundling breadcrumbs and source-aware return behavior together, adding a global route-origin store, or waiting for drawer/preview work before improving route-level orientation.

**Impact:**
Deep screens now explain their project, issue, edit, create, or team context without changing persistence, domain models, repositories, routes, or save behavior.

### 2026-07-15 — Keep AppShell selected-user orientation presentational

**Context:**
`Phase 5.8B2` needed the global shell to make the active demo user and role obvious from every main route, while preserving the Portfolio MVP constraint that demo identity is not real authentication or permissions.

**Decision:**
Use existing app state to show the current demo user, role, and compact Dashboard / Personal orientation links in the AppShell header. Keep the local/no-sign-in note visible but less dominant, and do not add a new user picker, permission layer, route behavior, drawer, modal, or navigation framework.

**Reasoning:**
This addresses the design review finding that topbar space was used for lifecycle/auth-scope messaging instead of operational context. It improves selected-user orientation without changing domain models, repositories, persistence, routing, or role semantics.

**Alternatives considered:**
Keeping the lifecycle/auth exclusion as the primary header content, adding a broader AppShell redesign, or introducing auth-like account controls.

**Impact:**
The selected demo perspective is now visible across routes, but role switching remains local demo state only. Deeper context headers, source-aware return flows, and route-hopping reductions remain separate Phase 5.8 slices.

### 2026-07-15 — Keep Dashboard assistant action counts read-model only

**Context:**
`Phase 5.8B1` needed the Dashboard to answer what matters for the selected demo user without adding real permissions, notifications, workflow behavior, or employee scoring.

**Decision:**
Add selected-user action counts to the Dashboard read model only:
open assigned issues, open curated issues, related `Needs Update` issues, and pending `Ready for Confirmation` items targeted at the selected user. Keep separate workspace-risk counts for blocked, delayed, and workspace-wide `Needs Update` issues.

**Reasoning:**
This makes Dashboard feel more like an assistant home while preserving the existing local-first architecture and system-label semantics. It also keeps personal next actions separate from workspace risk visibility so the UI does not imply performance scoring.

**Alternatives considered:**
Adding new notification-like queues, adding list-level quick actions, changing confirmation into a status, or introducing real role permissions.

**Impact:**
The Dashboard now surfaces selected-user action clarity before broader AppShell, navigation, drawer, preview, or route-hopping work. No persistence schema, domain model, route, backend, auth, or notification behavior changed.

### 2026-07-15 — Split Phase 5.8B before implementation

**Context:**
`Phase 5.8A` produced an accepted code-first design review. The review found that the app is functionally complete and coherent, but the first user-experience gap is weak selected-user next-action clarity rather than the absence of drawers or modals.

**Decision:**
Split `Phase 5.8B — Assistant Home and Role-aware Action Clarity` into `Phase 5.8B1 — Dashboard Assistant Home and Selected-user Action Summary` and `Phase 5.8B2 — AppShell Selected-user Orientation`.

**Reasoning:**
The Dashboard should first answer what matters for the selected demo user now. Drawer, modal, preview, and route-hopping reductions should come later, after the app clearly surfaces selected-user responsibilities, needs-update work, confirmation-needed work, and workspace risks.

**Alternatives considered:**
Start with drawer/preview patterns, keep `Phase 5.8B` as one broad implementation slice, or proceed directly to navigation/context recovery before clarifying the assistant home.

**Impact:**
Phase 5.8 now starts with a narrow Dashboard action-summary slice that improves assistant behavior without changing MVP scope, authentication constraints, permissions, notifications, or the project/issue data model.

### 2026-07-14 — Add app-experience refinement before final QA

**Context:**
After completing feature surfaces, dashboard work, and portfolio polish, the app is functionally coherent but still feels too page-hop heavy and not assistant-like enough for a public demo.

**Decision:**
Insert `Phase 5.8` before `Phase 6` to improve navigation, role-aware workflow clarity, interaction comfort, context recovery, and responsive usability before final testing and deployment.

**Reasoning:**
This reflects natural product development: once the full app exists, UX/IA problems become visible. Addressing them before final QA is safer than shipping a technically complete but uncomfortable demo.

**Alternatives considered:**
Proceed directly to `Phase 6`, defer all UX/navigation issues post-MVP, or start a broad redesign.

**Impact:**
The roadmap now includes a controlled, scoped app-experience refinement phase that improves usability without changing MVP scope, backend/auth constraints, or core data model.

### 2026-07-14 — Keep Phase 5.5 visual polish presentation-only

**Context:**
`Phase 5.5` required dashboard screenshot readiness, badge/card/table visual consistency, and calm SaaS polish without changing product scope.

**Decision:**
Add one small shared `Badge` presentation component and replace repeated ad hoc badge markup across existing screens instead of redesigning the UI system, adding new interaction behavior, or changing issue/status data semantics.

**Reasoning:**
Badges are visible across Dashboard, Demo, Projects, Project Detail, Personal, Issue Detail, and Team Workspace. Centralizing their visual treatment improves portfolio consistency while keeping the slice limited to presentation code.

**Alternatives considered:**
Creating a broader component library, restyling the full app shell, or introducing new card/table abstractions during the visual polish pass.

**Impact:**
Phase 5.5 improves screenshot readiness without changing routes, repositories, persistence, domain rules, or the separation between statuses, tags, labels, and system labels.

### 2026-07-14 — Keep responsive polish inside existing navigation and screen structure

**Context:**
`Phase 5.4` required responsive layout polish for sidebar/topbar behavior, tables/cards, and mobile/tablet readability without changing information architecture.

**Decision:**
Polish the existing app shell and screen layouts with responsive spacing, wrapping, full-width mobile controls, and horizontal mobile navigation instead of adding a new mobile drawer, new route structure, or mobile-only workflows.

**Reasoning:**
This keeps the slice focused on demo readability and avoids turning a responsive pass into an information-architecture redesign. The existing route model remains easier to audit for GitHub Pages and portfolio demo behavior.

**Alternatives considered:**
Adding a collapsible mobile drawer, changing the sidebar into a new top-level mobile navigation pattern, or redesigning dense screens into separate mobile-specific views.

**Impact:**
Phase 5.4 improved mobile and tablet usability while preserving existing domain, repository, route, and workflow boundaries. Broader visual consistency was left for the following `Phase 5.5` slice.

### 2026-07-14 — Keep Phase 5.3 quick actions on Issue Detail only

**Context:**
`Phase 5.3` calls for quick status actions, ownership/action affordances, and clear disabled states, while the existing app already has structured edit behavior for owner and curator changes.

**Decision:**
Add quick actions only to Issue Detail for common status and confirmation updates, and keep owner/curator changes as a clear shortcut into the existing structured edit form instead of duplicating responsibility mutations inline.

**Reasoning:**
Issue Detail is the safest action surface because it already shows full issue context and activity history. Reusing existing domain operations keeps updates activity-safe, while routing responsibility changes through the edit form avoids widening a polish slice into a second ownership-transfer UI.

**Alternatives considered:**
Adding quick actions to project lists, adding inline owner/curator selectors, or creating a broader global action menu.

**Impact:**
Phase 5.3 improves operational action speed without adding new workflow types, notifications, or route contracts. Broader list-level actions remain deferred unless a later roadmap slice explicitly requires them.

### 2026-07-14 — Keep Phase 5.2 search local to existing list surfaces

**Context:**  
`Phase 5.2` calls for basic search and filter polish, while the current app still does not have a dedicated global issue-list route or shared query model.

**Decision:**  
Add local search to the Dashboard operational queue and Project Detail issue list, and keep it composed with each screen's existing structured filters instead of introducing shared search infrastructure or saved filter state.

**Reasoning:**  
This improves demo scanability while staying inside the approved polish slice. It avoids turning a UI clarity task into a broader information architecture, route, or persistence feature.

**Alternatives considered:**  
Adding a global issue search route, building a reusable query engine, or storing saved filter/search state.

**Impact:**  
Phase 5.2 improves findability on the two active issue-list surfaces without creating new route contracts or changing repository/domain boundaries. Broader search architecture remains deferred unless a later roadmap slice explicitly requires it.

### 2026-07-14 — Keep dashboard click-throughs on existing issue and project routes

**Context:**  
`Phase 4.5` requires dashboard filters and click-through behavior, but the current app does not yet have a dedicated global issue-list route that can accept dashboard-origin filters without widening route scope or adding a new list surface.

**Decision:**  
Use the existing project list, project detail, and issue detail routes as the first dashboard click-through targets, and keep the filtered queue local to the dashboard instead of inventing a new cross-app issue-list route in the same slice.

**Reasoning:**  
This satisfies the approved navigation intent, stays inside current routing boundaries, and avoids turning a narrow dashboard-actionability slice into a broader navigation or list-architecture redesign.

**Alternatives considered:**  
Adding a new global issue-list route, or delaying dashboard click-through behavior until such a route existed.

**Impact:**  
`Phase 4.5` now makes the dashboard actionable without introducing new route contracts, while future list-surface expansion remains available only if a later roadmap slice explicitly requires it.

### 2026-07-14 — Keep owner distribution data-ready but out of the first chart slice

**Context:**  
`Phase 4.3` prepared dashboard distribution data for status, priority, project, and owner, while `Phase 4.4` in the roadmap narrows the first visual chart slice to readable `status / priority / project` charts.

**Decision:**  
Render charts for status, priority, and project in `Phase 4.4`, but leave owner distribution data unrendered and available through the existing dashboard hook for later use.

**Reasoning:**  
This matches the approved roadmap scope, keeps the first chart surface readable for portfolio screenshots, and avoids widening the dashboard into a denser reporting layout before filters and click-through behavior exist.

**Alternatives considered:**  
Rendering a fourth owner chart immediately, or dropping owner distribution preparation from the hook until a later phase.

**Impact:**  
`Phase 4.4` stays visually complete enough for the portfolio dashboard without pulling later dashboard density and interaction decisions forward.

### 2026-07-10 — Resolve dashboard needs-update metrics from persisted system labels

**Context:**  
`Phase 4.1` requires dashboard metric calculations in the domain layer, including a `needs update` count, while the current codebase already stores system labels with persisted ids that do not match the exported shared system-label ids.

**Decision:**  
Calculate `needs update` metrics by resolving the persisted `Needs Update` system label record by `type === 'system'` and name, then count issues carrying that persisted label id.

**Reasoning:**  
This matches the current domain behavior in attention logic, keeps the metrics slice aligned with the actual local-first data model, and avoids introducing a second conflicting interpretation of system-label identity just for dashboard counts.

**Alternatives considered:**  
Hard-coding the exported shared `needs-update` id in dashboard metrics, or recomputing stale-state freshness directly in the metrics layer.

**Impact:**  
`Phase 4.1` remains a narrow domain-calculation slice, and later dashboard UI work can consume stable metrics based on the same persisted system-label semantics already used elsewhere in the app.

### 2026-07-10 — Treat checkpoint docs as the live workflow source of truth

**Context:**  
After closing `Phase 3.8`, the live handoff and roadmap status metadata needed to stay unambiguous for fresh Codex chats, while older completed sections and the public README still contained historical phrasing that could mislead phase selection.

**Decision:**  
Make `changelog_checkpoint.md` the explicit live handoff source of truth, keep `BUILD_PLAN.md` as the roadmap/scope source, treat frozen docs as context only, and limit README status language to high-level presentation rather than implementation guidance.

**Reasoning:**  
The project now has enough phase history that historical roadmap wording and public-facing summaries can be mistaken for current execution state. A small documentation-governance rule is cheaper and safer than repeatedly rewriting old sections or trusting README status text.

**Alternatives considered:**  
Rewriting older completed roadmap sections wholesale, or leaving the hierarchy implicit and relying on prompt discipline alone.

**Impact:**  
Future chats can identify the current umbrella phase, latest completed micro-phase, and next concrete micro-phase without confusing frozen context or public README copy for the live implementation state.

### 2026-07-10 — Start Phase 4 metrics without a separate Phase 3 blocker-fix detour

**Context:**  
`Phase 3.8` audited the live codebase route-by-route and boundary-by-boundary before dashboard work, with a specific goal of deciding whether any screen-layer defects or architecture issues truly block `Phase 4.1`.

**Decision:**  
Treat the remaining Phase 3 issues as non-blocking debt and move directly into `Phase 4.1`, rather than spending an extra slice on pre-dashboard cleanup.

**Reasoning:**  
The implemented screens compile, lint, and hold their repository/state boundaries. The remaining issues are localized MVP limitations, such as the invalid create-route fallback and some navigation rough edges, but they do not prevent metric calculations from being defined cleanly in the domain layer.

**Alternatives considered:**  
Pausing for a small blocker-fix task before dashboard work, or widening `Phase 3.8` into a general polish pass.

**Impact:**  
The next slice can focus narrowly on dashboard metric calculations without reopening screen-scope work unless a concrete metric implementation exposes a real dependency gap.

### 2026-07-10 — Keep Team Workspace on the existing `/teams` route as a lightweight multi-team view

**Context:**  
`Phase 3.7` required a Team Workspace surface for team members, team issues, group issues, and team-level status summary, while the technical planning and router structure only defined a `/teams` route rather than a dedicated `/teams/:teamId` drill-in route.

**Decision:**  
Implement the first Team Workspace slice as a read-only multi-team overview on `/teams`, and prioritize the current demo user's team first instead of expanding the route model or adding team-management behavior in the same slice.

**Reasoning:**  
This stays inside the approved scope, keeps the feature aligned with the existing router contract, and avoids turning a visibility slice into a navigation, permissions, or organization-structure redesign.

**Alternatives considered:**  
Adding a new `/teams/:teamId` route immediately, or narrowing the page to only one current-user team and hiding the rest of the seeded team data.

**Impact:**  
`Phase 3.7` now provides usable team-level visibility without org-management drift, while future route refinement remains available only if a later roadmap slice explicitly requires it.

### 2026-07-07 — Save issue edits through one narrow orchestration helper

**Context:**  
`Phase 3.5D` needed to persist edit-form changes and preserve activity history behavior without turning the feature layer into a direct persistence client or rewriting the existing split issue-update helpers into one broad mutation service.

**Decision:**  
Add one narrow domain helper that orchestrates edit-save behavior by combining direct issue-record updates only where necessary with the existing focused domain operations for status, priority, owner, curator, tag, and label changes, while preserving read-only system labels during save.

**Reasoning:**  
The existing domain layer already has strong focused helpers for several structured changes. Reusing them keeps history behavior and business rules coherent, while a small orchestration helper avoids duplicating update logic in the UI and avoids forcing a broad repository or domain refactor just to support one edit surface.

**Alternatives considered:**  
Saving directly from the feature page with multiple repository calls, or collapsing all issue-update behavior into a new monolithic update service before `Phase 3.5E`.

**Impact:**  
`Phase 3.5D` now saves structured issue edits through repository/domain boundaries, preserves `Needs Update` and `Ready for Confirmation` as system labels, and leaves deeper activity-history/UI refinement for later slices.

### 2026-07-07 — Reuse one structured form surface for create and edit prefill

**Context:**  
`Phase 3.5C` required an edit route and persisted-field prefill without enabling save behavior yet, while `Phase 3.5A` and `3.5B` had already established a structured create form with the correct open-text boundary.

**Decision:**  
Extract the shared issue form controls into one reusable feature component, use that component in both create and edit surfaces, and expose the first edit entry narrowly from the existing Issue Detail placeholder route.

**Reasoning:**  
This keeps create and edit field structure aligned, avoids duplicating structured control logic before save behavior exists, and introduces the smallest coherent edit entry without expanding the placeholder Issue Detail route into a broader workflow surface.

**Alternatives considered:**  
Building a second standalone edit form, or waiting to expose any edit entry until save behavior was implemented.

**Impact:**  
`Phase 3.5C` now verifies route handling and persisted-field prefill against the same structured controls used by create, while save behavior and broader edit-entry UX remain deferred to later slices.

### 2026-07-07 — Keep issue creation submit project-scoped and reuse the existing create service

**Context:**  
`Phase 3.5B` required wiring the existing create-form shell to local persistence and activity history without expanding into edit mode, Issue Detail, or broader navigation patterns.

**Decision:**  
Submit the create form through the existing domain `createIssue` path, carry `teamId` from the selected project option in the feature read-model, and return the user to the originating Project Detail route after a successful create.

**Reasoning:**  
This keeps writes inside repository/domain boundaries, avoids a UI-side project lookup or direct persistence shortcut at submit time, and uses the already-established project context to make post-create visibility obvious in the project issue list.

**Alternatives considered:**  
Re-querying project data inside submit handling, adding a broader global post-create redirect decision now, or combining create wiring with edit-route work.

**Impact:**  
`Phase 3.5B` now completes the create path with a narrow project-scoped flow, while edit-mode routing and broader create-entry/navigation behavior remain deferred to later `Phase 3.5` slices.

### 2026-07-07 — Start issue creation from project context first

**Context:**  
`Phase 3.5A` required only the create-form UI shell and explicitly preferred a Create Issue entry point from Project Detail when current project context was available.

**Decision:**  
Start the first create-form shell from Project Detail and use a dedicated create route scoped by `projectId`, rather than introducing a broader global create entry at the same time.

**Reasoning:**  
Project-scoped entry keeps defaults understandable, reduces ambiguity around initial project selection, and lets the form shell stay small without pulling broader navigation or workflow decisions into the first create slice.

**Alternatives considered:**  
Adding a global create entry from the top-level app shell or Projects list immediately, or waiting to expose any entry point until submit wiring existed.

**Impact:**  
`Phase 3.5A` now validates the issue-create shell against a coherent project context, while broader create entry surfaces remain available for later slices only if the roadmap needs them.

### 2026-07-07 — Split Phase 3.5 before implementation

**Context:**  
The original `Phase 3.5 — Issue Create/Edit Form` combined create-form UI, edit-form UI, validation, persistence wiring, domain-service integration, and activity-history verification in one roadmap slice, while the surrounding roadmap still separately defers full Issue Detail work.

**Decision:**  
Split `Phase 3.5` into `3.5A — Create Issue Form UI Shell Only`, `3.5B — Wire Create Issue to Domain Service`, `3.5C — Edit Issue Form Route and Prefill`, `3.5D — Save Edit Changes and Verify History`, and `3.5E — Final Form Validation, Empty States, and Self-Audit` before implementation begins.

**Reasoning:**  
Create/edit work combines enough UI, validation, persistence, and domain-service behavior that one large slice would be prone to scope creep and accidental Issue Detail implementation. Smaller form-focused slices keep each checkpoint reviewable and easier to audit.

**Alternatives considered:**  
Implementing the full create/edit flow in one task, or splitting only after the first implementation exposed the pressure in code.

**Impact:**  
`Phase 3.5` can now proceed through smaller commits that keep create-shell UI, create wiring, edit prefill, edit save behavior, and final validation/audit as separate scoped tasks.

### 2026-07-07 — Keep Project Detail filters lightweight and local

**Context:**  
`Phase 3.4C` allowed lightweight structured filters only if they were still needed after the read-only Project Detail shell and issue list were already in place, while the slice explicitly excluded broader table-engine work and workflow actions.

**Decision:**  
Add only small local filters for status, priority, type, and attention labels directly in the Project Detail screen, and avoid introducing shared filtering infrastructure or wider query abstractions in this slice.

**Reasoning:**  
The current Project Detail list needed a modest readability improvement and a distinct filtered-empty state, but not a broader reusable filtering system. Keeping the behavior local closes `Phase 3.4` cleanly without pulling later table/list complexity forward.

**Alternatives considered:**  
Leaving the screen unfiltered, or introducing a shared filter framework before any broader cross-screen requirement actually existed.

**Impact:**  
`Phase 3.4` now closes with coherent local filtering and cleanup, while wider list/query infrastructure remains available for a later slice only if the roadmap genuinely requires it.

### 2026-07-06 — Split Phase 3.4 before implementation

**Context:**  
The original `Phase 3.4 — Project Detail View` combined project header/context, project summary counts, project issue rendering, and basic structured filters in one roadmap slice, while the surrounding phases separately defer Issue Create/Edit and Issue Detail work.

**Decision:**  
Split `Phase 3.4` into `3.4A — Project Detail Header and Summary`, `3.4B — Read-only Project Issue List`, and `3.4C — Basic Structured Filters, Empty States, and Audit Cleanup` before implementation begins.

**Reasoning:**  
This keeps the next implementation task small enough to stay read-only and route-focused, reduces the risk of accidental drift into Issue Detail or Issue Create/Edit scope, and makes the filter work explicitly optional until the simpler detail surface exists.

**Alternatives considered:**  
Implementing the entire Project Detail surface as one task, or deferring the split until after partial implementation exposed the scope pressure in code.

**Impact:**  
The live roadmap and handoff now make `3.4A` the next concrete implementation slice, with clearer exclusions around issue actions, mutation workflows, and broader filtering complexity.

### 2026-07-06 — Keep Projects list globally visible and summaries screen-scoped

**Context:**  
`Phase 3.3` required a project list, project summary cards or table, and basic project navigation, while the slice explicitly excluded project detail work, create/edit flows, and broader access-control behavior.

**Decision:**  
Keep the Projects screen globally visible across demo roles in this slice, derive project summaries in a small screen-scoped read-model hook, and avoid introducing team-scoped project hiding or role-based access semantics.

**Reasoning:**  
The roadmap defines `Phase 3.3` as a navigation and summary surface, not an access-control slice. Using role switching only for current identity display keeps the demo coherent for all seeded roles and avoids misleading team/org semantics before `Phase 3.4`.

**Alternatives considered:**  
Showing only same-team projects per role, or expanding shared repository APIs before broader project-detail and filtering work is defined.

**Impact:**  
`Phase 3.3` now delivers a consistent project list for Manager, Project Manager, and User demo roles without implying permissions logic, while richer project drill-down and filtering remain deferred to later phases.

### 2026-07-06 — Keep Personal issue grouping in a scoped read-model hook

**Context:**  
`Phase 3.2` required a Personal screen for assigned, created, curated, needs-update, and confirmation-related issue relationships, while the slice explicitly excluded advanced filters, broader screen work, and later workflow actions.

**Decision:**  
Implement the Personal screen with a small feature-scoped read-model hook that reads through existing repositories and groups results in memory, instead of expanding the shared issue repository with additional created-by, curated-by, and label-specific query methods in this slice.

**Reasoning:**  
This keeps the micro-phase narrow, respects the repository boundary, avoids direct persistence access from UI components, and prevents a small screen slice from prematurely widening the shared data-access API before the broader list and filtering phases are defined.

**Alternatives considered:**  
Adding new issue repository query methods immediately, or pushing the grouping logic directly into the page component.

**Impact:**  
`Phase 3.2` now delivers the approved Personal relationships view with a clean read path, while more general list/query infrastructure remains available for a later, broader slice if the roadmap actually needs it.

### 2026-07-06 — Route demo reset through app state and reuse one role-switcher UI

**Context:**  
`Phase 3.1` required demo page controls, a role switch UI connected to app state, and a safe reset action, while the slice explicitly excluded real authentication, later screen work, and direct UI-to-persistence coupling.

**Decision:**  
Expose demo reset as a Zustand app-state action that calls the existing persistence reset helper and rehydrates demo identity state, and extract a reusable role-switcher component that is rendered both in the sidebar shell and on the Demo page.

**Reasoning:**  
This keeps the feature UI inside the intended UI/state boundary, avoids direct Demo-page knowledge of persistence helpers or Dexie details, and ensures visible demo identity stays synchronized across the two entry points without duplicating stateful UI logic.

**Alternatives considered:**  
Calling reset helpers directly from the Demo page, or maintaining separate role-switch UI implementations in the shell and Demo screen.

**Impact:**  
`Phase 3.1` now delivers the approved demo controls slice with cleaner state orchestration, while richer demo account selection and other screen implementations remain explicitly deferred.

### 2026-07-06 — Normalize activity payloads and add minimal group participants before screens

**Context:**  
`Phase 2B.8` was introduced as a pre-Phase 3 hardening slice to close UI-relevant domain gaps before Issue Detail and other screen work begin.

**Decision:**  
Normalize activity history payloads to a small typed value object shape (`kind`, `id`, `label`), expand activity coverage for issue creation / label mutations / confirmation-requested flows, and add a minimal `participantIds` field to group-capable issues.

**Reasoning:**  
This gives later Phase 3 screens a stable rendering shape for activity history and a minimal participant model for group issues without introducing event sourcing, participant-management workflows, or broader organization behavior.

**Alternatives considered:**  
Keeping string-only activity payloads until Issue Detail work, or deferring group participants entirely until a later screen forces a model change under UI pressure.

**Impact:**  
Phase 3 screens can now consume issue activity and group participant data with less domain churn, while richer history semantics, participant workflows, and typed domain errors remain explicitly deferred.

### 2026-07-06 — Keep needs-update and confirmation behavior label-based

**Context:**  
`Phase 2B.6` required needs-update calculation, ready-for-confirmation modeling, and lightweight confirmation transitions, while the slice explicitly excluded dashboard visuals, notification behavior, and heavy approval workflow logic.

**Decision:**  
Implement attention and confirmation behavior as small domain/application helpers that resolve persisted system labels by label record, keep `Needs Update` and `Ready for Confirmation` as labels rather than statuses, and write only the minimal activity-history entries required for confirmation/reopen transitions in this slice.

**Reasoning:**  
This preserves the frozen product semantics, avoids coupling confirmation behavior to hard-coded shared label ids that do not match persisted seed ids, and keeps the logic lightweight instead of turning it into a workflow engine.

**Alternatives considered:**  
Treating confirmation as a new status category, or coupling the slice to the exported `SYSTEM_LABEL_IDS` instead of resolving the persisted system labels actually present in IndexedDB.

**Impact:**  
The next `Phase 2B.7` audit can validate stable attention/confirmation behavior before screen-level feature work begins, while richer notification and approval behavior remains explicitly deferred.

### 2026-07-06 — Keep tag and label mutations separate

**Context:**  
`Phase 2B.5` required tag add/remove behavior, duplicate prevention, and system-label handling, while the slice explicitly excluded UI polish, search/filter UX, and later confirmation logic.

**Decision:**  
Implement tag and label mutations as separate domain/application helpers, write activity history only for tag mutations in this slice, and preserve system labels strictly as label assignments rather than tag or status behavior.

**Reasoning:**  
This keeps the product semantics intact: tags stay lightweight classification, labels stay contextual markers, and system labels do not drift into other categories while the mutation rules remain small and repository-backed.

**Alternatives considered:**  
Treating labels the same as tags for history purposes immediately, or collapsing tag and label mutation logic into a single generic path without semantic guardrails.

**Impact:**  
The next needs-update/confirmation slice can build on stable label semantics, while richer history coverage and tag-creation rules remain explicitly deferred.

### 2026-07-03 — Keep ownership and curator changes repository-backed

**Context:**  
`Phase 2B.4` required owner transfer behavior, curator change behavior, group-issue curator rules, and activity-history writes, while the slice explicitly excluded notifications, advanced permissions, and UI behavior.

**Decision:**  
Implement owner and curator changes as small domain/application helpers that update the issue through the repository boundary and write separate activity-history entries, while enforcing that group issues cannot lose their curator.

**Reasoning:**  
This keeps responsibility-transfer logic explicit and auditable without leaking workflow behavior into UI code or turning the slice into a permissions or notification system.

**Alternatives considered:**  
Handling responsibility changes directly in UI actions, or allowing curator removal on group issues and correcting it later in screen-level validation.

**Impact:**  
The next tag/label slice can build on stable owner/curator operations, and later UI actions can call a narrow responsibility API instead of re-implementing these rules.

### 2026-07-03 — Keep issue state updates structured and history-backed

**Context:**  
`Phase 2B.3` required status and priority update operations with `updatedAt` / `updatedBy` handling and activity-history writes, while the slice explicitly excluded UI quick actions, notifications, and later ownership behavior.

**Decision:**  
Implement status and priority updates as small domain/application helpers that update the issue through the repository boundary and write activity-history entries separately through the activity-history repository.

**Reasoning:**  
This preserves a clean separation between persistence, domain behavior, and UI, while ensuring structured issue-state changes produce an audit trail before any screen-level interactions are added.

**Alternatives considered:**  
Writing update behavior directly in future UI actions, or folding activity-history writes into the repository layer itself.

**Impact:**  
The next ownership/curator slice can build on consistent update metadata and history behavior without reworking status and priority operations.

### 2026-07-03 — Keep issue creation logic small and repository-backed

**Context:**  
`Phase 2B.2` required an issue creation service foundation with default owner/curator rules and basic validation, while the slice explicitly excluded UI forms and later workflow behaviors.

**Decision:**  
Implement issue creation as a small domain/application helper that builds a persistence-ready `IssueRecord`, applies default owner/curator/status/priority rules, validates required structured fields, and writes through the repository boundary.

**Reasoning:**  
This captures the frozen creation rules early without coupling them to UI forms, direct Dexie calls, or later activity-history behavior.

**Alternatives considered:**  
Writing issue creation directly in a future form layer, or mixing creation with activity-history writes before the later operation slices are defined.

**Impact:**  
The next status/priority and ownership slices can build on a stable creation path, while richer validation and workflow behavior remain explicitly deferred.

### 2026-07-03 — Keep issue repository operations persistence-only and activity-safe

**Context:**  
`Phase 2B.1` required repository-level issue create/update/read operations, but the slice explicitly excluded UI forms, workflow services, and activity-history behavior.

**Decision:**  
Add explicit issue repository methods for create, update, and filtered reads, while keeping activity-history writes out of the repository and preserving immutable creation fields during updates.

**Reasoning:**  
This gives later domain/service slices a usable persistence surface without mixing repository concerns with workflow logic or audit-trail policy too early.

**Alternatives considered:**  
Leaving the repository as a generic CRUD wrapper, or coupling issue updates directly to activity-history persistence in the same slice.

**Impact:**  
The next issue-service slice can encode owner/curator rules against stable repository methods, while history-writing behavior remains a separate concern for later operations.

### 2026-07-03 — App state owns demo identity, not authentication

**Context:**  
`Phase 2A.5` required lightweight Zustand state for current demo identity and app lifecycle, while the roadmap explicitly excluded real auth, protected routes, and advanced permissions.

**Decision:**  
Initialize seeded demo data from the app-state layer and represent demo identity as local Zustand state only: current demo user, selected role, lifecycle status, and initialization error state.

**Reasoning:**  
This finishes the local-first demo bootstrap path end to end without introducing server/session concepts or leaking Dexie access into feature UI code.

**Alternatives considered:**  
Adding auth-shaped session state early, or leaving persistence bootstrap unconnected until later feature work.

**Impact:**  
The app now starts against seeded local data and can switch demo role context, while real authentication and permission logic remain explicitly out of scope.

### 2026-07-03 — Keep demo bootstrap/reset behavior in persistence helpers only

**Context:**  
`Phase 2A.4` required first-load seed initialization and reset behavior, but the slice explicitly excluded app state, UI controls, and broader workflow wiring.

**Decision:**  
Implement demo bootstrap/reset as persistence-layer helpers only, with `loadSeedData()` and `resetDemoData()` operating against Dexie-backed seed records without adding UI or provider integration yet.

**Reasoning:**  
This keeps the slice aligned with the roadmap, preserves the repository/persistence boundary, and avoids dragging `Phase 2A.5` app-state work into the persistence step.

**Alternatives considered:**  
Auto-wiring bootstrap into app providers immediately, or delaying all behavior until the later state slice.

**Impact:**  
The local-first demo lifecycle now exists at the persistence boundary, and the next slice can focus on representing current user / selected role context without reworking seed/reset logic.

### 2026-07-03 — Seed dataset follows role breakdown over conflicting total user count

**Context:**  
`Phase 2A.3` required a typed demo dataset, but the frozen technical planning contains an internal inconsistency between the stated total number of demo users and the listed role breakdown.

**Decision:**  
Use a demo dataset that matches the role breakdown needed by the product and user-journey docs, rather than the contradictory total count line.

**Reasoning:**  
The role-based journeys and seed coverage requirements are more operationally important than the single conflicting total-count statement, and they provide enough structure to build a realistic demo dataset without inventing unsupported product behavior.

**Alternatives considered:**  
Reducing the dataset to fit the smaller total user count, or blocking the seed slice until the frozen docs are rewritten.

**Impact:**  
The seed dataset now supports Manager, Project Manager, and User scenarios across multiple teams and projects, but the doc inconsistency should still be corrected later at the source.

### 2026-07-03 — Generic repository boundary over Dexie schema

**Context:**  
`Phase 2A.2` needed an initial IndexedDB/Dexie foundation and non-UI repository boundaries, but the scope explicitly excluded seed data, workflows, and app state.

**Decision:**  
Keep Dexie table definitions in the persistence layer and expose only small structural repository wrappers over a generic table adapter.

**Reasoning:**  
This satisfies the repository-boundary requirement without leaking persistence details into UI code or accidentally pulling issue-domain behavior into the persistence phase.

**Alternatives considered:**  
Direct UI-to-Dexie access for the MVP, or richer repository methods before seed data and workflows exist.

**Impact:**  
Later phases can add seed data, bootstrap behavior, and issue operations against stable repository entry points while keeping the current slice narrowly scoped.

### 2026-07-03 — Type-only domain contracts with explicit label/status separation

**Context:**  
`Phase 2A.1` required the typed operational vocabulary for later persistence and seed work, while the frozen docs distinguish statuses, tags, and labels and explicitly keep `Needs Update` separate from statuses.

**Decision:**  
Model the shared domain vocabulary as type-only literal unions plus exported label maps, and represent `Needs Update` / `Ready for Confirmation` as system labels rather than statuses or tags.

**Reasoning:**  
This keeps the phase inside the approved scope, makes later schema/seed work import from stable contracts, and preserves the frozen product semantics around attention signals versus workflow state.

**Alternatives considered:**  
Using runtime enums everywhere, or folding attention signals into the status model.

**Impact:**  
Later phases can build persistence and seed data on stable contracts without revisiting the core vocabulary, and the operational model remains aligned with the product freeze.

### 2026-07-02 — GitHub Pages-safe foundation routing

**Context:**  
The portfolio MVP must run as a static SPA on GitHub Pages, and direct deep-link refreshes are unreliable with `BrowserRouter` on project pages without additional fallback handling.

**Decision:**  
Use `HashRouter` for the frontend foundation.

**Reasoning:**  
This keeps routing reliable on GitHub Pages with minimal deployment complexity at MVP stage and avoids introducing a custom 404 rewrite strategy before product work starts.

**Alternatives considered:**  
`BrowserRouter` with GitHub Pages fallback handling and custom rewrite work.

**Impact:**  
All foundation routes work in static hosting now. Future migration to `BrowserRouter` remains possible if hosting constraints change.

### 2026-07-02 — Frontend-only Vite SPA initialization

**Context:**  
The product is explicitly scoped as a portfolio demo with no backend, no real authentication, and no server runtime.

**Decision:**  
Initialize the project as a React + TypeScript + Vite SPA with placeholder persistence boundaries only.

**Reasoning:**  
This matches the frozen technical planning, keeps the demo GitHub Pages-ready, and leaves clear boundaries for later Dexie/domain work without prematurely implementing business behavior.

**Alternatives considered:**  
Adding backend scaffolding, auth scaffolding, or production-style infrastructure at foundation stage.

**Impact:**  
The repository now supports frontend iteration, build verification, and future local-first persistence work while preserving strict MVP scope.

### 2026-07-02 — Tailwind classic config for explicit setup

**Context:**  
This foundation step required `tailwind.config.*` and `postcss.config.*` files, plus a predictable baseline for a portfolio dashboard UI.

**Decision:**  
Use Tailwind with explicit config and PostCSS setup.

**Reasoning:**  
This keeps the setup transparent, easy to maintain, and aligned with the requested foundation files.

**Alternatives considered:**  
A more implicit Tailwind setup with fewer explicit config files.

**Impact:**  
The styling foundation is stable and easy to extend during layout and component work.

### 2026-07-02 — Micro-phase roadmap control

**Context:**  
The implementation roadmap expanded from broad phases into explicit micro-phases so Codex work can stay reviewable and avoid uncontrolled scope growth.

**Decision:**  
Treat `BUILD_PLAN.md` as the practical implementation roadmap and execute only one micro-phase per Codex task.

**Reasoning:**  
This reduces scope creep, lowers the risk of hallucinated cross-phase implementation, and keeps commits aligned with narrow, verifiable slices.

**Alternatives considered:**  
Allowing umbrella phases such as `Phase 2A` or `Phase 3` to be implemented in a single task.

**Impact:**  
Future implementation should move slice by slice, with review, verification, checkpoint updates, and commit boundaries after each micro-phase.

---

## Implementation Notes

### Foundation scope boundary

The initial implementation intentionally stops at routing, layout, folder structure, and persistence scaffolding. No Issue model logic, dashboards, forms, role permissions, or seed behavior were implemented in this step.

---

## Technical Debt

| Item | Reason | Priority | Resolution |
|---|---|---|---|
| Docs filename mismatch (`.md` vs `.txt`) | Freeze docs are referenced as markdown in instructions but currently stored as text files | Medium | Normalize filenames or update references before later handoff confusion |
| Hard-coded Vite production base path | GitHub Pages target repo path is currently known and wired directly | Low | Move to env-driven deploy config if deployment workflow later requires it |

---

## Lessons Learned

- Generating the Vite app in a temporary folder avoided collisions with the pre-existing documentation repository state.

---

## README Candidates

- Portfolio demo runs as a static SPA optimized for GitHub Pages.
- Routing uses `HashRouter` intentionally for reliable demo refresh behavior on static hosting.

---

## LinkedIn / Portfolio Notes

- Strong example of disciplined MVP setup: domain boundaries and local-first readiness were prepared before feature work started.
