import { MetricCard } from '@/components/ui/MetricCard';
import styles from './OverviewKpiGrid.module.css';

/**
 * KPI cards grid for the Overview page rendering 4 backend-backed engineering metrics.
 *
 * @param {object} props
 * @param {object | null} [props.overview] - Analytics overview payload from backend
 * @param {number} [props.trackedCount=0] - Number of tracked repositories
 * @param {boolean} [props.isGitHubConnected=false] - Whether GitHub installation is connected
 * @param {number} [props.days=30] - Time window in days
 * @param {boolean} [props.isLoading=false] - Whether metrics are currently loading
 * @param {string} [props.className='']
 */
export const OverviewKpiGrid = ({
  overview = null,
  trackedCount = 0,
  isGitHubConnected = false,
  days = 30,
  isLoading = false,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div
        className={`${styles.grid} ${className}`}
        role="region"
        aria-label="Overview KPIs loading"
      >
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className={styles.skeletonCard}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                className={styles.skeletonBar}
                style={{ width: '90px', height: '12px' }}
              />
              <div
                className={styles.skeletonBar}
                style={{ width: '40px', height: '14px' }}
              />
            </div>
            <div
              className={styles.skeletonBar}
              style={{ width: '80px', height: '28px', marginTop: '6px' }}
            />
            <div
              className={styles.skeletonBar}
              style={{ width: '140px', height: '11px', marginTop: 'auto' }}
            />
            <div
              className={styles.skeletonBar}
              style={{ width: '100%', height: '4px', marginTop: '4px' }}
            />
          </div>
        ))}
      </div>
    );
  }

  // 1. Pull Requests
  const totalPrs =
    overview?.total_prs != null
      ? Number(overview.total_prs).toLocaleString()
      : '—';
  const openPrs = overview?.open_prs ?? 0;
  const mergedPrs = overview?.merged_prs ?? 0;
  const closedUnmerged = overview?.closed_unmerged_prs ?? 0;

  const prSegments = [
    { value: openPrs, color: 'coral', label: 'Open' },
    { value: mergedPrs, color: 'mint', label: 'Merged' },
    { value: closedUnmerged, color: 'neutral', label: 'Closed' },
  ];

  // 2. Merge Rate
  const mergeRate =
    overview?.merge_rate_percentage != null
      ? `${Number(overview.merge_rate_percentage).toFixed(1)}%`
      : '—';
  const finalizedPrs = mergedPrs + closedUnmerged;

  // 3. Time to Merge (Cycle Time)
  const p50Hours =
    overview?.cycle_time?.p50_hours != null
      ? `${Number(overview.cycle_time.p50_hours).toFixed(1)}`
      : '—';
  const p90Hours =
    overview?.cycle_time?.p90_hours != null
      ? `${Number(overview.cycle_time.p90_hours).toFixed(1)}h`
      : '—';
  const avgHours =
    overview?.cycle_time?.avg_hours != null
      ? `${Number(overview.cycle_time.avg_hours).toFixed(1)}h`
      : '—';

  const cycleTimeProgress =
    overview?.cycle_time?.p50_hours != null &&
    overview?.cycle_time?.p90_hours != null
      ? Math.min(
          100,
          (Number(overview.cycle_time.p50_hours) /
            Math.max(1, Number(overview.cycle_time.p90_hours))) *
            100,
        )
      : null;

  return (
    <div
      className={`${styles.grid} ${className}`}
      role="region"
      aria-label="Engineering overview KPIs"
    >
      {/* 1. Pull Requests */}
      <MetricCard
        label="PULL REQUESTS"
        value={totalPrs}
        badge={
          <span
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              padding: '1px 6px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {days}D Window
          </span>
        }
        segments={overview ? prSegments : null}
        subtext={
          <span className={styles.metaText}>
            {openPrs} open • {mergedPrs} merged • {closedUnmerged} closed
          </span>
        }
      />

      {/* 2. Merge Rate */}
      <MetricCard
        label="MERGE RATE"
        value={mergeRate}
        progress={
          overview?.merge_rate_percentage != null
            ? Number(overview.merge_rate_percentage)
            : null
        }
        progressColor="mint"
        subtext={
          <span className={styles.metaText}>
            {mergedPrs} merged • {finalizedPrs} finalized
          </span>
        }
      />

      {/* 3. Time to Merge */}
      <MetricCard
        label="TIME TO MERGE"
        value={p50Hours}
        suffix={p50Hours !== '—' ? 'hours' : null}
        badge={
          <span
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              padding: '1px 6px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              color: 'var(--color-text-secondary)',
            }}
          >
            P50 CAL
          </span>
        }
        progress={cycleTimeProgress}
        progressColor="gold"
        subtext={
          <span className={styles.metaText}>
            P90: {p90Hours} • Avg: {avgHours}
          </span>
        }
      />

      {/* 4. Tracked Repositories */}
      <MetricCard
        label="TRACKED REPOSITORIES"
        value={trackedCount}
        badge={
          <span
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              padding: '1px 6px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: isGitHubConnected
                ? 'rgba(53, 185, 138, 0.12)'
                : 'rgba(255, 255, 255, 0.06)',
              border: isGitHubConnected
                ? '1px solid rgba(53, 185, 138, 0.25)'
                : '1px solid rgba(255, 255, 255, 0.1)',
              color: isGitHubConnected
                ? 'var(--palette-mint)'
                : 'var(--color-text-muted)',
            }}
          >
            {isGitHubConnected ? 'CONNECTED' : 'DISCONNECTED'}
          </span>
        }
        progress={trackedCount > 0 ? 100 : 0}
        progressColor={isGitHubConnected ? 'mint' : 'neutral'}
        subtext={
          <span className={styles.metaText}>
            {trackedCount}{' '}
            {trackedCount === 1 ? 'repository' : 'repositories'} monitored •{' '}
            {/* <span
              className={
                isGitHubConnected
                  ? styles.metaStatusMint
                  : styles.metaStatusMuted
              }
            >
              {isGitHubConnected
                ? 'GitHub connected'
                : 'GitHub disconnected'}
            </span> */}
          </span>
        }
      />
    </div>
  );
};

export default OverviewKpiGrid;
