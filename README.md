# Project Operational Assistant 🚀
> Portfolio MVP for project-based operational clarity.

![Status: In Active Development]
![Architecture: Core Ready]
![Stack: React + TS + Zustand]

### 📊 Portfolio MVP Build Progress:
[▓▓▓▓▓▓▓▓░░░░░░░░░░░░] ~40% Completed 

- ✅ **Phase 0 & 1:** Product Scope & Technical Planning (100%)
- ✅ **Phase 2A & 2B:** Architecture, Local Persistence & Issue-Domain Logic (~95%)
- ⏳ **Phase 3 & 4:** Main Screens, Interactive Dashboards & Recharts (Upcoming)
- ⏳ **Phase 5 & 6:** Polishing, Testing, Deployment & Final Audit (Upcoming)

---

Portfolio MVP for project-based operational clarity.

Project Operational Assistant is a frontend-first web application designed for small and medium project-based teams. It helps managers, project managers, and users track issues, ownership, statuses, dependencies, curators, and operational progress across multiple projects.

This repository is built as a portfolio project to demonstrate product thinking, systems thinking, frontend engineering, structured data modeling, dashboard design, UI/UX discipline, and documentation workflow.

---

## Purpose

Many small and medium teams manage operational work through email, chats, calls, notes, and scattered spreadsheets. As a result, it becomes difficult to answer simple but important questions:

* What issue is currently open?
* Who owns the next action?
* What is blocked or delayed?
* Which issue needs an update?
* What changed recently?
* Is an issue actually done, or only done from one person’s side?

This project explores a lightweight operational assistant that reduces ambiguity without becoming a heavy enterprise project management tool.

---

## Core Concept

The main entity in the system is an **Issue**.

An Issue can represent a task, operational question, dependency, blocker, handoff, or follow-up item inside a project.

Each Issue is structured around:

* title
* description
* project
* status
* priority
* tags
* labels
* owner
* curator
* dependency
* activity history

The goal is to reduce open-text chaos by keeping most operational fields structured.

---

## Main Roles

### Manager

Views operational progress, blocked work, delayed issues, and dashboard metrics.

### Project Manager

Creates and manages projects and issues, assigns ownership, updates statuses, manages curators, and monitors project-level clarity.

### User

Works on assigned issues, updates statuses, transfers ownership when needed, and confirms completion when relevant.

---

## Key MVP Features

Planned Portfolio MVP features include:

* project-based issue tracking
* individual and group issues
* owner and ownership transfer
* curator model for group issues
* structured statuses
* priorities
* tags and labels
* dependency tracking
* activity history
* Needs Update attention signal
* lightweight confirmation flow
* dashboard metrics and charts
* personal, project, team, and dashboard views
* demo users and role switching
* local demo persistence
* reset demo data option

---

## What This Project Is Not

This project is intentionally not:

* a Jira clone
* an Asana clone
* a Trello clone
* a CRM
* an IT helpdesk
* an employee surveillance dashboard
* a full enterprise workflow platform
* an AI-first product
* a notification hub
* a document management system

The goal is operational clarity, not feature overload.

---

## Technical Direction

Planned stack:

* React
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* Lucide icons
* React Router with GitHub Pages-safe routing
* Zustand
* Dexie / IndexedDB
* React Hook Form
* Zod
* TanStack Table
* Recharts
* GitHub Pages deployment

The Portfolio MVP is designed as a static frontend application with local-first browser persistence.

No backend server is required for the demo version.

---

## Demo Strategy

The final demo is intended to run on GitHub Pages.

The demo version should include:

* seed data
* demo users
* role switching
* sample projects
* sample issues
* local browser persistence
* reset demo data

This allows visitors to test the product without needing a backend, database server, or real authentication.

---

## Current Status

The project is currently in the foundation/setup phase.

Completed so far:

* product discovery
* MVP scope definition
* user journey planning
* technical planning
* documentation structure
* GitHub repository initialization

Implementation is being developed step by step with documented checkpoints.

---

## Documentation

Project planning documents are maintained in the repository:

* `BUILD_PLAN.md`
* `changelog_checkpoint.md`
* `DEVELOPMENT_NOTES.md`
* `docs/Portfolio_MVP_V1.txt`
* `docs/Technical_Planning_v1.txt`
* `docs/User_Journey_Freeze_v1.txt`

These documents describe the product scope, technical direction, user journeys, build phases, decisions, trade-offs, and implementation progress.

---

## Portfolio Goal

This project is intended to show more than code.

It is designed to demonstrate:

* problem definition
* MVP discipline
* structured product planning
* frontend architecture
* local-first application design
* dashboard and workflow modeling
* documentation habits
* Git/GitHub workflow
* future-ready technical decisions

The objective is to build a clear, usable, and well-documented portfolio application rather than a large unfinished product.
