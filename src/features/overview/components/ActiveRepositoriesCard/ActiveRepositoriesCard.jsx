import { Link } from 'react-router-dom';
import { ArrowRight, FolderGit2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './ActiveRepositoriesCard.module.css';

/**
 * Card displaying active tracked repositories in the workspace.
 *
 * @param {object} props
 * @param {Array<object>} [props.repositories=[]] - List of tracked repositories from backend
 * @param {boolean} [props.isLoading=false] - Whether repository data is loading
 * @param {Error|null} [props.error=null] - Error object if query failed
 * @param {Function} [props.onRetry=null] - Retry callback for error state
 * @param {string} [props.selectedRepositoryId] - Optional active repository ID
 * @param {Function} [props.onSelectRepository] - Optional selection handler
 * @param {string} [props.className='']
 */
export const ActiveRepositoriesCard = ({
  repositories = [],
  isLoading = false,
  error = null,
  onRetry = null,
  selectedRepositoryId = null,
  onSelectRepository = null,
  className = '',
}) => {
  const displayedRepos = repositories.slice(0, 5);

  return (
    <div
      className={`${styles.card} ${className}`}
      role="region"
      aria-label="Active repositories list"
    >
      <div className={styles.header}>
        <h2 className={styles.title}>Active Repositories</h2>
        <span className={styles.orderBadge}>TRACKED</span>
      </div>

      <div className={styles.repoList}>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className={styles.skeletonItem}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div
                  className={styles.skeletonBar}
                  style={{ width: '120px', height: '14px' }}
                />
                <div
                  className={styles.skeletonBar}
                  style={{ width: '50px', height: '16px' }}
                />
              </div>
              <div
                className={styles.skeletonBar}
                style={{ width: '180px', height: '11px', marginTop: '4px' }}
              />
            </div>
          ))
        ) : error ? (
          <div className={styles.emptyState}>
            <AlertCircle size={24} color="var(--palette-coral)" />
            <p className={styles.emptyTitle}>Failed to load repositories</p>
            <p className={styles.emptyDesc}>
              {error?.message || 'Could not retrieve tracked repositories.'}
            </p>
            {onRetry && (
              <Button variant="secondary" size="sm" onClick={onRetry}>
                Retry
              </Button>
            )}
          </div>
        ) : displayedRepos.length === 0 ? (
          <div className={styles.emptyState}>
            <FolderGit2 size={24} color="var(--color-text-muted)" />
            <p className={styles.emptyTitle}>No tracked repositories</p>
            <p className={styles.emptyDesc}>
              Track repositories in your workspace to monitor activity and
              throughput.
            </p>
            <Link to="/app/repositories">
              <Button variant="secondary" size="sm">
                Track repositories
              </Button>
            </Link>
          </div>
        ) : (
          displayedRepos.map((repo) => {
            const isSelected = selectedRepositoryId === repo.id;
            const branch = repo.default_branch
              ? repo.default_branch.toUpperCase()
              : 'MAIN';
            const privacyLabel = repo.private ? 'Private' : 'Public';
            const description = repo.description || repo.full_name || repo.name;

            return (
              <div
                key={repo.id || repo.name}
                className={styles.repoItem}
                style={
                  isSelected
                    ? {
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        borderLeft: '2px solid var(--palette-gold)',
                      }
                    : undefined
                }
                onClick={() => onSelectRepository?.(repo)}
                role={onSelectRepository ? 'button' : undefined}
                tabIndex={onSelectRepository ? 0 : undefined}
              >
                <div className={styles.primaryRow}>
                  <div className={styles.repoNameGroup}>
                    <span className={styles.repoName} title={repo.name}>
                      {repo.name}
                    </span>
                    <span className={styles.envBadge}>{branch}</span>
                  </div>
                  <div className={styles.latencyGroup}>
                    <span className={styles.statusBadgeTracked}>TRACKED</span>
                  </div>
                </div>

                <div className={styles.secondaryRow}>
                  <span>{privacyLabel}</span>
                  <span className={styles.dotDivider} aria-hidden="true">
                    •
                  </span>
                  <span className={styles.subsystemDesc} title={description}>
                    {description}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className={styles.footer}>
        <span className={styles.footerWorkspaces}>
          {repositories.length} tracked{' '}
          {repositories.length === 1 ? 'repository' : 'repositories'}
        </span>
        <Link to="/app/repositories" className={styles.viewAllLink}>
          <span>View all repos</span>
          <ArrowRight size={13} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
};

export default ActiveRepositoriesCard;
