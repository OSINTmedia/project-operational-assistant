# Design Review — App Experience Inspection Act

## 1. Executive Verdict

Verdict: **App is functionally complete but not assistant-like yet**

Confidence level: **Medium**

Basis: code-first inspection of documentation and React source. Runtime/browser walkthrough was not used, so visual, responsive, and behavioral comfort conclusions should be treated as code-supported hypotheses until manually verified.

The user's complaint is **mostly valid**:

- The app has coherent routes and implemented screens, but most meaningful operations require full-page navigation.
- Selected demo user context is visible, but the app does not consistently answer "what should this selected user do next?"
- `Needs Update` is present in Dashboard, Personal, Projects, Project Detail, Issue Detail, and Teams, but it is not yet framed as a strong assistant-level queue.
- `Ready for Confirmation` / confirmation-needed visibility exists in Personal, Project Detail filters, and Issue Detail, but it is not prominent enough at the operational home level.
- Context recovery is partial: back links exist, but route transitions do not preserve origin, filters, scroll position, or "came from Dashboard/Personal/Teams" context.
- Issue quick actions exist, but mostly after the user reaches Issue Detail.

What is overstated:

- The app is not chaotic. The route tree is small, the screens are organized, and source boundaries are clean.
- Missing modals/drawers are not inherently a defect. Several operations, especially create/edit and full issue detail, are appropriate full-page routes.
- The app already has useful responsive patterns in code: mobile nav scroll, card/table swaps, responsive grids, and full-width mobile buttons.

Acceptable MVP limitations:

- No real permissions, real authentication, notification hub, organization workspace, or workflow engine.
- No command palette or enterprise search.
- No full design-system rewrite.
- No broad route replacement.

## 2. Product Experience Thesis

The app should feel like an operational assistant:

- The current operational state should be visible immediately.
- The selected user's relevant next actions should be visible without manual exploration.
- Update, confirmation, blocked, delayed, waiting, and ownership signals should be easy to find.
- Project context should be recoverable from issue inspection and edit flows.
- Issue inspection should be fast; deep full-page navigation should be reserved for deep reading or editing.
- The Dashboard should behave as the operational home, not only as charts plus a generic queue.
- Personal should clarify "my work" and should complement Dashboard rather than duplicate or compete with it.

Current implementation compared with that thesis:

- `src/app/router/AppRouter.tsx` provides a coherent static SPA route model with Dashboard, Personal, Projects, Project Detail, Issue Create, Issue Detail, Issue Edit, Teams, and Demo.
- `src/app/layout/AppShell.tsx` exposes global role switching and main nav, but the shell topbar mostly explains demo lifecycle and auth exclusion rather than selected-user action context.
- `src/features/dashboard/DashboardPage.tsx` shows metrics, charts, filters, and a queue, but the queue is global in feel. It does not yet become a role-aware "what should I do next?" assistant panel.
- `src/features/personal/PersonalPage.tsx` is closer to assistant behavior because it groups assigned, created, curated, needs-update, and confirmation work by current user.
- `src/features/issues/IssueDetailPage.tsx` has the strongest action layer through status and confirmation quick actions, but users must route-hop into Issue Detail before those actions are available.

## 3. Current Route Tree and Site Structure

| Route | Screen/component | Primary user intent | Current role in workflow | Destination or transitional page? | Context retained? | Context lost? | Page-hopping risk | Recommendation |
|---|---|---|---|---|---|---|---|---|
| `/` | `Navigate` in `src/app/router/AppRouter.tsx` | Enter app | Sends visitor to Dashboard | Transitional | None needed | None | Low | Keep. Root redirect supports Dashboard-first journey. |
| `/dashboard` | `DashboardPage` | See operational state and filtered issue queue | Main operational entry | Destination | Selected user name/role shown; filters local | Does not preserve prior route or source context | Medium | Keep full page. Add role-aware next-action panel in 5.8B. |
| `/personal` | `PersonalPage` | See current user's assigned/created/curated/attention work | Personal work surface | Destination | Current user and role shown | No route-origin context after issue drill-in | Medium | Keep full page. Strengthen "my next actions" and confirmation/update grouping. |
| `/projects` | `ProjectsPage` | Scan project health and open project | Project navigation | Destination | Current user shown; project summaries retained in screen | Returning from detail loses previous scroll/table position by default | Medium | Keep full page. Improve context return and possibly expandable project summaries. |
| `/projects/:projectId` | `ProjectDetailPage` | Inspect project context and project issue list | Project detail and issue list | Destination | Project context visible; Back to Projects exists | Filters/search not preserved through issue detail/edit flow | High | Keep full page. Add stronger breadcrumbs and consider issue preview drawer/inline expansion. |
| `/projects/:projectId/issues/new` | `IssueCreatePage` | Create project-scoped issue | Deep create work | Transitional/deep work | Project id in route; cancel/back to project | No compact create mode; save returns to Project Detail | Medium | Keep full page for MVP. Consider later compact create only if audit proves form friction. |
| `/issues/:issueId` | `IssueDetailPage` | Inspect issue details, activity, and quick actions | Deep issue detail/action surface | Destination | Project link/back to project; issue metadata retained | Origin lost if opened from Dashboard, Personal, or Teams | High | Keep full page for deep inspection. Add origin-aware back/breadcrumbs and preview drawer candidates. |
| `/issues/:issueId/edit` | `IssueEditPage` | Edit structured issue fields | Deep edit work | Transitional/deep work | Back/cancel to Issue Detail | Save returns to Project Detail, even if opened from Personal/Dashboard/Teams | High | Keep full page, but fix return semantics and context header in 5.8C. |
| `/teams` | `TeamsPage` | See team members, team issues, group issues | Team workspace | Destination | Current team prioritized | Links only to issues; project context is weak | Medium | Keep full page. Add project context links and reduce isolation. |
| `/demo` | `DemoPage` | Switch demo role and reset seed data | Support route | Destination/support | Role switch shared with shell | Switching role does not point user to relevant work | Low/Medium | Keep. Add "where to inspect after switching" guidance or route links if needed. |

## 4. Full Workflow Tree / Operation Inventory

| Operation | Role(s) | Entry point | Current route/screen | Current steps | Expected user goal | Current friction | Full page navigation? | Better pattern candidate | Should remain full page? | Severity | Recommended Phase 5.8 target |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Open app | All | Root | `/` to `/dashboard` | Load app, initialize seed data, redirect | Reach operational home | Good route behavior; runtime not verified | Yes | None | Yes | Not an issue | None |
| Understand selected role/user | All | Sidebar, page headers | `AppShell`, feature headers | Read role switcher and current-user boxes | Know whose perspective is active | Visible but repeated, not action-oriented | No | Sticky selected-user action strip | No | P1 | 5.8B |
| Switch demo role/user | All | Sidebar or Demo | `DemoRoleSwitcher`, `DemoPage` | Click role button | Compare perspectives | Switches role to first user in role; does not explain next best route | No | Role-aware post-switch guidance | No | P2 | 5.8B |
| Reset demo data | All | Demo | `/demo` | Native confirm, reset local seed | Restore demo state | Native confirm is acceptable but not styled | No route change | Later custom confirm only if needed | No | P3 | Post-MVP or 5.8E if mobile issue |
| Understand product | Portfolio visitor | README, Dashboard, Demo | `/dashboard`, `/demo` | Read helper text | Understand product value | Dashboard explains concepts but not "next action" enough | No | Assistant home copy/action panel | No | P1 | 5.8B |
| View operational summary | Manager, PM | Dashboard | `/dashboard` | Review metric cards/charts | See state quickly | Strong counts, but not role-prioritized | No | Role-aware summary panel | No | P1 | 5.8B |
| Identify open/done/waiting/blocked/delayed/needs-update counts | Manager, PM | Dashboard | `/dashboard` | Scan cards | Spot risks | Works in code; runtime visual hierarchy unverified | No | Group risk cards above general counts | No | P2 | 5.8B |
| Filter dashboard queue | Manager, PM | Dashboard queue | `/dashboard` | Select status/priority/project/attention | Narrow operational list | Works locally; queue can still feel like report list | No | Saved state not needed; improve labels | No | P2 | 5.8B/5.8E |
| Search dashboard queue | Manager, PM | Dashboard queue | `/dashboard` | Search input | Find issue | Works local to queue | No | None | No | P3 | 5.8E if mobile friction |
| Inspect dashboard issue | Manager, PM | Dashboard issue card | `/dashboard` to `/issues/:issueId` | Click Open issue | Understand issue context | Full-page hop loses dashboard filter origin | Yes | Issue preview drawer or origin-aware breadcrumb | Mixed | P1 | 5.8C/5.8D |
| Navigate dashboard to project | Manager, PM | Dashboard issue/project links | `/dashboard` to `/projects/:projectId` or `/projects` | Click project | Recover project context | Filter context lost | Yes | Breadcrumb/origin chip; maybe project preview | Mixed | P2 | 5.8C/5.8D |
| Understand charts | Manager | Dashboard | `/dashboard` | Read Recharts panels | See distribution | Code supports charts; mobile/runtime unknown | No | Manual responsive check | No | P2 | 5.8E |
| Understand selected-user relevance | All | Dashboard | `/dashboard` | Read current-user badge and queue | Know what belongs to me | Dashboard data feels global despite selected-user label | No | "My next actions" and "workspace risks" split | No | P0/P1 | 5.8B |
| Find assigned issues | User, PM | Personal | `/personal` | Open Personal, scan Assigned | Know my work | Good grouping; hidden behind separate nav | Yes from Dashboard | Surface summary on Dashboard | No | P1 | 5.8B |
| Find created issues | PM, User | Personal | `/personal` | Scan Created | Monitor opened work | Good but may duplicate project flow | Yes | Keep, add summary links | No | P2 | 5.8B |
| Find curated issues | PM | Personal | `/personal` | Scan Curated | Maintain group context | Good concept; curator responsibility could be stronger | Yes | Assistant action queue | No | P1 | 5.8B |
| Identify needs-update items | All | Dashboard, Personal, Projects, Project Detail, Teams, Issue Detail | Multiple | Scan cards/filters/badges | Refresh stale context | Visible but fragmented | Sometimes | Consolidated action queue and filters | No | P1 | 5.8B |
| Identify confirmation-related items | User, PM | Personal, Project Detail, Issue Detail | `/personal`, `/projects/:id`, `/issues/:id` | Scan confirmation section/filter/detail | Confirm waiting work | Dashboard lacks strong confirmation queue | Sometimes | Add confirmation-needed assistant queue | No | P1 | 5.8B |
| Navigate Personal issue to Issue Detail | User, PM | Personal card | `/personal` to `/issues/:issueId` | Click card | Inspect work | Origin lost after edit; back goes to project | Yes | Origin-aware back; maybe inline preview | Mixed | P1 | 5.8C/5.8D |
| Recover after returning from Personal | User, PM | Browser/back/manual nav | `/issues/:id` or `/projects/:id` | Back or nav | Return to personal work | Not guaranteed because links point to project/edit returns | Yes | Breadcrumb/source context | No | P1 | 5.8C |
| Scan projects | Manager, PM | Projects nav | `/projects` | Review summary cards/table | Understand portfolio | Good for project list | Yes | Maybe project row expansion | Yes | P2 | 5.8D |
| Open Project Detail | Manager, PM | Project cards/table | `/projects/:projectId` | Click View | Drill into project | Good but full route | Yes | Keep; add context preservation | Yes | P2 | 5.8C |
| Return to Projects | Manager, PM | Back link | `/projects/:projectId` | Click Back to Projects | Restore list | Link exists; scroll/filter not preserved | Yes | Route state or context header | No | P2 | 5.8C |
| Identify project issues | PM | Project Detail | `/projects/:projectId` | Scan issue cards | See project work | Works, but issue inspection requires full hop | No then yes | Inline issue preview/drawer | Mixed | P1 | 5.8D |
| Search/filter project issues | PM | Project Detail | `/projects/:projectId` | Search/select filters | Narrow issues | Good local controls; runtime mobile unknown | No | Collapsible filters on mobile | No | P2 | 5.8E |
| Create issue from project | PM | Project Detail | `/projects/:id/issues/new` | Click Create issue, fill form, save | Add issue | Full route is acceptable; form is dense | Yes | Keep full page; maybe collapsible advanced fields | Yes | P2 | 5.8E/Post-MVP |
| Inspect issue without losing project context | Manager, PM, User | Project Detail issue card | `/issues/:issueId` | Click issue | Read details | Project list context lost | Yes | Preview drawer or side panel | No for light inspect; yes for deep detail | P1 | 5.8D |
| View issue detail | All | Dashboard/Personal/Project/Team | `/issues/:issueId` | Open issue | Understand all fields | Detail is complete but dense | Yes | Keep; improve context header | Yes | P2 | 5.8C/5.8E |
| Understand owner | All | Issue Detail, Personal, Project cards | Multiple | Read owner metadata | Know next action owner | Present but not always emphasized as next action | No | "Next action owner" label | No | P1 | 5.8B |
| Understand curator | PM, Manager | Issue Detail, Teams, Project cards | Multiple | Read curator helper/context | Know context holder | Present; could be clearer in group issue lists | No | Curator tooltip/helper in list | No | P2 | 5.8B |
| Understand labels/tags/status/priority | All | Issue cards/detail/forms | Multiple | Read badges/metadata | Parse issue meaning | Works with Badge component | No | None except hierarchy tune | No | P2 | 5.8E |
| Understand dependency | PM, User | Issue Detail/Edit/Create | `/issues/:id`, forms | Read dependency card/select | Know waiting target | Detail has dependency; cards mostly omit it | Sometimes | Preview dependency in issue cards | No | P2 | 5.8B/5.8D |
| Understand activity history | PM, Manager | Issue Detail | `/issues/:id` | Scroll activity | Audit changes | Full detail appropriate | Yes | Keep full page | Yes | Not an issue | None |
| Use quick status actions | PM, User | Issue Detail | `/issues/:id` | Click status action | Update status quickly | Requires Issue Detail route | Yes | Add scoped list-level quick actions only after context review | Maybe | P2 | 5.8D or post-MVP |
| Request confirmation | PM, User | Issue Detail | `/issues/:id` | Click request confirmation | Mark ready | Action exists but discoverability is low | Yes | Add assistant queue and clearer badge | No | P1 | 5.8B |
| Confirm issue | User, PM | Issue Detail | `/issues/:id` | Click confirm issue | Accept work | Action exists but finding pending confirmations takes effort | Yes | Confirmation-needed queue | No | P1 | 5.8B |
| Understand disabled actions | All | Issue Detail | `/issues/:id` | Read disabled reason text | Know why blocked | Good code-level support | No | Runtime accessibility check | No | P3 | 5.8F |
| Edit issue | PM, User | Issue Detail | `/issues/:id/edit` | Click edit, save | Change structured fields | Full route acceptable; return path questionable | Yes | Improve return/origin logic | Yes | P1 | 5.8C |
| Return after edit | All | Edit form save/cancel | `/issues/:id/edit` | Cancel to detail, save to project | Recover context | Save always returns to Project Detail | Yes | Source-aware return or post-save issue context | No | P1 | 5.8C |
| Create issue structured fields | PM | Create form | `/projects/:id/issues/new` | Fill selects/checks | Structured issue creation | Dense but scoped | Yes | Collapsible advanced fields optional | Yes | P2 | 5.8E/Post-MVP |
| Understand required fields | PM | Create/Edit | forms | Read validation message | Complete form | Blocking messages present | No | Runtime check | No | P3 | 5.8F |
| Cancel and return | PM, User | Create/Edit | forms | Click cancel/back | Exit form | Cancel routes are present | Yes | Keep; add specific labels | Yes | P3 | 5.8C |
| Save and see result | PM, User | Create/Edit | forms | Submit | Confirm saved state | Create/edit return to Project Detail | Yes | Context-aware success route/message | No | P1/P2 | 5.8C |
| Understand system labels are not ordinary tags/statuses | PM, User | Forms/Issue/Dashboard | Multiple | Read helper text | Avoid semantic confusion | Good code-level copy | No | Keep | No | Not an issue | None |
| Understand team workspace | Manager, PM | Teams | `/teams` | Scan teams | Team-level visibility | Useful, but isolated from projects | Yes | Add project links/context | No | P2 | 5.8C |
| Identify team members | Manager, PM | Teams | `/teams` | Scan member badges | Understand team composition | Works | No | None | No | P3 | 5.8E |
| Identify team issues | Manager, PM | Teams | `/teams` | Scan team issues | See team work | Links to issues only | No then yes | Include project link/preview | No | P2 | 5.8C/5.8D |
| Identify group issues | PM | Teams | `/teams` | Scan group issues | Manage coordination | Curator concept present | No then yes | Add owner/curator/action emphasis | No | P2 | 5.8B |
| Navigate mobile app | All | App shell | all routes | Horizontal nav | Move between top-level sections | Code has overflow-x nav; runtime needed | No | Maybe improved mobile nav after test | No | P2 | 5.8E |
| Use filters/search on mobile | All | Dashboard/Project Detail | routes | Inputs/selects | Narrow lists | Code uses full-width controls; chart/list density unknown | No | Collapsible filters if visual clutter confirmed | No | P2 | 5.8E |
| Use forms on mobile | PM/User | Create/Edit | routes | Fill many fields | Create/edit work | Likely long scroll | Yes | Collapsible advanced fields | Yes | P2 | 5.8E/Post-MVP |
| Use quick actions on mobile | PM/User | Issue Detail | `/issues/:id` | Tap action cards | Status/confirmation update | Code grids wrap; runtime tap check needed | No | Sticky context/action bar maybe | No | P2 | 5.8E |

## 5. Role-based Journey Audit

### Manager

Questions:

- What does Manager see first? Dashboard via root redirect.
- Can Manager understand operational health quickly? Mostly yes through metric cards and charts.
- Can Manager identify blocked/delayed/needs-update work? Yes globally, but not as an assistant-prioritized risk list.
- Can Manager move from summary to context without wandering? Partially. Dashboard queue links to issues/projects, but origin/filter context is lost.
- Does UI avoid employee-scoring interpretation? Mostly yes. Copy explicitly avoids scoring, and metrics are issue/project based.

Scores:

| Dimension | Score |
|---|---:|
| orientation | 4 |
| next-action clarity | 2 |
| dashboard usefulness | 4 |
| project visibility | 4 |
| navigation comfort | 3 |
| assistant-like feel | 2 |

### Project Manager

Questions:

- Can PM identify project-specific work? Yes through Projects and Project Detail.
- Can PM create/update issues efficiently? Create/Edit exist; quick status actions exist on Issue Detail.
- Can PM understand ownership/curator/context quickly? Yes in detail views; less strong in lists.
- Can PM see confirmation/update responsibility? Needs Update visible; confirmation visibility is fragmented.
- Does PM have to jump between too many pages? Yes for project issue inspection and edit loops.

Scores:

| Dimension | Score |
|---|---:|
| orientation | 3 |
| next-action clarity | 2 |
| project workflow comfort | 3 |
| issue workflow comfort | 3 |
| navigation comfort | 2 |
| assistant-like feel | 2 |

### User

Questions:

- Can User immediately see "my work"? Yes if they know to open Personal.
- Can User tell whether something needs their confirmation? Partially through Personal confirmation section, but not clearly from Dashboard.
- Can User tell whether something needs update? Yes in Personal and labels, but it requires navigation.
- Can User act without exploring projects manually? Partially; Personal links to Issue Detail actions.
- Does selected demo user context actually change what feels relevant? Yes on Personal and Teams; Dashboard feels less role-specific.

Scores:

| Dimension | Score |
|---|---:|
| orientation | 3 |
| my-work visibility | 3 |
| confirmation clarity | 2 |
| needs-update clarity | 3 |
| navigation comfort | 2 |
| assistant-like feel | 2 |

## 6. Screen-by-screen UX Diagnosis

### Dashboard

- Current purpose: operational overview, metrics, charts, filtered queue.
- What works: strong metric coverage, `Needs Update` explanation, local search/filter, links to issue and project routes.
- What fails: role/user context is present but not used enough to show "my next actions."
- What is overloaded: cards + explanation + charts + queue can feel like a dashboard/report rather than assistant home.
- What is hidden: confirmation-needed work is not first-class.
- Too many clicks: queue issue inspection requires full Issue Detail route.
- Context lost: Dashboard filter/search context is not carried into Issue Detail.
- "Where am I?": acceptable at route level.
- "What do I do next?": weak.
- Opportunities: assistant panel, role-aware queue, inline issue preview/drawer for light inspection.
- Responsive concerns: charts and queue need runtime validation at mobile widths.
- Accessibility concerns: chart meaning may require non-visual backup; code has labels but runtime screen-reader review needed.
- Recommended fixes: 5.8B role-aware action panel; 5.8D preview drawer for queue items only if it reduces route hops.
- Severity: P1.

### Personal

- Current purpose: current-user issue relationships.
- What works: assigned, created, curated, needs-update, confirmation sections.
- What fails: it is separate from Dashboard, so users must know to go there for "my work."
- What is overloaded: section cards can become long if dataset grows.
- What is hidden: confirmation is lower in the page and visually secondary.
- Too many clicks: Personal issue -> detail -> edit -> Project Detail can lose Personal context.
- Context lost: origin is not preserved after issue edit.
- Opportunities: "my next actions" summary, collapsible sections if lists grow, origin-aware return links.
- Responsive concerns: issue cards likely usable but long-scroll risk exists.
- Accessibility concerns: issue card as whole link is acceptable but needs focus verification.
- Recommended fixes: 5.8B assistant summaries; 5.8C origin-aware breadcrumbs.
- Severity: P1.

### Projects

- Current purpose: project scan and project-detail navigation.
- What works: responsive card/table split, issue/attention counts, project summaries.
- What fails: it is a project catalog, not an assistant surface.
- What is overloaded: desktop table is dense but appropriate.
- What is hidden: role-specific project relevance.
- Too many clicks: project -> detail -> issue -> edit route chain.
- Context lost: return from detail may not restore scroll/table position.
- Opportunities: row expansion/project preview for lightweight scan; stronger "risk projects first" ordering already partially supported by active issue sort.
- Responsive concerns: card/table switch must be runtime checked.
- Recommended fixes: 5.8C context recovery; maybe 5.8D project row expansion.
- Severity: P2.

### Project Detail

- Current purpose: project context, metrics, filtered issue list, create entry.
- What works: clear back link, project metadata, filters/search, create issue entry, issue cards.
- What fails: issue inspection always leaves project context.
- What is overloaded: filter section and issue cards can create long pages.
- What is hidden: dependencies and confirmation responsibility are not highlighted in issue cards beyond labels.
- Too many clicks: scan issue -> open detail -> edit -> save -> return project.
- Context lost: filters/search not preserved through detail/edit route.
- Opportunities: issue preview drawer, inline issue expansion, collapsible filters on mobile.
- Responsive concerns: dense filter controls need mobile runtime verification.
- Recommended fixes: 5.8C breadcrumbs/filter context; 5.8D scoped issue preview.
- Severity: P1.

### Issue Detail

- Current purpose: deep issue inspection, metadata, quick actions, activity history.
- What works: rich context, quick actions, disabled-state messages, owner/curator/label/dependency/activity visibility.
- What fails: it is required for almost every action and inspection.
- What is overloaded: lots of metadata cards and helper panels.
- What is hidden: origin context from Dashboard/Personal/Teams.
- Too many clicks: edit route required for owner/curator changes; acceptable, but return behavior is weak.
- Context lost: "Back to Project" ignores origin if user came from Dashboard, Personal, or Teams.
- Opportunities: sticky context header, origin-aware breadcrumb, keep Issue Detail as deep route but add preview options upstream.
- Responsive concerns: quick action grid and metadata density need mobile review.
- Recommended fixes: 5.8C context header; 5.8E responsive action layout check.
- Severity: P1.

### Issue Create

- Current purpose: project-scoped issue creation.
- What works: structured fields, project context, clear cancel/save, system label boundary.
- What fails: form is dense; quick-create intent from frozen user journey is not fully reflected.
- What is overloaded: all fields appear together.
- Context lost: minimal; route is project-scoped and save returns to Project Detail.
- Opportunities: progressive disclosure for advanced fields, but do not rush this before 5.8B/C.
- Responsive concerns: long mobile form likely needs runtime review.
- Recommended fixes: 5.8E form comfort; post-MVP quick-create if needed.
- Severity: P2.

### Issue Edit

- Current purpose: structured issue editing.
- What works: prefill, validation, cancel to Issue Detail, system labels read-only, domain-backed save.
- What fails: save returns to Project Detail even if user came from Dashboard, Personal, or Teams.
- What is overloaded: all fields together, but acceptable for deep edit.
- Context lost: origin and current issue-detail context after save.
- Opportunities: source-aware return, success message, breadcrumb.
- Responsive concerns: same as Create.
- Recommended fixes: 5.8C return-flow correction.
- Severity: P1.

### Team Workspace

- Current purpose: team members, team issues, group issues, status summaries.
- What works: current team prioritized, group issue context, links to issues.
- What fails: Team Workspace feels isolated from project context.
- What is hidden: project navigation from team issue cards.
- Too many clicks: team issue -> issue detail -> back to project, not team.
- Context lost: team origin disappears after issue route.
- Opportunities: add project links, origin-aware issue return, maybe inline team issue preview.
- Responsive concerns: multi-column team cards need runtime check.
- Recommended fixes: 5.8C team/project context links; 5.8D preview only if useful.
- Severity: P2.

### Demo / Role Switch

- Current purpose: role switch and reset local demo data.
- What works: explicit no-auth framing, reused role switcher, reset guard.
- What fails: role switch does not guide the user to role-relevant work.
- What is hidden: individual demo users within each role; role switch picks first matching role.
- Opportunities: after switching, show "try Dashboard / Personal" links or selected-user responsibility counts.
- Responsive concerns: low risk.
- Recommended fixes: 5.8B selected-user orientation.
- Severity: P2.

### App Shell / Sidebar / Topbar

- Current purpose: global nav, role switch, lifecycle/auth-scope messaging.
- What works: HashRouter-compatible nav, mobile horizontal nav, visible role switch.
- What fails: topbar uses valuable global space for lifecycle/auth messages rather than operational context.
- What is hidden: current user's next responsibilities.
- Opportunities: convert header into selected-user context/action strip; keep auth exclusion less prominent.
- Responsive concerns: horizontal nav should be runtime-tested for overflow and tap comfort.
- Recommended fixes: 5.8B shell action context; 5.8E mobile nav review.
- Severity: P1.

## 7. Page-hopping and Context-loss Map

| Flow | Current path | Route hops | Context lost? | Why it feels bad | Better pattern | Recommended fix | Phase 5.8 slice |
|---|---|---:|---|---|---|---|---|
| Dashboard -> Issue Detail -> Edit -> Project Detail | `/dashboard` -> `/issues/:id` -> `/issues/:id/edit` -> `/projects/:projectId` | 3 | Yes | User starts from filtered queue but lands in project after edit. | Origin-aware return + issue context header | Preserve origin route/filter label; return to Issue or origin after save. | 5.8C |
| Project Detail -> Issue Detail -> Edit -> Project Detail | `/projects/:id` -> `/issues/:id` -> `/issues/:id/edit` -> `/projects/:id` | 3 | Partially | Project context returns, but filters/search are lost. | Preserve project filter context or use preview. | Add breadcrumbs and consider issue preview drawer. | 5.8C/5.8D |
| Personal -> Issue Detail -> Edit -> Project Detail | `/personal` -> `/issues/:id` -> `/issues/:id/edit` -> `/projects/:id` | 3 | Yes | User's personal-work context disappears after save. | Source-aware return | Return to Issue Detail or Personal with success context. | 5.8C |
| Dashboard filtered queue -> Project Detail -> Issue Detail -> back | `/dashboard` -> `/projects/:id` -> `/issues/:id` | 2+ | Yes | Dashboard filters do not carry forward. | Breadcrumb/origin chip | Show "From Dashboard queue" and back target. | 5.8C |
| Projects -> Project Detail -> Create Issue -> Project Detail | `/projects` -> `/projects/:id` -> `/projects/:id/issues/new` -> `/projects/:id` | 3 | Low/Medium | Reasonable, but full form is long. | Keep full page; optional advanced section collapse later. | Improve create context copy/mobile. | 5.8E |
| Teams -> Issue Detail -> Edit | `/teams` -> `/issues/:id` -> `/issues/:id/edit` | 2 | Yes | Team origin and team issue context vanish. | Origin-aware breadcrumb + project link | Add team/project source context on Issue Detail. | 5.8C |
| Demo role switch -> relevant work discovery | `/demo` or sidebar -> manual navigation | 0 route hops, then manual | Yes conceptually | Role changes but app does not point to role-relevant work. | Role-aware assistant panel | Add selected-user next actions on Dashboard/header. | 5.8B |

## 8. Modal / Drawer / Show-Hide Opportunity Map

| Pattern | Recommended? | Where it would apply | Why | Expected UX benefit | Implementation risk | Affected files | Product scope change? | Phase |
|---|---|---|---|---|---|---|---|---|
| Inline expansion | Recommended selectively | Project Detail issue cards, Personal sections | Lightweight inspection without route hop | Faster scan, preserved list context | Medium | `ProjectDetailPage.tsx`, `PersonalPage.tsx` | No | 5.8D |
| Collapsible issue groups | Maybe | Personal sections, Project filters on mobile | Reduces long-scroll burden | Better focus on mobile/dense screens | Low/Medium | `PersonalPage.tsx`, `ProjectDetailPage.tsx` | No | 5.8E |
| Project row expansion | Maybe | Projects desktop table/card list | Show recent issues without opening detail | Faster project scan | Medium | `ProjectsPage.tsx`, `useProjectsListView.ts` | No if read-only | 5.8D |
| Issue preview drawer | Recommended selectively | Dashboard queue, Project Detail issue list, Team issues | The core page-hopping reduction pattern | Inspect metadata/actions while preserving list context | Medium/High, accessibility required | Dashboard, Project Detail, Teams, shared component if created | No if read-only/limited action | 5.8D |
| Project preview drawer | Maybe | Dashboard project links, Projects list | Could avoid opening project detail for basic health | Faster summary check | Medium | Dashboard, Projects | No | 5.8D |
| Quick action panel | Already present; expand carefully | Issue Detail now; maybe selected list cards later | Actions are currently too deep | Faster status/confirmation action | Medium, risk of unsafe context | Issue Detail, maybe Dashboard/Personal later | No if existing domain actions reused | 5.8D/Post-MVP |
| Role-aware action queue | Recommended | Dashboard and maybe shell header | Directly addresses assistant gap | Shows next actions in 10 seconds | Medium | `DashboardPage.tsx`, `useDashboardMetrics.ts`, maybe Personal hook | No | 5.8B |
| Dashboard assistant panel | Recommended | Dashboard top area | Splits global metrics from "my next actions" | Makes Dashboard operational home | Medium | Dashboard files | No | 5.8B |
| Dropdown show/hide details | Maybe | Dense metadata and filters | Useful for secondary detail on mobile | Less overload | Low | Screen components | No | 5.8E |
| Contextual side panel | Maybe | Issue preview from lists | Same as drawer; use only for read/quick inspect | Preserves list context | Medium/High | Shared UI + feature pages | No | 5.8D |
| Sticky context header | Recommended | Issue Detail/Edit, Project Detail | Helps "where am I?" on long pages | Reduces disorientation | Low/Medium | Issue/Project pages, AppShell maybe | No | 5.8C/5.8E |
| Breadcrumbs | Recommended | Project Detail, Issue Detail, Edit/Create, Teams issue links | Strong low-risk context recovery | Predictable back paths | Low | Route screens | No | 5.8C |
| Mobile drawer navigation | Not recommended now | App shell | Current mobile nav exists; drawer would add complexity | Unclear benefit before runtime test | Medium | `AppShell.tsx` | No, but risk | Maybe 5.8E only if runtime fails |

## 9. Information Architecture Diagnosis

- Current route model is not too deep in absolute terms, but common workflows traverse too many full pages.
- Top-level navigation matches a product demo mental model: Dashboard, Personal, Projects, Team Workspace, Demo.
- Dashboard is the intended operational home, but current source makes it more of a metrics/reporting home than an assistant home.
- Personal overlaps with Dashboard in attention visibility but is more user-specific. This overlap is acceptable if Dashboard becomes "home + next actions" and Personal becomes "full my-work surface."
- Projects/Project Detail are dominant because issue creation and many issue lists originate there.
- Issue Detail is overused as a required step for inspection and action.
- Create/Edit should stay full-page for now because they are structured, high-context operations.
- Lightweight issue inspection from Dashboard, Project Detail, Personal, and Teams should be considered for inline/drawer treatment.
- Sidebar/topbar should make selected-user context and next action clearer; current auth/demo lifecycle messaging is less valuable during task completion.

## 10. Interaction Design Diagnosis

- Unclear actions: Dashboard queue gives links, but does not distinguish inspect vs act vs project context.
- Hidden actions: status/confirmation actions are hidden until Issue Detail.
- Disabled states: Issue Detail quick actions include disabled reasons, which is good.
- Confirmation affordances: present, but discovery is weak before Issue Detail/Personal.
- Needs-update affordances: present as counts and badges, but spread across screens.
- Too many separate pages: issue inspection and edit flows frequently leave the user's originating context.
- Lack of progressive disclosure: forms and detail screens present many fields at once.
- Lack of compact previews: no inline preview/drawer patterns exist.
- Over-exposed detail: Issue Detail has dense metadata and helper cards.
- Under-exposed next actions: no unified action queue for the selected user.

## 11. Visual Hierarchy and Working UI Diagnosis

Runtime was not used, so visual conclusions are code-supported only.

- Hierarchy likely guides the eye reasonably through repeated header/cards/sections.
- Cards and tables are dense but appropriate for operational SaaS; they risk feeling like admin pages when every action opens another full page.
- Labels/badges are meaningful and centralized through `src/shared/components/Badge.tsx`.
- Headings explain route context, but not always task context.
- Sections are logically grouped, especially in Issue Detail and Team Workspace.
- Primary/secondary actions are generally clear, but Issue Detail quick actions compete with heavy metadata.
- Repeated metadata appears across Dashboard, Projects, Project Detail, and Issue Detail; this supports clarity but adds scanning burden.
- The app is closer to a modern internal dashboard than an old admin website, but it lacks assistant-style guidance and context-preserving inspection.
- Phase 5 polish improved presentation; Phase 5.8 should focus interaction and information architecture, not brand redesign.

## 12. Responsive and Mobile UX Diagnosis

Runtime was not used. Ratings are code-first confidence estimates.

| Area | Rating | Specific issue | Recommended fix | Severity |
|---|---|---|---|---|
| Mobile navigation | Partially usable | App shell uses horizontal overflow nav; tap/scroll comfort unverified | Manual viewport test; improve only if friction appears | P2 |
| Dashboard cards/charts/filter/queue | Partially usable | Responsive grids exist, but charts and dense queue may be tall | Test mobile; consider collapsible filters or shorter assistant-first layout | P2 |
| Project list | Usable | Mobile card layout exists, desktop table hidden under `xl` | Verify card scan comfort | P3 |
| Project detail | Partially usable | Filters and issue cards stack; long scroll likely | Collapsible filters or sticky context if runtime confirms | P2 |
| Issue detail | Partially usable | Metadata, quick actions, activity, side panels become long sequence | Sticky context header; prioritize actions/labels | P2 |
| Create/Edit forms | Partially usable | Full structured form is long | Consider collapsible advanced fields after core nav fixes | P2 |
| Quick actions | Partially usable | Grid wraps; tap targets likely okay, but runtime needed | Verify tap comfort and disabled readability | P2 |
| Team workspace | Partially usable | Nested team cards and issue lists can become long | Add compact project/issue context and optional collapses | P2 |

## 13. Accessibility and Usability QA

- Heading hierarchy: generally route header `h2`; app title `h1` lives in shell. Runtime screen-reader flow should be checked because all routes share the same shell `h1`.
- Link vs button semantics: route navigation uses `Link`/`NavLink`; local actions use `button`; this is mostly correct.
- Keyboard/focus risks: no custom modal/drawer currently, so risk is lower. Any future drawer must handle focus trap, Escape, labels, and restore focus.
- Readable labels: native labels exist around inputs/selects in Dashboard, Project Detail, and forms.
- Screen-reader clarity: chart data may need table/text alternative if not already readable enough.
- Color/badge dependency: badge colors encode meaning, but text labels are present. Good.
- Tap targets: role switch buttons and action buttons appear reasonable in code, but mobile runtime test required.
- Scroll burden: high on Issue Detail, Create/Edit, Team Workspace, and Dashboard with charts/queue.
- Empty/error state clarity: present across major screens.

## 14. Severity-classified Findings

| ID | Title | Severity | Affected role(s) | Affected screen/route | Evidence | Impact | Recommended direction | Proposed Phase 5.8 slice | Scope risk |
|---|---|---|---|---|---|---|---|---|---|
| F-01 | Dashboard is not yet a selected-user assistant home | P1 | All | `/dashboard` | `DashboardPage` shows global metrics/queue plus current user label | User must infer relevant next actions | Add role-aware next-action panel and separate "my actions" from workspace risks | 5.8B | Low/Medium |
| F-02 | Confirmation-needed work is not prominent enough before detail | P1 | User, PM | Dashboard, Personal, Issue Detail | Confirmation appears in Personal and Issue Detail; Dashboard attention filter only has Needs Update | Users may miss pending confirmation work | Add confirmation-needed summary/action queue | 5.8B | Low |
| F-03 | Issue origin context is lost across Dashboard/Personal/Teams to Issue Detail/Edit | P1 | All | `/issues/:id`, `/issues/:id/edit` | Issue Detail back target is project; edit save returns project | Users lose where they came from | Origin-aware breadcrumbs/return behavior | 5.8C | Medium |
| F-04 | Project issue inspection requires full route hop | P1 | PM, Manager | `/projects/:projectId` to `/issues/:id` | Project issue card is a whole `Link` to Issue Detail | Filters/context disappear during light inspection | Issue preview drawer or inline expansion | 5.8D | Medium |
| F-05 | Personal to edit flow returns to project context | P1 | User, PM | `/personal` -> issue -> edit | `IssueEditPage` saves to `/projects/${savedIssue.projectId}` | Personal workflow feels interrupted | Save to Issue Detail or origin; show success | 5.8C | Medium |
| F-06 | Topbar space is not used for operational context | P1 | All | App shell | Header shows demo lifecycle/auth exclusion | Repeats portfolio constraint instead of task guidance | Use selected-user/current action context; keep auth note less dominant | 5.8B | Low |
| F-07 | Team Workspace is isolated from project context | P2 | Manager, PM | `/teams` | Team issue links go to Issue Detail; project links not visible in issue actions | Team flow loses project path | Add project links/context and origin-aware back | 5.8C | Low |
| F-08 | Create/Edit forms are dense on mobile | P2 | PM, User | create/edit routes | All fields rendered together | Long-scroll burden | Responsive audit; optional advanced-field collapse | 5.8E | Medium |
| F-09 | Dashboard charts may compete with action discovery | P2 | Manager, PM | `/dashboard` | Charts appear before operational queue | User may see reporting before action | Reorder or add assistant panel above charts | 5.8B | Low |
| F-10 | No inline preview/drawer/collapsible patterns exist | P2 | All | Lists and details | Grep found no modal/drawer/accordion; only native confirm | Every inspection tends toward route navigation | Add only scoped patterns where context loss is proven | 5.8D | Medium |
| F-11 | Role switch changes identity but not discovery path | P2 | Demo visitor | Sidebar, Demo | `setSelectedRole` updates user but no guidance appears | Visitor may switch role and not know what changed | Add selected-user counts/links after switch | 5.8B | Low |
| F-12 | Current route model is coherent | Not an issue | All | Router | Small HashRouter tree | Good architecture base | Preserve routes; do not rewrite router | All | Low |
| F-13 | Missing modal/drawer globally is not inherently a problem | Not an issue | All | App-wide | Several operations need full pages | Avoid pattern overuse | Use drawers only for preview/inspection | 5.8D | Medium |

## 15. Recommended Phase 5.8 Execution Plan

### 5.8B — Assistant Home and Role-aware Action Clarity

- Exact goal: make Dashboard/AppShell clearly answer "what matters for this selected demo user now?"
- Recommended scope:
  - Add selected-user action summary.
  - Surface assigned, curated, needs-update, confirmation-needed, blocked/delayed relevant counts.
  - Make Dashboard split explicit: "My next actions" and "Workspace risks."
  - Keep data local to existing repositories/hooks.
- What not to do:
  - No real permissions.
  - No notification system.
  - No employee scoring.
  - No workflow engine.
- Candidate files:
  - `src/features/dashboard/DashboardPage.tsx`
  - `src/features/dashboard/useDashboardMetrics.ts`
  - `src/features/personal/usePersonalView.ts`
  - `src/app/layout/AppShell.tsx`
- Acceptance criteria:
  - Selected user can identify next actions within 10 seconds.
  - Confirmation-needed and Needs Update work visible without hunting.
  - Dashboard remains operational, not a scorecard.
- Manual test plan:
  - Switch Manager, PM, User.
  - Open Dashboard.
  - Ask: "What should this user inspect or act on next?"
- Risk level: Medium.
- Suggested commit message: `feat: clarify role aware action experience`
- Split recommendation: Consider splitting into `5.8B1 Dashboard assistant panel` and `5.8B2 shell/role orientation` if implementation looks large.

### 5.8C — Navigation and Context Recovery Refinement

- Exact goal: make list -> detail -> edit -> return flows predictable.
- Recommended scope:
  - Add breadcrumbs/context labels.
  - Improve back labels and origin context.
  - Revisit edit save return path.
  - Add project/team/source context where missing.
- What not to do:
  - No router rewrite.
  - No global issue-list route unless separately approved.
- Candidate files:
  - `IssueDetailPage.tsx`
  - `IssueEditPage.tsx`
  - `ProjectDetailPage.tsx`
  - `TeamsPage.tsx`
  - `DashboardPage.tsx`
  - `PersonalPage.tsx`
- Acceptance criteria:
  - User knows where they are and how to return.
  - Personal/Dashboard/Teams origins are not overwritten by project-only return logic.
- Manual test plan:
  - Dashboard -> issue -> edit -> save.
  - Personal -> issue -> edit -> save.
  - Teams -> issue -> back.
- Risk level: Medium.
- Suggested commit message: `feat: refine navigation context`

### 5.8D — Inline Inspection and Reduced Route-hopping

- Exact goal: reduce full-page navigation for lightweight inspection.
- Recommended scope:
  - Add one scoped preview pattern first, likely issue preview from Project Detail or Dashboard queue.
  - Keep Issue Detail full page for deep inspection and activity history.
  - Keep create/edit full page.
- What not to do:
  - No modal/drawer framework rewrite.
  - No replacing every detail route.
  - No complex state machine.
- Candidate files:
  - `ProjectDetailPage.tsx`
  - `DashboardPage.tsx`
  - `TeamsPage.tsx`
  - maybe a small shared preview component after pattern is proven.
- Acceptance criteria:
  - Common inspection is faster.
  - Full routes still exist.
  - Accessibility is not weakened.
- Manual test plan:
  - Inspect issue from Project Detail without leaving project list.
  - Verify keyboard and Escape behavior if drawer is used.
- Risk level: Medium/High.
- Suggested commit message: `feat: reduce route hopping in app experience`
- Split recommendation: yes. Start with one route surface, not all lists.

### 5.8E — Responsive Interaction and Working-layout Pass

- Exact goal: verify and refine mobile/tablet usability after navigation changes.
- Recommended scope:
  - Test Dashboard, Project Detail, Issue Detail, Create/Edit, Teams.
  - Fix only issues caused or exposed by app-experience changes.
  - Consider collapsible filters/advanced form sections only if runtime shows real burden.
- What not to do:
  - No separate mobile product.
  - No unrelated visual redesign.
- Candidate files:
  - `AppShell.tsx`
  - Dashboard/Projects/Issues/Teams feature pages
  - possibly shared components introduced earlier.
- Acceptance criteria:
  - Major workflows usable on mobile/tablet.
  - No text overlap.
  - Actions remain visible and tappable.
- Manual test plan:
  - 390px, 768px, desktop widths.
  - Role switch, filter, inspect issue, quick action, create/edit.
- Risk level: Medium.
- Suggested commit message: `style: refine responsive app experience`

### 5.8F — Final App Experience Audit

- Exact goal: verify app is ready for Phase 6.
- Recommended scope:
  - Confirm assistant-like feel.
  - Confirm no scope creep.
  - Run build/typecheck/lint.
  - Update handoff docs.
- What not to do:
  - No new feature implementation during audit.
- Candidate files:
  - `changelog_checkpoint.md`
  - `DEVELOPMENT_NOTES.md` only if meaningful decisions occurred
  - maybe this `design_review.md` if final audit references it.
- Acceptance criteria:
  - Selected user sees next actions.
  - Dashboard works as home.
  - Confirmation/update responsibilities are discoverable.
  - Routes remain coherent.
- Manual test plan:
  - Repeat role-based and viewport verification.
- Risk level: Low.
- Suggested commit message: `chore: audit app experience refinement`

## 16. Quick Wins vs Structural Changes

Quick wins:

| Item | Benefit | Risk | Affected files | Suggested phase | Approval required? |
|---|---|---|---|---|---|
| Add Dashboard "My next actions" section | Strong assistant feel quickly | Medium data mapping | Dashboard hook/page | 5.8B | Yes, normal phase approval |
| Add confirmation-needed count to Dashboard | Fixes discoverability gap | Low/Medium | Dashboard hook/page | 5.8B | Yes |
| Improve AppShell header selected-user context | Better orientation across app | Low | `AppShell.tsx` | 5.8B | Yes |
| Add breadcrumbs/source labels to detail/edit pages | Reduces "where am I?" | Low/Medium | Issues/Projects/Teams pages | 5.8C | Yes |
| Add project links in Team issue cards | Reduces team isolation | Low | `TeamsPage.tsx` | 5.8C | Yes |
| Rename/improve back links based on context | Better return clarity | Low | Issue/Project pages | 5.8C | Yes |

Structural changes:

| Item | Benefit | Risk | Affected files | Suggested phase | Approval required? |
|---|---|---|---|---|---|
| Issue preview drawer from Project Detail | Major page-hop reduction | Medium/High | Project Detail + shared UI | 5.8D | Yes, explicit |
| Dashboard queue issue preview | Makes Dashboard more assistant-like | Medium/High | Dashboard + shared UI | 5.8D | Yes, explicit |
| Source-aware return state | Solves origin loss | Medium | Router links/detail/edit pages | 5.8C | Yes |
| Collapsible mobile filters | Reduces mobile clutter | Medium | Dashboard/Project Detail | 5.8E | Yes |
| Advanced-field collapse in forms | Reduces form burden | Medium | Issue forms | Post-5.8E or approved split | Yes |

## 17. Scope-control Boundary

Phase 5.8 must not implement:

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
- no enterprise search or command palette unless explicitly approved later
- no Jira/Asana/Trello/CRM/helpdesk drift
- no attachment behavior
- no external integrations

Allowed direction:

- Improve visibility of existing data.
- Improve navigation and context recovery.
- Add scoped UI interaction patterns only where they reduce friction.
- Preserve local-first architecture and existing domain/repository boundaries.

## 18. Proposed Success Criteria for App Experience Reconstruction

- Selected user can identify relevant next actions within 10 seconds.
- Needs-update and confirmation-needed items are visible without route hunting.
- Common issue inspection does not require full-page navigation unless deep work is needed.
- Dashboard feels like an operational home, not only charts.
- Project/issue/team context is recoverable from every major route.
- List -> detail -> edit -> return flows are predictable.
- Responsive layout remains usable on mobile and tablet.
- No product-scope creep introduced.
- `Needs Update` and `Ready for Confirmation` remain system labels.
- Build/typecheck/lint pass after implementation slices.

## 19. Manual Verification Script for the User

### Manager walkthrough

1. Open Dashboard.
2. Confirm you know which demo user/role is selected.
3. Ask: What is risky right now?
4. Find blocked/delayed/needs-update work.
5. Open one issue from the Dashboard queue.
6. Return to the previous context.
7. Confirm the UI does not feel like employee scoring.

### Project Manager walkthrough

1. Switch to Project Manager.
2. Open Dashboard.
3. Identify project-specific risks.
4. Open Projects, then Project Detail.
5. Search/filter project issues.
6. Create one issue from Project Detail.
7. Open an issue, edit it, save it.
8. Ask: Did I return where I expected?

### User walkthrough

1. Switch to User.
2. Open Dashboard.
3. Ask: Do I know what belongs to me?
4. Open Personal.
5. Find assigned, needs-update, and confirmation-related work.
6. Open one issue and use a safe quick action.
7. Ask: Do I understand what needs update or confirmation?

### Desktop viewport

- Verify Dashboard hierarchy.
- Verify Project Detail filters and issue cards.
- Verify Issue Detail quick action panel.
- Verify Teams issue cards and project context.

### Tablet viewport

- Verify nav remains understandable.
- Verify cards and filters do not overlap.
- Verify issue/action buttons remain clear.

### Mobile viewport

- Verify horizontal nav/tap comfort.
- Verify Dashboard filters and queue.
- Verify Project Detail filters.
- Verify Issue Detail quick actions.
- Verify Create/Edit form scroll and field clarity.

Questions for every walkthrough:

- Do I know where I am?
- Do I know what matters now?
- Do I know what belongs to me?
- Do I know what needs confirmation?
- Do I know what needs update?
- Can I inspect without losing context?
- Can I return without confusion?

## 20. Final Recommendation

Recommendation: **Split Phase 5.8B before implementation**

Recommended next concrete micro-phase:

- `Phase 5.8B1 — Dashboard Assistant Home and Selected-user Action Summary`

Reason:

The biggest validated problem is not first the absence of drawers. It is that the app does not yet make selected-user next actions obvious. A focused Dashboard/AppShell assistant-home slice should come before broader navigation and drawer work.

Implementation should begin only after the user approves the refined 5.8B split or confirms that 5.8B should remain one slice.

The user's complaint was validated: the app is implemented and coherent, but it currently asks users to manually infer too much from separate pages.

Biggest risk if Phase 5.8 is skipped:

- The public demo will look technically complete but will feel like a collection of admin screens instead of a productized operational assistant.
