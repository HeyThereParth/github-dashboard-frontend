import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getAnalyticsCycleTimeTrend } from '../services/analytics';

/**
 * Hook to query weekly cycle time trend metrics (p50, p90, avg, is_partial).
 *
 * @param {object} params
 * @param {string | null} params.workspaceId - Active workspace UUID
 * @param {number} [params.weeks=12] - Lookback window in weeks (min 1, max 52)
 * @param {string | null} [params.repositoryId=null] - Optional tracked repository UUID filter
 * @returns {import('@tanstack/react-query').UseQueryResult<import('../services/analytics').CycleTimeAnalyticsResponse>}
 */
export const useAnalyticsCycleTimeTrend = ({
  workspaceId,
  weeks = 12,
  repositoryId = null,
}) => {
  return useQuery({
    queryKey: ['analytics', 'cycle-time', workspaceId, weeks, repositoryId],
    queryFn: () => getAnalyticsCycleTimeTrend(workspaceId, { weeks, repositoryId }),
    enabled: Boolean(workspaceId),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
};

export default useAnalyticsCycleTimeTrend;
