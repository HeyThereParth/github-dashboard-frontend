import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getPullRequests } from '../services/pullRequests';

/**
 * Hook to query paginated pull requests for a tracked repository.
 *
 * @param {object} params
 * @param {string | null} params.workspaceId - Active workspace UUID
 * @param {string | null} params.repositoryId - Tracked repository UUID
 * @param {'all' | 'open' | 'closed'} [params.state='all'] - Filter by state
 * @param {number} [params.page=1] - Active page number
 * @param {number} [params.perPage=10] - Items per page
 */
export const usePullRequests = ({
  workspaceId,
  repositoryId,
  state = 'all',
  page = 1,
  perPage = 10,
}) => {
  return useQuery({
    queryKey: [
      'workspaces',
      workspaceId,
      'repositories',
      repositoryId,
      'pullRequests',
      { state, page, perPage },
    ],
    queryFn: () =>
      getPullRequests(workspaceId, repositoryId, { state, page, perPage }),
    enabled: Boolean(workspaceId && repositoryId),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
};

export default usePullRequests;
