import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, Globe, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import styles from './RepositoryContextBar.module.css';

/**
 * Contextual bar displaying active repository metadata, repo switcher, and navigation back to repos.
 *
 * @param {object} props
 * @param {object | null} props.currentRepository - Active tracked repository entity
 * @param {Array<object>} [props.trackedRepositories=[]] - Available tracked repositories
 * @param {(repositoryId: string) => void} [props.onSelectRepository] - Handler for changing repo
 * @param {string} [props.className]
 */
export const RepositoryContextBar = ({
  currentRepository,
  trackedRepositories = [],
  onSelectRepository,
  className = '',
}) => {
  const repoName = currentRepository?.name || currentRepository?.full_name || 'Repository';
  const defaultBranch = currentRepository?.default_branch || 'main';
  const isPrivate = Boolean(currentRepository?.private);

  const selectOptions = trackedRepositories.map((repo) => ({
    value: repo.id,
    label: repo.full_name || repo.name,
  }));

  return (
    <div className={`${styles.container} ${className}`} role="region" aria-label="Repository Context">
      <div className={styles.leftSection}>
        <Link to="/app/repositories" className={styles.backLink}>
          <ArrowLeft size={16} />
          <span>Repositories</span>
        </Link>

        <div className={styles.divider} aria-hidden="true" />

        <div className={styles.repoMeta}>
          <div className={styles.iconWrapper} aria-hidden="true">
            {isPrivate ? <Lock size={16} /> : <Globe size={16} />}
          </div>

          <h2 className={styles.repoTitle}>{repoName}</h2>

          <Badge variant="neutral" size="sm">
            {isPrivate ? 'PRIVATE' : 'PUBLIC'}
          </Badge>

          <span className={styles.metaMonospace}>
            default: {defaultBranch}
          </span>

          {currentRepository?.html_url && (
            <a
              href={currentRepository.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.backLink}
              title="View on GitHub"
              aria-label="View repository on GitHub"
            >
              <ArrowUpRight size={15} />
            </a>
          )}
        </div>
      </div>

      {selectOptions.length > 1 && (
        <div className={styles.rightSection}>
          <div className={styles.selectorWrapper}>
            <Select
              value={currentRepository?.id || ''}
              onChange={(e) => onSelectRepository && onSelectRepository(e.target.value)}
              options={selectOptions}
              aria-label="Switch tracked repository"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RepositoryContextBar;
