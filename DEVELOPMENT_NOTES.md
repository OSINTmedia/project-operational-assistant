# Development Notes

## Purpose

This file captures implementation decisions, trade-offs, lessons learned, problems encountered, and reasoning that should not clutter README.md.

---

## Decision Log

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
