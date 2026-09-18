import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getAnalyticsThroughput } from '../services/analytics';

/**
 * Hook to query weekly merged PR delivery throughput.
 *
 * @param {object} params
 * @param {string | null} params.workspaceId - Active workspace UUID
 * @param {string | null} params.repositoryId - Tracked repository UUID
 * @param {number} [params.weeks=8] - Lookback window in weeks
 */
export const useAnalyticsThroughput = ({
  workspaceId,
  repositoryId,
  weeks = 8,
}) => {
  return useQuery({
    queryKey: [
      'workspaces',
      workspaceId,
      'repositories',
      repositoryId,
      'analytics',
      'throughput',
      { weeks },
    ],
    queryFn: () => getAnalyticsThroughput(workspaceId, repositoryId, { weeks }),
    enabled: Boolean(workspaceId && repositoryId),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
};

export default useAnalyticsThroughput;
