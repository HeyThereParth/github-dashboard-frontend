import { useQuery } from '@tanstack/react-query';
import { listSyncJobs } from '../services/repositories';

/**
 * Hook to query recent sync jobs for a tracked repository.
 * Fetches recent sync jobs list without polling (specific active jobs are polled via useSyncJob).
 *
 * @param {string | null} workspaceId
 * @param {string | null} repositoryId
 */
export const useRepositorySyncJobs = (workspaceId, repositoryId) => {
  return useQuery({
    queryKey: ['workspaces', workspaceId, 'repositories', repositoryId, 'sync-jobs'],
    queryFn: () => listSyncJobs(workspaceId, repositoryId, 5),
    enabled: Boolean(workspaceId && repositoryId),
    staleTime: 10 * 1000,
  });
};

export default useRepositorySyncJobs;
