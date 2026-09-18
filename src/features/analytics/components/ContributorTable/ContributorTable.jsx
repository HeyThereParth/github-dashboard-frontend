import { useMemo } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table';
import { EmptyState } from '@/components/ui/EmptyState';
import styles from './ContributorTable.module.css';

/**
 * Contributor volume and turnaround metrics table.
 * Strictly presents operational engineering fields without gamification or leaderboards.
 *
 * @param {object} props
 * @param {Array<object> | object | null} props.data - Raw author analytics data from backend
 * @param {string} [props.className]
 */
export const ContributorTable = ({ data, className = '' }) => {
  const items = useMemo(() => {
    const rawList = Array.isArray(data)
      ? data
      : data?.items || data?.authors || [];

    return rawList.map((item, idx) => ({
      id: item.author_login || `author-${idx}`,
      author_login: item.author_login || 'Unknown',
      total_prs: Number(item.total_prs ?? 0),
      merged_prs: Number(item.merged_prs ?? 0),
      avg_cycle_time_hours:
        item.avg_cycle_time_hours != null
          ? Number(item.avg_cycle_time_hours)
          : null,
    }));
  }, [data]);

  return (
    <div
      className={`${styles.container} ${className}`}
      role="region"
      aria-label="Contributor flow and turnaround metrics"
    >
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h3 className={styles.title}>Contributor flow & turnaround</h3>
          <p className={styles.subtitle}>
            Author volume and lifecycle profile (Operational observability, non-gamified).
          </p>
        </div>
        <div className={styles.metaNotice}>
          Observability metrics
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No contributor activity"
          description="No contributor records were found for the selected repository and time window."
        />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contributor</TableHead>
                <TableHead align="right">Total PRs</TableHead>
                <TableHead align="right">Merged PRs</TableHead>
                <TableHead align="right">Avg Cycle Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((contributor) => {
                const initials = contributor.author_login
                  .slice(0, 2)
                  .toUpperCase();

                const cycleTimeDisplay =
                  contributor.avg_cycle_time_hours != null
                    ? `${contributor.avg_cycle_time_hours.toFixed(1)}h`
                    : '—';

                return (
                  <TableRow key={contributor.id}>
                    <TableCell>
                      <div className={styles.contributorCell}>
                        <div className={styles.avatarBadge} aria-hidden="true">
                          {initials}
                        </div>
                        <span className={styles.authorLogin}>
                          {contributor.author_login}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell align="right">
                      <span className={styles.monoCell}>
                        {contributor.total_prs}
                      </span>
                    </TableCell>

                    <TableCell align="right">
                      <span className={styles.monoCell}>
                        {contributor.merged_prs}
                      </span>
                    </TableCell>

                    <TableCell align="right">
                      <span className={styles.cycleTimeCell}>
                        {cycleTimeDisplay}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className={styles.footerNote}>
            <span>
              {items.length} {items.length === 1 ? 'contributor' : 'contributors'} observed in active lookback period
            </span>
            <span>Non-gamified operational telemetry</span>
          </div>
        </>
      )}
    </div>
  );
};

export default ContributorTable;
