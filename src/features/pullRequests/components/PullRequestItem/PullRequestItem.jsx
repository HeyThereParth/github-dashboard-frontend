import {
  GitPullRequest,
  GitMerge,
  GitPullRequestClosed,
  GitPullRequestDraft,
  ArrowUpRight,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatRelativeTime } from '@/utils/date';
import styles from './PullRequestItem.module.css';

/**
 * Renders a single pull request row item.
 *
 * @param {object} props
 * @param {object} props.pullRequest - API pull request entity
 * @param {string} [props.repositoryName] - Optional repo name for context
 */
export const PullRequestItem = ({ pullRequest, repositoryName = '' }) => {
  if (!pullRequest) return null;

  const isMerged = Boolean(pullRequest.merged_at);
  const isDraft = Boolean(pullRequest.draft && pullRequest.state === 'open');
  const isClosed = pullRequest.state === 'closed' && !isMerged;

  let statusKey = 'open';
  let statusLabel = 'OPEN';
  let StatusIcon = GitPullRequest;
  let iconClass = styles.iconOpen;

  if (isMerged) {
    statusKey = 'merged';
    statusLabel = 'MERGED';
    StatusIcon = GitMerge;
    iconClass = styles.iconMerged;
  } else if (isDraft) {
    statusKey = 'draft';
    statusLabel = 'DRAFT';
    StatusIcon = GitPullRequestDraft;
    iconClass = styles.iconDraft;
  } else if (isClosed) {
    statusKey = 'closed';
    statusLabel = 'CLOSED';
    StatusIcon = GitPullRequestClosed;
    iconClass = styles.iconClosed;
  }

  // Lifecycle time text
  let lifecycleText = '';
  if (isMerged && pullRequest.merged_at) {
    lifecycleText = `merged ${formatRelativeTime(pullRequest.merged_at)}`;
  } else if (isClosed && pullRequest.closed_at) {
    lifecycleText = `closed ${formatRelativeTime(pullRequest.closed_at)}`;
  } else if (pullRequest.github_created_at) {
    lifecycleText = `opened ${formatRelativeTime(pullRequest.github_created_at)}`;
  }

  const updatedTime = pullRequest.github_updated_at
    ? formatRelativeTime(pullRequest.github_updated_at)
    : '';

  return (
    <article className={styles.item} aria-label={`Pull Request #${pullRequest.number}: ${pullRequest.title}`}>
      <div className={styles.mainSection}>
        <div
          className={`${styles.iconWrapper} ${iconClass}`}
          title={`Status: ${statusLabel}`}
          aria-hidden="true"
        >
          <StatusIcon size={16} />
        </div>

        <div className={styles.content}>
          <div className={styles.titleRow}>
            <a
              href={pullRequest.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.titleLink}
              title={pullRequest.title}
            >
              {pullRequest.title}
            </a>
          </div>

          <div className={styles.metadataRow}>
            <span className={styles.number}>#{pullRequest.number}</span>
            {repositoryName && (
              <span className={styles.repoTag}>{repositoryName}</span>
            )}
            {pullRequest.author_login && (
              <span className={styles.author}>by {pullRequest.author_login}</span>
            )}
            {lifecycleText && <span>• {lifecycleText}</span>}
          </div>
        </div>
      </div>

      <div className={styles.stateColumn}>
        <StatusBadge status={statusKey}>{statusLabel}</StatusBadge>
      </div>

      <div className={styles.activityColumn}>
        {updatedTime && (
          <span className={styles.updatedTime} title={pullRequest.github_updated_at}>
            Updated {updatedTime}
          </span>
        )}
        <a
          href={pullRequest.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.externalLink}
          aria-label={`View PR #${pullRequest.number} on GitHub`}
          title="Open in GitHub"
        >
          <ArrowUpRight size={15} />
        </a>
      </div>
    </article>
  );
};

export default PullRequestItem;
