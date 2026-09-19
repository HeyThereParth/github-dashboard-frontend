import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Lock,
  Globe,
  RefreshCw,
  ArrowUpRight,
  Plus,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { formatRelativeTime } from '@/utils/date';
import { useRepositorySyncJobs } from '../../hooks/useRepositorySyncJobs';
import { useSyncJob } from '../../hooks/useSyncJob';
import styles from './RepositoryCard.module.css';

/**
 * Single card representing a repository (either tracked or available).
 *
 * @param {object} props
 * @param {object} props.repository
 * @param {string} props.workspaceId
 * @param {boolean} [props.isTracked=false]
 * @param {({ owner, repo }: { owner: string, repo: string }) => void} [props.onTrack]
 * @param {(repositoryId: string) => void} [props.onUntrack]
 * @param {(repositoryId: string) => Promise<{ job_id?: string } | void>} [props.onSync]
 * @param {boolean} [props.isTracking=false]
 * @param {boolean} [props.isUntracking=false]
 * @param {boolean} [props.isSyncTriggering=false]
 */
export const RepositoryCard = ({
  repository,
  workspaceId,
  isTracked = false,
  onTrack,
  onUntrack,
  onSync,
  isTracking = false,
  isUntracking = false,
  isSyncTriggering = false,
}) => {
  const [showUntrackConfirm, setShowUntrackConfirm] = useState(false);
  const [triggeredJobId, setTriggeredJobId] = useState(null);

  // For tracked repositories, fetch historical sync jobs for initial status display
  const { data: syncJobs = [] } = useRepositorySyncJobs(
    workspaceId,
    isTracked ? repository.id : null,
  );

  const latestHistoryJob = syncJobs.length > 0 ? syncJobs[0] : null;
  const historyStatus = latestHistoryJob?.status?.toLowerCase();
  const isHistoryJobActive = historyStatus === 'queued' || historyStatus === 'processing';

  // Effective job ID to poll: triggered job takes precedence, then active historical job
  const activeJobId =
    triggeredJobId || (isHistoryJobActive ? latestHistoryJob.job_id || latestHistoryJob.id : null);

  // Poll specific active job using GET /api/v1/repositories/sync-jobs/{job_id}
  const { data: polledJob } = useSyncJob({
    jobId: activeJobId,
    workspaceId,
    repositoryId: isTracked ? repository.id : null,
  });

  const activeJob = polledJob || latestHistoryJob;
  const currentStatus = activeJob?.status?.toLowerCase();

  // Active sync states: queued, processing (no running status)
  const isSyncActive =
    isSyncTriggering ||
    currentStatus === 'queued' ||
    currentStatus === 'processing';

  const ownerLogin =
    repository.owner_login ||
    (repository.full_name ? repository.full_name.split('/')[0] : '');
  const repoName = repository.name || repository.full_name;
  const defaultBranch = repository.default_branch || 'main';
  const isPrivate = Boolean(repository.private);

  const handleSyncClick = async () => {
    if (!onSync || isSyncActive) return;
    try {
      const res = await onSync(repository.id);
      if (res?.job_id) {
        setTriggeredJobId(res.job_id);
      }
    } catch (err) {
      console.error('[RepositoryCard] Failed to trigger sync:', err);
    }
  };

  // Render status row based on real API sync state
  const renderStatusRow = () => {
    if (!isTracked) {
      return (
        <div className={styles.statusRow}>
          <span className={`${styles.statusDot} ${styles.dotNeutral}`} aria-hidden="true" />
          <span>Not tracked yet • Available for telemetry collection</span>
        </div>
      );
    }

    if (isSyncActive) {
      return (
        <div className={styles.statusRow}>
          <span
            className={`${styles.statusDot} ${styles.dotGold} ${styles.pulse}`}
            aria-hidden="true"
          />
          <span className={styles.statusTextActive}>
            {currentStatus === 'processing' ? 'Processing synchronization...' : 'Sync queued...'}
          </span>
          {typeof activeJob?.total_synced === 'number' && activeJob.total_synced > 0 && (
            <span>• {activeJob.total_synced} pull requests processed</span>
          )}
        </div>
      );
    }

    if (currentStatus === 'completed') {
      const syncedTime = formatRelativeTime(activeJob?.completed_at);
      return (
        <div className={styles.statusRow}>
          <span className={`${styles.statusDot} ${styles.dotMint}`} aria-hidden="true" />
          <span>Your data is up to date</span>
          {typeof activeJob?.total_synced === 'number' && (
            <span>• {activeJob.total_synced} pull requests synchronized</span>
          )}
          {syncedTime && <span>• Synced {syncedTime}</span>}
        </div>
      );
    }

    if (currentStatus === 'failed') {
      const failedTime = formatRelativeTime(activeJob?.completed_at);
      return (
        <div className={styles.statusRow}>
          <span className={`${styles.statusDot} ${styles.dotCoral}`} aria-hidden="true" />
          <span style={{ color: 'var(--color-error)' }}>
            Sync failed: {activeJob?.error_message || 'Task error'}
          </span>
          {failedTime && <span>• {failedTime}</span>}
        </div>
      );
    }

    return (
      <div className={styles.statusRow}>
        <span className={`${styles.statusDot} ${styles.dotMint}`} aria-hidden="true" />
        <span>Live telemetry stream connected</span>
      </div>
    );
  };

  return (
    <article className={styles.card} aria-label={`Repository ${repoName}`}>
      <div className={styles.mainSection}>
        <div
          className={styles.iconWrapper}
          title={isPrivate ? 'Private repository' : 'Public repository'}
          aria-hidden="true"
        >
          {isPrivate ? <Lock size={16} /> : <Globe size={16} />}
        </div>

        <div className={styles.details}>
          <div className={styles.titleRow}>
            {repository.html_url ? (
              <a
                href={repository.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.repoName}
              >
                {repoName}
              </a>
            ) : (
              <span className={styles.repoName}>{repoName}</span>
            )}

            <Badge variant="neutral" size="sm">
              {isPrivate ? 'PRIVATE' : 'PUBLIC'}
            </Badge>

            <span className={styles.metaMonospace}>
              default: {defaultBranch}
            </span>

            {ownerLogin && (
              <span className={styles.ownerText}>• {ownerLogin}</span>
            )}
          </div>

          {repository.description && (
            <p className={styles.description}>{repository.description}</p>
          )}

          {renderStatusRow()}
        </div>
      </div>

      <div className={styles.actions}>
        {isTracked ? (
          <>
            <Link
              to={`/app/pull-requests?repositoryId=${encodeURIComponent(repository.id)}&repo=${encodeURIComponent(repoName)}`}
            >
              <Button
                variant="outline"
                size="sm"
                rightIcon={<ArrowUpRight size={13} />}
              >
                View PRs
              </Button>
            </Link>

            <Button
              variant="secondary"
              size="sm"
              leftIcon={
                <RefreshCw
                  size={13}
                  className={isSyncActive ? styles.spin : ''}
                />
              }
              onClick={handleSyncClick}
              disabled={isSyncActive}
              aria-label={`Sync ${repoName}`}
            >
              {isSyncActive ? 'Updating...' : 'Sync now'}
            </Button>

            <div style={{ position: 'relative' }}>
              <IconButton
                variant="ghost"
                size="sm"
                onClick={() => setShowUntrackConfirm((prev) => !prev)}
                aria-label="More options"
              >
                <MoreHorizontal size={14} />
              </IconButton>

              {showUntrackConfirm && (
                <div className={styles.untrackMenu} role="menu">
                  <span className={styles.untrackPrompt}>
                    Untrack telemetry for this repository?
                  </span>
                  <Button
                    variant="danger"
                    size="sm"
                    fullWidth
                    leftIcon={<Trash2 size={13} />}
                    onClick={() => {
                      setShowUntrackConfirm(false);
                      if (onUntrack) onUntrack(repository.id);
                    }}
                    disabled={isUntracking}
                  >
                    {isUntracking ? 'Untracking...' : 'Confirm Untrack'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    onClick={() => setShowUntrackConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={() => onTrack && onTrack({ owner: ownerLogin, repo: repository.name })}
            disabled={isTracking}
          >
            {isTracking ? 'Tracking...' : 'Track repository'}
          </Button>
        )}
      </div>
    </article>
  );
};

export default RepositoryCard;
