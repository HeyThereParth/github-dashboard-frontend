import { MetricCard } from '@/components/ui/MetricCard';
import styles from './AnalyticsKpiGrid.module.css';

/**
 * KPI cards grid rendering overview metrics (Merge rate, Cycle time, PR volume).
 *
 * @param {object} props
 * @param {object | null} props.overview - Data from getAnalyticsOverview
 * @param {string} [props.className]
 */
export const AnalyticsKpiGrid = ({ overview, className = '' }) => {
  if (!overview) return null;

  const mergeRate =
    overview.merge_rate_percentage != null
      ? `${Number(overview.merge_rate_percentage).toFixed(1)}%`
      : '—';

  const p50Hours =
    overview.cycle_time?.p50_hours != null
      ? `${Number(overview.cycle_time.p50_hours).toFixed(1)}h`
      : '—';

  const p90Hours =
    overview.cycle_time?.p90_hours != null
      ? `${Number(overview.cycle_time.p90_hours).toFixed(1)}h`
      : '—';

  const avgHours =
    overview.cycle_time?.avg_hours != null
      ? `${Number(overview.cycle_time.avg_hours).toFixed(1)}h`
      : '—';

  const totalPrs =
    overview.total_prs != null ? Number(overview.total_prs).toLocaleString() : '—';
  const openPrs = overview.open_prs ?? 0;
  const mergedPrs = overview.merged_prs ?? 0;
  const closedUnmerged = overview.closed_unmerged_prs ?? 0;

  // Segments for PR Volume card
  const prSegments = [
    { value: mergedPrs, color: 'mint', label: 'Merged' },
    { value: openPrs, color: 'coral', label: 'Open' },
    { value: closedUnmerged, color: 'neutral', label: 'Closed unmerged' },
  ];

  return (
    <div className={`${styles.grid} ${className}`} role="region" aria-label="Analytics KPIs">
      {/* 1. Overall Merge Rate */}
      <MetricCard
        label="OVERALL MERGE RATE"
        value={mergeRate}
        progress={
          overview.merge_rate_percentage != null
            ? Number(overview.merge_rate_percentage)
            : null
        }
        progressColor="mint"
        subtext={
          <span className={styles.metaText}>
            {mergedPrs} merged • {closedUnmerged} closed unmerged
          </span>
        }
      />

      {/* 2. Time to Merge (Cycle Time) */}
      <MetricCard
        label="TIME TO MERGE"
        value={p50Hours}
        suffix="typical (P50)"
        subtext={
          <span className={styles.metaText}>
            {p90Hours} longer-running (P90) • {avgHours} avg
          </span>
        }
        progress={
          overview.cycle_time?.p50_hours != null && overview.cycle_time?.p90_hours != null
            ? Math.min(
                100,
                (Number(overview.cycle_time.p50_hours) /
                  Math.max(1, Number(overview.cycle_time.p90_hours))) *
                  100,
              )
            : null
        }
        progressColor="gold"
      />

      {/* 3. Pull Request Volume */}
      <MetricCard
        label="PULL REQUEST VOLUME"
        value={totalPrs}
        segments={prSegments}
        subtext={
          <span className={styles.metaText}>
            {openPrs} open • {mergedPrs} merged • {closedUnmerged} unmerged
          </span>
        }
      />
    </div>
  );
};

export default AnalyticsKpiGrid;
