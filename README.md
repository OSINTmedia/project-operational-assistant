# Project Operational Assistant

Portfolio MVP for project-based operational clarity.

`React` · `TypeScript` · `Vite` · `Tailwind CSS` · `Zustand` · `Dexie / IndexedDB` · `Recharts`

## Build Progress

`[#################---] 85%`

Current public-demo status: Phase 5 polish is nearly complete. Phase 5.6 README presentation is complete; Phase 5.7 polish audit and Phase 6 final quality/deployment work remain.

- Complete: Phase 0 and 1 - Product scope, planning, and frontend foundation
- Complete: Phase 2A and 2B - Local-first data model, persistence, seed data, and issue-domain logic
- Complete: Phase 3 - Main app screens and screen audit
- Complete: Phase 4 - Dashboard metrics, charts, filters, click-throughs, and audit
- In progress: Phase 5 - Portfolio polish and public documentation
- Upcoming: Phase 6 - Validation, deployment setup, live demo verification, and final release audit

For exact implementation handoff state, use `changelog_checkpoint.md` first and `BUILD_PLAN.md` second. This README is public-facing portfolio context, not the internal work log.

## Overview

Project Operational Assistant is a frontend-only portfolio application for small and medium project-based teams. It helps users see operational Issues across Projects with structured statuses, priorities, labels, tags, owners, curators, dependencies, activity history, demo users, local-first persistence, and dashboard metrics.

The product goal is operational clarity: what is open, what is blocked, what is delayed, who owns the next action, and what needs an update. It is intentionally not a heavyweight project management platform.

## Live Demo

GitHub Pages target:

`https://osintmedia.github.io/project-operational-assistant/`

Final GitHub Pages deployment and live-demo verification are planned for Phase 6. The app is already designed as a static SPA with GitHub Pages-safe routing.

## What It Demonstrates

- Product thinking and MVP scope control
- Systems thinking around Issue ownership, curator responsibility, and attention signals
- Frontend architecture with React, TypeScript, and route-based feature surfaces
- Local-first persistence through IndexedDB / Dexie
- Repository, state, and domain boundaries
- Structured data modeling for operational work
- Dashboard metrics and distribution charts
- UI/UX discipline for dense operational screens
- Documentation and Git checkpoint workflow

## Core Product Model

The central entity is an Issue. An Issue can represent a task, dependency, blocker, handoff, follow-up, operational question, or confirmation item inside a Project.

Structured Issue fields include:

- Project
- Type
- Status
- Priority
- Tags
- Labels
- Owner
- Curator
- Dependency
- Created / updated metadata
- Activity history

Open text is intentionally limited to title and description. Operational meaning is carried by structured fields so the demo does not become a loose notes tool.

## Key Features

- Dashboard with operational metric cards
- Status, priority, and project distribution charts
- Local dashboard filters and issue search
- Project list and project detail surfaces
- Readable project issue lists with structured filters
- Issue create and edit flows
- Issue detail with metadata, dependency context, labels, tags, participants, and activity history
- Quick status and confirmation actions from Issue Detail
- Personal work surface grouped by assigned, created, curated, and attention-related Issues
- Team workspace visibility for members, team Issues, group Issues, and status summary
- Demo users and role switching
- Local browser persistence with reset demo data behavior
- Needs Update and Ready for Confirmation as system labels / attention signals

## Demo Accounts

The demo uses predefined local users instead of real authentication.

- Manager: Mariam Kapanadze
- Project Managers: Nino Beridze, Luka Tsereteli
- Users: Ana Japaridze, Gio Lomidze, Maya Chikovani, Dato Khatiashvili

Role switching is local app state only. It is designed to let visitors compare perspectives without sign-in, sessions, or a backend.

## What This Project Is Not

This MVP is intentionally not:

- Jira, Asana, Trello, CRM, or helpdesk software
- an employee scoring or surveillance tool
- a notification hub
- an attachment or document management system
- an organization workspace platform
- a real authentication system
- a backend/API integration project

The goal is a clear operational assistant, not a broad enterprise suite.

## Architecture

The app is a static frontend SPA with local-first browser persistence.

High-level layers:

- UI layer: React feature screens and shared presentation components
- Application state: Zustand for demo identity and app lifecycle
- Domain logic: issue rules, dashboard metrics, confirmation and attention behavior
- Repository layer: typed access boundaries for persisted records
- Persistence adapter: Dexie / IndexedDB
- Seed data: local demo dataset and reset behavior

The UI does not talk directly to IndexedDB. Feature screens consume state, read-model hooks, domain helpers, and repositories rather than persistence internals.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router with `HashRouter`
- Zustand
- Dexie / IndexedDB
- React Hook Form
- Zod
- Recharts
- Lucide React
- oxlint

## Local Setup

```bash
npm install
npm run dev
```

Open the local Vite URL printed in the terminal.

Useful commands:

```bash
npm run build
npm run typecheck
npm run lint
```

## Project Structure

```text
src/
  app/           app shell, router, providers, app state
  domain/        issue rules and dashboard metric logic
  entities/      typed entity contracts
  features/      dashboard, projects, issues, teams, personal, demo
  persistence/   Dexie schema, seed data, reset lifecycle
  repositories/  data access boundaries
  shared/        shared components, constants, types, utilities
  styles/        global styles
```

## Documentation

Planning and handoff documents:

- `BUILD_PLAN.md` - implementation roadmap and micro-phase definitions
- `changelog_checkpoint.md` - live handoff state and next concrete task
- `DEVELOPMENT_NOTES.md` - decisions, trade-offs, and lessons learned
- `docs/Portfolio_MVP_V1.md` - frozen product scope
- `docs/Technical_Planning_v1.md` - frozen technical direction
- `docs/User_Journey_Freeze_v1.md` - frozen user journey context

## Roadmap

Completed:

- Product scope and technical planning
- Frontend foundation and GitHub Pages-safe SPA routing
- Local-first persistence, seed data, reset flow, and demo users
- Issue-domain operations and activity history behavior
- Main screens for Dashboard, Personal, Projects, Project Detail, Issue Detail, Teams, and Demo
- Dashboard metrics, charts, filters, and click-throughs
- Portfolio polish through helper text, search/filter polish, quick actions, responsive layout, and visual consistency

Remaining:

- Phase 5.7 - Phase 5 polish audit
- Phase 6 - validation, focused tests, GitHub Pages deployment setup, live-demo verification, final scope audit, documentation cleanup, and release tag

## Lessons Captured

- A local-first portfolio app can still demonstrate serious product architecture when persistence is kept behind clear boundaries.
- Structured fields make the operational model easier to reason about than open text alone.
- System labels such as Needs Update and Ready for Confirmation should remain semantically separate from statuses and tags.
- Small micro-phases make implementation easier to audit and keep the project from drifting into a clone of heavier tools.
