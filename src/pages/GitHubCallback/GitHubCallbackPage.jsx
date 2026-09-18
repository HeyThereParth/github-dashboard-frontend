import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, AlertCircle, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { useWorkspace } from '@/features/workspace';
import { useAuth } from '@/features/auth';
import styles from './GitHubCallbackPage.module.css';

/**
 * Handles browser return from GitHub App installation.
 * Validates installation_id, state parameter, and setup_action,
 * and exchanges the installation ID with FastAPI.
 */
export const GitHubCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { selectedWorkspaceId, connectGitHub } = useWorkspace();

  const [status, setStatus] = useState('processing'); // 'processing' | 'success' | 'error' | 'request'
  const [errorMessage, setErrorMessage] = useState(null);

  const hasExecutedRef = useRef(false);

  const installationIdParam = searchParams.get('installation_id');
  const setupActionParam = searchParams.get('setup_action');
  const stateParam = searchParams.get('state');

  useEffect(() => {
    if (isAuthLoading || hasExecutedRef.current || !isAuthenticated) return;

    const processCallback = async () => {
      hasExecutedRef.current = true;

      // 1. If setup_action is request, user requested installation but isn't org admin
      if (setupActionParam === 'request') {
        setStatus('request');
        return;
      }

      // 2. Validate installation_id
      if (!installationIdParam) {
        setStatus('error');
        setErrorMessage('GitHub installation ID was not provided in callback parameters.');
        return;
      }

      const installationId = parseInt(installationIdParam, 10);
      if (isNaN(installationId) || installationId <= 0) {
        setStatus('error');
        setErrorMessage(`Invalid installation ID received: "${installationIdParam}".`);
        return;
      }

      // 3. Verify state parameter matches expected workspace ID
      const targetWorkspaceId = stateParam || selectedWorkspaceId;
      if (!targetWorkspaceId) {
        setStatus('error');
        setErrorMessage('No target workspace was identified for this GitHub connection.');
        return;
      }

      if (stateParam && selectedWorkspaceId && stateParam !== selectedWorkspaceId) {
        setStatus('error');
        setErrorMessage(
          `State verification failed. The installation was requested for workspace "${stateParam}", but the active workspace is "${selectedWorkspaceId}".`,
        );
        return;
      }

      // 4. Connect installation ID to backend
      try {
        await connectGitHub({ workspaceId: targetWorkspaceId, installationId });
        setStatus('success');
        setTimeout(() => {
          navigate('/app/settings');
        }, 2000);
      } catch (err) {
        setStatus('error');
        setErrorMessage(
          err.response?.status === 403
            ? 'Only the workspace owner is authorized to connect a GitHub App installation.'
            : err.response?.data?.detail || err.message || 'Failed to connect GitHub App to workspace.',
        );
      }
    };

    // Defer execution out of the synchronous render cycle
    Promise.resolve().then(processCallback);
  }, [
    isAuthLoading,
    isAuthenticated,
    installationIdParam,
    setupActionParam,
    stateParam,
    selectedWorkspaceId,
    connectGitHub,
    navigate,
  ]);

  if (isAuthLoading) {
    return (
      <div className={styles.container}>
        <LoadingState message="Verifying authentication session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.cardWrapper}>
          <Card>
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>
                Please sign in to complete your GitHub App connection.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/login">
                <Button variant="primary" fullWidth size="md">
                  Sign In to Continue
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.cardWrapper}>
        <Card>
          <CardHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              {status === 'processing' && (
                <div className={styles.statusIcon}>
                  <LoadingState variant="spinner" message="" />
                </div>
              )}
              {status === 'success' && (
                <div className={`${styles.statusIcon} ${styles.iconSuccess}`}>
                  <CheckCircle2 size={24} />
                </div>
              )}
              {status === 'error' && (
                <div className={`${styles.statusIcon} ${styles.iconError}`}>
                  <AlertCircle size={24} />
                </div>
              )}
              {status === 'request' && (
                <div className={`${styles.statusIcon} ${styles.iconWarning}`}>
                  <AlertTriangle size={24} />
                </div>
              )}

              <div>
                <CardTitle>
                  {status === 'processing' && 'Connecting GitHub App...'}
                  {status === 'success' && 'GitHub App Connected'}
                  {status === 'error' && 'Connection Failed'}
                  {status === 'request' && 'Installation Request Pending'}
                </CardTitle>
                <CardDescription>
                  {status === 'processing' && 'Verifying installation tokens and updating workspace telemetry.'}
                  {status === 'success' && 'Your workspace is now synchronized with GitHub.'}
                  {status === 'error' && 'An issue occurred during GitHub authorization.'}
                  {status === 'request' && 'Installation request submitted to organization owner.'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className={styles.content}>
              {status === 'processing' && (
                <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                  Finalizing installation ID <code>{installationIdParam}</code> with backend...
                </p>
              )}

              {status === 'success' && (
                <div>
                  <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                    Successfully linked GitHub installation to your workspace. Redirecting to settings...
                  </p>
                  <div className={styles.actions}>
                    <Link to="/app/settings">
                      <Button variant="primary" size="md" rightIcon={<ArrowRight size={14} />}>
                        Go to Settings Now
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div>
                  <p style={{ color: 'var(--palette-coral)', margin: 0, fontSize: 'var(--font-size-secondary)' }}>
                    {errorMessage}
                  </p>
                  <div className={styles.actions}>
                    <Link to="/app/settings">
                      <Button variant="outline" size="sm">
                        Return to Settings
                      </Button>
                    </Link>
                    <Link to="/app/overview">
                      <Button variant="ghost" size="sm">
                        Go to Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {status === 'request' && (
                <div>
                  <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                    You requested the GitHub App installation on an organization where you are not an owner. An organization administrator must approve the installation before it can be connected.
                  </p>
                  <div className={styles.actions}>
                    <Link to="/app/settings">
                      <Button variant="outline" size="sm">
                        Back to Settings
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GitHubCallbackPage;
