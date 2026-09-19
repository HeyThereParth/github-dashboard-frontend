import apiClient from '@/services/api/client';

/**
 * List all workspaces accessible to the user.
 * @returns {Promise<Array<{ id: string, name: string, github_installation_id: number | null, created_at: string }>>}
 */
export const listWorkspaces = async () => {
  const response = await apiClient.get('/api/v1/workspaces');
  return response.data;
};

/**
 * List all tracked repositories in a workspace.
 * @param {string} workspaceId
 * @returns {Promise<Array<{ id: string, name: string, full_name: string, private: boolean, is_tracked: boolean, html_url: string, default_branch: string }>>}
 */
export const listTrackedRepositories = async (workspaceId) => {
  if (!workspaceId) return [];
  const response = await apiClient.get(`/api/v1/workspaces/${workspaceId}/repositories/tracked`);
  return response.data;
};

/**
 * List all GitHub repositories accessible via the workspace installation.
 * @param {string} workspaceId
 * @param {object} [params]
 * @param {number} [params.page=1]
 * @param {number} [params.perPage=100]
 * @returns {Promise<Array<{ github_id: number, node_id: string, name: string, full_name: string, private: boolean, html_url: string, default_branch: string, description: string | null }>>}
 */
export const listAvailableRepositories = async (workspaceId, { page = 1, perPage = 100 } = {}) => {
  if (!workspaceId) return [];
  const response = await apiClient.get(`/api/v1/workspaces/${workspaceId}/github/repositories`, {
    params: { page, per_page: perPage },
  });
  return response.data;
};

/**
 * Add a GitHub repository to tracking in a workspace.
 * @param {string} workspaceId
 * @param {{ owner: string, repo: string }} payload
 * @returns {Promise<object>}
 */
export const trackRepository = async (workspaceId, { owner, repo }) => {
  const response = await apiClient.post(`/api/v1/workspaces/${workspaceId}/repositories/track`, {
    owner,
    repo,
  });
  return response.data;
};

/**
 * Untrack a repository from a workspace.
 * @param {string} workspaceId
 * @param {string} repositoryId
 * @returns {Promise<void>}
 */
export const untrackRepository = async (workspaceId, repositoryId) => {
  await apiClient.delete(`/api/v1/workspaces/${workspaceId}/repositories/tracked/${repositoryId}`);
};

/**
 * Trigger background synchronization for a repository.
 * @param {string} workspaceId
 * @param {string} repositoryId
 * @returns {Promise<{ job_id: string, status: string, message: string }>}
 */
export const syncRepository = async (workspaceId, repositoryId) => {
  const response = await apiClient.post(
    `/api/v1/workspaces/${workspaceId}/repositories/tracked/${repositoryId}/sync`,
  );
  return response.data;
};

/**
 * List recent background sync jobs for a repository.
 * @param {string} workspaceId
 * @param {string} repositoryId
 * @param {number} [limit=5]
 * @returns {Promise<Array<{ id: string, workspace_id: string, repository_id: string, status: string, total_synced: number, error_message: string | null, started_at: string | null, completed_at: string | null, created_at: string, updated_at: string }>>}
 */
export const listSyncJobs = async (workspaceId, repositoryId, limit = 5) => {
  if (!workspaceId || !repositoryId) return [];
  const response = await apiClient.get(
    `/api/v1/workspaces/${workspaceId}/repositories/tracked/${repositoryId}/sync-jobs`,
    { params: { limit } },
  );
  return response.data;
};

/**
 * Get sync job status by job ID.
 *
 * @param {string} jobId - Unique sync job UUID
 * @returns {Promise<{ id: string, job_id?: string, status: string, error_message: string | null, total_synced?: number, started_at: string | null, completed_at: string | null }>}
 */
export const getSyncJob = async (jobId) => {
  if (!jobId) return null;
  const response = await apiClient.get(`/api/v1/repositories/sync-jobs/${jobId}`);
  return response.data;
};

