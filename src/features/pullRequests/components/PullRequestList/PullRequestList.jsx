import { PullRequestItem } from '../PullRequestItem';
import styles from './PullRequestList.module.css';

/**
 * List container for pull request items with tabular column header.
 *
 * @param {object} props
 * @param {Array<object>} props.items - Array of PR items
 * @param {string} [props.repositoryName] - Selected repo name for context badge
 * @param {string} [props.className]
 */
export const PullRequestList = ({
  items = [],
  repositoryName = '',
  className = '',
}) => {
  return (
    <div className={`${styles.container} ${className}`} role="region" aria-label="Pull requests list">
      <div className={styles.headerRow} aria-hidden="true">
        <span className={styles.colMain}>Pull Request & Context</span>
        <span className={styles.colStatus}>Status</span>
        <span className={styles.colActivity}>Latest Activity</span>
      </div>

      <ul className={styles.list}>
        {items.map((pr) => (
          <li key={pr.id || pr.github_id || pr.number}>
            <PullRequestItem
              pullRequest={pr}
              repositoryName={repositoryName}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PullRequestList;
