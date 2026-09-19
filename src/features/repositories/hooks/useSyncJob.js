import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getSyncJob } from '../services/repositories';

/**
 * Hook to poll a specific sync job by job ID until a terminal status is reached.
 * Polls every 1800ms (within 1500–2000ms) while status is 'queued' or 'processing'.
 * Automatically stops polling on 'completed' or 'failed'.
 * On successful completion, invalidates tracked repos, PRs, and analytics query caches.
 *
 * @param {object} params
 * @param {string | null} params.jobId - Specific sync job UUID returned from trigger endpoint
 * @param {string | null} params.workspaceId - Active workspace UUID
 * @param {string | null} params.repositoryId - Tracked repository UUID
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
export const useSyncJob = ({ jobId, workspaceId, repositoryId }) => {
  const queryClient = useQueryClient();
  const hasInvalidatedRef = useRef(false);

  // Reset invalidation tracker when jobId changes
  useEffect(() => {
    hasInvalidatedRef.current = false;
  }, [jobId]);

  const query = useQuery({
    queryKey: ['sync-job', jobId],
    queryFn: () => getSyncJob(jobId),
    enabled: Boolean(jobId),
    refetchInterval: (queryState) => {
      const data = queryState.state.data;
      const status = data?.status?.toLowerCase();
      // Active states: continue polling between 1500–2000ms
      if (status === 'queued' || status === 'processing') {
        return 1800;
      }
      // Terminal states: stop polling on completed, failed, or missing status
      return false;
    },
    staleTime: 1000,
  });

  const jobData = query.data;
  const status = jobData?.status?.toLowerCase();

  useEffect(() => {
    if (status === 'completed' && !hasInvalidatedRef.current) {
      hasInvalidatedRef.current = true;

      // Invalidate relevant TanStack Query caches upon successful sync
      if (workspaceId) {
        queryClient.invalidateQueries({
          queryKey: ['workspaces', workspaceId, 'repositories', 'tracked'],
        });
        queryClient.invalidateQueries({
          queryKey: ['analytics', 'activity', workspaceId],
        });
        queryClient.invalidateQueries({
          queryKey: ['analytics', 'cycle-time', workspaceId],
        });
      }

      if (workspaceId && repositoryId) {
        queryClient.invalidateQueries({
          queryKey: ['workspaces', workspaceId, 'repositories', repositoryId, 'pullRequests'],
        });
        queryClient.invalidateQueries({
          queryKey: ['workspaces', workspaceId, 'repositories', repositoryId, 'analytics'],
        });
        queryClient.invalidateQueries({
          queryKey: ['workspaces', workspaceId, 'repositories', repositoryId, 'sync-jobs'],
        });
      }
    }
  }, [status, workspaceId, repositoryId, queryClient]);

  return query;
};

export default useSyncJob;
