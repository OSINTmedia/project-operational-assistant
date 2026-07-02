# Technical Planning v1 — Project Operational Assistant

## 1. Deployment Goal

პროდუქტი უნდა განთავსდეს როგორც online demo GitHub-ზე.

Target deployment:

* GitHub repository
* GitHub Pages
* GitHub Actions deploy pipeline
* Static Single Page Application
* No required backend for Portfolio MVP
* Demo data available on first load
* User can create/update test data
* User can reset demo data

Portfolio MVP არ საჭიროებს რეალურ სერვერს, რეალურ auth-ს ან production database-ს.

---

## 2. Core Technical Decision

Portfolio MVP უნდა აშენდეს როგორც frontend-first static web app.

მიზეზი:

* მარტივად იდება GitHub Pages-ზე
* დამსაქმებელი/დამკვეთი პირდაპირ ხსნის live demo-ს
* არ საჭიროებს hosting backend-ს
* არ აქვს server maintenance
* კარგად აჩვენებს frontend architecture-ს, state management-ს, UI/UX-ს და data modeling-ს
* მომავალში შესაძლებელია backend-ზე გადასვლა repository abstraction-ის საშუალებით

---

## 3. Recommended Tech Stack

### Frontend

* React
* TypeScript
* Vite

მიზეზი:

* სწრაფი development experience
* კარგი GitHub Pages compatibility
* TypeScript აჩვენებს engineering discipline-ს
* React ecosystem კარგად ერგება dashboard/forms/table ტიპის აპლიკაციას

---

### Styling / UI

* Tailwind CSS
* shadcn/ui
* Lucide icons

მიზეზი:

* სწრაფი, სუფთა და პროფესიონალური UI
* reusable components
* dashboard/cards/tables/forms-ს სწრაფად ააწყობს
* portfolio demo ვიზუალურად უკეთ გამოჩნდება

---

### Routing

* React Router

საჭირო routes:

* `/`
* `/dashboard`
* `/personal`
* `/projects`
* `/projects/:projectId`
* `/teams`
* `/issues/:issueId`
* `/demo`

---

### State Management

* Zustand

მიზეზი:

* Redux-ზე მსუბუქია
* Portfolio MVP-სთვის საკმარისია
* კარგად ერგება local-first app-ს
* მარტივია role switch, filters, selected project, UI state, demo state-სთვის

---

### Forms and Validation

* React Hook Form
* Zod

გამოყენება:

* Issue create/edit form
* Project create/edit form
* Team form
* Tag/status management
* input validation
* default values
* structured choices

---

### Tables / Lists

* TanStack Table

გამოყენება:

* Issue list
* Project issues
* Personal issues
* Team issues
* filter/sort/search
* status/priority/tag filtering

---

### Charts / Dashboard

* Recharts

გამოყენება:

* issues by status
* issues by priority
* issues by project
* team progress
* personal progress
* blocked/delayed/needs update cards

---

### Persistence

Primary choice:

* IndexedDB
* Dexie.js wrapper

Why:

* უკეთესია სტრუქტურირებული demo data-სთვის
* localStorage-ზე უკეთ უმკლავდება relational-like collections-ს
* შესაძლებელია seed/reset logic
* browser-ში ინახავს ტესტურ მონაცემებს
* backend-ის გარეშე იძლევა რეალურ demo behavior-ს

localStorage შეიძლება დარჩეს მხოლოდ მცირე UI preferences-ისთვის:

* selected demo role
* theme
* last selected tab
* collapsed sidebar state

---

### Testing

Portfolio MVP-სთვის საკმარისია:

* Vitest
* React Testing Library
* Playwright, optional but recommended

Testing focus:

* issue creation
* ownership transfer
* status update
* needs update calculation
* dashboard metrics
* role-based visible actions
* demo reset

---

### Deployment

* GitHub Actions
* GitHub Pages

Deployment pipeline:

1. Push to main branch
2. Install dependencies
3. Run lint/typecheck/tests
4. Build Vite app
5. Publish static build to GitHub Pages

---

## 4. Architecture Style

Recommended architecture:

Frontend SPA with local-first persistence and clear domain/service/repository boundaries.

Layers:

1. UI Layer
2. Application State Layer
3. Domain Logic Layer
4. Repository Layer
5. Persistence Adapter Layer
6. Seed / Demo Data Layer

---

## 5. Folder Structure

Recommended folder structure:

```text
src/
  app/
    router/
    providers/
    layout/
  features/
    dashboard/
    issues/
    projects/
    teams/
    personal/
    demo/
    tags/
    statuses/
  entities/
    issue/
    project/
    user/
    team/
    tag/
    activity/
  shared/
    ui/
    components/
    hooks/
    utils/
    constants/
    types/
  domain/
    issueRules/
    dashboardMetrics/
    needsUpdate/
    permissions/
  repositories/
    issueRepository.ts
    projectRepository.ts
    userRepository.ts
    teamRepository.ts
    tagRepository.ts
  persistence/
    db.ts
    indexedDbAdapter.ts
    seedData.ts
    resetDemoData.ts
  styles/
    globals.css
```

პრინციპი:

* UI არ უნდა ელაპარაკებოდეს პირდაპირ IndexedDB-ს.
* UI ელაპარაკება store/service/repository-ს.
* მომავალში IndexedDB adapter შეიძლება შეიცვალოს API adapter-ით.

---

## 6. Core Domain Model

### User

User წარმოადგენს სისტემის შიდა მომხმარებელს.

Fields:

* id
* name
* email
* role
* teamId
* avatarInitials
* isDemoUser

Roles:

* Manager
* Project Manager
* User

---

### Team

Team წარმოადგენს მსუბუქ ჯგუფურ სივრცეს.

Fields:

* id
* name
* description
* memberIds
* createdAt
* updatedAt

Team Workspace არ უნდა გადაიქცეს organization management სისტემად.

---

### Project

Project არის Issue-ების კონტეინერი.

Fields:

* id
* name
* description
* status
* ownerId
* teamId
* createdBy
* createdAt
* updatedAt

Project-ში open text ძირითადად არის description.

---

### Issue

Issue არის მთავარი ოპერაციული ერთეული.

Fields:

* id
* title
* description
* projectId
* type
* statusId
* priority
* ownerId
* curatorId
* teamId
* tagIds
* labelIds
* dependencyType
* dependencyTargetId
* createdBy
* createdAt
* updatedBy
* updatedAt
* completedAt
* confirmationRequired
* confirmedBy
* confirmedAt

---

### Issue Type

Allowed values:

* Individual
* Group

---

### Status

Default statuses:

* New
* Planned
* Waiting
* Blocked
* Delayed
* In Progress
* Done
* Canceled

Custom status creation:

* allowed only for Manager
* allowed only for Project Manager
* not allowed for regular User

---

### Priority

Allowed values:

* Low
* Medium
* High
* Critical

---

### Tag

Tag გამოიყენება სწრაფი კონტექსტისთვის.

Fields:

* id
* name
* normalizedName
* color
* usageCount
* createdBy
* createdAt

Tag behavior:

* autocomplete-first
* duplicate prevention
* user can create tag
* system should suggest existing tags first

---

### Label

Label გამოიყენება დამატებითი operational context-ისთვის.

Fields:

* id
* name
* type
* color
* createdBy
* createdAt

Needs Update უნდა იყოს system label, არა status.

---

### Dependency

Dependency აღწერს, ვის მხარესაა შემდეგი მოქმედება ან რა აფერხებს Issue-ს.

Dependency Type:

* None
* User
* Team
* Client Representative
* External Representative
* Unknown

კლიენტი ან გარე კონტრაქტორი არ არის სისტემის მომხმარებელი.

შიდა representative მართავს სტატუსს.

---

### Activity History

Activity entry:

* id
* issueId
* actorId
* actionType
* oldValue
* newValue
* createdAt

Tracked actions:

* Issue Created
* Status Changed
* Owner Changed
* Priority Changed
* Curator Changed
* Tag Added
* Tag Removed
* Issue Updated
* Issue Completed
* Issue Confirmed
* Issue Reopened

---

## 7. Needs Update Logic

Needs Update არის system attention label.

Rule:

* თუ Issue არ არის Done ან Canceled
* და updatedAt ძველია მიმდინარე სამუშაო დღის კონტექსტში
* მაშინ Issue ითვლება Needs Update-ად

Product interpretation:

Needs Update არ ნიშნავს, რომ Issue ჩავარდა.

ის ნიშნავს:

* მონაცემი დაძველდა
* სტატუსი გადასამოწმებელია
* მომხმარებელმა უნდა დაადასტუროს ან განაახლოს მდგომარეობა

UI-ში Needs Update უნდა ჩანდეს:

* Dashboard count card
* Personal view
* Projects view
* Team Workspace
* Issue badge

თუ Needs Update ბევრია, UI-ში უნდა გამოჩნდეს count, ხოლო click-ზე გაიხსნას შესაბამისი filtered list.

---

## 8. Confirmation Logic

Portfolio MVP-ში საჭიროა მსუბუქი confirmation behavior.

Use case:

თუ Issue გადაეცა სხვა მომხმარებელს და საბოლოო მიღება მასზეა დამოკიდებული, მაშინ “Done” არ ნიშნავს სრულ დახურვას, სანამ მიმღებმა არ დაადასტურა.

Simplified flow:

1. Owner ასრულებს თავის ნაწილს.
2. Issue გადადის Done ან Ready for Confirmation მდგომარეობაში.
3. Recipient / target user ხედავს დასადასტურებელ Issue-ს.
4. Recipient ადასტურებს ან აბრუნებს Issue-ს.
5. Activity history ინახავს მოქმედებას.

Implementation note for MVP:

Ready for Confirmation შეიძლება გაკეთდეს label-ით და არა ცალკე heavy approval workflow-ით.

---

## 9. Main Screens

### Dashboard

Purpose:

* operational overview
* demo entry point
* manager visibility
* PM daily starting point

Contains:

* metric cards
* charts
* issue status distribution
* priority distribution
* needs update count
* blocked count
* delayed count
* project progress
* team progress
* filters
* click-through to Issue list

---

### Personal

Purpose:

აჩვენოს მომხმარებელთან დაკავშირებული საკითხები.

Sections:

* Assigned to me
* Created by me
* Curated by me
* Needs update
* Blocked / delayed related to me
* Confirmation required from me

---

### Projects

Purpose:

პროექტების სია და პროექტის შიდა Issue-ები.

Contains:

* project cards/table
* project status summary
* issue list
* filters by status, owner, priority, tag
* create issue
* create project

---

### Project Detail

Contains:

* project name
* project description
* status summary
* issue table
* issue filters
* team info
* project progress
* create issue button

---

### Issue Detail

Contains:

* title
* description
* project
* type
* owner
* curator
* status
* priority
* tags
* labels
* dependency
* activity history
* quick actions

Primary quick actions:

* change status
* change owner
* change priority
* add/remove tag
* mark done
* confirm/reopen if applicable

---

### Team Workspace

Purpose:

მსუბუქი team-level visibility.

Contains:

* team members
* team issues
* group issues
* team progress
* blocked/delayed/needs update counts

Not included:

* advanced permissions
* org hierarchy
* department management

---

### Demo Page / Demo Controls

Contains:

* Login as Manager
* Login as Project Manager
* Login as User
* Reset Demo Data
* Load Seed Data
* Short explanation of product

---

## 10. Demo Data

Seed data should include:

* 3 demo users
* 1 manager
* 2 project managers
* 4–6 regular users
* 2 teams
* 3–5 projects
* 20–30 issues
* individual issues
* group issues
* blocked issues
* delayed issues
* waiting issues
* done issues
* needs update issues
* ownership transfer examples
* curator examples
* activity history examples

Demo data should make the Dashboard look alive immediately.

---

## 11. Persistence Strategy

Portfolio MVP persistence:

* IndexedDB stores demo/user-created data
* Reset Demo Data restores seed state
* Load Seed Data initializes first visit
* No real backend
* No real authentication
* No sensitive data

Limitations:

* Data is local to browser/device
* Data is not shared between visitors
* Data can be reset
* Demo is not production multi-user software

This limitation is acceptable for portfolio MVP.

---

## 12. Future Backend Readiness

Even though MVP is frontend-only, code should be structured as if a backend can be added later.

Repository abstraction should allow replacing IndexedDB with:

* REST API
* GraphQL API
* Supabase
* Firebase
* custom backend
* GitHub-backed storage

Future backend modules:

* Auth
* Database
* Realtime updates
* Notifications
* Attachments
* Integrations
* Organization workspace
* Advanced permissions

---

## 13. Event Readiness

Full Notification Hub is not part of Portfolio MVP.

However, the domain should treat important actions as events internally.

Internal domain events:

* IssueCreated
* IssueUpdated
* StatusChanged
* OwnerChanged
* IssueBlocked
* IssueDelayed
* NeedsUpdateDetected
* IssueCompleted
* IssueConfirmed
* IssueReopened

In Portfolio MVP, these events only update:

* activity history
* dashboard metrics
* attention labels
* UI state

In future versions, these events can feed:

* browser notifications
* email
* Outlook
* Slack
* Telegram
* WhatsApp
* webhooks

---

## 14. UI/UX Design Direction

Style:

* clean internal SaaS dashboard
* calm colors
* high readability
* table-first operational interface
* cards for metrics
* badges for status/priority/tags
* quick action buttons
* minimal free text

Design priorities:

* fast scanning
* low cognitive load
* operational clarity
* no decorative complexity
* no heavy enterprise UI
* dashboard must look useful in screenshots

Important UI elements:

* status badge
* priority badge
* owner avatar/initials
* curator marker
* needs update badge
* quick status buttons
* filter bar
* search input
* metric cards
* simple charts
* activity timeline

---

## 15. Access / Auth Strategy

Portfolio MVP should not implement real authentication.

Use demo role switch:

* Login as Manager
* Login as Project Manager
* Login as User

Internally this changes currentUser.

This is enough for demo.

Future auth can be added later.

---

## 16. Permissions Strategy

Portfolio MVP permissions are lightweight.

Manager:

* can view dashboard
* can view all projects/issues
* can create/edit statuses
* can create/edit projects
* can update issues

Project Manager:

* can create/edit projects
* can create/edit issues
* can create statuses
* can manage group issue curator
* can transfer ownership

User:

* can view related projects/issues
* can update assigned issues
* can transfer ownership where applicable
* can add/use tags
* cannot create statuses

Permissions should remain simple and product-facing, not enterprise-grade.

---

## 17. Build Roadmap

### Phase 1 — Foundation

* project setup
* routing
* layout
* theme
* mock/demo users
* IndexedDB setup
* seed/reset demo data

### Phase 2 — Core Entities

* users
* teams
* projects
* issues
* statuses
* tags
* labels

### Phase 3 — Issue Operations

* create issue
* edit issue
* change status
* change owner
* change priority
* add/remove tags
* activity history
* needs update calculation

### Phase 4 — Main Views

* Dashboard
* Personal
* Projects
* Project detail
* Issue detail
* Team Workspace
* Demo controls

### Phase 5 — Portfolio Polish

* charts
* filters
* search
* helper texts
* empty states
* responsive layout
* demo guide
* README
* screenshots
* GitHub Pages deploy

### Phase 6 — Quality

* validation
* basic tests
* edge case handling
* lint/typecheck
* final demo reset testing

---

## 18. Repository Documentation

GitHub repository should include:

* README.md
* Product brief
* Feature inventory
* User journey
* Technical architecture
* Data model overview
* Demo instructions
* Screenshots
* Deployment instructions
* Future roadmap

README should clearly explain:

* problem
* solution
* user roles
* demo link
* stack
* architecture
* what is intentionally out of scope

---

## 19. Portfolio Positioning

This project should be presented as:

“A project-based operational clarity assistant for small teams, designed to reduce status ambiguity, ownership confusion, and open-text workflow chaos.”

It demonstrates:

* product discovery
* domain modeling
* frontend engineering
* data architecture
* UI/UX thinking
* local-first persistence
* dashboard design
* GitHub deployment
* future-ready architecture

---

## 20. Final Technical Direction

Build as:

React + TypeScript + Vite SPA
Tailwind + shadcn/ui interface
Zustand application state
Dexie + IndexedDB persistence
React Hook Form + Zod validation
TanStack Table lists
Recharts dashboard charts
GitHub Actions deployment
GitHub Pages hosting

No backend in Portfolio MVP.
No real auth in Portfolio MVP.
No attachments in Portfolio MVP.
No integrations in Portfolio MVP.
No notification hub in Portfolio MVP.

The MVP should feel like a working internal tool, but remain small enough to finish and polish.
