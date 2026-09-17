import { useQuery } from '@tanstack/react-query';
import { listSyncJobs } from '../services/repositories';

/**
 * Hook to query recent sync jobs for a tracked repository.
 * Polls every 3 seconds only while the latest sync job is queued or running.
 *
 * @param {string | null} workspaceId
 * @param {string | null} repositoryId
 */
export const useRepositorySyncJobs = (workspaceId, repositoryId) => {
  return useQuery({
    queryKey: ['workspaces', workspaceId, 'repositories', repositoryId, 'sync-jobs'],
    queryFn: () => listSyncJobs(workspaceId, repositoryId, 5),
    enabled: Boolean(workspaceId && repositoryId),
    refetchInterval: (query) => {
      const data = query.state.data;
      if (Array.isArray(data) && data.length > 0) {
        const latestStatus = data[0]?.status?.toLowerCase();
        if (latestStatus === 'queued' || latestStatus === 'running') {
          return 3000;
        }
      }
      return false;
    },
    staleTime: 5 * 1000,
  });
};

export default useRepositorySyncJobs;
