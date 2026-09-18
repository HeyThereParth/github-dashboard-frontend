import apiClient from '@/services/api/client';

/**
 * Fetch paginated pull requests for a tracked repository.
 *
 * @param {string} workspaceId - Active workspace UUID
 * @param {string} repositoryId - Tracked repository UUID
 * @param {object} [params]
 * @param {'all' | 'open' | 'closed'} [params.state='all'] - PR state filter
 * @param {number} [params.page=1] - Page number (1-based)
 * @param {number} [params.perPage=10] - Number of items per page
 * @returns {Promise<{ items: Array<object>, total: number, page: number, per_page: number }>}
 */
export const getPullRequests = async (
  workspaceId,
  repositoryId,
  { state = 'all', page = 1, perPage = 10 } = {},
) => {
  if (!workspaceId || !repositoryId) {
    return { items: [], total: 0, page: 1, per_page: perPage };
  }

  const response = await apiClient.get(
    `/api/v1/workspaces/${workspaceId}/repositories/tracked/${repositoryId}/pull-requests`,
    {
      params: {
        state,
        page,
        per_page: perPage,
      },
    },
  );

  return response.data;
};

export default getPullRequests;
