import { FolderGit2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { RepositoryCard } from '../RepositoryCard';
import styles from './AvailableRepositoriesList.module.css';

/**
 * Section rendering the list of available GitHub repositories ready to track.
 *
 * @param {object} props
 * @param {Array} props.repositories
 * @param {string} props.workspaceId
 * @param {({ owner, repo }: { owner: string, repo: string }) => void} props.onTrack
 * @param {string | null} [props.trackingRepoName]
 */
export const AvailableRepositoriesList = ({
  repositories = [],
  workspaceId,
  onTrack,
  trackingRepoName = null,
}) => {
  return (
    <section className={styles.section} aria-label="Available GitHub Repositories">
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h2 className={styles.title}>Available on GitHub</h2>
          <Badge variant="neutral">
            {repositories.length} UNTRACKED
          </Badge>
        </div>
        <span className={styles.subtitle}>What can I track next?</span>
      </div>

      {repositories.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title="No untracked repositories"
          description="All repositories accessible via your GitHub App installation are currently tracked."
        />
      ) : (
        <div className={styles.list}>
          {repositories.map((repo) => {
            const isTracking = trackingRepoName === repo.name || trackingRepoName === repo.full_name;
            return (
              <RepositoryCard
                key={repo.github_id || repo.id || repo.full_name}
                repository={repo}
                workspaceId={workspaceId}
                isTracked={false}
                onTrack={onTrack}
                isTracking={isTracking}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default AvailableRepositoriesList;
