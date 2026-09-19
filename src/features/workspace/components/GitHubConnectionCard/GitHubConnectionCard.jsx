import { useState } from 'react';
import { GitBranch, ExternalLink, Unlink, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useWorkspace } from '../../hooks/useWorkspace';
import styles from './GitHubConnectionCard.module.css';

/**
 * Card displaying real GitHub connection state for the active workspace,
 * with actions to trigger GitHub App installation or disconnect.
 */
export const GitHubConnectionCard = () => {
  const {
    currentWorkspace,
    workspaceDetail,
    workspaceId,
    getGitHubInstallUrl,
    disconnectGitHub,
    isDisconnecting,
  } = useWorkspace();

  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmDisconnect, setShowConfirmDisconnect] = useState(false);

  // Reliable connection state: prefer workspaceDetail if present, fallback to github_installation_id !== null
  const isConnected = Boolean(
    workspaceDetail?.is_github_connected ??
      (currentWorkspace?.is_github_connected ?? (currentWorkspace?.github_installation_id != null))
  );
  const installationId = currentWorkspace?.github_installation_id ?? workspaceDetail?.github_installation_id;

  const handleConnect = async () => {
    if (!workspaceId) return;
    setIsConnecting(true);
    setError(null);

    try {
      const data = await getGitHubInstallUrl(workspaceId);
      if (data?.install_url) {
        window.location.href = data.install_url;
      } else {
        setError('Backend did not return a valid install URL.');
        setIsConnecting(false);
      }
    } catch (err) {
      setError(
        err.response?.status === 403
          ? 'Only the workspace owner can connect a GitHub App installation.'
          : err.response?.data?.detail || err.message || 'Failed to generate GitHub install URL.',
      );
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!workspaceId) return;
    setError(null);

    try {
      await disconnectGitHub(workspaceId);
      setShowConfirmDisconnect(false);
    } catch (err) {
      setError(
        err.response?.status === 403
          ? 'Only the workspace owner can disconnect GitHub.'
          : err.response?.data?.detail || err.message || 'Failed to disconnect GitHub.',
      );
    }
  };

  return (
    <Card className={styles.container}>
      <CardHeader>
        <div className={styles.statusHeader}>
          <div className={styles.statusLeft}>
            <div className={styles.githubIcon} aria-hidden="true">
              <GitBranch size={18} />
            </div>
            <div>
              <CardTitle>GitHub App Connection</CardTitle>
              <CardDescription>
                Synchronize pull request telemetry and engineering metadata via the official GitHub App.
              </CardDescription>
            </div>
          </div>

          <Badge variant={isConnected ? 'success' : 'neutral'} size="sm">
            {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <div className={styles.errorBanner} role="alert">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          </div>
        )}

        {isConnected ? (
          <div className={styles.contentRow}>
            <div className={styles.metaGroup}>
              <span className={styles.metaLabel}>Installation Status</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: '2px' }}>
                <CheckCircle2 size={15} color="var(--palette-mint)" />
                <span className={styles.metaValue}>
                  Installation ID: {installationId ?? 'Active'}
                </span>
              </div>
            </div>

            {showConfirmDisconnect ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDisconnect}
                  disabled={isDisconnecting}
                >
                  {isDisconnecting ? 'Disconnecting...' : 'Confirm Disconnect'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConfirmDisconnect(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Unlink size={14} />}
                onClick={() => setShowConfirmDisconnect(true)}
              >
                Disconnect GitHub
              </Button>
            )}
          </div>
        ) : (
          <div className={styles.contentRow}>
            <div>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-secondary)' }}>
                No GitHub App is currently connected to <strong>{currentWorkspace?.name}</strong>. Connect your installation to start tracking repositories.
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              leftIcon={<ExternalLink size={15} />}
              onClick={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting ? 'Generating Install URL...' : 'Connect GitHub'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GitHubConnectionCard;
