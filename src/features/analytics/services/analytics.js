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

export default {
  getAnalyticsOverview,
  getAnalyticsThroughput,
  getAnalyticsAuthors,
};
