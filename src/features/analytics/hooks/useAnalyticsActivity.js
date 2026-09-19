import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getAnalyticsActivity } from '../services/analytics';

/**
 * Hook to query daily pull request activity (opened and merged counts).
 *
 * @param {object} params
 * @param {string | null} params.workspaceId - Active workspace UUID
 * @param {number} [params.days=30] - Lookback window in days (min 1, max 365)
 * @param {string | null} [params.repositoryId=null] - Optional tracked repository UUID filter
 * @returns {import('@tanstack/react-query').UseQueryResult<import('../services/analytics').ActivityAnalyticsResponse>}
 */
export const useAnalyticsActivity = ({
  workspaceId,
  days = 30,
  repositoryId = null,
}) => {
  return useQuery({
    queryKey: ['analytics', 'activity', workspaceId, days, repositoryId],
    queryFn: () => getAnalyticsActivity(workspaceId, { days, repositoryId }),
    enabled: Boolean(workspaceId),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
};

export default useAnalyticsActivity;
