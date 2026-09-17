import { FolderGit2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { RepositoryCard } from '../RepositoryCard';
import styles from './TrackedRepositoriesList.module.css';

/**
 * Section rendering the list of tracked repositories.
 *
 * @param {object} props
 * @param {Array} props.repositories
 * @param {string} props.workspaceId
 * @param {(repositoryId: string) => void} props.onUntrack
 * @param {(repositoryId: string) => void} props.onSync
 * @param {string | null} [props.untrackingId]
 * @param {string | null} [props.syncingId]
 */
export const TrackedRepositoriesList = ({
  repositories = [],
  workspaceId,
  onUntrack,
  onSync,
  untrackingId = null,
  syncingId = null,
}) => {
  return (
    <section className={styles.section} aria-label="Tracked Repositories">
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h2 className={styles.title}>Tracked Repositories</h2>
          <Badge variant="primary">
            {repositories.length} LIVE TELEMETRY STREAMS
          </Badge>
        </div>
        <span className={styles.subtitle}>What is being tracked right now</span>
      </div>

      {repositories.length === 0 ? (
        <EmptyState
          icon={FolderGit2}
          title="No tracked repositories"
          description="You haven't tracked any repositories in this workspace yet. Select from the available GitHub repositories below to begin ingesting telemetry."
        />
      ) : (
        <div className={styles.list}>
          {repositories.map((repo) => (
            <RepositoryCard
              key={repo.id}
              repository={repo}
              workspaceId={workspaceId}
              isTracked={true}
              onUntrack={onUntrack}
              onSync={onSync}
              isUntracking={untrackingId === repo.id}
              isSyncTriggering={syncingId === repo.id}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default TrackedRepositoriesList;
