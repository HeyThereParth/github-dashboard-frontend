import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth';
import { WorkspaceContext } from './WorkspaceContextObject';
import {
  listWorkspaces,
  getWorkspaceDetail,
  createWorkspace as apiCreateWorkspace,
  connectGitHub as apiConnectGitHub,
  disconnectGitHub as apiDisconnectGitHub,
  getGitHubInstallUrl,
} from '../services/workspace';

const STORAGE_KEY = 'github_intelligence_selected_workspace_id';

export const WorkspaceProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const [storedWorkspaceId, setStoredWorkspaceId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });

  // 1. Fetch workspaces list
  const workspacesQuery = useQuery({
    queryKey: ['workspaces'],
    queryFn: listWorkspaces,
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });

  const workspaces = useMemo(() => workspacesQuery.data || [], [workspacesQuery.data]);

  // 2. Determine active workspace ID
  const selectedWorkspaceId = useMemo(() => {
    if (workspaces.length === 0) return null;
    const exists = workspaces.some((w) => w.id === storedWorkspaceId);
    if (exists) return storedWorkspaceId;
    return workspaces[0].id;
  }, [workspaces, storedWorkspaceId]);

  // Sync to local storage whenever active ID updates
  useEffect(() => {
    if (selectedWorkspaceId) {
      try {
        localStorage.setItem(STORAGE_KEY, selectedWorkspaceId);
      } catch (err) {
        console.warn('[Workspace] Failed to persist selected workspace ID:', err);
      }
    }
  }, [selectedWorkspaceId]);

  const setSelectedWorkspaceId = useCallback((id) => {
    setStoredWorkspaceId(id);
    try {
      if (id) {
        localStorage.setItem(STORAGE_KEY, id);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (err) {
      console.warn('[Workspace] Failed to update stored workspace ID:', err);
    }
  }, []);

  // 3. Fetch detail for selected workspace
  const detailQuery = useQuery({
    queryKey: ['workspaces', selectedWorkspaceId],
    queryFn: () => getWorkspaceDetail(selectedWorkspaceId),
    enabled: Boolean(isAuthenticated && selectedWorkspaceId),
    staleTime: 30 * 1000,
  });

  // Active workspace object prefers detail, falls back to summary
  const currentWorkspace = useMemo(() => {
    if (detailQuery.data) return detailQuery.data;
    if (!selectedWorkspaceId) return null;
    return workspaces.find((w) => w.id === selectedWorkspaceId) || null;
  }, [detailQuery.data, workspaces, selectedWorkspaceId]);

  // 4. Mutations
  const createMutation = useMutation({
    mutationFn: apiCreateWorkspace,
    onSuccess: (newWorkspace) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      if (newWorkspace?.id) {
        setSelectedWorkspaceId(newWorkspace.id);
      }
    },
  });

  const connectMutation = useMutation({
    mutationFn: ({ workspaceId, installationId }) =>
      apiConnectGitHub(workspaceId, { installationId }),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces', workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: (workspaceId) => apiDisconnectGitHub(workspaceId),
    onSuccess: (_, workspaceId) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces', workspaceId] });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });

  const value = useMemo(
    () => ({
      workspaces,
      selectedWorkspaceId,
      currentWorkspace,
      workspaceDetail: detailQuery.data || null,
      workspaceId: selectedWorkspaceId,
      isLoading: workspacesQuery.isLoading,
      isLoadingWorkspaces: workspacesQuery.isLoading,
      isDetailLoading: detailQuery.isLoading,
      isError: workspacesQuery.isError || detailQuery.isError,
      error: workspacesQuery.error || detailQuery.error,
      refetchWorkspaces: workspacesQuery.refetch,
      refetchDetail: detailQuery.refetch,
      setSelectedWorkspaceId,
      createWorkspace: createMutation.mutateAsync,
      isCreating: createMutation.isPending,
      connectGitHub: connectMutation.mutateAsync,
      isConnecting: connectMutation.isPending,
      disconnectGitHub: disconnectMutation.mutateAsync,
      isDisconnecting: disconnectMutation.isPending,
      getGitHubInstallUrl,
    }),
    [
      workspaces,
      selectedWorkspaceId,
      currentWorkspace,
      detailQuery.data,
      workspacesQuery.isLoading,
      detailQuery.isLoading,
      workspacesQuery.isError,
      detailQuery.isError,
      workspacesQuery.error,
      detailQuery.error,
      workspacesQuery.refetch,
      detailQuery.refetch,
      setSelectedWorkspaceId,
      createMutation.mutateAsync,
      createMutation.isPending,
      connectMutation.mutateAsync,
      connectMutation.isPending,
      disconnectMutation.mutateAsync,
      disconnectMutation.isPending,
    ],
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export default WorkspaceProvider;
