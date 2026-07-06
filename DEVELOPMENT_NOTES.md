# Development Notes

## Purpose

This file captures implementation decisions, trade-offs, lessons learned, problems encountered, and reasoning that should not clutter README.md.

---

## Decision Log

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
