import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Tabs } from '@/components/ui/Tabs';
import styles from './RepositoryFilters.module.css';

/**
 * Filter and search controls for repositories.
 *
 * @param {object} props
 * @param {string} props.searchQuery
 * @param {(query: string) => void} props.onSearchChange
 * @param {'all' | 'private' | 'public'} props.visibilityFilter
 * @param {(visibility: 'all' | 'private' | 'public') => void} props.onVisibilityChange
 * @param {{ all: number, private: number, public: number, tracked: number, available: number }} props.counts
 */
export const RepositoryFilters = ({
  searchQuery = '',
  onSearchChange,
  visibilityFilter = 'all',
  onVisibilityChange,
  counts = { all: 0, private: 0, public: 0, tracked: 0, available: 0 },
}) => {
  const tabs = [
    { value: 'all', label: 'All', count: counts.all },
    { value: 'private', label: 'Private', count: counts.private },
    { value: 'public', label: 'Public', count: counts.public },
  ];

  return (
    <div className={styles.bar} role="search" aria-label="Repository filter and search">
      <div className={styles.leftControls}>
        <Tabs
          tabs={tabs}
          value={visibilityFilter}
          onChange={onVisibilityChange}
        />
      </div>

      <div className={styles.rightControls}>
        <div className={styles.searchInput}>
          <Input
            placeholder="Filter repositories by name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={<Search size={14} />}
            aria-label="Filter repositories by name"
          />
        </div>

        <div className={styles.statusIndicator} aria-live="polite">
          <span className={styles.statusDot} aria-hidden="true" />
          <span>
            {counts.tracked} active · {counts.available} available
          </span>
        </div>
      </div>
    </div>
  );
};

export default RepositoryFilters;
