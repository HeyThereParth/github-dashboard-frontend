import apiClient from '@/services/api/client';

/**
 * List all workspaces accessible to the authenticated user.
 * Returns a bare array of WorkspaceSummary objects.
 *
 * @returns {Promise<Array<{ id: string, name: string, github_installation_id: number | null, created_at: string, updated_at: string }>>}
 */
export const listWorkspaces = async () => {
  const response = await apiClient.get('/api/v1/workspaces');
  return response.data;
};

/**
 * Fetch detailed information for a specific workspace.
 * Includes computed `is_github_connected`.
 *
 * @param {string} workspaceId
 * @returns {Promise<{ id: string, name: string, github_installation_id: number | null, is_github_connected: boolean, created_at: string, updated_at: string }>}
 */
export const getWorkspaceDetail = async (workspaceId) => {
  if (!workspaceId) return null;
  const response = await apiClient.get(`/api/v1/workspaces/${workspaceId}`);
  return response.data;
};

/**
 * Create a new workspace.
 *
 * @param {{ name: string }} payload
 * @returns {Promise<{ id: string, name: string, github_installation_id: number | null, is_github_connected: boolean, created_at: string, updated_at: string }>}
 */
export const createWorkspace = async ({ name }) => {
  const response = await apiClient.post('/api/v1/workspaces', { name });
  return response.data;
};

/**
 * Generate GitHub App installation URL for a workspace.
 *
 * @param {string} workspaceId
 * @returns {Promise<{ install_url: string }>}
 */
export const getGitHubInstallUrl = async (workspaceId) => {
  if (!workspaceId) throw new Error('Workspace ID is required to get install URL');
  const response = await apiClient.get(`/api/v1/workspaces/${workspaceId}/github/install-url`);
  return response.data;
};

/**
 * Connect a GitHub App installation to a workspace.
 *
 * @param {string} workspaceId
 * @param {{ installationId: number }} payload
 * @returns {Promise<object>}
 */
export const connectGitHub = async (workspaceId, { installationId }) => {
  if (!workspaceId) throw new Error('Workspace ID is required to connect GitHub');
  const response = await apiClient.post(`/api/v1/workspaces/${workspaceId}/github/connect`, {
    installation_id: Number(installationId),
  });
  return response.data;
};

/**
 * Disconnect GitHub App installation from a workspace.
 *
 * @param {string} workspaceId
 * @returns {Promise<object>}
 */
export const disconnectGitHub = async (workspaceId) => {
  if (!workspaceId) throw new Error('Workspace ID is required to disconnect GitHub');
  const response = await apiClient.delete(`/api/v1/workspaces/${workspaceId}/github/disconnect`);
  return response.data;
};

export default {
  listWorkspaces,
  getWorkspaceDetail,
  createWorkspace,
  getGitHubInstallUrl,
  connectGitHub,
  disconnectGitHub,
};
