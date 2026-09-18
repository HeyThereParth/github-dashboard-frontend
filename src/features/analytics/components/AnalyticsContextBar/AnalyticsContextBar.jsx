import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, Globe, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { AnalyticsWindowSelector } from '../AnalyticsWindowSelector';
import styles from './AnalyticsContextBar.module.css';

/**
 * Context bar for the Analytics page providing repository metadata, repo switcher, and date window controls.
 *
 * @param {object} props
 * @param {object | null} props.currentRepository - Active tracked repository
 * @param {Array<object>} [props.trackedRepositories=[]] - Tracked repositories in workspace
 * @param {(repositoryId: string) => void} [props.onSelectRepository] - Repo change callback
 * @param {number} props.days - Current days window
 * @param {({ days: number, weeks: number }) => void} props.onWindowChange - Window change callback
 * @param {string} [props.className]
 */
export const AnalyticsContextBar = ({
  currentRepository,
  trackedRepositories = [],
  onSelectRepository,
  days,
  onWindowChange,
  className = '',
}) => {
  const repoName =
    currentRepository?.name || currentRepository?.full_name || 'Repository';
  const defaultBranch = currentRepository?.default_branch || 'main';
  const isPrivate = Boolean(currentRepository?.private);

  const selectOptions = trackedRepositories.map((repo) => ({
    value: repo.id,
    label: repo.full_name || repo.name,
  }));

  return (
    <div
      className={`${styles.container} ${className}`}
      role="region"
      aria-label="Analytics Context"
    >
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

      <div className={styles.rightSection}>
        {selectOptions.length > 1 && (
          <div className={styles.selectorWrapper}>
            <Select
              size="sm"
              value={currentRepository?.id || ''}
              onChange={(e) =>
                onSelectRepository && onSelectRepository(e.target.value)
              }
              options={selectOptions}
              aria-label="Switch tracked repository"
            />
          </div>
        )}

        <AnalyticsWindowSelector
          days={days}
          onChange={onWindowChange}
        />
      </div>
    </div>
  );
};

export default AnalyticsContextBar;
