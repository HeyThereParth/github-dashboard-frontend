# GitHub Intelligence

> An engineering intelligence and telemetry platform providing operational visibility into GitHub repository activity, PR delivery velocity, cycle times, and workflow health.

---

## ⚡ Overview

**GitHub Intelligence** is a client application designed for engineering leads, managers, and software teams who need actionable visibility into software delivery without misleading vanity metrics or individual developer gamification.

The platform connects to a dedicated **FastAPI** backend to ingest GitHub organization webhooks and REST data, transforming raw events into clean operational signals: pull request throughput, cycle time distributions, merge ratios, and repository sync health.

---

## ✨ Key Features

- **📊 Delivery Velocity & Metrics**
  - Track pull request throughput, merge rates, and time-to-merge across customizable time windows.
  - Interactive charts powered by Recharts visualizing historical trends and review bottlenecks.

- **🔄 Repository Discovery & Sync Management**
  - Discover repositories across GitHub organizations and toggle tracking per repository.
  - Real-time sync job status monitoring, failure reporting, and manual sync triggers.

- **🔍 Pull Request Telemetry**
  - High-density PR stream with instant filtering by status (`open`, `merged`, `closed`), author, and repository.
  - Deep-dive metadata inspection including cycle time breakdown and direct GitHub navigation.

- **🏢 Multi-Workspace Scoping**
  - Global organization and workspace selector to switch contexts seamlessly across teams.

- **🎨 High-Density Developer UI**
  - Precision dark-mode aesthetic inspired by developer tooling like Linear and Datadog.
  - Custom design token system built on vanilla CSS Modules — no bloated runtime CSS frameworks.
  - Fully responsive layout with mobile drawer support and keyboard-friendly navigation.

- **🔐 Authentication & Access**
  - Supabase Auth integration supporting GitHub OAuth sign-in and secure tokenized API communication.

---

## 🏗️ Architecture & Engineering Principles

The frontend codebase is organized around strict modularity, separation of concerns, and predictability:

```text
src/
├── app/          # App-level routing, providers, and global setup
├── assets/       # Static assets, SVG symbols, brand logos
├── components/   # Truly reusable domain-agnostic UI primitives (Button, Card, Badge, Table)
├── constants/    # App-wide constants and route definitions
├── features/     # Domain-specific feature modules (analytics, repositories, pullRequests, workspace)
│   ├── components/
│   ├── hooks/
│   └── services/
├── layouts/      # Structural shells (DashboardLayout, MarketingLayout)
├── pages/        # Lightweight route-level composition screens
├── services/     # Centralized HTTP client and API integration layer
├── styles/       # Design tokens (tokens.css) and global baseline styles
└── utils/        # Specialized date, number, and string formatting helpers
```

### Key Engineering Decisions:
- **Server State vs. UI State**: TanStack Query handles caching, background invalidation, and deduplication for server data. Local state is reserved strictly for ephemeral UI state (modals, dropdowns).
- **URL as Source of Truth**: Navigational states (filters, active tabs, search queries, pagination) live in URL search parameters to ensure shareable, reproducible URLs.
- **Layered Data Access**: Components never make direct HTTP calls. UI components consume domain hooks (`useRepositories`, `useThroughput`), which invoke typed service endpoints backed by a single configured Axios instance.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Core Framework** | [React 19](https://react.dev/) + [Vite](https://vite.dev/) |
| **Routing** | [React Router v7](https://reactrouter.com/) |
| **Server State & Caching** | [TanStack Query v5](https://tanstack.com/query) |
| **Data Visualization** | [Recharts](https://recharts.org/) |
| **HTTP Client** | [Axios](https://axios-http.com/) |
| **Authentication** | [Supabase Auth](https://supabase.com/docs/guides/auth) (GitHub OAuth) |
| **Styling** | Vanilla CSS Modules + CSS Custom Property Design Tokens |
| **Icons & Motion** | [Lucide React](https://lucide.dev/) + [Motion](https://motion.dev/) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- Running instance of the [GitHub Intelligence FastAPI backend](https://github.com) (or compatible API server)

### 1. Clone & Install

```bash
git clone https://github.com/HeyThereParth/github-dashboard-frontend.git
cd github-dashboard-frontend
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Configure your environment variables:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
```

### 3. Development Server

Start the local development server with Hot Module Replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server with HMR. |
| `npm run build` | Compiles and optimizes assets into `dist/` for production. |
| `npm run lint` | Runs ESLint across the codebase to ensure code quality and rule compliance. |
| `npm run preview` | Locally previews the production build. |

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
