# GitHub Intelligence Frontend — Agent Instructions

This document defines the mandatory engineering rules for the GitHub Intelligence frontend.

These rules apply to every feature, bug fix, refactor, UI change, API integration, routing change, dependency change, and architectural modification.

The agent MUST follow these rules unless an explicit user instruction overrides them.

---

# 1. Project Identity

This repository contains the frontend for GitHub Intelligence.

GitHub Intelligence is an engineering intelligence platform that analyzes GitHub repositories, pull requests, delivery velocity, cycle time, contributor activity, and engineering workflow health.

The frontend is:

* React
* Vite
* React Router
* TanStack Query
* Axios

The backend is a separate FastAPI application.

The frontend is a client application.

---

# 2. Core Engineering Principle

The goal is not to produce the fewest files.

The goal is to produce code that is:

* predictable
* maintainable
* readable
* testable
* reusable
* easy for another engineer to extend
* consistent with the existing architecture

Prefer clear structure over compressed structure.

Prefer explicit code over clever abstractions.

Prefer small focused modules over giant files.

---

# 3. Source of Truth

Before implementing anything, inspect the relevant `.agent/` documentation.

Use this priority:

1. `AGENTS.md`
2. `PHASES.md`
3. `ARCHITECTURE.md`
4. `DESIGN.md`
5. `API.md`
6. `PRODUCT.md`
7. `DECISIONS.md`
8. Existing implementation

If two documents conflict:

* Do not silently choose one.
* Identify the conflict.
* Follow the higher-priority document.
* If the conflict cannot be resolved, report it before proceeding.

---

# 4. Mandatory Pre-Implementation Process

Before writing code, the agent MUST:

1. Read the relevant `.agent/` documentation.
2. Inspect the existing repository structure.
3. Inspect related existing components.
4. Search for reusable components before creating new ones.
5. Inspect existing routes if routing is involved.
6. Inspect existing API services/hooks if API work is involved.
7. Check `git status`.
8. Understand existing uncommitted changes.

Do not immediately start creating files after receiving a task.

Understand the existing implementation first.

---

# 5. Phase Discipline

Development is divided into phases defined in:

`.agent/PHASES.md`

Only implement the requested/current phase.

Do NOT:

* implement future phases
* add speculative functionality
* redesign unrelated screens
* refactor unrelated code
* create infrastructure for future features
* silently expand scope

If an unrelated issue is discovered:

* do not automatically fix it
* mention it in the final report
* only fix it if it blocks the current task

---

# 6. Frontend / Backend Responsibility

The backend is the source of truth.

## Frontend owns

* presentation
* interaction
* client-side UI state
* server-state consumption
* routing
* visualization
* loading states
* error states
* empty states
* responsive behavior

## Backend owns

* business logic
* analytics calculations
* authorization
* persistence
* GitHub integration
* synchronization
* domain rules
* server-side validation

The frontend must NOT recreate backend business logic.

---

# 7. API Rules

The backend API contract is defined in:

`.agent/API.md`

Never invent:

* endpoints
* response fields
* request fields
* query parameters
* IDs
* status values
* business rules

If required data does not exist in the documented API:

1. Identify the missing backend requirement.
2. Report it.
3. Stop that part of the implementation.
4. Do not fabricate production API behavior.

Mock data may only be used for explicit visual prototyping.

Mock data must never silently become part of production behavior.

---

# 8. Folder Architecture

The source tree follows clear responsibility boundaries.

```text
src/
├── app/
├── assets/
├── components/
├── constants/
├── features/
├── hooks/
├── layouts/
├── pages/
├── services/
├── styles/
├── utils/
├── index.css
└── main.jsx
```

Each directory has a defined responsibility.

Do not place files wherever it is convenient.

---

# 9. Component Folder Rule — MANDATORY

Every meaningful React component MUST have its own directory.

DO NOT do this:

```text
components/ui/
├── Button.jsx
├── Button.module.css
├── Card.jsx
├── Card.module.css
├── Badge.jsx
├── Badge.module.css
```

DO this:

```text
components/ui/
├── Button/
│   ├── Button.jsx
│   ├── Button.module.css
│   └── index.js
├── Card/
│   ├── Card.jsx
│   ├── Card.module.css
│   └── index.js
└── Badge/
    ├── Badge.jsx
    ├── Badge.module.css
    └── index.js
```

This rule applies to:

* reusable UI components
* feature components
* layout components
* complex page components

---

# 10. Component Folder Structure

The preferred structure is:

```text
ComponentName/
├── ComponentName.jsx
├── ComponentName.module.css
└── index.js
```

Only create files that are actually needed.

For example, if no component-specific CSS is required:

```text
ComponentName/
├── ComponentName.jsx
└── index.js
```

If tests exist:

```text
ComponentName/
├── ComponentName.jsx
├── ComponentName.module.css
├── ComponentName.test.jsx
└── index.js
```

Do not create empty placeholder files.

---

# 11. Component index.js

Component folders should expose their public component through `index.js`.

Example:

```js
export { default } from "./Button";
```

Consumers should preferably import:

```js
import Button from "@/components/ui/Button";
```

rather than:

```js
import Button from "@/components/ui/Button/Button";
```

---

# 12. Feature Structure

Feature-specific functionality belongs inside:

```text
src/features/
```

A feature should normally follow:

```text
features/
└── repositories/
    ├── components/
    │   ├── RepositoryCard/
    │   │   ├── RepositoryCard.jsx
    │   │   └── index.js
    │   └── RepositoryTable/
    │       ├── RepositoryTable.jsx
    │       └── index.js
    ├── hooks/
    ├── services/
    ├── utils/
    └── index.js
```

Do not put repository-specific components in global `components/`.

Do not put analytics-specific components in global `components/`.

---

# 13. Shared UI vs Feature UI

Use:

```text
src/components/
```

ONLY for genuinely reusable UI.

Examples:

* Button
* Card
* Badge
* Input
* Table
* Tabs
* Tooltip
* LoadingState
* ErrorState
* EmptyState

Use:

```text
src/features/<feature>/
```

for feature-specific UI.

Examples:

```text
features/repositories/
features/pullRequests/
features/analytics/
features/workspace/
features/pipeline/
```

A component should move into shared `components/` only when it has a genuine cross-feature use case.

Do not place something in shared UI simply because it might be reused someday.

---

# 14. Pages

Pages represent route-level screens.

A page should primarily compose:

* feature components
* layouts
* shared UI
* hooks/query hooks

Pages should NOT become giant implementation files.

Avoid:

```text
AnalyticsPage.jsx
```

containing:

* API calls
* large data transformations
* dozens of UI sections
* chart implementations
* complex filtering
* reusable components
* business rules

Prefer:

```text
pages/
└── Analytics/
    └── AnalyticsPage.jsx

features/
└── analytics/
    ├── components/
    ├── hooks/
    ├── services/
    └── utils/
```

The page composes the feature.

---

# 15. Page vs Feature Decision Rule

When deciding where code belongs:

## Put it in `pages/` if:

It primarily represents a route/screen.

Example:

```text
AnalyticsPage
RepositoriesPage
SettingsPage
```

## Put it in `features/` if:

It represents domain-specific functionality.

Example:

```text
AnalyticsChart
CycleTimeCard
RepositoryTable
PullRequestFilters
SyncJobStatus
WorkspaceSelector
```

## Put it in `components/` if:

It is genuinely reusable and domain-agnostic.

Example:

```text
Button
Card
Badge
Tabs
Input
Table
```

---

# 16. Layouts

Layouts define application structure.

Examples:

```text
layouts/
├── DashboardLayout/
└── MarketingLayout/
```

A layout may contain structural components such as:

```text
DashboardLayout/
├── DashboardLayout.jsx
├── Sidebar/
│   ├── Sidebar.jsx
│   ├── Sidebar.module.css
│   └── index.js
├── TopBar/
│   ├── TopBar.jsx
│   ├── TopBar.module.css
│   └── index.js
└── index.js
```

Layouts must NOT contain feature-specific business logic.

---

# 17. Existing Layout Rule

Do not unnecessarily flatten existing layout structures.

If a layout contains meaningful subcomponents such as:

* Sidebar
* TopBar
* Navigation
* WorkspaceSelector

those should have their own component boundaries when they become independently meaningful.

---

# 18. Reuse Before Creation

Before creating a component:

1. Search the repository.
2. Check `components/ui/`.
3. Check the relevant feature.
4. Check existing layouts.
5. Check existing hooks/utilities.

If an equivalent component already exists:

* reuse it
* extend it
* refactor it if necessary

Do not create duplicate versions.

---

# 19. Duplicate Component Rule

Do NOT create variations such as:

```text
MetricCard
MetricCard2
DashboardMetricCard
AnalyticsMetricCard
StatsCard
```

if they represent the same underlying concept.

Before creating a new component, determine whether the existing component can support the requirement.

If the components genuinely have different responsibilities, keep them separate and document the distinction through naming.

---

# 20. Component Responsibility

A component should have one clear responsibility.

Avoid components that simultaneously:

* fetch data
* perform complex data transformation
* manage global state
* manage routing
* render multiple unrelated sections
* contain business rules

Split responsibilities when the separation improves maintainability.

Do NOT split components merely to reduce line count.

---

# 21. React State

Use local React state for temporary UI state.

Examples:

* modal visibility
* dropdown visibility
* input state
* temporary UI state
* tabs when not represented in the URL

Do not introduce global state without a demonstrated need.

---

# 22. Server State

Use TanStack Query for server state.

Examples:

* repositories
* pull requests
* analytics
* workspaces
* sync jobs
* current user

Do not duplicate server state into local state without a specific reason.

Do not introduce Redux for server state.

---

# 23. URL State

Use URL state when state should survive:

* refresh
* navigation
* sharing
* browser history

Examples:

* filters
* pagination
* selected repository
* date range
* search query

Do not hide important navigational state inside component-only state.

---

# 24. API Calls

Do not place raw Axios calls throughout components.

Prefer:

```text
feature/
├── services/
│   └── repositories.js
├── hooks/
│   └── useRepositories.js
└── components/
```

The UI should consume hooks/services rather than construct HTTP requests itself.

---

# 25. Axios Client

There should be a single configured HTTP client.

Do not create multiple competing Axios clients without an architectural reason.

Do not hardcode the production backend URL.

Use:

```text
VITE_API_BASE_URL
```

---

# 26. Loading / Error / Empty States

Every API-driven feature must explicitly consider:

1. Loading
2. Success
3. Empty
4. Error

Do not leave blank screens while waiting for data.

Do not assume collections are always non-empty.

---

# 27. Data Transformation

Simple presentation formatting may occur in the frontend.

Examples:

* date formatting
* display labels
* number formatting
* percentage formatting

Business calculations belong to the backend.

Do not recreate backend analytics calculations in React.

---

# 28. Design System

`.agent/DESIGN.md` is the visual source of truth.

The agent must follow:

* color system
* typography
* spacing
* borders
* density
* hierarchy
* component treatment
* chart treatment
* interaction states

Do not replace the product design with generic SaaS UI.

Do not introduce a generic Material UI visual style.

Do not add:

* gradients
* glassmorphism
* neon palettes
* excessive shadows
* excessive rounded cards
* unnecessary animation

unless explicitly requested.

---

# 29. Styling

Follow the existing CSS architecture.

For component-specific styles, prefer:

```text
Component/
├── Component.jsx
├── Component.module.css
└── index.js
```

Do not create large global CSS files for component-specific styling.

Do not duplicate design tokens.

Use centralized tokens from:

```text
src/styles/tokens.css
```

---

# 30. Responsive Design

Desktop is the primary design target.

However, all UI should degrade gracefully on:

* tablet
* mobile

Do not create a completely separate mobile product unless explicitly requested.

---

# 31. Accessibility

Interactive elements must use appropriate semantic HTML.

Prefer:

```html
<button>
<a>
<input>
<select>
```

over clickable `<div>` elements.

Consider:

* keyboard navigation
* focus states
* accessible labels
* alt text
* semantic structure

Accessibility is part of implementation, not an optional polish step.

---

# 32. Dependencies

Do not add dependencies casually.

Before installing a package:

1. Check existing dependencies.
2. Check whether browser/React functionality is sufficient.
3. Check whether an existing package already solves the problem.
4. Explain why the new dependency is necessary.

Do not install a library for a trivial helper.

---

# 33. No Premature Abstraction

Do not create abstractions because they sound architecturally impressive.

Avoid premature:

* generic render engines
* universal components
* factory systems
* abstraction layers
* configuration engines
* generic data managers

Abstract only when multiple real use cases justify it.

---

# 34. No Giant Components

If a component becomes difficult to understand, identify its responsibilities.

Possible extraction targets:

* child component
* custom hook
* service
* utility
* feature module

Do not create one 800-line component containing an entire screen.

---

# 35. No Giant Utility Files

Do not create:

```text
utils/
└── index.js
```

containing hundreds of unrelated helpers.

Group utilities by responsibility.

For example:

```text
utils/
├── date/
├── formatting/
└── validation/
```

Use folders when the number of utilities justifies it.

---

# 36. No Giant Hook Files

Hooks should have focused responsibilities.

Prefer:

```text
hooks/
├── useHealth.js
```

and feature-specific hooks under their feature:

```text
features/
└── analytics/
    └── hooks/
        ├── useAnalyticsOverview.js
        ├── useThroughput.js
        └── useAuthors.js
```

Do not create one giant `useAppData.js`.

---

# 37. No Giant Service Files

API services should be grouped by domain.

Prefer:

```text
services/
└── api/
    ├── client.js
    └── health.js
```

and feature-specific services where appropriate:

```text
features/
└── repositories/
    └── services/
        └── repositories.js
```

Do not create one enormous API file containing every endpoint.

---

# 38. Routing

Routes belong in the application routing layer.

Do not scatter route definitions throughout feature components.

Do not hardcode navigation URLs unnecessarily.

Follow the existing router architecture.

---

# 39. Environment Variables

Never commit secrets.

Never hardcode:

* API keys
* access tokens
* passwords
* private credentials

Environment-specific configuration must use environment variables.

Keep `.env.example` updated when new required variables are introduced.

---

# 40. Git Safety

Before changing code:

```bash
git status
```

The agent MUST inspect the current working tree.

Existing uncommitted changes may belong to the developer.

Never assume they can be discarded.

---

# 41. Preserve User Changes

Before modifying a file that already contains uncommitted changes:

1. Inspect the diff.
2. Understand the existing changes.
3. Preserve unrelated work.

Never overwrite developer work.

Never run destructive commands such as:

```bash
git reset --hard
git clean -fd
git checkout -- .
git restore .
```

unless explicitly instructed.

---

# 42. Verification

A feature is not complete because the code was written.

Before completion, run the available project checks.

At minimum, where configured:

```bash
npm run lint
npm run build
npm test
```

Also run type checking if configured.

Only report checks that were actually executed.

Never claim:

"Tests passed"

unless tests were actually run.

---

# 43. Diff Review

Before committing:

```bash
git diff
```

Review the complete change.

Look for:

* unrelated files
* accidental changes
* debug logs
* TODOs
* mock data
* secrets
* broken imports
* unused imports
* accidental formatting changes
* generated files

The final diff should contain only intended changes.

---

# 44. Commit Rules

Commits must be:

* focused
* atomic
* descriptive
* verified

Prefer:

```text
feat(analytics): add throughput chart

feat(repositories): add repository tracking

fix(pull-requests): handle empty results

refactor(ui): organize shared components
```

Avoid:

```text
update

changes

fix stuff

final

frontend work
```

---

# 45. Commit Sequence

The preferred workflow is:

```text
Understand
    ↓
Inspect
    ↓
Plan
    ↓
Implement
    ↓
Test
    ↓
Build
    ↓
Review diff
    ↓
Commit
```

Do not commit before verification.

---

# 46. Commit Scope

One commit should represent one logical unit of work.

Do not combine:

* unrelated UI changes
* unrelated refactors
* dependency upgrades
* feature implementation
* cleanup

into one commit.

---

# 47. Documentation

If an implementation changes architecture, update the relevant `.agent/` document.

Examples:

Architecture change:

```text
.agent/ARCHITECTURE.md
```

Design change:

```text
.agent/DESIGN.md
```

API change:

```text
.agent/API.md
```

Important technical decision:

```text
.agent/DECISIONS.md
```

Phase change:

```text
.agent/PHASES.md
```

Do not document behavior that does not actually exist.

---

# 48. Scope Control

If the agent notices an improvement that is unrelated to the current task:

Do not implement it.

Report it as:

```text
Potential follow-up:
<description>
```

The current task should remain focused.

---

# 49. Final Verification Checklist

Before declaring work complete:

* [ ] Relevant `.agent/` files were read
* [ ] Existing implementation was inspected
* [ ] Existing components were searched for reuse
* [ ] `git status` was checked
* [ ] Existing user changes were preserved
* [ ] Only requested scope was implemented
* [ ] Folder architecture was followed
* [ ] Meaningful components have their own folders
* [ ] Component-specific CSS is co-located
* [ ] Components have `index.js` where appropriate
* [ ] Shared components are genuinely reusable
* [ ] Feature components remain inside their feature
* [ ] Pages remain route-level compositions
* [ ] API calls are not scattered through UI
* [ ] TanStack Query is used for server state
* [ ] No backend logic was recreated
* [ ] No API behavior was invented
* [ ] Loading state exists
* [ ] Error state exists
* [ ] Empty state exists where applicable
* [ ] Responsive behavior was considered
* [ ] Accessibility was considered
* [ ] No unnecessary dependency was added
* [ ] No secrets were introduced
* [ ] Lint passed
* [ ] Tests passed where configured
* [ ] Build passed
* [ ] `git diff` was reviewed
* [ ] Only intended files changed
* [ ] Documentation was updated if necessary
* [ ] Commit was created with a meaningful message

---

# 50. Final Report Format

After completing a task, report:

## Changes

What was implemented.

## Files

Files created, modified, or deleted.

## Verification

Actual results for:

* lint
* tests
* type check
* build

## Git

Commit hash and commit message.

## Assumptions

Any assumptions made.

## Follow-ups

Unrelated issues discovered but intentionally not changed.

---

# 51. Golden Rule

When uncertain:

DO NOT INVENT.

Inspect the repository.

Read the project documentation.

Search for existing patterns.

Follow the established architecture.

Make the smallest correct change.

Verify the implementation.

Review the diff.

Commit only verified work.

The objective is not to generate the most code.

The objective is to maintain a frontend codebase that a human engineer can understand, review, maintain, and extend.
