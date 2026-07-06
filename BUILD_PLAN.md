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

Roadmap control rule:
"You must never implement a whole umbrella phase in one task. Each micro-phase must be implemented, reviewed, committed, and pushed separately."

---

## Phase 0 — Product Discovery and Planning

Status: `Completed`

Completed outcomes:

- product scope frozen
- technical planning completed
- user journey frozen
- documentation structure created

Source context:

- `docs/Portfolio_MVP_V1.md`
- `docs/Technical_Planning_v1.md`
- `docs/User_Journey_Freeze_v1.md`

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

Status: `Completed`

Goal:

Define the typed operational model and the first usable local-first demo data layer without building issue workflows yet.

Phase 2A umbrella scope:

- core TypeScript entity models
- role constants
- status constants
- priority constants
- issue type constants
- system label constants:
  - Needs Update
  - Ready for Confirmation
- source type constants if needed:
  - Email
  - Call
  - Meeting
  - Chat
  - Internal
  - Other
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

Phase 2A umbrella acceptance criteria:

- app can load seed data on first run
- reset demo data works
- demo users exist
- projects, issues, teams, and tags are represented in typed structures
- IndexedDB / Dexie foundation exists
- data access does not happen directly from UI components
- current demo user / role can be represented in app state
- build passes
- typecheck passes

Implementation constraints for Phase 2A umbrella:

- no backend
- no real authentication
- `Needs Update` and `Ready for Confirmation` remain system labels, not statuses and not tags
- no issue CRUD UI yet
- no dashboard metrics logic yet
- no advanced permissions logic yet
- no production-grade persistence behavior

### Phase 2A.1 — Core Domain Model / Type Contracts

Status: `Planned`

Goal:

Establish the typed operational vocabulary before any persistence or workflow behavior is added.

Scope:

- entity model types
- roles
- statuses
- priorities
- issue types
- system labels
- source types
- dependency types
- activity action types
- central exports

Explicit exclusions:

- Dexie schema
- seed data
- repositories
- Zustand state
- UI behavior
- issue workflows

Acceptance criteria:

- type contracts cover the frozen MVP entities and structured fields
- build / typecheck / lint pass
- no runtime behavior required

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: add core domain model contracts`

### Phase 2A.2 — Persistence Schema and Repository Boundaries

Status: `Planned`

Goal:

Create a safe persistence boundary that keeps data access out of UI components.

Scope:

- Dexie initial schema
- typed table names
- persistence adapter structure
- repository interfaces / placeholders for:
  - issues
  - projects
  - users
  - teams
  - statuses
  - tags
  - labels
  - activity history
- enforce no direct UI-to-Dexie access

Explicit exclusions:

- seed dataset
- issue CRUD UI
- dashboard metrics
- issue operations

Acceptance criteria:

- schema compiles
- repository boundary exists
- non-UI repository boundaries exist for all seed-backed core entities
- build / typecheck / lint pass

Verification requirements:

- schema compiles against Phase 2A.1 type contracts
- UI still depends on repository/state boundaries rather than Dexie directly
- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: add persistence schema and repository boundaries`

### Phase 2A.3 — Seed Demo Dataset

Status: `Planned`

Goal:

Define a typed demo dataset that expresses the MVP concepts before bootstrap logic is added.

Scope:

- demo users
- teams
- projects
- statuses
- tags
- system labels
- issues
- activity history examples
- ownership / curator examples

Explicit exclusions:

- reset behavior
- first-load bootstrap
- UI workflows
- dashboard metrics

Acceptance criteria:

- typed seed data compiles
- dataset reflects MVP concepts:
  - owner
  - curator
  - group issue
  - needs update label
  - ready for confirmation label

Verification requirements:

- typed seed dataset compiles
- dataset coverage is broad enough for later Personal / Projects / Dashboard work
- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: add typed demo seed dataset`

### Phase 2A.4 — First-load Bootstrap and Reset Demo Data

Status: `Planned`

Goal:

Make the local demo behave like a real first-run browser app without introducing production persistence complexity.

Scope:

- first-load seed initialization
- reset demo data flow
- persistence lifecycle helpers
- safe local browser demo behavior

Explicit exclusions:

- UI polish
- CRUD workflows
- metrics logic
- production persistence

Acceptance criteria:

- app can initialize local demo data
- reset function restores seed data
- build / typecheck / lint pass

Verification requirements:

- first-load bootstrap is idempotent enough for local demo use
- reset returns the app to seed state
- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: add demo data bootstrap and reset flow`

### Phase 2A.5 — Lightweight App State and Demo Role State

Status: `Planned`

Goal:

Represent demo user and role context in app state without introducing real auth.

Scope:

- Zustand state for current user
- selected demo role
- app lifecycle / loading state
- role switch state only

Explicit exclusions:

- real auth
- protected routes
- advanced permissions
- backend auth

Acceptance criteria:

- selected demo user / role can be represented
- no real authentication implemented

Verification requirements:

- app state can represent current demo identity without server/session logic
- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: add demo role app state`

### Phase 2A.6 — Phase 2A Integration Audit

Status: `Planned`

Goal:

Verify that the full Domain and Demo Data foundation is complete and still within scope before Issue Operations begin.

Scope:

- verify all Phase 2A acceptance criteria
- verify data access boundaries
- verify no Phase 2B / 3 / 4 work slipped in
- update checkpoint

Explicit exclusions:

- new feature work
- UI scope expansion
- dashboard metrics work

Acceptance criteria:

- all Phase 2A slices are complete
- no direct UI-to-Dexie access has slipped in
- next work can safely start at Phase 2B

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`
- checkpoint updated with completed 2A state

Suggested commit message:

- `chore: audit phase 2a foundation`

---

## Phase 2B — Issue Core Operations

Status: `Completed`

Goal:

Implement issue-domain behavior and repository-backed operations before UI workflows are expanded.

### Phase 2B.1 — Issue Repository Operations

Status: `Completed`

Goal:

Provide safe repository-level issue read/write capabilities without introducing forms or UI workflows.

Scope:

- create / update / read issue repository operations
- no UI forms yet
- activity-safe method boundaries

Explicit exclusions:

- issue creation UI
- dashboard metrics
- tag / label UX
- backend sync

Acceptance criteria:

- repository methods cover the required issue persistence surface for later services
- build / typecheck / lint pass

Verification requirements:

- repository methods compile against Phase 2A types and schema
- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: add issue repository operations`

### Phase 2B.2 — Issue Creation Service Foundation

Status: `Completed`

Goal:

Encode issue creation rules in application/domain logic before any form UI is connected.

Scope:

- create issue domain / application function
- default owner / curator rules
- basic validation boundary
- no UI form yet

Explicit exclusions:

- issue creation screen
- dashboard metrics
- advanced validation UX

Acceptance criteria:

- creation logic reflects frozen owner / curator rules
- build / typecheck / lint pass

Verification requirements:

- creation logic uses repository/state boundaries instead of UI coupling
- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: add issue creation service foundation`

### Phase 2B.3 — Status and Priority Update Operations

Status: `Completed`

Goal:

Implement structured state changes for status and priority with correct tracking metadata.

Scope:

- status update behavior
- priority update behavior
- `updatedAt` / `updatedBy` handling
- activity history write behavior

Explicit exclusions:

- quick action UI
- dashboard metrics
- notification behavior

Acceptance criteria:

- updates preserve activity history requirements from frozen docs
- build / typecheck / lint pass

Verification requirements:

- status and priority operations remain structured, not open-text
- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: add issue status and priority operations`

### Phase 2B.4 — Ownership and Curator Operations

Status: `Completed`

Goal:

Make responsibility transfer explicit and activity-safe before screen-level interactions are added.

Scope:

- owner transfer behavior
- curator change behavior
- group issue curator rules
- activity history write behavior

Explicit exclusions:

- notification hub
- employee monitoring behavior
- advanced permissions

Acceptance criteria:

- ownership and curator rules match frozen product definitions
- build / typecheck / lint pass

Verification requirements:

- transfer logic preserves "whose side is the next action on" modeling
- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: add ownership and curator operations`

### Phase 2B.5 — Tag and Label Operations

Status: `Completed`

Goal:

Implement structured tag and label mutation rules while keeping system labels distinct from statuses and tags.

Scope:

- tag add / remove behavior
- duplicate tag prevention
- system label handling
- keep `Needs Update` / `Ready for Confirmation` as labels

Explicit exclusions:

- tag management UI polish
- full search / filter UX
- external connectors

Acceptance criteria:

- labels and tags remain semantically distinct
- build / typecheck / lint pass

Verification requirements:

- system labels never drift into status/tag categories
- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: add tag and label operations`

### Phase 2B.6 — Needs Update and Confirmation Logic Foundation

Status: `Completed`

Goal:

Implement lightweight attention and confirmation logic without turning the app into a heavy approval workflow.

Scope:

- needs update calculation
- ready for confirmation modeling
- lightweight confirmation state transitions
- no heavy approval workflow

Explicit exclusions:

- dashboard visuals
- notification hub
- enterprise approval chains

Acceptance criteria:

- needs update and confirmation logic match frozen docs
- build / typecheck / lint pass

Verification requirements:

- `Needs Update` and `Ready for Confirmation` remain labels, not statuses
- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: add attention and confirmation logic`

### Phase 2B.7 — Phase 2B Audit

Status: `Completed`

Goal:

Audit issue-domain behavior before Main Screens begin using it.

Scope:

- verify issue operations against frozen docs
- verify no UI scope creep
- verify no backend / auth / notification behavior

Explicit exclusions:

- new feature work
- dashboard implementation
- screen polish

Acceptance criteria:

- Phase 2B behavior aligns with frozen product rules
- next work can safely move into screens

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `chore: audit phase 2b issue operations`

---

## Phase 3 — Main Screens

Status: `Next active phase`

Goal:

Replace placeholder pages with real feature surfaces backed by repository/state boundaries.

### Phase 3.1 — Demo Controls and Role Switch UI

Status: `Next active phase`

Goal:

Connect demo controls to the local app lifecycle before feature screens depend on them.

Scope:

- demo page controls
- role switch UI connected to app state
- reset data action exposed safely

Explicit exclusions:

- real auth
- permissions matrix
- deployment controls

Acceptance criteria:

- demo role switching is wired to app state only
- reset action is exposed without unsafe destructive behavior

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: add demo controls and role switch`

### Phase 3.2 — Personal View

Status: `Later`

Goal:

Deliver the first user-centered operational screen based on structured issue ownership relationships.

Scope:

- assigned to me
- created by me
- curated by me
- needs update
- confirmation-related placeholders if ready

Explicit exclusions:

- dashboard metrics
- advanced filters
- employee scoring views

Acceptance criteria:

- personal issue groupings reflect available issue relationships
- build / typecheck / lint pass

Verification requirements:

- screen reads from repository/state boundaries rather than persistence directly
- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: add personal issue view`

### Phase 3.3 — Projects List View

Status: `Later`

Goal:

Provide project-level navigation and summary visibility before project detail work starts.

Scope:

- project list
- project summary cards / table
- basic project navigation
- no project creation form unless explicitly scoped

Explicit exclusions:

- project create / edit flows unless separately scoped
- dashboard charts
- organization workspace

Acceptance criteria:

- project list is navigable and structurally useful for the demo
- build / typecheck / lint pass

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: add projects list view`

### Phase 3.4 — Project Detail View

Status: `Later`

Goal:

Expose project-scoped issue visibility without broadening into project administration complexity.

Scope:

- project detail
- project issue list
- basic filters by structured fields
- project status summary

Explicit exclusions:

- project admin workflows
- dashboard metrics scope
- attachment handling

Acceptance criteria:

- project detail is usable as an issue drill-down surface
- build / typecheck / lint pass

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: add project detail view`

### Phase 3.5 — Issue Create/Edit Form

Status: `Later`

Goal:

Expose structured issue creation and editing through a minimal UI without turning the form into open-text workflow chaos.

Scope:

- quick-create issue form
- structured issue edit form
- title / description as open text only
- project, status, priority, owner, curator, type, tags, labels, dependency as structured fields
- connect to Phase 2B issue creation/update services
- activity history updates where applicable

Explicit exclusions:

- comments
- attachments
- notification behavior
- advanced validation UX
- custom workflow builder

Acceptance criteria:

- user can create a new Issue
- user can edit structured Issue fields
- form respects open text policy
- activity history is updated for meaningful changes
- build / typecheck / lint pass

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: add issue create edit form`

### Phase 3.6 — Issue Detail View

Status: `Later`

Goal:

Render the complete structured issue record before broad quick-action polish begins.

Scope:

- issue detail fields
- owner / curator / status / priority / tags / labels / dependency display
- activity history display
- quick action placeholders or scoped actions only

Explicit exclusions:

- comments
- attachments
- heavy workflow UI

Acceptance criteria:

- issue detail reflects structured issue semantics clearly
- build / typecheck / lint pass

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: add issue detail view`

### Phase 3.7 — Team Workspace View

Status: `Later`

Goal:

Add lightweight team-level visibility without drifting into org-management behavior.

Scope:

- team members
- team issues
- group issues
- team-level status summary

Explicit exclusions:

- org hierarchy
- advanced permissions
- department management

Acceptance criteria:

- team workspace supports the frozen visibility goals
- build / typecheck / lint pass

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: add team workspace view`

### Phase 3.8 — Phase 3 Screen Audit

Status: `Later`

Goal:

Audit the screen layer before Dashboard and Metrics work begins.

Scope:

- verify screens use repository / state boundaries
- verify no direct IndexedDB access from UI
- verify no dashboard metrics scope creep

Explicit exclusions:

- new screen features
- dashboard charts
- deployment work

Acceptance criteria:

- screens remain aligned with the layered architecture
- next work can move into dashboard metrics safely

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `chore: audit phase 3 screens`

---

## Phase 4 — Dashboard and Operational Metrics

Status: `Later`

Goal:

Turn the dashboard into the primary operational entry point for the portfolio demo.

### Phase 4.1 — Dashboard Metrics Domain Functions

Status: `Later`

Goal:

Define metric calculations in the domain layer before charts or cards consume them.

Scope:

- total / open / done / waiting / blocked / delayed / needs update calculations
- no UI charts yet

Explicit exclusions:

- metric cards
- charts
- click-through filters

Acceptance criteria:

- calculations match frozen product rules
- build / typecheck / lint pass

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: add dashboard metric calculations`

### Phase 4.2 — Dashboard Metric Cards

Status: `Later`

Goal:

Render the top-level dashboard summary without drifting into employee scoring.

Scope:

- render metric cards
- connect to metric functions
- keep employee scoring out of scope

Explicit exclusions:

- charts
- saved filters
- performance scoring

Acceptance criteria:

- cards reflect operational clarity goals
- build / typecheck / lint pass

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: add dashboard metric cards`

### Phase 4.3 — Status / Priority / Project / Owner Distributions

Status: `Later`

Goal:

Prepare distribution data for the operational dashboard views.

Scope:

- issues by status
- issues by priority
- issues by project
- issues by owner

Explicit exclusions:

- charts styling
- cross-screen search polish
- employee scoring

Acceptance criteria:

- distribution data aligns with issue state semantics
- build / typecheck / lint pass

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: add dashboard issue distributions`

### Phase 4.4 — Dashboard Charts

Status: `Later`

Goal:

Turn metric / distribution data into readable portfolio-grade visuals.

Scope:

- simple Recharts visuals
- status / priority / project charts
- readable portfolio screenshot quality

Explicit exclusions:

- advanced analytics
- saved dashboards
- decorative chart overload

Acceptance criteria:

- charts remain readable and operational, not decorative
- build / typecheck / lint pass

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: add dashboard charts`

### Phase 4.5 — Dashboard Filters and Click-throughs

Status: `Later`

Goal:

Make the dashboard actionable rather than purely report-like.

Scope:

- basic filters
- click-through to relevant issue / project lists
- no saved filters unless separately scoped

Explicit exclusions:

- saved filter feature
- notification workflows
- cross-app command palette

Acceptance criteria:

- dashboard interactions support navigation into operational work
- build / typecheck / lint pass

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: add dashboard filters and navigation`

### Phase 4.6 — Phase 4 Dashboard Audit

Status: `Later`

Goal:

Verify the dashboard is aligned with product intent before polish begins.

Scope:

- verify dashboard is operational clarity, not employee scoring
- verify metrics match product rules
- verify performance / build / typecheck / lint

Explicit exclusions:

- new dashboard features
- portfolio styling work
- deployment work

Acceptance criteria:

- dashboard accurately reflects frozen product semantics
- next work can move into polish without logic churn

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `chore: audit dashboard metrics`

---

## Phase 5 — Portfolio Polish

Status: `Later`

Goal:

Polish the product into a clean public demo without changing the frozen MVP scope.

### Phase 5.1 — Empty States and Helper Text

Status: `Later`

Goal:

Help a first-time portfolio visitor understand the product quickly without turning the UI into documentation.

Scope:

- Dashboard helper text
- Projects empty state
- Issues empty state
- Team Workspace helper text
- Needs Update explanation
- Curator explanation

Explicit exclusions:

- feature expansion
- long onboarding flows
- marketing copy

Acceptance criteria:

- the app explains core concepts quickly and minimally

Verification requirements:

- docs-only or UI-text task; if implementation touches UI, run build / typecheck / lint

Suggested commit message:

- `feat: add helper text and empty states`

### Phase 5.2 — Filter / Search Polish

Status: `Later`

Goal:

Improve scanability and findability without broadening the filtering model.

Scope:

- basic search
- filter UX cleanup
- structured-field filter clarity

Explicit exclusions:

- advanced search syntax
- saved filters
- fuzzy enterprise query builder behavior

Acceptance criteria:

- filter / search UX is clearer and easier to demo
- build / typecheck / lint pass

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: polish filters and search`

### Phase 5.3 — Quick Action Polish

Status: `Later`

Goal:

Make operational actions feel efficient and predictable without adding new workflow scope.

Scope:

- quick status actions
- ownership / action affordances
- clear disabled states where needed

Explicit exclusions:

- new workflow types
- notifications
- advanced shortcuts documentation

Acceptance criteria:

- action affordances are clearer and safer
- build / typecheck / lint pass

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: polish issue quick actions`

### Phase 5.4 — Responsive Layout Polish

Status: `Later`

Goal:

Ensure the demo remains readable and professional across desktop, tablet, and mobile widths.

Scope:

- sidebar / topbar responsiveness
- table / card layout cleanup
- mobile / tablet readability

Explicit exclusions:

- redesign of information architecture
- scope-expanding mobile features

Acceptance criteria:

- layout remains coherent across target viewport sizes
- build / typecheck / lint pass

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `style: polish responsive layout`

### Phase 5.5 — Visual Portfolio Polish

Status: `Later`

Goal:

Raise the visual finish for screenshots and live demo use while keeping the interface calm and utilitarian.

Scope:

- dashboard screenshot readiness
- badge / card / table visual consistency
- calm SaaS UI polish

Explicit exclusions:

- brand redesign
- decorative marketing hero work
- unrelated animation work

Acceptance criteria:

- UI looks portfolio-ready without changing product scope
- build / typecheck / lint pass

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `style: polish portfolio UI`

### Phase 5.6 — README Presentation Update

Status: `Later`

Goal:

Turn the public README into a clean portfolio presentation artifact only when the product is far enough along.

Scope:

- demo link placeholder or final link
- demo accounts
- local setup
- project structure
- architecture summary
- out-of-scope
- roadmap
- lessons learned

Explicit exclusions:

- work-log style updates
- internal handoff notes
- frozen product planning rewrites

Acceptance criteria:

- README is public-facing and portfolio-appropriate

Verification requirements:

- docs-only task; build / typecheck / lint only if implementation files also change

Suggested commit message:

- `docs: update portfolio readme`

### Phase 5.7 — Phase 5 Polish Audit

Status: `Later`

Goal:

Verify the product is understandable and visually ready before final quality and deployment work.

Scope:

- verify no scope creep
- verify README is public-facing, not work log
- verify demo visitor can understand product in 5–10 minutes

Explicit exclusions:

- new feature implementation
- deployment changes
- backend work

Acceptance criteria:

- polish is complete enough for final review work

Verification requirements:

- build / typecheck / lint if any code changed in the polish sequence

Suggested commit message:

- `chore: audit portfolio polish`

---

## Phase 6 — Quality and Final Review

Status: `Later`

Goal:

Close the MVP with verification, deployment readiness, and final public-facing documentation.

### Phase 6.1 — Validation and Edge-case Review

Status: `Later`

Goal:

Review domain and data integrity before adding or broadening tests.

Scope:

- validation gaps
- domain edge cases
- demo data consistency

Explicit exclusions:

- new feature work
- deployment configuration

Acceptance criteria:

- major validation and data consistency gaps are known and addressed or recorded

Verification requirements:

- build / typecheck / lint if implementation files change during fixes

Suggested commit message:

- `chore: review validation and edge cases`

### Phase 6.2 — Focused Tests

Status: `Later`

Goal:

Add tests where they materially reduce risk, not for checklist inflation.

Scope:

- add focused tests only where useful
- issue creation logic
- ownership transfer
- needs update
- dashboard metrics
- reset demo data

Explicit exclusions:

- exhaustive UI snapshot testing
- low-signal test bloat

Acceptance criteria:

- key domain risks have focused automated coverage

Verification requirements:

- relevant test suite passes
- build / typecheck / lint pass

Suggested commit message:

- `test: add focused domain tests`

### Phase 6.3 — GitHub Pages Deployment Setup

Status: `Later`

Goal:

Prepare automated static deployment without changing runtime architecture.

Scope:

- GitHub Actions workflow
- Pages build settings
- Vite base verification
- HashRouter deployment check

Explicit exclusions:

- backend hosting
- BrowserRouter migration
- server rewrites

Acceptance criteria:

- deployment configuration is ready for GitHub Pages use

Verification requirements:

- build passes in CI-oriented configuration
- deployment workflow is syntactically valid

Suggested commit message:

- `ci: add github pages deployment`

### Phase 6.4 — Live Demo Verification

Status: `Later`

Goal:

Verify the real hosted demo behaves as expected after deployment setup.

Scope:

- verify GitHub Pages demo loads
- verify routes work
- verify reset data works
- verify role switch works

Explicit exclusions:

- new feature work
- redesigns

Acceptance criteria:

- hosted demo is stable enough for public portfolio use

Verification requirements:

- live demo checked after deployment
- local build / typecheck / lint still pass

Suggested commit message:

- `chore: verify live demo`

### Phase 6.5 — Final Scope Audit

Status: `Later`

Goal:

Confirm the implementation stayed inside the frozen MVP boundaries.

Scope:

- compare implementation against frozen docs
- verify exclusions:
  - no backend
  - no real auth
  - no attachments
  - no notification hub
  - no organization workspace
  - no employee scoring

Explicit exclusions:

- new corrective feature work unless explicitly approved

Acceptance criteria:

- final scope alignment is documented and defensible

Verification requirements:

- build / typecheck / lint if audit uncovers code changes that must be fixed

Suggested commit message:

- `chore: complete final scope audit`

### Phase 6.6 — Final Documentation Cleanup

Status: `Later`

Goal:

Make the public and internal docs consistent for final handoff.

Scope:

- README final polish
- changelog checkpoint final state
- DEVELOPMENT_NOTES final lessons / trade-offs
- ensure docs are consistent

Explicit exclusions:

- frozen docs changes unless explicit scope change is approved
- internal work-log clutter in README

Acceptance criteria:

- public and internal docs are coherent and appropriately scoped

Verification requirements:

- docs-only task unless code / docs fixes require build / typecheck / lint

Suggested commit message:

- `docs: finalize project documentation`

### Phase 6.7 — Portfolio Release Tag

Status: `Later`

Goal:

Prepare the project for final portfolio release and handoff.

Scope:

- final build / typecheck / lint
- optional release tag plan
- final handoff summary

Explicit exclusions:

- new feature implementation
- post-MVP expansion

Acceptance criteria:

- project is release-ready for portfolio presentation

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `chore: prepare portfolio mvp release`

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

- Each micro-phase must be small enough for one Codex task
- Each implementation micro-phase must end with build / typecheck / lint unless the task is docs-only
- `changelog_checkpoint.md` is updated after every meaningful implementation step
- `DEVELOPMENT_NOTES.md` is updated only for meaningful decisions, trade-offs, bugs, workarounds, or lessons learned
- `README.md` is not a work log
- `README.md` is updated only during public presentation / documentation phases
- `docs/*` files are frozen planning context unless explicitly changed
- Every Codex implementation task must end with:
  - changed files
  - completed work
  - scope compliance
  - verification results
  - known issues
  - proposed commit message
  - no commit / push until approval

---

## Working Rule

When implementation order feels unclear:

1. check frozen docs first
2. check `BUILD_PLAN.md` for phase order
3. check `changelog_checkpoint.md` for current handoff state
4. only then implement the next scoped step
