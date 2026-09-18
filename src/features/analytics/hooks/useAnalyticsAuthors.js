import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getAnalyticsAuthors } from '../services/analytics';

/**
 * Hook to query contributor activity analytics for a tracked repository.
 *
 * @param {object} params
 * @param {string | null} params.workspaceId - Active workspace UUID
 * @param {string | null} params.repositoryId - Tracked repository UUID
 * @param {number} [params.days=30] - Lookback window in days
 */
export const useAnalyticsAuthors = ({
  workspaceId,
  repositoryId,
  days = 30,
}) => {
  return useQuery({
    queryKey: [
      'workspaces',
      workspaceId,
      'repositories',
      repositoryId,
      'analytics',
      'authors',
      { days },
    ],
    queryFn: () => getAnalyticsAuthors(workspaceId, repositoryId, { days }),
    enabled: Boolean(workspaceId && repositoryId),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
};

export default useAnalyticsAuthors;
