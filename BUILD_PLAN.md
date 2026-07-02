# Build Plan

## Purpose

`BUILD_PLAN.md` is the practical implementation roadmap for the Portfolio MVP.

It defines:

- what gets built
- in what order
- what the current active phase is
- what acceptance criteria must be met before moving forward

This document must be used together with `changelog_checkpoint.md`.

- `BUILD_PLAN.md` defines the roadmap.
- `changelog_checkpoint.md` records the live implementation checkpoint and handoff state.

---

## Current Status

- Phase 0 — Product Discovery and Planning: `Completed`
- Phase 1 — Foundation / Repository Setup: `Completed`
- Phase 2A — Domain and Demo Data Foundation: `Next active phase`

---

## Phase 0 — Product Discovery and Planning

Status: `Completed`

Completed outcomes:

- product scope frozen
- technical planning completed
- user journey frozen
- documentation structure created

Source context:

- `docs/Portfolio_MVP_V1.txt`
- `docs/Technical_Planning_v1.txt`
- `docs/User_Journey_Freeze_v1.txt`

---

## Phase 1 — Foundation / Repository Setup

Status: `Completed`

Completed outcomes:

- React + TypeScript + Vite initialized
- Tailwind configured
- GitHub Pages-safe `HashRouter` selected
- placeholder routes created
- app shell created
- source folder structure prepared
- persistence placeholder files created
- build / typecheck / lint verified
- checkpoint and development notes updated

Completion notes:

- foundation remains frontend-only
- no backend or real auth added
- no product behavior implemented beyond placeholders and scaffolds

Reference:

- see `changelog_checkpoint.md` for the detailed file-level checkpoint

---

## Phase 2A — Domain and Demo Data Foundation

Status: `Next active phase`

Goal:

Define the typed operational model and the first usable local-first demo data layer without building issue workflows yet.

Work items:

- core TypeScript entity models
- role constants
- status constants
- priority constants
- issue type constants
- system label constants
- dependency type constants
- Dexie initial schema
- repository boundary placeholders
- first-load seed bootstrap
- reset demo data flow
- seed demo users
- seed teams
- seed projects
- seed issues
- seed tags
- seed activity history
- lightweight Zustand app state for:
  - current user
  - selected role
  - app lifecycle

Acceptance criteria:

- app can load seed data on first run
- reset demo data works
- demo users exist
- projects, issues, teams, and tags are represented in typed structures
- IndexedDB / Dexie foundation exists
- data access does not happen directly from UI components
- current demo user / role can be represented in app state
- build passes
- typecheck passes

Implementation constraints for Phase 2A:

- no backend
- no real authentication
- no issue CRUD UI yet
- no dashboard metrics logic yet
- no advanced permissions logic yet
- no production-grade persistence behavior

---

## Phase 2B — Issue Core Operations

Status: `Later`

Planned focus:

- issue create/edit foundations
- owner assignment and ownership transfer behavior
- status update behavior
- priority update behavior
- tag add/remove behavior
- curator handling for group issues
- activity history write behavior
- needs update calculation foundation
- confirmation-ready modeling where needed

---

## Phase 3 — Main Screens

Status: `Later`

Planned focus:

- Personal screen
- Projects screen
- Project detail screen
- Issue detail screen
- Team Workspace screen
- Demo controls screen

Goal:

Replace placeholder pages with real feature surfaces backed by repository/state boundaries.

---

## Phase 4 — Dashboard and Operational Metrics

Status: `Later`

Planned focus:

- dashboard metric cards
- blocked / delayed / needs update visibility
- issues by status
- issues by priority
- issues by project
- issues by owner
- project progress
- team progress
- personal progress

Goal:

Turn the dashboard into the primary operational entry point for the portfolio demo.

---

## Phase 5 — Portfolio Polish

Status: `Later`

Planned focus:

- filter refinement
- basic search
- quick action polish
- helper text and empty states
- responsive cleanup
- visual polish for screenshots/demo
- demo reset validation UX
- README presentation improvements

---

## Phase 6 — Quality and Final Review

Status: `Later`

Planned focus:

- validation checks
- edge-case review
- lint/typecheck/build verification
- focused testing where needed
- GitHub Pages deployment readiness review
- final scope audit against frozen docs
- final documentation cleanup

---

## Scope Guardrails

Portfolio MVP must not implement:

- backend
- real authentication
- attachments
- integrations
- notification hub
- organization workspace
- employee scoring
- AI agent behavior
- heavy permissions
- enterprise workflow builder

Also avoid:

- silent scope expansion
- enterprise workflow complexity
- turning the product into Jira / Asana / Trello / CRM / helpdesk behavior

---

## Documentation Rules

- `changelog_checkpoint.md` is updated after every meaningful implementation step
- `DEVELOPMENT_NOTES.md` is updated only for meaningful decisions, trade-offs, bugs, workarounds, or lessons learned
- `README.md` is not a work log
- `docs/*` files are frozen planning context unless explicitly changed

---

## Working Rule

When implementation order feels unclear:

1. check frozen docs first
2. check `BUILD_PLAN.md` for phase order
3. check `changelog_checkpoint.md` for current handoff state
4. only then implement the next scoped step
