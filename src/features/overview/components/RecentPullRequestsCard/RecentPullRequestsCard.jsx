import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { GitPullRequest, ArrowRight } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatRelativeTime } from '@/utils/date';
import styles from './RecentPullRequestsCard.module.css';

/**
 * Recent Pull Requests card table on the Overview page.
 *
 * @param {object} props
 * @param {Array<object>} [props.pullRequests=[]] - List of pull request entities
 * @param {number} [props.total=0] - Total PR count in repository
 * @param {string} [props.repositoryName=''] - Active repository name
 * @param {boolean} [props.isLoading=false] - Whether data is loading
 * @param {number} [props.page=1] - Current page number
 * @param {number} [props.perPage=5] - Items per page
 * @param {Function} [props.onPageChange] - Callback when page changes
 * @param {string} [props.className='']
 */
export const RecentPullRequestsCard = ({
  pullRequests = [],
  total = 0,
  repositoryName = '',
  isLoading = false,
  page = 1,
  perPage = 5,
  onPageChange = null,
  className = '',
}) => {
  const [activeFilter, setActiveFilter] = useState('all');

  // Presentation-only filtering adhering to backend PR semantics:
  // - Open: state === "open"
  // - Merged: merged_at !== null
  // - Closed: state === "closed" && merged_at === null
  const filteredItems = useMemo(() => {
    if (!Array.isArray(pullRequests)) return [];
    if (activeFilter === 'open') {
      return pullRequests.filter((pr) => pr.state === 'open');
    }
    if (activeFilter === 'merged') {
      return pullRequests.filter((pr) => Boolean(pr.merged_at));
    }
    if (activeFilter === 'closed') {
      return pullRequests.filter((pr) => pr.state === 'closed' && !pr.merged_at);
    }
    return pullRequests;
  }, [pullRequests, activeFilter]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <div
      className={`${styles.card} ${className}`}
      role="region"
      aria-label="Recent pull requests table"
    >
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.title}>Recent pull requests</h2>
          <span className={styles.streamBadge}>STREAM</span>
        </div>

        <div className={styles.filters} role="tablist" aria-label="PR state filters">
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === 'all'}
            className={`${styles.filterBtn} ${
              activeFilter === 'all' ? styles.filterBtnActive : ''
            }`}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === 'open'}
            className={`${styles.filterBtn} ${
              activeFilter === 'open' ? styles.filterBtnActive : ''
            }`}
            onClick={() => setActiveFilter('open')}
          >
            Open
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === 'merged'}
            className={`${styles.filterBtn} ${
              activeFilter === 'merged' ? styles.filterBtnActive : ''
            }`}
            onClick={() => setActiveFilter('merged')}
          >
            Merged
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === 'closed'}
            className={`${styles.filterBtn} ${
              activeFilter === 'closed' ? styles.filterBtnActive : ''
            }`}
            onClick={() => setActiveFilter('closed')}
          >
            Closed
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col" style={{ minWidth: '260px' }}>
                TITLE &amp; PR ID
              </th>
              <th scope="col">REPOSITORY</th>
              <th scope="col">AUTHOR</th>
              <th scope="col">STATE</th>
              <th scope="col">CYCLE TIME</th>
              <th scope="col">UPDATED</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: perPage }).map((_, idx) => (
                <tr key={idx} className={styles.skeletonRow}>
                  <td>
                    <div
                      className={styles.skeletonBar}
                      style={{ width: '220px', height: '14px' }}
                    />
                  </td>
                  <td>
                    <div
                      className={styles.skeletonBar}
                      style={{ width: '90px', height: '14px' }}
                    />
                  </td>
                  <td>
                    <div
                      className={styles.skeletonBar}
                      style={{ width: '80px', height: '14px' }}
                    />
                  </td>
                  <td>
                    <div
                      className={styles.skeletonBar}
                      style={{ width: '60px', height: '18px' }}
                    />
                  </td>
                  <td>
                    <div
                      className={styles.skeletonBar}
                      style={{ width: '40px', height: '14px' }}
                    />
                  </td>
                  <td>
                    <div
                      className={styles.skeletonBar}
                      style={{ width: '60px', height: '14px' }}
                    />
                  </td>
                </tr>
              ))
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className={styles.emptyState}>
                    <GitPullRequest size={24} color="var(--color-text-muted)" />
                    <p className={styles.emptyTitle}>No pull requests found</p>
                    <p className={styles.emptyDesc}>
                      {pullRequests.length === 0
                        ? 'No pull requests have been synchronized for this repository yet.'
                        : `No pull requests match the "${activeFilter}" filter.`}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredItems.map((pr) => {
                const isMerged = Boolean(pr.merged_at);
                const isDraft = Boolean(pr.draft && pr.state === 'open');
                const isClosed = pr.state === 'closed' && !isMerged;

                let statusBadgeKey = 'open';
                let statusLabel = 'OPEN';
                if (isMerged) {
                  statusBadgeKey = 'merged';
                  statusLabel = 'MERGED';
                } else if (isDraft) {
                  statusBadgeKey = 'draft';
                  statusLabel = 'DRAFT';
                } else if (isClosed) {
                  statusBadgeKey = 'closed';
                  statusLabel = 'CLOSED';
                }

                // Legitimate cycle time definition: merged_at - github_created_at
                let cycleTimeText = '—';
                if (isMerged && pr.merged_at && pr.github_created_at) {
                  const ms = new Date(pr.merged_at) - new Date(pr.github_created_at);
                  const hours = ms / (1000 * 3600);
                  if (hours >= 0) {
                    cycleTimeText = `${hours.toFixed(1)}h`;
                  }
                }

                const initials = pr.author_login
                  ? pr.author_login.slice(0, 2).toUpperCase()
                  : '??';

                const updatedFormatted = pr.github_updated_at
                  ? formatRelativeTime(pr.github_updated_at)
                  : '—';

                return (
                  <tr key={pr.id || pr.github_id || pr.number}>
                    <td>
                      <span className={styles.prNumber}>#{pr.number}</span>
                      <a
                        href={pr.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.prTitleLink}
                        title={pr.title}
                      >
                        {pr.title}
                      </a>
                      {isDraft && (
                        <span className={styles.draftBadge}>DRAFT</span>
                      )}
                    </td>
                    <td>
                      <span className={styles.repoBadge}>
                        {repositoryName || pr.repository_name || '—'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.authorCell}>
                        <div className={styles.authorAvatar} aria-hidden="true">
                          {initials}
                        </div>
                        <span className={styles.authorLogin}>
                          {pr.author_login || 'ghost'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={statusBadgeKey}>
                        {statusLabel}
                      </StatusBadge>
                    </td>
                    <td>
                      <span className={styles.cycleTimeCell}>
                        {cycleTimeText}
                      </span>
                    </td>
                    <td>
                      <span className={styles.updatedCell}>
                        {updatedFormatted}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.footer}>
        <span className={styles.footerCount}>
          Showing {filteredItems.length} of {total} ingested pull requests
        </span>

        <div className={styles.footerActions}>
          {totalPages > 1 && onPageChange && (
            <div className={styles.paginationControls}>
              <button
                type="button"
                className={styles.pageBtn}
                disabled={page <= 1 || isLoading}
                onClick={() => onPageChange(page - 1)}
                aria-label="Previous page"
              >
                Previous
              </button>
              <button
                type="button"
                className={styles.pageBtn}
                disabled={page >= totalPages || isLoading}
                onClick={() => onPageChange(page + 1)}
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          )}

          <Link to="/app/pull-requests" className={styles.viewAllLink}>
            <span>View all in explorer</span>
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecentPullRequestsCard;
