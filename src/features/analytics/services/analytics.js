import apiClient from '@/services/api/client';

/**
 * Fetch high-level engineering analytics overview for a tracked repository.
 *
 * @param {string} workspaceId - Active workspace UUID
 * @param {string} repositoryId - Tracked repository UUID
 * @param {object} [params]
 * @param {number} [params.days=30] - Lookback window in days
 * @returns {Promise<{
 *   total_prs: number,
 *   open_prs: number,
 *   merged_prs: number,
 *   closed_unmerged_prs: number,
 *   merge_rate_percentage: number,
 *   cycle_time: {
 *     p50_hours: number | null,
 *     p90_hours: number | null,
 *     avg_hours: number | null
 *   }
 * }>}
 */
export const getAnalyticsOverview = async (
  workspaceId,
  repositoryId,
  { days = 30 } = {},
) => {
  if (!workspaceId || !repositoryId) {
    return null;
  }

  const response = await apiClient.get(
    `/api/v1/workspaces/${workspaceId}/repositories/tracked/${repositoryId}/analytics/overview`,
    {
      params: { days },
    },
  );

  return response.data;
};

/**
 * Fetch weekly delivery throughput (merged PR counts) for a tracked repository.
 *
 * @param {string} workspaceId - Active workspace UUID
 * @param {string} repositoryId - Tracked repository UUID
 * @param {object} [params]
 * @param {number} [params.weeks=8] - Number of weeks to inspect
 * @returns {Promise<Array<{ week?: string, merged_prs?: number, count?: number }> | object>}
 */
export const getAnalyticsThroughput = async (
  workspaceId,
  repositoryId,
  { weeks = 8 } = {},
) => {
  if (!workspaceId || !repositoryId) {
    return [];
  }

  const response = await apiClient.get(
    `/api/v1/workspaces/${workspaceId}/repositories/tracked/${repositoryId}/analytics/throughput`,
    {
      params: { weeks },
    },
  );

  return response.data;
};

/**
 * Fetch contributor telemetry (PR volume, merged count, cycle time) for a tracked repository.
 *
 * @param {string} workspaceId - Active workspace UUID
 * @param {string} repositoryId - Tracked repository UUID
 * @param {object} [params]
 * @param {number} [params.days=30] - Lookback window in days
 * @returns {Promise<Array<{
 *   author_login: string,
 *   total_prs: number,
 *   merged_prs: number,
 *   avg_cycle_time_hours: number | null
 * }> | object>}
 */
export const getAnalyticsAuthors = async (
  workspaceId,
  repositoryId,
  { days = 30 } = {},
) => {
  if (!workspaceId || !repositoryId) {
    return [];
  }

  const response = await apiClient.get(
    `/api/v1/workspaces/${workspaceId}/repositories/tracked/${repositoryId}/analytics/authors`,
    {
      params: { days },
    },
  );

  return response.data;
};

/**
 * @typedef {object} ActivityDataPoint
 * @property {string} day - ISO UTC timestamp string (e.g. "2026-08-21T00:00:00")
 * @property {number} created_count - Number of PRs opened on this day
 * @property {number} merged_count - Number of PRs merged on this day
 */

/**
 * @typedef {object} ActivityAnalyticsResponse
 * @property {string} workspace_id - Workspace UUID
 * @property {string | null} repository_id - Optional repository UUID filter
 * @property {number} days_analyzed - Number of days analyzed
 * @property {ActivityDataPoint[]} data - List of daily activity records
 * @property {boolean} cached - Whether response was served from cache
 */

/**
 * Fetch daily pull request activity (opened and merged counts) for a workspace or repository.
 *
 * @param {string} workspaceId - Active workspace UUID
 * @param {object} [params]
 * @param {number} [params.days=30] - Lookback window in days (min 1, max 365)
 * @param {string | null} [params.repositoryId=null] - Optional tracked repository UUID filter
 * @returns {Promise<ActivityAnalyticsResponse | null>}
 */
export const getAnalyticsActivity = async (
  workspaceId,
  { days = 30, repositoryId = null } = {},
) => {
  if (!workspaceId) {
    return null;
  }

  const params = { days };
  if (repositoryId) {
    params.repository_id = repositoryId;
  }

  const response = await apiClient.get(
    `/api/v1/workspaces/${workspaceId}/analytics/activity`,
    { params },
  );

  return response.data;
};

/**
 * @typedef {object} CycleTimeDataPoint
 * @property {string} week_start - ISO UTC timestamp of week start (e.g. "2026-09-07T00:00:00")
 * @property {number | null} p50_hours - 50th percentile cycle time in hours, or null if no data
 * @property {number | null} p90_hours - 90th percentile cycle time in hours, or null if no data
 * @property {number | null} avg_hours - Average cycle time in hours, or null if no data
 * @property {boolean} is_partial - Whether the week is partial / currently in progress
 */

/**
 * @typedef {object} CycleTimeAnalyticsResponse
 * @property {string} workspace_id - Workspace UUID
 * @property {string | null} repository_id - Optional repository UUID filter
 * @property {number} weeks_analyzed - Number of weeks analyzed
 * @property {CycleTimeDataPoint[]} data - List of weekly cycle time records
 * @property {boolean} cached - Whether response was served from cache
 */

/**
 * Fetch weekly cycle time trend metrics (p50, p90, avg) for a workspace or repository.
 *
 * @param {string} workspaceId - Active workspace UUID
 * @param {object} [params]
 * @param {number} [params.weeks=12] - Lookback window in weeks (min 1, max 52)
 * @param {string | null} [params.repositoryId=null] - Optional tracked repository UUID filter
 * @returns {Promise<CycleTimeAnalyticsResponse | null>}
 */
export const getAnalyticsCycleTimeTrend = async (
  workspaceId,
  { weeks = 12, repositoryId = null } = {},
) => {
  if (!workspaceId) {
    return null;
  }

  const params = { weeks };
  if (repositoryId) {
    params.repository_id = repositoryId;
  }

  const response = await apiClient.get(
    `/api/v1/workspaces/${workspaceId}/analytics/cycle-time-trend`,
    { params },
  );

  return response.data;
};

export default {
  getAnalyticsOverview,
  getAnalyticsThroughput,
  getAnalyticsAuthors,
  getAnalyticsActivity,
  getAnalyticsCycleTimeTrend,
};
