# Architecture Decision Record

## ADR-001 — React + Vite

Decision:

Use React + Vite rather than Next.js.

Reason:

The application is primarily a client-side authenticated dashboard
and already has a separately deployed FastAPI backend.

SSR/SSG is not currently required.

---

## ADR-002 — FastAPI is the Backend

The frontend does not implement backend business logic.

FastAPI owns:

- data
- analytics
- GitHub integration
- synchronization
- authorization

---

## ADR-003 — TanStack Query

Use TanStack Query for server state.

Do not introduce Redux for server state.

---

## ADR-004 — Feature-Oriented Architecture

Organize frontend code primarily by feature/domain.

---

## ADR-005 — Backend API is Source of Truth

Frontend must not invent API contracts.

---

## ADR-006 — Design System

Use the GitHub Intelligence dark engineering intelligence visual system.

Primary:

#B7A16A

Secondary:

#B96858

Tertiary:

#35B98A

Background:

#08110F