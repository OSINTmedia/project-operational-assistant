# Design Review V2 - Compact Assistant UX, Navigation, and Actionability Audit

Status: documentation-only audit  
Scope: React + TypeScript + Tailwind MVP, local-first architecture preserved  
Primary input: source inspection, planning docs, existing design reviews, and `comments.txt` as user pain evidence, not as unquestioned truth  
Runtime status: code-first audit. No source files were changed.

## 1. Executive Verdict

Verdict: **Current UI needs navigation and compact reconstruction before Phase 6.**

Confidence level: **High for code-supported layout/navigation findings; medium for runtime/mobile severity until verified in browser.**

The user complaint is valid. The strongest valid complaint is not just that cards are too large; it is that the app asks the user to keep moving between Dashboard, Personal, Projects, Project Detail, Issue Detail, Edit/Create, and Teams without always making the current context, return path, and next action obvious. This is supported by the route tree in `src/app/router/AppRouter.tsx`, the route-state helpers in `src/features/issues/issueNavigationState.ts`, and repeated full-page transitions from Dashboard/Personal/Project/Teams issue links into `IssueDetailPage`.

What is valid:

- Dashboard still presents reporting before operational action. In `src/features/dashboard/DashboardPage.tsx`, the header, Assistant Home cards, metric cards, Needs Update helper, and charts render before the Operational Queue.
- First-viewport usefulness is weak across Dashboard, Personal, Project Detail, Issue Detail, and Teams because context blocks and metrics appear before work queues.
- Navigation has source-aware return support, but the user still experiences route-hopping because preview, filtering, and quick action behavior is not strong enough.
- AppShell/topbar/page headers duplicate context and consume vertical space in `src/app/layout/AppShell.tsx`.
- Visual density is too loose for a compact SaaS assistant: many screens use `rounded-xl`, `p-4`, `p-6`, `gap-6`, multi-card grids, and stacked helper copy.
- Mobile risk is high because desktop screens already rely on long vertical stacking.

What is overstated:

- The route model itself is not huge or technically broken. The route set is small and coherent: Dashboard, Personal, Projects, Project Detail, Issue Create, Teams, Issue Detail, Issue Edit, Demo.
- Return behavior is not absent. `issueNavigationState.ts` provides bounded source-aware return state for `dashboard`, `personal`, `project`, and `teams`.
- Removing `/personal` is not justified without separate explicit approval. Personal has a clear role as a focused "my work" surface.
- A full product redesign, backend/auth change, notification system, workflow engine, or Jira-like expansion is not required.

Biggest product risk: **the app is intended to reduce operational confusion, but the current experience can become another system the user must navigate and manage.**

Phase 6 readiness: **Do not proceed to Phase 6 yet.** A corrective Phase 5.9 or equivalent is required before portfolio/demo hardening.

## 2. Core UX Failure Statement

The current app has the data and route structure of an operational assistant, but it still behaves too much like a reporting/admin dashboard: it sends users across routes to understand what matters, consumes the first viewport with headers, summaries, metrics, charts, and helper text, and places the actual work surface too low. The result is high cognitive load, weak wayfinding, route-hopping, poor screen economy, and mobile-first risk. A compact assistant should answer "where am I, what matters, what should I do next, and how do I get back?" before it asks the user to interpret charts, scan cards, or open another page.

## 3. Navigation and Wayfinding Audit

This is the highest-priority audit area. The route tree is not excessive, but the interaction model makes routes feel heavier than they are.

| Screen / route | User intent | Where the user came from | Where the user likely goes next | Current navigation friction | Risk of getting lost | Back/return clarity | Breadcrumb/source clarity | Recommended correction | Severity |
|---|---|---|---|---|---|---|---|---|---|
| Dashboard `/dashboard` | Understand workspace risk and act on urgent work | Default route, sidebar, topbar Dashboard link, issue return | Issue Detail, Personal, Project Detail, filters | Reporting blocks appear before queue; Assistant cards summarize instead of narrowing work; charts precede action queue | High, because it is the supposed home but does not behave like command center | Weak after deep issue/edit loops because return is state-dependent | No explicit "you are in assistant home because..." context beyond page header | Put Operational Queue and role-aware actions first; make cards/metrics filter or preview; move charts lower/collapsible | P0 |
| Personal `/personal` | See selected user's assigned/curated/update/confirmation work | Sidebar, topbar Personal link, Dashboard prompt | Issue Detail, Dashboard, project context | Useful page, but duplicates Dashboard signals and still starts with header/metric cards before work | Medium | Source state returns from issues, but user can still wonder whether Dashboard or Personal is the right surface | Personal scope is clearer than Dashboard, but overlap remains | Define Personal as focused "my work"; Dashboard may surface personal counters but should link/filter precisely | P1 |
| Projects `/projects` | Choose a project and understand portfolio status | Sidebar, Dashboard project cards, Issue Detail project link | Project Detail | Metric summary and project cards/table add a browse layer before work | Medium | Back to Dashboard/Personal depends on browser or route memory | No persistent source hint | Make Projects a compact index; reduce summary dominance; show project health/action counts inline | P2 |
| Project Detail `/projects/:projectId` | Work inside one project | Projects, Dashboard, Issue Detail/Edit return | Issue Detail, Issue Create, Projects | Header, context, metric cards, filters appear before issue list; issue work starts too low | High for PM workflow | Good when reached with route state; less clear after refresh/direct link | Project context exists but consumes page space instead of aiding wayfinding | Compact project status bar; issue queue above metadata; stronger source-aware return label | P1 |
| Issue Detail `/issues/:issueId` | Inspect issue and take next safe action | Dashboard, Personal, Project Detail, Teams, direct link | Edit, return to source, project, team | Full documentation-page feeling; metadata cards and activity can dominate before action | High in repeated open/edit/return loops | Implemented via `getIssueReturnContext`, but direct/reloaded issue lacks strong context | Source-aware but not visibly dominant enough | Treat as focused work surface: title/status/action strip first; metadata collapsed/side panel; return button label reflects source | P1 |
| Issue Edit `/issues/:issueId/edit` | Modify existing issue safely | Issue Detail or direct route | Issue Detail or source context | Full-page edit interrupts workflow; return after save depends on source state | Medium-high | Source state exists but needs stronger visible cancel/save return context | Breadcrumb/source implied, not strong enough | Sticky compact save/cancel bar; visible "returning to..." context; reduce form helper copy | P1 |
| Issue Create `/projects/:projectId/issues/new` | Create project-scoped issue | Project Detail | Project Detail or new Issue Detail | Project-only route is good MVP scope, but form page is heavy and interrupts project flow | Medium | Project return is predictable | Project context should be compact and sticky | Quick-create structure: required fields first, advanced fields collapsed; keep project context in header/status bar | P2 |
| Teams `/teams` | Inspect team workload and selected user/team context | Sidebar, Issue Detail return | Issue Detail, Dashboard/Personal | Works as secondary admin/support surface, but can become another issue entry route | Medium | Source state returns from issue links | Team source is less central than Dashboard/Project/Personal | Keep Teams secondary; avoid making it primary work path; compact team cards and make issue links return clearly | P2 |
| Demo `/demo` | Switch role/demo user and understand seeded scenario | Sidebar/topbar role control | Dashboard, Personal | Demo context competes with app shell selected role/user messaging | Low-medium | Return is manual via nav | Context appears in shell and page | Keep Demo secondary; selected user/role should live compactly in shell, not repeated in every page | P3 |

Key conclusion: the app does not need fewer routes first; it needs **fewer unnecessary route transitions for common work** and clearer source-aware return behavior when transitions are necessary.

### Route-hopping reduction decision hierarchy

Use this rule during Phase 5.9 implementation:

- Use an in-place filter when the user is narrowing a list.
- Use preview/inline inspection when the user is inspecting before deciding.
- Use full Issue Detail route only for deep reading, broader context, or meaningful action.
- Use Edit route only when field changes are required.
- Use Project Detail route when project context is the user's active frame.
- Do not make every summary card a route jump. A card should first try to filter, preview, or focus the current work surface.

### Measurable UX success metrics

Phase 5.9 should be judged by observable behavior, not by whether the interface merely looks smaller.

- Dashboard first viewport must show the Operational Queue or its first actionable rows on a standard desktop viewport.
- Common user workflow should not require more than 2-3 route transitions before reaching the relevant work item.
- Issue Detail/Edit must always show a visible source-aware return destination.
- A direct Back/Return control must be available on deep work routes; do not rely only on browser back.
- Mobile first viewport must not be consumed entirely by headers/cards/filters.
- Summary cards must either filter, preview, or route to a precise work surface.
- Charts must not appear above the main action queue.
- Dashboard, Personal, Project Detail, and Issue Detail must answer "where am I, what matters, what can I do next?" without heavy scrolling.

## 4. End-to-End Workflow Friction Audit

### Manager

| Item | Current assessment |
|---|---|
| Current likely path | Dashboard -> scan Assistant Home/metrics/charts -> Operational Queue -> Issue Detail -> maybe Edit -> return Dashboard -> Project Detail for project risk |
| Route transitions | Commonly 3-5 for one decision: Dashboard to Issue Detail, Issue Detail to Edit, Edit back, Issue back, maybe Project Detail |
| Where user may get lost | After Issue Detail/Edit if source context is not visually dominant; when choosing whether risk belongs in Dashboard, Projects, Project Detail, or Teams |
| Where scrolling becomes excessive | Dashboard before Operational Queue; Issue Detail before action panel/history; Project Detail before issue list |
| Direct action/filter/preview opportunity | Dashboard risk cards should filter queue or open preview; delayed/blocked metrics should open exact filtered worklist; issue preview should reduce full route trips |
| Recommended correction | Make Dashboard the manager command center: compact role context, urgent queue first, risk cards as filters, charts lower/collapsible, source-aware return labels |
| Severity | P0 |

### Project Manager

| Item | Current assessment |
|---|---|
| Current likely path | Projects -> Project Detail -> scroll past header/metrics/filters -> issue list -> Issue Detail -> Edit/Create -> return Project Detail |
| Route transitions | Commonly 4-6 for one project update |
| Where user may get lost | Project Detail to Issue Detail/Edit and back; browser back may not match the source-aware intent after direct links |
| Where scrolling becomes excessive | Project Detail first viewport; create/edit form pages; issue detail card stack |
| Direct action/filter/preview opportunity | Project Detail should show compact issue queue immediately; issue preview/edit shortcut could avoid full detail for simple updates |
| Recommended correction | Recompose Project Detail as project-scoped work queue first, metadata second; keep project context in compact header/status bar; preserve project-scoped create route |
| Severity | P1 |

### User

| Item | Current assessment |
|---|---|
| Current likely path | Dashboard or Personal -> find Assigned/Needs Update/Ready for Confirmation -> Issue Detail -> quick action/edit -> return |
| Route transitions | Commonly 3-5, depending on whether the user starts on Dashboard or Personal |
| Where user may get lost | Dashboard vs Personal responsibility is ambiguous; Ready for Confirmation is present but not dominant enough; issue return context can be missed |
| Where scrolling becomes excessive | Dashboard before user-specific queue; Personal metric cards before confirmation/update work; Issue Detail before action controls |
| Direct action/filter/preview opportunity | Dashboard selected-user cards should filter; Personal sections should put Needs Update/Confirmation at top for selected user; safe actions should be visible on Issue Detail first viewport |
| Recommended correction | Define Personal as the selected user's focused workbench; Dashboard as workspace command center with user filters; make quick actions first-visible |
| Severity | P1 |

## 5. First Viewport Usefulness Audit

| Screen | What appears before scrolling | Real work visible? | Primary action visible? | Static explanation dominance | Wasted space | Correction | Severity |
|---|---|---:|---:|---:|---|---|---|
| Dashboard | Page header card, Assistant Home cards, metric cards, Needs Update helper, charts before queue | Often no | Partly, but mostly summary | High | Header, cards, metrics, chart placement | Operational Queue first; Assistant cards as compact filters; charts below/collapsible | P0 |
| Personal | Header, metric cards, then sections | Partly | Partly | Medium | Metrics before work sections | Put Needs Update/Confirmation/Assigned queue first; metrics as compact inline chips | P1 |
| Projects | Header, portfolio metrics, project list/table | Partly | Project open action visible after summary | Medium | Summary cards before project work | Compact project index; health/action counts inline | P2 |
| Project Detail | Back/header/context, metrics, filter panel before issues | Weak | Create visible, issue work low | High | Metadata and filters before issue list | Compact project status row; issue queue immediately visible; filters as toolbar | P1 |
| Issue Detail | Header and metadata/action sections; exact order suggests documentation feel | Partly | Quick actions not dominant enough | Medium-high | Tower of cards, metadata volume | Title/status/action strip first; metadata collapsed/side column | P1 |
| Issue Edit | Full form page with context and helper copy | Yes, but heavy | Save/cancel visible only by page layout | Medium | Form spacing, helper text, all fields equal | Sticky save/cancel; required-first form; secondary fields collapsed | P1 |
| Issue Create | Full project-scoped form | Yes, but heavy | Create/cancel present | Medium | Same as edit; too much form at once | Quick-create required fields first; advanced section collapsed | P2 |
| Teams | Header, team metrics/cards | Partly | Issue action secondary | Medium | Team summary before actionable workload | Keep secondary; compact team workload rows | P2 |
| Demo | Demo explanation/state controls | Yes for role switching | Yes | Acceptable | Some repeated context with AppShell | Keep secondary; avoid repeating selected user state elsewhere | P3 |

Strict verdict: **first viewport must show work, not explanation.** Dashboard and Project Detail currently fail this standard most clearly.

## 6. Visual Density and Space Economy Audit

| Affected screen/file | Current pattern | Why it wastes space | What can be compressed | Move to shell/sidebar/collapsible? | Implementation risk |
|---|---|---|---|---|---|
| `src/app/layout/AppShell.tsx` | 260px sidebar plus multi-line sticky topbar and page padding `px-3 py-4 sm:px-6 sm:py-6` | Shell repeats role/context and pushes page content down | Topbar height, role copy, Dashboard/Personal quick links, demo note | Selected user/role into compact sidebar/status bar | Medium |
| `src/features/dashboard/DashboardPage.tsx` | Header card + Assistant Home + metrics + helper + charts before queue | Makes home feel like report, not assistant | Header, Assistant cards, metric card height, chart position | Some role/user context to shell; charts collapsible/lower | Medium |
| `src/features/dashboard/DashboardCharts.tsx` | Charts rendered before Operational Queue | Visual weight goes to reporting | Move below queue or behind "Insights" disclosure | Lower/collapsible | Low-medium |
| `src/features/personal/PersonalPage.tsx` | Metric cards before work sections | User-specific work is delayed | Inline counters/chips, shorter header | Some counters in sidebar quick links | Low-medium |
| `src/features/projects/ProjectsPage.tsx` | Summary cards before project browsing | Adds admin/reporting feel | Inline project counts/status chips | Keep in page, compact | Low |
| `src/features/projects/ProjectDetailPage.tsx` | Header/context + metric cards + large filter panel before issue list | PM must scroll before work | Project status row, compact toolbar filters, issue list earlier | Project context to compact header/status bar | Medium |
| `src/features/issues/IssueDetailPage.tsx` | Multiple metadata/action/history cards | Looks like documentation page | Priority action strip, compact metadata grid, collapsible history/dependencies | Secondary metadata to side/collapse | Medium |
| `src/features/issues/IssueCreatePage.tsx`, `IssueEditPage.tsx`, `IssueFormFields.tsx` | All form fields visible with roomy spacing/helper copy | Turns quick update into admin form | Required-first grouping, denser spacing, advanced collapse | Keep in page; sticky save/cancel | Medium |
| `src/features/teams/TeamsPage.tsx` | Team overview cards and issue rows | Useful but secondary; can add route noise | Compact team rows and current-team focus | Keep secondary nav | Low |
| `src/styles/globals.css`, `src/index.css` | Global spacing/typography likely supports roomy layout | Density may be repeated manually and globally | Audit section/card spacing tokens | No architecture change | Low-medium |

The implementation path should be incremental. Do not introduce a new design system layer unless repeated spacing fixes become unmanageable.

## 7. Left Navigation / AppShell Opportunity Audit

| Opportunity | Proposed location | Benefit | Risk | Accessibility concern | Candidate files | Separate approval? |
|---|---|---|---|---|---|---|
| Selected demo user and role as compact persistent context | Sidebar or compact topbar/status bar | Reduces repeated page headers and clarifies "whose work am I seeing?" | Could crowd sidebar | Must remain readable and keyboard reachable | `AppShell.tsx`, `navigation.ts`, `src/features/demo/*`, `src/app/state/*` | No |
| Current route context and source-aware return label | Compact status bar/page header | Answers "where am I and how do I get back?" | Bad labels could add noise | Return control must be semantic link/button | `AppShell.tsx`, issue/project pages, `issueNavigationState.ts` | No |
| Global create issue button | Sidebar/topbar or Project Detail header only | Speeds creation | Current create route is project-scoped; global create may imply unsupported scope | Must not create invalid projectless issue | `AppShell.tsx`, `ProjectDetailPage.tsx` | Yes if truly global |
| "My work" quick links with counters | Sidebar | Makes Personal role clearer and reduces Dashboard/Personal guessing | Counters can become noisy | Links need visible labels, not icon-only | `AppShell.tsx`, `usePersonalView.ts`, dashboard metrics hooks | No |
| Needs Update / Ready for Confirmation counters | Sidebar or compact topbar | Turns role-specific risk into direct navigation/filter | Could duplicate page content | Badge contrast and focus state | `AppShell.tsx`, `useDashboardMetrics.ts`, `usePersonalView.ts` | No |
| Project context inside Project Detail | Compact status bar/page header | Saves vertical space and improves wayfinding | Too much metadata in shell if overdone | Truncated labels need full accessible names | `ProjectDetailPage.tsx`, `useProjectDetailView.ts` | No |
| Compact breadcrumbs | Page header/status bar | Clarifies source and hierarchy | Breadcrumbs can become another row of chrome | Use semantic nav/aria-label | `AppShell.tsx`, page headers | No |
| Dashboard/Personal quick switch | Sidebar primary/secondary nav | Clarifies two work modes | Current topbar quick links duplicate sidebar | Link labels must remain explicit | `AppShell.tsx`, `navigation.ts` | No |

Recommendation: **do not redesign the full shell first.** Start with compacting existing AppShell responsibilities and making wayfinding/state visible.

Sidebar boundary rules:

Allowed in sidebar:

- Primary navigation.
- Current section indication.
- Selected demo user and role.
- Concise My Work / Needs Update / Ready for Confirmation counters.
- Lightweight wayfinding cues that help the user understand current context.

Not allowed in sidebar without separate explicit approval:

- Full issue lists.
- Complex filters.
- Charts.
- Project metadata panels.
- Command palette behavior.
- Secondary dashboard blocks that turn the sidebar into another dashboard.

The sidebar may support wayfinding and compact counters, but it must not become a second dashboard or an overloaded control panel.

## 8. Dashboard as Assistant Home Audit

| Element | Current behavior | UX problem | Expected assistant behavior | Recommended correction | Candidate files | Severity |
|---|---|---|---|---|---|---|
| Page header | Large explanatory dashboard header/card | Consumes first viewport and repeats shell context | Brief command-center context only | Short one-line title/context or merge into shell/status row | `DashboardPage.tsx`, `AppShell.tsx` | P1 |
| Operational Queue | Rendered after summary blocks and charts | Most important work starts too low | Primary work surface appears first | Move near top, before charts; filters as compact toolbar | `DashboardPage.tsx` | P0 |
| Assistant Home cards | Summarize selected user actions | Dead summaries increase interpretation effort | Cards filter/preview the exact work they describe | Make cards clickable filters or direct Personal anchors | `DashboardPage.tsx`, `useDashboardMetrics.ts` | P1 |
| Workspace Risk cards | Summarize blocked/delayed/needs update | Risk signals do not immediately become work | Risk cards narrow queue and expose top issue preview | Convert to queue filters with counts and top examples | `DashboardPage.tsx` | P1 |
| Metric cards | Four large cards before queue | Reports compete with action | Compact badges or secondary summary | Reduce height; move after queue or into compact row | `DashboardPage.tsx` | P1 |
| Charts | Render before queue via `DashboardCharts` | Chart-first behavior is reporting, not assistant-like | Insights after action queue | Move below queue or collapse under Insights | `DashboardCharts.tsx`, `DashboardPage.tsx` | P1 |
| Filters/search | Present inside Operational Queue but low on page | Useful controls are delayed | Filter toolbar should be first visible with queue | Move with queue to top; presets from cards | `DashboardPage.tsx` | P1 |
| Preview/open behavior | Queue supports selected preview/open patterns | Good direction, but not enough to reduce route-hopping | Preview is default for scanning; full detail is deliberate | Strengthen preview prominence and source-aware full open | `DashboardPage.tsx`, issue links | P1 |
| Role-aware selected-user context | Present but spread across shell/header/cards | User must reconcile role/page state | Persistent compact role/user state | Move key context to shell/status row | `AppShell.tsx`, `DashboardPage.tsx` | P1 |
| Dashboard route role | Workspace overview plus personal prompts | Overlaps Personal mental model | Dashboard owns "what needs attention now"; Personal owns "my assigned/curated work" | Rewrite hierarchy around action queue and precise filters | `DashboardPage.tsx`, `PersonalPage.tsx` | P0 |

Dashboard should become the place where a user can act without route-hopping. Cards and metrics that do not filter, preview, or route to a precise working surface should be demoted.

## 9. Personal vs Dashboard Responsibility Audit

Dashboard should own:

- Workspace-level attention: blocked, delayed, stale, high-priority, Needs Update, confirmation risk.
- Operational Queue with global filters and role-aware presets.
- Manager/PM triage and cross-project risk.
- Short selected-user context, but not a full duplicate of Personal.

Personal should own:

- Selected user's assigned work.
- Selected user's curated work.
- Needs Update and Ready for Confirmation for that user.
- A focused workbench for "what belongs to me now."

What should not be duplicated:

- Large metric cards on both Dashboard and Personal.
- Repeated helper explanations of the same selected-user context.
- Multiple large entry points to the same issue lists without clear difference.

Does Personal create confusion? Yes, partially. The route is useful, but the current distinction is not sharp enough. A new user can reasonably ask whether Dashboard or Personal is the correct place to start.

Should Dashboard surface Personal-like signals? Yes, but only as compact filters/counters that either filter the Dashboard queue or route precisely to Personal. Dashboard should not become another full Personal page.

Personal route deprecation: **not recommended in this audit.** Removing or deprecating `/personal` would require separate explicit approval and is not necessary for the MVP.

## 10. Project / Project Detail Navigation Audit

Projects list:

- `ProjectsPage` should remain an index, not a reporting page.
- Portfolio metrics can stay, but they should be smaller and visually secondary.
- Project cards/table should expose action counts inline: blocked, delayed, Needs Update, unassigned, confirmation-ready.

Project Detail:

- `ProjectDetailPage.tsx` currently renders header/context, metrics, and filters before the issue list.
- This makes the PM path too slow: the user opens a project to work issues, not to read a project landing page.
- Project metadata should collapse or move into a compact status row.
- Filters/search should become a toolbar directly attached to the issue list.
- The issue list should appear in the first viewport.
- Create issue should remain project-scoped and visible, but it should not compete with the active issue queue.

Route-hopping:

- Project Detail -> Issue Detail -> Issue Edit -> Project Detail is predictable only when route state survives.
- The return label should be visible and source-aware: "Back to Project: X", not generic.
- Issue previews inside Project Detail should be strengthened where possible to avoid full navigation for simple inspection.

## 11. Issue Detail / Edit / Create Workflow Audit

Issue Detail should be a focused work surface, not a long issue document.

Keep visible:

- Issue title/key/project context.
- Current status, priority, owner, curator.
- The next safe action and primary edit action.
- Source-aware return control.

Collapse or demote:

- Long metadata grids.
- Activity history.
- Dependency/detail sections that are not required for the next decision.
- Repeated helper text.

Move to tabs/columns/secondary panels only if implemented simply:

- Details/metadata.
- Activity/history.
- Related project/team context.

Avoid MVP creep:

- Do not add workflow engine logic.
- Do not add comments/notifications/permissions.
- Do not turn issue detail into Jira.

Edit/Create:

- `IssueFormFields.tsx` should support a denser required-first structure.
- Save/cancel/return context should remain visible, especially on mobile.
- Advanced fields should be grouped or collapsed if possible.
- Create remains project-scoped; do not invent global issue creation unless separately approved.

Return behavior after edit:

- Preserve source-aware return state.
- Make the return destination explicit before save/cancel.
- Do not rely only on browser back behavior.

## 12. Mobile-first Responsive Risk Audit

| Area | Classification | Mobile problem | Likely cause | Recommended responsive pattern | Minimum acceptable fix before Phase 6 |
|---|---|---|---|---|---|
| Dashboard | Must test immediately | Endless stack before queue; charts/cards dominate | Summary-first layout and chart placement | Queue first, compact filter toolbar, charts collapsed/lower | Operational Queue visible early on mobile |
| Personal | Risky | Metric cards and sections stack before key work | Cards before queues | Priority sections first; counters as chips | Needs Update/Confirmation visible without long scroll |
| Projects | Risky | Project cards may become long browse list | Card layout on small screens | Compact rows/cards with inline counts | Project list usable without summary-card wall |
| Project Detail | Likely poor | Header/metrics/filters can consume whole viewport | Metadata before issue list | Sticky compact project header; filter disclosure; issue list first | First issues visible quickly |
| Issue Detail | Likely poor | Tower of cards and metadata scrolling | Documentation-page structure | Action strip first; collapsible details/history | Primary safe action visible before deep scroll |
| Issue Edit/Create | Risky | Long form and hidden save/cancel | Full form page with roomy spacing | Sticky save/cancel; required-first groups | Save/cancel always easy to reach |
| Teams | Risky | Team cards stack and push issue work low | Overview-first layout | Current team/workload rows first | Keep Teams secondary and compact |
| AppShell/navigation | Must test immediately | Sidebar/topbar may consume too much vertical space or hide context | Multi-line topbar and persistent chrome | Compact mobile header, clear current route, accessible menu | User always sees current section and return/action path |

Mobile standard: compactness cannot reduce tap targets or labels. Use disclosure, tabs, sticky actions, and compact rows, not hidden mystery icons.

## 13. Visual Simplification / Removal Candidates

| Element | Screen | Current problem | Recommended treatment | Risk | Approval needed |
|---|---|---|---|---|---|
| Large Dashboard page header card | Dashboard | Pushes work down | Shorten or merge with shell/status row | Low | No |
| Dashboard Assistant Home card grid | Dashboard | Static summaries compete with queue | Convert to compact actionable filters | Medium | No |
| Dashboard charts above queue | Dashboard | Reporting before action | Move below queue or collapse under Insights | Low-medium | No |
| Needs Update explanatory block | Dashboard | Repeats concept and consumes vertical space | Convert to queue preset/filter chip | Low | No |
| Metric cards on Dashboard/Personal/Project | Multiple | Equal visual weight to work | Reduce to compact row/chips | Low-medium | No |
| Project Detail metadata/header blocks | Project Detail | Delays issue list | Compact status row; collapse details | Medium | No |
| Project Detail filter card | Project Detail | Large filter block before results | Convert to toolbar/disclosure | Medium | No |
| Issue Detail metadata cards | Issue Detail | Tower-of-cards | Side/secondary/collapsible metadata | Medium | No |
| Activity history prominence | Issue Detail | Secondary info can dominate | Collapse or move lower | Low | No |
| Form helper text | Create/Edit | Makes form feel instructional/admin-heavy | Shorten; keep only decision-critical labels | Low | No |
| Topbar Dashboard/Personal quick links | AppShell | Duplicates sidebar nav | Move to sidebar or compact context controls | Low-medium | No |
| Global create issue action | AppShell | Could imply unsupported projectless issue | Do not add unless product decision made | Medium | Yes |
| Removing `/personal` | Navigation | Would erase useful focused route | Do not remove in Phase 5.9 | High | Yes |

## 14. Severity-classified Findings

| ID | Title | Severity | Affected screen(s) | Evidence from code/runtime | User impact | Recommended direction | Candidate files | Implementation risk | Before Phase 6? | Separate approval needed? |
|---|---|---|---|---|---|---|---|---|---|---|
| UX-P0-01 | Dashboard is not action-first | P0 | Dashboard | `DashboardPage.tsx` renders header/cards/metrics/helper/charts before queue | User starts by interpreting, not acting | Move Operational Queue and filters to top; demote charts | `DashboardPage.tsx`, `DashboardCharts.tsx` | Medium | Yes | No |
| UX-P0-02 | Route-hopping creates wandering | P0 | Dashboard, Personal, Project Detail, Issue Detail/Edit | Route tree plus many `Link`/`navigate` paths to issue detail/edit | User loses context across pages | Strengthen preview/filter/source-aware return behavior | `AppRouter.tsx`, issue/project/dashboard pages, `issueNavigationState.ts` | Medium | Yes | No |
| UX-P1-03 | Return paths are technically present but visually weak | P1 | Issue Detail/Edit | `issueNavigationState.ts` supports sources, but deep pages still need stronger labels | User does not know where action returns | Visible source-aware return/status strip | `IssueDetailPage.tsx`, `IssueEditPage.tsx`, `issueNavigationState.ts` | Low-medium | Yes | No |
| UX-P1-04 | Assistant cards are not actionable enough | P1 | Dashboard | `selectedUserActionCards` and `workspaceRiskCards` are summary definitions | Summary cards become reading burden | Convert cards into filters/previews/precise routes | `DashboardPage.tsx`, `useDashboardMetrics.ts` | Medium | Yes | No |
| UX-P1-05 | Charts and metrics appear too high | P1 | Dashboard | `DashboardCharts` rendered before queue | Reporting competes with operational work | Move below queue/collapse | `DashboardPage.tsx`, `DashboardCharts.tsx` | Low-medium | Yes | No |
| UX-P1-06 | AppShell/header consumes and duplicates context | P1 | Global | `AppShell.tsx` sidebar plus sticky multi-line topbar plus page headers | Real work starts lower; context repeated | Compact topbar; move selected user/role into persistent concise area | `AppShell.tsx`, `navigation.ts` | Medium | Yes | No |
| UX-P1-07 | Visual density failure across work screens | P1 | Dashboard, Personal, Projects, Project Detail, Issue Detail | Repeated `rounded-xl`, `p-4/p-6`, `gap-6`, card grids | Heavy interface, too much scanning | Density pass: smaller cards, gaps, typography, rows | Feature pages, shared components, CSS | Medium | Yes | No |
| UX-P1-08 | Real work often begins below first viewport | P1 | Dashboard, Project Detail, Personal | Code render order places summaries before queues | User scrolls before acting | Work queues first, context compact | Dashboard/Personal/Project pages | Medium | Yes | No |
| UX-P1-09 | Dashboard vs Personal mental model is ambiguous | P1 | Dashboard, Personal | Both surface selected-user work and metrics | User does not know where to start | Dashboard = workspace triage; Personal = my focused work | `DashboardPage.tsx`, `PersonalPage.tsx`, shell nav labels | Medium | Yes | No |
| UX-P1-10 | Project Detail drill-down friction | P1 | Project Detail, Issue Detail/Edit | Project Detail metadata/filters before list; issue links route out | PM workflow requires repeated open/return | Issue list first, compact filters, stronger preview/return | `ProjectDetailPage.tsx`, issue pages | Medium | Yes | No |
| UX-P1-11 | Issue Detail tower-of-cards | P1 | Issue Detail | Metadata/action/history card structure | Action surface feels like documentation | Action strip first; metadata/history collapsed or secondary | `IssueDetailPage.tsx` | Medium | Yes | No |
| UX-P1-12 | Form pages feel like admin documents | P1 | Issue Create/Edit | Full form pages and helper-heavy fields | Simple edits feel slow | Required-first compact form; sticky save/cancel | `IssueCreatePage.tsx`, `IssueEditPage.tsx`, `IssueFormFields.tsx` | Medium | Yes | No |
| UX-P1-13 | Mobile endless-scroll risk | P1 | All major screens | Desktop render order already stacks many blocks | Mobile may become unusable for quick triage | Mobile survival pass with queue-first and sticky actions | All feature pages, `AppShell.tsx` | Medium-high | Yes | No |
| UX-P2-14 | Teams can add navigation noise | P2 | Teams | Teams has issue links and overview cards | Secondary route can feel like another start point | Keep Teams compact/secondary; clarify return | `TeamsPage.tsx` | Low | If possible | No |
| UX-P2-15 | Projects index may be more reporting than action | P2 | Projects | Summary metrics before browsing | Browse step feels heavier than needed | Compact project rows with inline risk | `ProjectsPage.tsx` | Low | If possible | No |
| UX-P3-16 | Demo context repeats with shell | P3 | Demo, AppShell | Demo state appears in shell and page | Minor redundancy | Keep Demo secondary and concise | `Demo` files, `AppShell.tsx` | Low | No | No |

## 15. Corrective Roadmap

Navigation and wayfinding come first because the primary pain is "I get lost in my own app." AppShell compression is related, but it should not be allowed to swallow the route clarity work. Dashboard action-first recomposition follows after the return/context foundation is clear.

### Phase 5.9A1 - Route Wayfinding and Return Context

Goal: make every deep work route answer where the user is, where they came from, and how they return.

Scope:

- Improve source-aware return labels on Issue Detail/Edit.
- Add visible Back/Return controls where the current flow relies too much on browser back.
- Clarify current-location context on Issue Detail, Issue Edit, Issue Create, Project Detail, and Teams.
- Preserve the existing route model and bounded route-state helper.
- Clarify Dashboard vs Personal return destinations when opening issues from either surface.

Explicit exclusions: AppShell redesign, route removal, `/personal` removal, backend/auth, global command palette, navigation history framework.

Likely files: `issueNavigationState.ts`, `IssueDetailPage.tsx`, `IssueEditPage.tsx`, `IssueCreatePage.tsx`, `ProjectDetailPage.tsx`, `TeamsPage.tsx`, issue links in Dashboard/Personal/Project/Teams.

Acceptance criteria:

- Issue Detail/Edit always show a visible source-aware return destination.
- Deep routes expose a semantic Back/Return control and do not rely only on browser back.
- Dashboard -> Issue -> Edit -> return, Personal -> Issue -> Edit -> return, Project Detail -> Issue -> Edit -> return, and Teams -> Issue -> return are predictable.
- No new routes are added and no existing routes are removed.

Manual test: Manager -> Dashboard -> issue -> edit -> save/cancel -> return; PM -> Project Detail -> issue -> return; User -> Personal -> confirmation issue -> return; Team route -> issue -> return.

Risk level: Medium.  
Suggested commit message: `feat: clarify route return context`  
Separate explicit approval needed: No.

### Phase 5.9A2 - Compact AppShell and Header Compression

Goal: reduce repeated shell/page context without turning the sidebar into a second dashboard.

Scope:

- Compact AppShell topbar only where it supports wayfinding.
- Make selected user/role persistent but concise.
- Reduce duplicate Dashboard/Personal/page-header context.
- Move only lightweight counters/context into shell areas.

Explicit exclusions: broad AppShell redesign, full sidebar dashboard, charts/issue lists/complex filters in sidebar, global create issue unless separately approved.

Likely files: `AppShell.tsx`, `navigation.ts`, `DemoRoleSwitcher.tsx`, page headers.

Acceptance criteria:

- Topbar/page header does not repeat the same role/user/status copy.
- Selected user/role remains visible without consuming the page's first work area.
- Sidebar contains navigation and concise wayfinding only.
- Mobile shell remains usable and does not hide route context.

Manual test: switch role/user, visit every major route, confirm current context is visible and page work starts earlier.

Risk level: Medium.  
Suggested commit message: `feat: compact app shell orientation`  
Separate explicit approval needed: No.

### Phase 5.9B - Dashboard Action-first Recomposition

Goal: make Dashboard behave like an assistant home rather than a report page.

Scope:

- Move Operational Queue and filters above charts.
- Convert Assistant Home and risk cards into filters/previews/precise links.
- Demote charts and metric cards.
- Preserve existing data hooks and local-first state.

Explicit exclusions: new data model, new backend, notifications, workflow engine.

Likely files: `DashboardPage.tsx`, `DashboardCharts.tsx`, `useDashboardMetrics.ts`.

Acceptance criteria:

- User can see urgent queue and filter controls before heavy scrolling.
- Every major summary card either filters, previews, or routes precisely.
- Charts no longer visually dominate the first viewport.

Manual test: filter blocked/delayed/Needs Update from Dashboard; open issue; return to exact context.

Risk level: Medium.  
Suggested commit message: `feat: make dashboard action-first`  
Separate explicit approval needed: No.

### Phase 5.9C - Project and Personal Density Pass

Goal: make work lists visible earlier and reduce duplicate summary cards.

Scope:

- Personal: prioritize Needs Update/Ready for Confirmation/Assigned work above metrics.
- Projects: compact project index and inline risk counts.
- Project Detail: issue list first, filters as toolbar, metadata compact/collapsible.

Explicit exclusions: project permissions, team workflow, new project model.

Likely files: `PersonalPage.tsx`, `usePersonalView.ts`, `ProjectsPage.tsx`, `ProjectDetailPage.tsx`, project hooks.

Acceptance criteria:

- Project Detail shows issues in first viewport.
- Personal makes selected user's next work obvious in under 60 seconds.
- Projects index remains a compact chooser, not a report page.

Manual test: PM finds a delayed project issue in two route changes or fewer after reaching Project Detail.

Risk level: Medium.  
Suggested commit message: `feat: compact personal and project work surfaces`  
Separate explicit approval needed: No.

### Phase 5.9D - Issue Detail and Form Compression

Goal: turn Issue Detail/Edit/Create into focused work surfaces.

Scope:

- Issue Detail action strip first.
- Compact metadata; collapse history/dependencies where safe.
- Create/Edit required-first form grouping.
- Sticky or persistent save/cancel/return context.

Explicit exclusions: comments, notification subscriptions, workflow automation, permissions.

Likely files: `IssueDetailPage.tsx`, `IssueCreatePage.tsx`, `IssueEditPage.tsx`, `IssueFormFields.tsx`, issue hooks.

Acceptance criteria:

- Primary safe action is visible before deep scroll.
- Save/cancel/return behavior is predictable on desktop and mobile.
- Form no longer feels like a long admin document for simple edits.

Manual test: User opens Needs Update issue, performs safe action/edit, returns to source without confusion.

Risk level: Medium.  
Suggested commit message: `feat: compact issue work and edit flows`  
Separate explicit approval needed: No.

### Phase 5.9E - Mobile Survival Pass

Goal: prevent endless stacked scrolling and hidden actions on small screens.

Scope:

- Mobile Dashboard queue-first layout.
- Compact mobile headers.
- Sticky issue/form actions.
- Filter disclosures/tabs where appropriate.
- Validate tap targets and focus order.

Explicit exclusions: native app patterns, animation pass, bottom navigation redesign unless separately approved.

Likely files: `AppShell.tsx`, major feature pages, shared components, CSS.

Acceptance criteria:

- Dashboard, Personal, Project Detail, Issue Detail, and forms are usable at mobile width.
- Primary action and current context remain discoverable.
- Compactness does not remove labels or keyboard accessibility.

Manual test: 375px, 768px, desktop widths; keyboard tab through nav, filters, issue actions, forms.

Risk level: Medium-high.  
Suggested commit message: `feat: improve compact mobile work flows`  
Separate explicit approval needed: No.

### Phase 5.9F - Final Compact UX Audit

Goal: verify the corrected MVP before Phase 6.

Scope:

- Repeat first-60-seconds test.
- Repeat Manager/PM/User workflow traces.
- Check no frozen docs or architecture boundaries changed unexpectedly.
- Capture before/after screenshots if runtime is available.

Explicit exclusions: new features and scope expansion.

Likely files: audit docs only unless defects are found.

Acceptance criteria:

- New user can understand the product and next action in under 60 seconds.
- Common workflows do not require wandering between ambiguous routes.
- Phase 6 can begin without carrying unresolved P0/P1 UX debt.

Manual test: full role workflow walkthrough.

Risk level: Low.  
Suggested commit message: `docs: verify compact ux readiness`  
Separate explicit approval needed: No.

### Phase dependency map

- 5.9A1 must happen before Issue Detail/Form compression because return/source behavior affects deep pages.
- 5.9A2 should happen after or alongside A1, but it must not delay the route-return fix.
- 5.9B must happen before mobile survival because Dashboard order determines mobile stacking.
- 5.9C and 5.9D should happen after Dashboard because compact work-surface patterns should be proven on the primary assistant home first.
- 5.9E must come after the major desktop/layout changes; otherwise mobile fixes will be invalidated.
- 5.9F must remain audit-only.

### Phase 6 gate checklist

Phase 6 may begin only when:

- No P0 findings remain.
- P1 findings are fixed or explicitly accepted as MVP debt.
- Dashboard is action-first.
- Route return context is clear on Issue Detail/Edit and other deep work routes.
- First viewport is useful on Dashboard, Personal, Project Detail, and Issue Detail.
- Mobile survival pass is complete.
- Summary cards filter, preview, or route to precise work surfaces.
- Charts do not appear above the main action queue.
- Final compact UX audit passes.

## 16. Scope-control Boundary

Not allowed:

- Backend.
- Real auth.
- Notification hub.
- Employee scoring.
- Workflow engine.
- Organization workspace.
- New data model.
- Full product redesign.
- Brand redesign.
- Animation pass.
- Jira/Asana/Trello/CRM/helpdesk drift.
- Enterprise command palette unless separately approved.
- Removing `/personal` without separate explicit approval.

Allowed:

- Reorder existing blocks.
- Compress headers/cards/padding.
- Reduce helper copy.
- Make metrics/cards actionable.
- Collapse secondary information.
- Improve first-viewport utility.
- Improve wayfinding.
- Improve return paths.
- Use sidebar/topbar more efficiently.
- Preserve route model unless separately approved.
- Improve mobile-first responsive behavior.
- Preserve local-first repository/state/domain boundaries.
- Avoid UI-to-Dexie shortcuts.

Compactness guardrail:

- Do not solve density by hiding critical context.
- Critical next actions, selected-user context, current route/source, and the primary queue must remain visible.
- Use collapses/tabs/disclosures only for secondary information: charts, long metadata, activity history, helper copy, and advanced form fields.
- Compact UI must preserve readable labels, semantic buttons/links, visible focus, keyboard order, and usable tap targets.

Architecture guardrail: UI changes should continue to use existing hooks, repositories, state selectors, and domain helpers. Do not shortcut directly from UI components into Dexie or persistence internals.

## 17. Final Recommendation

Final choice: **Add/continue corrective Phase 5.9 before Phase 6.**

Recommended next concrete micro-phase: **Phase 5.9A1 - Route Wayfinding and Return Context**.

Then:

1. **Phase 5.9A2 - Compact AppShell and Header Compression**
2. **Phase 5.9B - Dashboard Action-first Recomposition**

This order is deliberate: the critical weakness is the feeling of wandering and not knowing how to return. Dashboard layout matters, but the first corrective slice should establish "where am I / how do I return / why am I here" across deep routes.

Top 5 P0/P1 blockers:

1. Dashboard is not action-first; Operational Queue appears after summaries and charts.
2. Route-hopping makes common work feel like wandering, even though the route tree is small.
3. Return/source context exists in code but is not visually dominant enough on deep issue/edit flows.
4. First viewport is spent on context, cards, metrics, and charts instead of work.
5. Mobile is likely to become endless stacked scrolling because desktop is already vertically heavy.

Implementation should begin: **Yes, but only as controlled Phase 5.9 corrective work, not as Phase 6.**

User complaint validated: **Yes.** The critique is especially correct about route behavior, navigation uncertainty, first-viewport weakness, and heavy visual density.

Biggest risk if ignored: the public portfolio demo will look functional but not product-sharp. It may demonstrate data and routing, but it will not convincingly feel like a compact operational assistant that reduces confusion.

Proposed commit message: `docs: expand compact ux and navigation review`
