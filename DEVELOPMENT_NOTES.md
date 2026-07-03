# Development Notes

## Purpose

This file captures implementation decisions, trade-offs, lessons learned, problems encountered, and reasoning that should not clutter README.md.

---

## Decision Log

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
