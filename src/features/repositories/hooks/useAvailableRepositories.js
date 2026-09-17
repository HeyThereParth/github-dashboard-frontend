import { useQuery } from '@tanstack/react-query';
import { listAvailableRepositories } from '../services/repositories';

/**
 * Hook to query available GitHub repositories for a workspace.
 * @param {string | null} workspaceId
 */
export const useAvailableRepositories = (workspaceId) => {
  return useQuery({
    queryKey: ['workspaces', workspaceId, 'github', 'repositories'],
    queryFn: () => listAvailableRepositories(workspaceId, { page: 1, perPage: 100 }),
    enabled: Boolean(workspaceId),
    staleTime: 60 * 1000,
  });
};

export default useAvailableRepositories;
