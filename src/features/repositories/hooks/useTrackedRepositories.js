import { useQuery } from '@tanstack/react-query';
import { listTrackedRepositories } from '../services/repositories';

/**
 * Hook to query all tracked repositories for a workspace.
 * @param {string | null} workspaceId
 */
export const useTrackedRepositories = (workspaceId) => {
  return useQuery({
    queryKey: ['workspaces', workspaceId, 'repositories', 'tracked'],
    queryFn: () => listTrackedRepositories(workspaceId),
    enabled: Boolean(workspaceId),
    staleTime: 30 * 1000,
  });
};

export default useTrackedRepositories;
