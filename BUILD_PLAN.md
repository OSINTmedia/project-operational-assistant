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

Interpretation rule:

- `changelog_checkpoint.md` is the live source of truth for the latest completed micro-phase and the next concrete micro-phase.
- `BUILD_PLAN.md` defines roadmap order and scope, but some older completed sections intentionally retain historical micro-phase status labels.
- Do not choose the next task from historical `Planned` labels inside already completed umbrella phases.

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

### Phase 2B.8 — Pre-Phase 3 Domain Hardening

Status: `Completed`

Goal:

Harden issue-domain behavior for Phase 3 screen work without expanding UI scope.

Scope:

- activity history consistency for UI-relevant issue mutations
- activity payload normalization for later Issue Detail rendering
- minimal group issue participant modeling
- checkpoint / development-note sync

Explicit exclusions:

- no screen work
- no dashboard metrics
- no notification behavior
- no real auth
- no backend
- no production-grade event sourcing

Acceptance criteria:

- issue creation and label / confirmation mutations write meaningful activity history
- activity payloads are consistent enough for later Issue Detail UI rendering
- group issues have a minimal participant field or a documented deferral decision
- build / typecheck / lint pass

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `refactor: harden issue activity model before screens`

---

## Phase 3 — Main Screens

Status: `Completed`

Goal:

Replace placeholder pages with real feature surfaces backed by repository/state boundaries.

### Phase 3.1 — Demo Controls and Role Switch UI

Status: `Completed`

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

Status: `Completed`

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

Status: `Completed`

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

Status: `Completed`

Goal:

Expose project-scoped issue visibility without broadening into project administration complexity.

Phase 3.4 umbrella scope:

- project detail header/context
- project status summary
- project issue list
- lightweight structured filters only if still needed after the read-only detail surface exists

Phase 3.4 umbrella exclusions:

- no issue create/edit form
- no Issue Detail implementation
- no status update actions
- no owner / curator transfer actions
- no confirmation workflow UI
- no dashboard charts
- no Team Workspace implementation
- no project create/edit flow
- no backend / auth / integrations
- no broad data model refactor

### Phase 3.4A — Project Detail Header and Summary

Status: `Completed`

Goal:

Replace the Project Detail placeholder with a real read-only detail shell before issue-row rendering begins.

Scope:

- replace the current Project Detail placeholder with a real read-only project detail shell
- load selected project from route param
- show project name, description, status, owner, team/context, and updated date where available
- show project-level summary counts derived from its issues
- provide clear Back to Projects navigation
- provide controlled empty/error state for invalid project ids
- include only a reserved issue-list section / container
- do not implement the full project issue list yet

Explicit exclusions:

- no issue create / edit form
- no Issue Detail implementation
- no issue mutation actions
- no status update actions
- no owner / curator transfer actions
- no confirmation workflow UI
- no dashboard charts
- no Team Workspace implementation
- no project create / edit flow
- no broad data model refactor

Acceptance criteria:

- project detail route is no longer a placeholder
- project header / context loads from repository-state boundaries
- project-level summary counts are coherent
- Back to Projects navigation is clear
- invalid project ids resolve to a controlled empty/error state
- build / typecheck / lint pass

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: add project detail header and summary`

### Phase 3.4B — Read-only Project Issue List

Status: `Completed`

Goal:

Render the selected project's issues without introducing mutation workflows or Issue Detail implementation.

Scope:

- render issues belonging to the selected project
- show useful issue metadata such as title, type, status, priority, owner, curator if applicable, labels / tags, and updated date
- allow navigation to existing Issue Detail placeholder routes if already supported
- do not implement Issue Detail itself
- do not add issue mutation actions

Explicit exclusions:

- no issue create / edit form
- no Issue Detail implementation
- no status update actions
- no owner / curator transfer actions
- no confirmation workflow UI
- no dashboard charts
- no Team Workspace implementation
- no project create / edit flow
- no broad data model refactor

Acceptance criteria:

- selected-project issue list is rendered read-only
- issue metadata is useful and structurally coherent
- issue links can use the existing Issue Detail placeholder route without breaking
- build / typecheck / lint pass

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: add project issue list`

### Phase 3.4C — Basic Structured Filters, Empty States, and Audit Cleanup

Status: `Completed`

Goal:

Finish the Project Detail read-only surface with lightweight structured filtering only if it is still necessary after 3.4A and 3.4B.

Scope:

- add only lightweight structured filters / grouping if still needed, such as status, priority, attention/system labels, or type
- keep filters simple and local to Project Detail
- finish empty states and UX cleanup for Project Detail
- run final Phase 3.4 integrity check
- do not add advanced table engine, dashboard metrics, or mutation workflows

Explicit exclusions:

- no issue create / edit form
- no Issue Detail implementation
- no status update actions
- no owner / curator transfer actions
- no confirmation workflow UI
- no dashboard charts
- no Team Workspace implementation
- no project create / edit flow
- no backend / auth / integrations
- no broad data model refactor

Acceptance criteria:

- Project Detail is coherent and polished enough for the demo's read-only use
- any filters remain lightweight and local in scope
- Phase 3.4 integrity check passes
- build / typecheck / lint pass

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `chore: finish project detail read-only surface`

### Phase 3.5 — Issue Create/Edit Form

Status: `Completed`

Goal:

Expose structured issue creation and editing through minimal UI slices without turning the form into a broad Issue Detail workflow, dashboard workflow, or open-text process.

Phase 3.5 umbrella scope:

- quick-create issue form
- structured issue edit form
- title / description as open text only
- project, status, priority, owner, curator, type, tags, labels, dependency as structured fields
- connect to existing Phase 2B creation/update services
- verify meaningful activity history writes where supported

Phase 3.5 umbrella exclusions:

- no Issue Detail implementation
- no activity timeline rendering UI
- no comments
- no attachments
- no notification behavior
- no backend
- no real authentication
- no dashboard metrics / charts
- no Team Workspace implementation
- no project create / edit flow
- no status quick-action toolbar
- no owner transfer workflow UI beyond explicitly scoped form fields
- no confirmation workflow UI
- no advanced validation UX
- no custom workflow builder
- no broad repository / data-model refactor

### Phase 3.5A — Create Issue Form UI Shell Only

Status: `Completed`

Goal:

Create the visual and structural form shell for issue creation without wiring persistence submit behavior yet.

Scope:

- add or expose a Create Issue entry point from the most appropriate existing screen, preferably Project Detail when current project context is available
- create a form route, panel, or screen surface for issue creation
- render structured form fields needed for creation
- include Title and Description as the only open-text fields
- include structured fields such as Project, Status, Priority, Owner, Type, Curator when applicable, Tags, Labels, and Dependency where feasible
- provide cancel / back navigation
- provide placeholder or disabled submit behavior if submit wiring belongs to `Phase 3.5B`
- keep default values visible and understandable
- keep UI state local / feature-scoped

Explicit exclusions:

- no real issue creation submit
- no repository writes
- no activity history writes
- no edit mode
- no Issue Detail implementation
- no status quick actions
- no owner transfer workflow UI
- no confirmation workflow UI
- no advanced validation UX
- no broad form framework abstraction unless already present

Acceptance criteria:

- user can open the Create Issue form shell
- form layout is visible and structured
- Title / Description are the only open-text fields
- structured fields are represented as selects, toggles, pickers, or simple structured controls
- cancel / back navigation works
- build / typecheck / lint pass

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: add issue create form shell`

### Phase 3.5B — Wire Create Issue to Domain Service

Status: `Completed`

Goal:

Connect the Create Issue form to the existing Phase 2B issue creation service and local persistence path.

Scope:

- enable submit behavior for creating a new issue
- use existing domain / application `createIssue` logic
- write through repository / service boundaries, not direct Dexie access
- validate required fields
- apply creation defaults consistently
- create activity history for issue creation if the service supports it
- redirect or return to the appropriate context after creation, such as Project Detail or Personal
- verify new issue appears in relevant lists after creation
- preserve reset-demo behavior

Explicit exclusions:

- no edit mode
- no Issue Detail implementation
- no comments / attachments / notifications
- no advanced validation UX
- no custom status creation
- no broad repository refactor unless a tiny adapter is unavoidable and documented

Acceptance criteria:

- user can create a new issue
- created issue persists in IndexedDB / local demo data
- created issue appears in the selected project issue list or relevant Personal view
- form respects open-text policy
- creation writes expected metadata and activity history where supported
- build / typecheck / lint pass

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: wire issue creation form`

### Phase 3.5C — Edit Issue Form Route and Prefill

Status: `Completed`

Goal:

Create the edit surface for existing issues and prefill it from persisted issue data without saving changes yet.

Scope:

- add an edit route or edit form surface for an existing issue
- load issue by route param or explicit edit entry point
- prefill existing issue fields
- display structured fields consistently with create-form controls
- handle missing / invalid issue id with a controlled state
- provide cancel / back navigation
- avoid implementing full Issue Detail content

Explicit exclusions:

- no save / edit persistence yet
- no issue mutation submit
- no status quick-action toolbar
- no activity history rendering
- no confirmation workflow UI
- no comments / attachments
- no full Issue Detail implementation

Acceptance criteria:

- user can open edit form for an existing issue
- fields are prefilled correctly
- invalid issue id does not crash
- no direct UI-to-Dexie access
- build / typecheck / lint pass

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: add issue edit form prefill`

### Phase 3.5D — Save Edit Changes and Verify History

Status: `Completed`

Goal:

Connect edit-form save behavior to existing structured update operations and verify meaningful activity history writes.

Scope:

- enable saving allowed structured issue changes
- update Title and Description if allowed by current product scope
- update structured fields such as Status, Priority, Owner, Curator, Type, Tags, Labels, and Dependency only through existing domain / application helpers where available
- write activity history for meaningful changes where supported
- preserve Updated At and Updated By behavior
- ensure group-issue curator rules remain enforced
- ensure `Needs Update` and `Ready for Confirmation` remain labels
- return user to a coherent context after save

Explicit exclusions:

- no Issue Detail implementation
- no activity timeline UI
- no comments / attachments / notifications
- no confirmation workflow UI
- no broad quick-action controls
- no custom workflow builder
- no broad repository rewrite

Acceptance criteria:

- user can edit an existing issue and save changes
- saved changes persist after refresh
- changed issue appears updated in Project Detail / Personal read views
- relevant activity history entries are created where domain helpers support them
- Updated At / Updated By behavior remains coherent
- form respects open-text policy
- build / typecheck / lint pass

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: wire issue edit form`

### Phase 3.5E — Final Form Validation, Empty States, and Self-Audit

Status: `Completed`

Goal:

Close Phase 3.5 by validating the create/edit flow, improving obvious empty/error states, and auditing scope boundaries.

Scope:

- tighten required-field validation
- ensure default values are sensible
- add or refine controlled empty / error states
- verify create and edit flows across roles
- verify reset demo data restores seeded state after user-created issues
- verify no direct Dexie access in UI
- update `changelog_checkpoint.md`
- update `BUILD_PLAN.md` status metadata
- update `DEVELOPMENT_NOTES.md` only if a meaningful implementation decision was made
- run final Phase 3.5 integrity check

Explicit exclusions:

- no new create / edit features beyond validation and cleanup
- no Issue Detail implementation
- no dashboard metrics
- no Team Workspace
- no comments / attachments / notifications
- no backend / auth / integrations
- no broad refactor

Acceptance criteria:

- Phase 3.5 create / edit flow is coherent enough for the portfolio demo
- create / edit validation is sufficient for MVP usage
- user-created data persists locally
- demo reset restores seed state
- form respects open-text policy
- no scope creep into `Phase 3.6` or later phases
- build / typecheck / lint pass

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `chore: audit issue create edit flow`

### Phase 3.6 — Issue Detail View

Status: `Completed`

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

Status: `Completed`

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

Status: `Completed`

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

Status: `Completed`

Goal:

Turn the dashboard into the primary operational entry point for the portfolio demo.

### Phase 4.1 — Dashboard Metrics Domain Functions

Status: `Completed`

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

Status: `Completed`

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

Status: `Completed`

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

Status: `Completed`

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

Status: `Completed`

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

Status: `Completed`

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

Status: `Completed`

Goal:

Polish the product into a clean public demo without changing the frozen MVP scope.

### Phase 5.1 — Empty States and Helper Text

Status: `Completed`

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

Status: `Completed`

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

Status: `Completed`

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

Status: `Completed`

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

Status: `Completed`

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

Status: `Completed`

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

Status: `Completed`

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

### Phase 5.8 — App Experience Refinement Before Final QA

Status: `Completed through 5.8E; superseded by Phase 5.9 corrective UX roadmap`

Goal:

Improve navigation, information architecture, role-aware workflow clarity, interaction comfort, and responsive usability before final QA and deployment.

Purpose:

Improve the product experience after the full feature and polish surface is visible, before final validation, tests, deployment, and release.

This phase should make the app feel like an operational assistant rather than a collection of disconnected admin pages.

Execution note:

Phase 5.8 completed the first app-experience sequence through selected-user orientation, source-aware return flow, inline previews, and responsive working-layout repair.

After the deeper `design_review_V2.md` audit, the remaining UX risk was reclassified into `Phase 5.9 — Compact Assistant UX and Actionability Refinement`. `APP_EXPERIENCE_PLAN.md` is now the active Phase 5.9 execution plan. `Phase 5.9A1 — Route Wayfinding and Return Context`, `Phase 5.9A2 — Compact AppShell and Header Compression`, `Phase 5.9B — Dashboard Action-first Recomposition`, `Phase 5.9C — Project and Personal Density Pass`, `Phase 5.9D — Issue Detail and Form Compression`, `Phase 5.9E — Mobile Survival Pass`, `Phase 5.9E2 — Project Manager Project Management and Project Status Sync`, and `Phase 5.9E3 — Live Demo Dataset Expansion` are complete. The next micro-phase is `Phase 5.9F — Final Compact UX Audit`.

The older Phase 5.8 micro-phase entries below are retained as historical roadmap context. They are no longer the source for the next task.

Scope:

- reduce unnecessary page hopping
- improve dashboard-as-operational-home behavior
- improve selected-user orientation
- make "my next actions" clearer
- make needs-update and confirmation-needed items easier to discover
- improve project / issue / team context recovery
- improve list -> detail -> edit -> return flows
- improve sidebar / topbar / contextual navigation clarity
- use inline expansion, collapsible sections, dropdowns, or drawers where they reduce friction
- refine responsive behavior where navigation changes require it
- preserve existing domain model, route compatibility, local-first architecture, and static GitHub Pages direction

Explicit exclusions:

- no backend
- no real auth
- no notification hub
- no organization workspace
- no employee scoring
- no enterprise permissions
- no workflow engine
- no broad product-scope expansion
- no new project/issue data model unless a tiny UI-only adaptation is explicitly justified
- no full design-system rewrite
- no brand redesign
- no decorative animation pass
- no replacing the entire router architecture unless a later approved micro-phase proves it unavoidable

### Phase 5.8A — UX / Navigation Diagnostic and Target Plan

Status: `Completed`

Goal:

Run a code-first and behavior-first audit of the current app experience and define a targeted refinement plan before implementing changes.

Scope:

- inspect Dashboard, Personal, Projects, Project Detail, Issue Detail, Issue Create/Edit, Team Workspace, Demo
- assess role-specific flows for Manager, Project Manager, and User
- identify page-hopping, context loss, unclear role responsibilities, and confusing action visibility
- classify findings by severity
- decide which improvements belong in 5.8 and which are post-MVP

Explicit exclusions:

- no implementation
- no redesign
- no source changes unless only documentation notes are updated

Acceptance criteria:

- clear verdict on whether the app is assistant-like enough
- prioritized 5.8 implementation plan
- no product-scope expansion

Verification requirements:

- docs-only task unless implementation files are explicitly changed during an approved follow-up

Suggested commit message:

- `docs: plan app experience refinement`

### Phase 5.8B — Assistant Home and Role-aware Action Clarity

Status: `Later`

Goal:

Make the app entry experience and Dashboard/Personal surfaces clearly show what the selected demo user should pay attention to next.

Refinement note:

The accepted Phase 5.8A design review split this broad implementation area into:

- `Phase 5.8B1 — Dashboard Assistant Home and Selected-user Action Summary`
- `Phase 5.8B2 — AppShell Selected-user Orientation`

Use `APP_EXPERIENCE_PLAN.md` for exact slice scope before implementation.

Scope:

- clarify selected-user context
- surface "my next actions" or equivalent role-aware action summaries
- make needs-update / confirmation-needed / blocked / delayed visibility easier to understand
- keep behavior local to existing data and routes

Explicit exclusions:

- no real permissions
- no notification system
- no new workflow engine
- no employee scoring

Acceptance criteria:

- selected user can identify relevant work within 10 seconds
- assistant-like operational cues are visible without hunting through pages
- build / typecheck / lint pass

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: clarify role aware action experience`

### Phase 5.8C — Navigation and Context Recovery Refinement

Status: `Later`

Goal:

Reduce user disorientation when moving between Dashboard, Projects, Issues, Edit, and Teams.

Scope:

- improve contextual headers, breadcrumbs, back paths, or route labels
- make list -> detail -> edit -> return flows more coherent
- reduce dead-end feeling
- clarify where the user is and why they are there
- preserve HashRouter and existing GitHub Pages compatibility

Explicit exclusions:

- no full router rewrite
- no new global issue-list route unless explicitly approved after audit
- no app-wide command palette

Acceptance criteria:

- major routes preserve or restore user context clearly
- common flows require less guessing
- build / typecheck / lint pass

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: refine navigation context`

### Phase 5.8D — Inline Inspection and Reduced Route-hopping

Status: `Later`

Goal:

Reduce unnecessary full-page navigation by using modern interaction patterns only where they improve operational flow.

Scope:

- evaluate and implement scoped inline expansion, collapsible sections, dropdown show/hide, or drawer-style previews where appropriate
- prefer quick inspection over full route hops for lightweight issue/project context
- keep full pages only where deep detail/editing is justified
- avoid adding new product features

Explicit exclusions:

- no modal/drawer framework rewrite
- no replacing every detail route
- no complex state machine
- no new workflow types

Acceptance criteria:

- common inspection flows feel faster and less fragmented
- route tree remains stable
- build / typecheck / lint pass

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: reduce route hopping in app experience`

### Phase 5.8E — Responsive Interaction and Working-layout Pass

Status: `Later`

Goal:

Ensure navigation and refined interaction patterns remain usable across desktop, tablet, and mobile widths.

Scope:

- check sidebar/topbar behavior
- refine dashboard/project/issue/team layout responsiveness after navigation changes
- preserve readability and action visibility on smaller screens
- fix only responsive issues exposed by the app-experience pass

Explicit exclusions:

- no separate mobile product
- no unrelated visual redesign
- no new feature scope

Acceptance criteria:

- major workflows remain usable at target viewport sizes
- build / typecheck / lint pass

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `style: refine responsive app experience`

### Phase 5.8F — Final App Experience Audit

Status: `Later`

Goal:

Verify the refined app experience is ready to enter Phase 6 quality, tests, deployment, and release work.

Scope:

- verify app feels coherent and assistant-like
- verify role-aware action visibility
- verify reduced navigation friction
- verify no scope creep
- verify no backend/auth/notification/org/employee-scoring behavior was added
- verify build / typecheck / lint

Explicit exclusions:

- no new feature implementation
- no deployment work
- no final release docs unless needed for handoff metadata

Acceptance criteria:

- selected user can understand next actions quickly
- Dashboard works as an operational home
- confirmation/update responsibilities are discoverable
- project/issue/team navigation is coherent
- app is ready to enter Phase 6

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `chore: audit app experience refinement`

---

### Phase 5.9 — Compact Assistant UX and Actionability Refinement

Status: `In progress`

Goal:

Make the existing MVP feel like a compact operational assistant by correcting route wayfinding, first-viewport usefulness, actionability, visual density, and mobile survival risk before Phase 6.

Purpose:

The primary product is already built. Phase 5.9 is a controlled UX/UI/flow correction pass based on `design_review_V2.md` and `APP_EXPERIENCE_PLAN.md`. It does not add backend behavior, real auth, notification infrastructure, workflow engines, employee scoring, a new data model, or a broad route redesign. A narrow `5.9E2` corrective capability slice resolves the documented gap between frozen Project Manager intent and the earlier Phase 3 project-list-only implementation.

Execution note:

Detailed execution for Phase 5.9 is tracked in `APP_EXPERIENCE_PLAN.md`. `design_review_V2.md` is the current UX diagnosis. `changelog_checkpoint.md` remains the live handoff and next-task source.

Scope:

- improve route wayfinding and source-aware return context
- clarify where the user is, where they came from, and how they return
- compress AppShell/page header context only after return clarity is handled
- make Dashboard action-first rather than report-first
- reduce dead summary cards by turning them into filters, previews, or precise route targets
- improve Personal and Project work-surface density
- improve Issue Detail/Edit/Create compactness and visible save/cancel/return behavior
- complete a mobile survival pass after desktop/layout order changes
- add bounded Project Manager project create/edit capability required by frozen scope docs
- keep project status synchronized with issue status where project issues determine the state
- expand local seed data so a first-time portfolio visitor can see complete Manager, Project Manager, and User workflows
- preserve existing route model, `HashRouter`, GitHub Pages compatibility, local-first architecture, and system-label semantics

Explicit exclusions:

- no backend
- no real auth
- no notification hub
- no organization workspace
- no employee scoring
- no enterprise permissions
- no workflow engine
- no new project/issue data model
- no project delete/archive/workflow administration
- no broad product-scope expansion
- no full AppShell redesign
- no full design-system rewrite
- no brand redesign
- no animation pass
- no command palette unless separately approved
- no removing `/personal` unless separately approved
- no replacing the router architecture

### Phase 5.9A1 — Route Wayfinding and Return Context

Status: `Completed`

Goal:

Make every deep work route answer where the user is, where they came from, and how they return.

Scope:

- strengthen visible source-aware return labels on Issue Detail and Issue Edit
- add or clarify direct Back/Return controls where browser back is currently doing too much work
- clarify current-location context on Issue Detail, Issue Edit, Issue Create, Project Detail, and Teams
- preserve the existing route tree and bounded route-state helper

Explicit exclusions:

- no AppShell compression
- no Dashboard recomposition
- no density pass
- no mobile survival pass
- no new route model
- no global navigation-history framework

Acceptance criteria:

- Issue Detail/Edit always show a visible source-aware return destination
- Dashboard -> Issue -> Edit -> return is predictable
- Personal -> Issue -> Edit -> return is predictable
- Project Detail -> Issue -> Edit -> return is predictable
- Teams -> Issue -> return is predictable
- no routes are added or removed
- build / typecheck / lint pass

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: clarify route return context`

### Phase 5.9A2 — Compact AppShell and Header Compression

Status: `Completed`

Goal:

Reduce repeated shell/page context without turning the sidebar into a second dashboard.

Scope:

- compact AppShell topbar where it supports wayfinding
- make selected user/role persistent but concise
- reduce duplicate Dashboard/Personal/page-header context
- keep sidebar navigation-first

Explicit exclusions:

- no full AppShell redesign
- no full issue lists, complex filters, charts, or project metadata panels in sidebar
- no global create issue unless separately approved

Acceptance criteria:

- selected user/role is visible without consuming the main work area
- page headers and topbar do not repeat the same context
- mobile shell remains usable

Suggested commit message:

- `feat: compact app shell orientation`

### Phase 5.9B — Dashboard Action-first Recomposition

Status: `Complete`

Goal:

Make Dashboard behave like an assistant home rather than a reporting surface.

Scope:

- move Operational Queue and filters above charts
- convert Assistant Home and risk cards into filters, previews, or precise work-surface routes
- demote charts and metric cards
- keep data behind existing hooks/repositories/state boundaries

Explicit exclusions:

- no new data model
- no saved dashboard/report system
- no notification behavior

Acceptance criteria:

- Operational Queue or first actionable rows are visible in the first desktop viewport
- charts do not appear above the main action queue
- summary cards filter, preview, or route to precise work surfaces

Suggested commit message:

- `feat: make dashboard action-first`

### Phase 5.9C — Project and Personal Density Pass

Status: `Complete`

Goal:

Make work lists visible earlier and reduce duplicate summary blocks.

Scope:

- Personal prioritizes Needs Update, Ready for Confirmation, and assigned/curated work
- Projects becomes a compact project chooser
- Project Detail shows issue queue earlier and compacts filters/project metadata

Explicit exclusions:

- no project permissions
- no team workflow engine
- no new project model
- no removal of `/personal`

Suggested commit message:

- `feat: compact personal and project work surfaces`

### Phase 5.9D — Issue Detail and Form Compression

Status: `Complete`

Goal:

Turn Issue Detail/Edit/Create into focused work surfaces.

Scope:

- prioritize title/status/source/action strip
- compact or collapse secondary metadata/history
- keep save/cancel/return controls visible
- make create/edit forms required-first and less document-like

Explicit exclusions:

- no comments
- no notifications
- no permissions expansion
- no Jira-style workflow expansion

Suggested commit message:

- `feat: compact issue work and edit flows`

### Phase 5.9E — Mobile Survival Pass

Status: `Complete`

Goal:

Prevent endless stacked scrolling and hidden actions on small screens after the main desktop/layout changes are done.

Scope:

- Dashboard mobile queue-first layout
- compact mobile headers
- sticky or persistent issue/form actions where needed
- filter disclosures/tabs where appropriate
- validate tap targets, focus order, and readable labels

Explicit exclusions:

- no separate mobile product
- no bottom navigation redesign unless separately approved
- no unrelated visual redesign

Suggested commit message:

- `feat: improve compact mobile work flows`

### Phase 5.9E2 — Project Manager Project Management and Project Status Sync

Status: `Complete`

Goal:

Resolve the conflict where frozen docs describe Project Manager project management, but the live app only allowed project viewing and issue creation.

Scope:

- add bounded project create and edit routes for Manager and Project Manager demo roles
- expose Create project from Projects and Edit project from Project Detail for allowed roles
- save project fields through domain/repository rules, not UI-to-persistence shortcuts
- keep project status derived from project issues when issue state changes
- ensure all issues `Done` makes the project status `Done`

Explicit exclusions:

- no project delete/archive
- no project permissions engine
- no organization workspace
- no workflow engine
- no backend/auth behavior
- no new project data model
- no `/personal` removal or route replacement

Acceptance criteria:

- Project Manager can create a project from Projects
- Project Manager can edit project name, description, status, owner, and team from Project Detail
- non-manager roles do not get project-management entry points and receive clear blocked-state copy on direct route access
- project status is recalculated after issue create/edit/status/confirmation changes
- if every issue in a project is `Done`, the project status becomes `Done`
- build / typecheck / lint pass

Verification requirements:

- `npm run build`
- `npm run typecheck`
- `npm run lint`

Suggested commit message:

- `feat: add project management for project managers`

### Phase 5.9E3 — Live Demo Dataset Expansion

Status: `Complete`

Goal:

Prepare richer local-first seed data before GitHub Pages live demo deployment.

Scope:

- expand demo users across Manager, Project Manager, and User roles
- expand teams, projects, tags, labels, issues, dependencies, assignments, curator relationships, participants, statuses, confirmation states, and activity history
- include a fully `Done` project so issue-derived project status sync is visible
- include active, blocked, delayed, waiting, planned, new, done, and canceled work examples
- keep data in the existing local-first seed path

Explicit exclusions:

- no schema migration
- no backend/auth
- no real organization data
- no new data model
- no README/public deployment copy update

Acceptance criteria:

- first-time visitors see full workspace coverage without manual setup
- Manager, Project Manager, and User role switching reveals distinct useful work
- Projects, Project Detail, Personal, Dashboard, Issue Detail, Teams, and create/edit forms have richer reference data
- users with old local IndexedDB can use Demo reset to reseed the expanded dataset
- build / typecheck / lint pass

Suggested commit message:

- `chore: expand live demo seed data`

### Phase 5.9F — Final Compact UX Audit

Status: `Next`

Goal:

Verify Phase 5.9 is complete enough to enter Phase 6.

Scope:

- repeat first-60-seconds test
- repeat Manager / Project Manager / User workflow traces
- repeat desktop / tablet / mobile checks
- verify no scope creep
- verify docs match implementation reality

Acceptance criteria:

- no P0 findings remain
- P1 findings are fixed or explicitly accepted as MVP debt
- Dashboard is action-first
- route return context is clear
- first viewport is useful on Dashboard, Personal, Project Detail, and Issue Detail
- mobile survival pass is complete
- build / typecheck / lint pass

Suggested commit message:

- `docs: verify compact ux readiness`

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
