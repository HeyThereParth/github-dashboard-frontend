import { useMemo, useState } from 'react';
import { Info } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatWeekStart } from '@/utils/date';
import styles from './ThroughputChart.module.css';

/**
 * Weekly PR throughput bar chart rendering merged PR delivery velocity.
 *
 * @param {object} props
 * @param {Array<object> | object | null} props.data - Raw throughput data from backend
 * @param {number} [props.weeks=8] - Number of weeks displayed
 * @param {string} [props.className]
 */
export const ThroughputChart = ({
  data,
  weeks = 8,
  className = '',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const items = useMemo(() => {
    // Backend returns: { data: [ { week_start, merged_count, is_partial } ] }
    const rawList = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
      ? data
      : data?.items || data?.weeks || [];

    return rawList.map((item, idx) => {
      const count = Number(
        item.merged_count ?? item.merged_prs ?? item.count ?? item.prs ?? item.total ?? 0,
      );
      const label = item.week_start
        ? formatWeekStart(item.week_start)
        : (item.week || item.label || `W${idx + 1}`);
      return {
        id: item.week_start || item.id || `week-${idx}`,
        count,
        label,
        isPartial: Boolean(item.is_partial),
      };
    });
  }, [data]);

  const totalMerged = useMemo(
    () => items.reduce((sum, item) => sum + item.count, 0),
    [items],
  );

  const avgWeekly = items.length > 0 ? (totalMerged / items.length).toFixed(1) : '0.0';

  const maxVal = useMemo(
    () => Math.max(5, ...items.map((i) => i.count)),
    [items],
  );

  const peakIndex = useMemo(() => {
    if (items.length === 0) return -1;
    let max = -1;
    let maxIdx = -1;
    items.forEach((item, idx) => {
      if (item.count > max) {
        max = item.count;
        maxIdx = idx;
      }
    });
    return max > 0 ? maxIdx : -1;
  }, [items]);

  // Chart dimensions in SVG viewBox coordinate space
  const svgWidth = 700;
  const svgHeight = 220;
  const paddingTop = 35;
  const paddingBottom = 35;
  const paddingLeft = 30;
  const paddingRight = 60;
  const chartHeight = svgHeight - paddingTop - paddingBottom;
  const chartWidth = svgWidth - paddingLeft - paddingRight;

  return (
    <div
      className={`${styles.container} ${className}`}
      role="region"
      aria-label="Weekly PR activity and delivery velocity chart"
    >
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.titleRow}>
            <span className={styles.dot} aria-hidden="true" />
            <h3 className={styles.title}>Weekly PR activity & delivery velocity</h3>
          </div>
          <p className={styles.subtitle}>
            Pull requests merged per week over the last {weeks} weeks.
          </p>
        </div>

        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={`${styles.legendSquare} ${styles.legendMerged}`} />
            <span>Merged PRs</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendSquare} ${styles.legendPeak}`} />
            <span>Peak Output</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendLine} />
            <span>Avg ({avgWeekly}/wk)</span>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No throughput data available"
          description="No weekly throughput records were found for the selected repository window."
        />
      ) : (
        <>
          <div className={styles.chartWrapper}>
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className={styles.svgChart}
              preserveAspectRatio="none"
              role="img"
              aria-label={`Weekly throughput chart. Total: ${totalMerged} PRs merged over ${items.length} weeks. Average: ${avgWeekly} PRs per week.`}
            >
              {/* Baseline */}
              <line
                x1={paddingLeft}
                y1={paddingTop + chartHeight}
                x2={paddingLeft + chartWidth}
                y2={paddingTop + chartHeight}
                stroke="var(--color-border)"
              />

              {/* Average reference line */}
              {Number(avgWeekly) > 0 && (
                <>
                  <line
                    x1={paddingLeft}
                    y1={
                      paddingTop +
                      chartHeight -
                      (Number(avgWeekly) / maxVal) * chartHeight
                    }
                    x2={paddingLeft + chartWidth}
                    y2={
                      paddingTop +
                      chartHeight -
                      (Number(avgWeekly) / maxVal) * chartHeight
                    }
                    className={styles.avgLine}
                  />
                  <text
                    x={paddingLeft + chartWidth + 6}
                    y={
                      paddingTop +
                      chartHeight -
                      (Number(avgWeekly) / maxVal) * chartHeight +
                      3
                    }
                    className={styles.avgLabel}
                  >
                    {avgWeekly}
                  </text>
                </>
              )}

              {/* Bars */}
              {items.map((item, idx) => {
                const slotWidth = chartWidth / items.length;
                const barWidth = Math.max(14, Math.min(42, slotWidth * 0.55));
                const x = paddingLeft + idx * slotWidth + (slotWidth - barWidth) / 2;
                const barHeight =
                  maxVal > 0 ? (item.count / maxVal) * chartHeight : 0;
                const y = paddingTop + chartHeight - barHeight;
                const isPeak = idx === peakIndex;
                const isHovered = idx === hoveredIdx;

                return (
                  <g
                    key={item.id}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    tabIndex={0}
                    role="graphics-symbol"
                    aria-label={`${item.label}: ${item.count} merged pull requests`}
                    style={{ outline: 'none' }}
                  >
                    {/* Bar rectangle */}
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={Math.max(2, barHeight)}
                      rx={3}
                      className={`${styles.bar} ${isPeak ? styles.barPeak : styles.barNormal}`}
                      style={{
                        opacity: hoveredIdx !== null && !isHovered ? 0.6 : 1,
                      }}
                    />

                    {/* Value label above bar */}
                    {item.count > 0 && (
                      <text
                        x={x + barWidth / 2}
                        y={y - 8}
                        className={styles.barLabel}
                      >
                        {item.count}
                        {isPeak ? ' ★' : ''}
                      </text>
                    )}

                    {/* Week X-axis label */}
                    <text
                      x={x + barWidth / 2}
                      y={paddingTop + chartHeight + 20}
                      className={styles.axisLabel}
                    >
                      {item.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className={styles.footerNote}>
            <div className={styles.footerLeft}>
              <Info size={14} />
              <span>
                {peakIndex >= 0
                  ? `Peak velocity occurred in ${items[peakIndex].label} (${items[peakIndex].count} PRs merged).`
                  : 'Velocity stable across recent delivery cycles.'}
              </span>
            </div>
            <span>
              Total {totalMerged} pull requests merged across {items.length} weeks
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default ThroughputChart;
