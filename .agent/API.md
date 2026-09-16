# Backend API Contract

## Base URL

Configured through:

VITE_API_BASE_URL

Example:

https://github-dashboard-xvea.onrender.com

Do not hardcode the production URL inside components.

---

# Health

GET

/health

Purpose:

Liveness probe.

Response:

{
  "status": "ok"
}

---

# Current User

GET

/api/v1/me

Purpose:

Return authenticated application user.

---

# Workspaces

POST

/api/v1/workspaces

Create workspace.

GET

/api/v1/workspaces

List workspaces.

GET

/api/v1/workspaces/{workspace_id}

Get workspace.

---

# GitHub Connection

GET

/api/v1/workspaces/{workspace_id}/github/install-url

Generate GitHub installation URL.

POST

/api/v1/workspaces/{workspace_id}/github/connect

Connect GitHub installation.

DELETE

/api/v1/workspaces/{workspace_id}/github/disconnect

Disconnect GitHub installation.

---

# GitHub Repositories

GET

/api/v1/workspaces/{workspace_id}/github/repositories

List repositories available through the GitHub installation.

Query parameters:

page
per_page

---

# Tracked Repositories

POST

/api/v1/workspaces/{workspace_id}/repositories/track

Track repository.

GET

/api/v1/workspaces/{workspace_id}/repositories/tracked

List tracked repositories.

GET

/api/v1/workspaces/{workspace_id}/repositories/tracked/{repository_id}

Get tracked repository.

DELETE

/api/v1/workspaces/{workspace_id}/repositories/tracked/{repository_id}

Untrack repository.

---

# Repository Sync

POST

/api/v1/workspaces/{workspace_id}/repositories/tracked/{repository_id}/sync

Starts asynchronous synchronization.

Returns:

job_id
status
message

---

# Sync Jobs

GET

/api/v1/workspaces/{workspace_id}/repositories/tracked/{repository_id}/sync-jobs

List recent sync jobs.

GET

/api/v1/workspaces/{workspace_id}/repositories/tracked/{repository_id}/sync-jobs/{job_id}

Get sync job status.

---

# Pull Requests

GET

/api/v1/workspaces/{workspace_id}/repositories/tracked/{repository_id}/pull-requests

Query parameters:

state
page
per_page

Response:

items
total
page
per_page

---

# Analytics Overview

GET

/api/v1/workspaces/{workspace_id}/repositories/tracked/{repository_id}/analytics/overview

Query:

days

Returns:

total_prs
open_prs
merged_prs
closed_unmerged_prs
merge_rate_percentage

cycle_time:
  p50_hours
  p90_hours
  avg_hours

---

# Analytics Throughput

GET

/api/v1/workspaces/{workspace_id}/repositories/tracked/{repository_id}/analytics/throughput

Query:

weeks

Returns weekly merged PR counts.

---

# Analytics Authors

GET

/api/v1/workspaces/{workspace_id}/repositories/tracked/{repository_id}/analytics/authors

Query:

days

Returns:

author_login
total_prs
merged_prs
avg_cycle_time_hours

---

# Important API Rule

The frontend must consume the API exactly as defined.

If the UI requires data that is not available:

DO NOT fabricate it.

Instead identify the backend requirement.