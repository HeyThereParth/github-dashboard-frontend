import { useQuery } from '@tanstack/react-query';
import { listWorkspaces } from '../services/repositories';

/**
 * Hook to resolve the current active workspace.
 * Queries GET /api/v1/workspaces and selects the first available workspace.
 */
export const useWorkspace = () => {
  const query = useQuery({
    queryKey: ['workspaces'],
    queryFn: listWorkspaces,
    staleTime: 60 * 1000,
  });

  const workspaces = query.data || [];
  const currentWorkspace = workspaces.length > 0 ? workspaces[0] : null;

  return {
    ...query,
    workspaces,
    currentWorkspace,
    workspaceId: currentWorkspace?.id || null,
  };
};

export default useWorkspace;
