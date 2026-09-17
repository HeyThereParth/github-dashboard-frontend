import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  trackRepository,
  untrackRepository,
  syncRepository,
} from '../services/repositories';

/**
 * Hook providing mutations for repository operations (track, untrack, sync).
 * Automatically invalidates affected queries on success.
 *
 * @param {string | null} workspaceId
 */
export const useRepositoryMutations = (workspaceId) => {
  const queryClient = useQueryClient();

  const trackMutation = useMutation({
    mutationFn: ({ owner, repo }) => trackRepository(workspaceId, { owner, repo }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['workspaces', workspaceId, 'repositories', 'tracked'],
      });
      queryClient.invalidateQueries({
        queryKey: ['workspaces', workspaceId, 'github', 'repositories'],
      });
    },
  });

  const untrackMutation = useMutation({
    mutationFn: (repositoryId) => untrackRepository(workspaceId, repositoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['workspaces', workspaceId, 'repositories', 'tracked'],
      });
      queryClient.invalidateQueries({
        queryKey: ['workspaces', workspaceId, 'github', 'repositories'],
      });
    },
  });

  const syncMutation = useMutation({
    mutationFn: (repositoryId) => syncRepository(workspaceId, repositoryId),
    onSuccess: (data, repositoryId) => {
      queryClient.invalidateQueries({
        queryKey: ['workspaces', workspaceId, 'repositories', repositoryId, 'sync-jobs'],
      });
    },
  });

  return {
    trackMutation,
    untrackMutation,
    syncMutation,
  };
};

export default useRepositoryMutations;
