import { MetricCard } from '@/components/ui/MetricCard';
import { Badge } from '@/components/ui/Badge';
import styles from './RepositoryMetrics.module.css';

/**
 * Top repository metrics derived strictly from actual API counts.
 *
 * @param {object} props
 * @param {number} props.trackedCount
 * @param {number} props.availableCount
 */
export const RepositoryMetrics = ({ trackedCount = 0, availableCount = 0 }) => {
  const totalCount = trackedCount + availableCount;

  return (
    <section className={styles.grid} aria-label="Repository Telemetry Summary">
      <MetricCard
        label="CONNECTED REPOS"
        value={String(totalCount)}
        suffix="total repos"
        subtext={`${trackedCount} active tracking · ${availableCount} available`}
        segments={[
          { value: trackedCount, color: 'mint', label: 'Active tracking' },
          { value: availableCount, color: 'neutral', label: 'Available' },
        ]}
      />

      <MetricCard
        label="TRACKED STREAMS"
        value={String(trackedCount)}
        suffix="active"
        badge={<Badge variant="success">LIVE TELEMETRY</Badge>}
        subtext={`${trackedCount} repositories actively synchronized`}
      />

      <MetricCard
        label="AVAILABLE ON GITHUB"
        value={String(availableCount)}
        suffix="untracked"
        badge={<Badge variant="neutral">READY TO INGEST</Badge>}
        subtext={`${availableCount} repositories accessible to track`}
      />
    </section>
  );
};

export default RepositoryMetrics;
