import { Tabs } from '@/components/ui/Tabs';
import styles from './PullRequestFilters.module.css';

const TABS = [
  {
    value: 'all',
    label: 'All',
  },
  {
    value: 'open',
    label: 'Open',
    dotColor: 'var(--palette-coral)',
  },
  {
    value: 'closed',
    label: 'Closed',
    dotColor: 'var(--color-text-muted)',
  },
];

/**
 * Filter tabs for switching pull request state between All, Open, and Closed.
 *
 * @param {object} props
 * @param {'all' | 'open' | 'closed'} props.state - Current state filter
 * @param {(state: 'all' | 'open' | 'closed') => void} props.onChange - Tab change handler
 * @param {number} [props.total] - Total items in current query view
 * @param {string} [props.className]
 */
export const PullRequestFilters = ({
  state = 'all',
  onChange,
  total,
  className = '',
}) => {
  return (
    <div className={`${styles.filterBar} ${className}`}>
      <div className={styles.tabGroup}>
        <Tabs
          tabs={TABS}
          value={state}
          onChange={onChange}
          aria-label="Filter pull requests by status"
        />
      </div>

      {typeof total === 'number' && (
        <div className={styles.statsText}>
          {total} {total === 1 ? 'pull request' : 'pull requests'}
        </div>
      )}
    </div>
  );
};

export default PullRequestFilters;
