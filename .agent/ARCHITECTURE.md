# Frontend Architecture

## Architecture

React + Vite frontend.

FastAPI backend.

The frontend is a client application.

---

# Layers

UI

↓

Features

↓

Hooks

↓

Services

↓

HTTP Client

↓

FastAPI

---

# Directory Responsibilities

## app/

Application bootstrap.

Contains:

- router
- providers
- application configuration

---

## layouts/

Structural layouts.

Examples:

DashboardLayout
MarketingLayout

Layouts should not contain feature-specific business logic.

---

## pages/

Route-level compositions.

Pages should compose features rather than contain large amounts
of implementation logic.

---

## features/

Business/domain-specific frontend functionality.

Examples:

dashboard
analytics
repositories
pullRequests
pipeline
settings
workspace

---

## components/ui/

Reusable UI primitives.

Examples:

Button
Card
Badge
Input
Modal
Table
Tabs

Only put genuinely reusable components here.

---

## services/

API communication.

Services know how to communicate with FastAPI.

Components should not manually construct HTTP requests.

---

## hooks/

Reusable React behavior.

Examples:

useRepositories
usePullRequests
useAnalytics
useSyncJob

---

## styles/

Global CSS and design tokens.

---

# Data Flow

Example:

AnalyticsPage

↓

useAnalytics()

↓

analyticsService

↓

Axios client

↓

FastAPI

↓

TanStack Query cache

↓

AnalyticsPage

↓

Chart / Metric components