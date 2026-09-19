import { useState, useMemo, useCallback } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatWeekStart } from '@/utils/date';
import styles from './PullRequestActivityChart.module.css';

/**
 * Pull request activity chart rendering daily or weekly opened vs merged volumes.
 *
 * @param {object} props
 * @param {Array<object> | object | null} props.data - Raw backend activity data or items array
 * @param {number} [props.days=30] - Lookback window in days
 * @param {string} [props.className]
 */
export const PullRequestActivityChart = ({
  data = null,
  days = 30,
  className = '',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Normalize data items from backend payload { data: [ { day, created_count, merged_count } ] } or array
  const items = useMemo(() => {
    if (!data) return [];
    const rawList = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
      ? data
      : [];

    return rawList.map((item, idx) => {
      const opened = Number(item.created_count ?? item.opened ?? 0);
      const merged = Number(item.merged_count ?? item.merged ?? 0);
      const velocity = Number(item.velocity ?? merged);
      const label = item.day
        ? formatWeekStart(item.day)
        : (item.week || `Day ${idx + 1}`);
      const isCurrent = Boolean(item.isCurrent || item.is_partial);
      return {
        id: item.day || item.week || `activity-${idx}`,
        opened,
        merged,
        velocity,
        label,
        isCurrent,
        rawDate: item.day || item.week || '',
      };
    });
  }, [data]);

  const totalOpened = useMemo(
    () => items.reduce((sum, item) => sum + item.opened, 0),
    [items],
  );

  const totalMerged = useMemo(
    () => items.reduce((sum, item) => sum + item.merged, 0),
    [items],
  );

  const mergeRate =
    totalOpened > 0
      ? `${((totalMerged / totalOpened) * 100).toFixed(1)}%`
      : totalMerged > 0
      ? '100%'
      : '0.0%';

  // SVG coordinate dimensions
  const svgWidth = 640;
  const svgHeight = 240;
  const marginLeft = 38;
  const marginRight = 24;
  const marginTop = 20;
  const marginBottom = 40;

  const chartWidth = svgWidth - marginLeft - marginRight;
  const chartHeight = svgHeight - marginTop - marginBottom;

  const maxVal = useMemo(() => {
    const highest = Math.max(5, ...items.flatMap((i) => [i.opened, i.merged, i.velocity]));
    return Math.ceil(highest * 1.15);
  }, [items]);

  const yTicks = useMemo(() => {
    const t4 = maxVal;
    const t3 = Math.round(maxVal * 0.75);
    const t2 = Math.round(maxVal * 0.5);
    const t1 = Math.round(maxVal * 0.25);
    return [t4, t3, t2, t1].filter((v, i, a) => a.indexOf(v) === i && v > 0);
  }, [maxVal]);

  const getY = useCallback(
    (val) => marginTop + chartHeight - (val / maxVal) * chartHeight,
    [chartHeight, marginTop, maxVal],
  );

  const slotWidth = items.length > 0 ? chartWidth / items.length : chartWidth;
  const barGap = items.length > 20 ? 1 : 3;
  const barWidth = Math.max(2, Math.min(14, (slotWidth - barGap * 2) / 2));

  // Build points path for the velocity trend line
  const velocityPoints = useMemo(() => {
    return items.map((item, idx) => {
      const groupCenterX = marginLeft + idx * slotWidth + slotWidth / 2;
      const x = groupCenterX + (barGap + barWidth) / 2;
      const y = getY(item.velocity);
      return { x, y, isCurrent: item.isCurrent, velocity: item.velocity, label: item.label };
    });
  }, [items, marginLeft, slotWidth, barGap, barWidth, getY]);

  const linePathD = useMemo(() => {
    return velocityPoints.reduce(
      (acc, pt, idx) => (idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`),
      '',
    );
  }, [velocityPoints]);

  return (
    <div
      className={`${styles.container} ${className}`}
      role="region"
      aria-label="Pull request activity over time chart"
    >
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h2 className={styles.title}>Pull request activity over time</h2>
          <p className={styles.subtitle}>
            Volume of opened versus merged pull requests over the last {days} days.
          </p>
        </div>

        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={styles.legendSquareMerged} aria-hidden="true" />
            <span>Merged</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendSquareOpened} aria-hidden="true" />
            <span>Opened</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendVelocityLine} aria-hidden="true" />
            <span>Velocity</span>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div style={{ padding: 'var(--space-6) var(--space-4)' }}>
          <EmptyState
            title="No pull request activity available"
            description="No pull request events were recorded for the selected window."
          />
        </div>
      ) : (
        <>
          <div className={styles.chartBody}>
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className={styles.svgChart}
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label={`Bar chart showing ${totalOpened} opened and ${totalMerged} merged pull requests.`}
            >
              {/* Y-axis gridlines and labels */}
              {yTicks.map((tick) => {
                const y = getY(tick);
                return (
                  <g key={tick}>
                    <line
                      x1={marginLeft}
                      y1={y}
                      x2={marginLeft + chartWidth}
                      y2={y}
                      className={styles.gridLine}
                    />
                    <text x={marginLeft - 8} y={y} className={styles.axisTick}>
                      {tick}
                    </text>
                  </g>
                );
              })}

              {/* Baseline */}
              <line
                x1={marginLeft}
                y1={marginTop + chartHeight}
                x2={marginLeft + chartWidth}
                y2={marginTop + chartHeight}
                className={styles.baseLine}
              />

              {/* Grouped Bars */}
              {items.map((item, idx) => {
                const groupCenterX = marginLeft + idx * slotWidth + slotWidth / 2;
                const openedX = groupCenterX - barWidth - barGap / 2;
                const mergedX = groupCenterX + barGap / 2;

                const openedH = (item.opened / maxVal) * chartHeight;
                const openedY = marginTop + chartHeight - openedH;

                const mergedH = (item.merged / maxVal) * chartHeight;
                const mergedY = marginTop + chartHeight - mergedH;

                const isHovered = hoveredIdx === idx;

                // Thin out X labels if there are many items
                const shouldRenderLabel =
                  items.length <= 12 ||
                  (items.length <= 35 && (idx % 4 === 0 || idx === items.length - 1)) ||
                  (idx % 10 === 0 || idx === items.length - 1);

                return (
                  <g
                    key={item.id}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Hover column background highlight */}
                    {isHovered && (
                      <rect
                        x={groupCenterX - slotWidth / 2}
                        y={marginTop}
                        width={slotWidth}
                        height={chartHeight}
                        fill="rgba(255, 255, 255, 0.03)"
                        rx={2}
                      />
                    )}

                    {/* Opened Bar */}
                    <rect
                      x={openedX}
                      y={openedY}
                      width={barWidth}
                      height={Math.max(1, openedH)}
                      rx={1}
                      className={styles.barOpened}
                      opacity={hoveredIdx !== null && !isHovered ? 0.4 : 1}
                    >
                      <title>{`${item.label}: ${item.opened} opened`}</title>
                    </rect>

                    {/* Merged Bar */}
                    <rect
                      x={mergedX}
                      y={mergedY}
                      width={barWidth}
                      height={Math.max(1, mergedH)}
                      rx={1}
                      className={styles.barMerged}
                      opacity={hoveredIdx !== null && !isHovered ? 0.4 : 1}
                    >
                      <title>{`${item.label}: ${item.merged} merged`}</title>
                    </rect>

                    {/* X-axis Week/Day Label */}
                    {shouldRenderLabel && (
                      <text
                        x={groupCenterX}
                        y={marginTop + chartHeight + 22}
                        className={
                          item.isCurrent
                            ? `${styles.xLabel} ${styles.xLabelCurrent}`
                            : styles.xLabel
                        }
                      >
                        {item.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Dotted velocity line */}
              {linePathD && <path d={linePathD} className={styles.velocityLine} />}

              {/* Velocity points */}
              {velocityPoints.map((pt, idx) => {
                if (items.length > 20 && idx % 3 !== 0 && !pt.isCurrent) return null;
                return (
                  <circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r={pt.isCurrent ? 4 : 2.5}
                    className={pt.isCurrent ? styles.velocityDotCurrent : styles.velocityDot}
                  >
                    <title>{`${pt.label} Velocity: ${pt.velocity}`}</title>
                  </circle>
                );
              })}
            </svg>
          </div>

          <div className={styles.footerBar}>
            <div className={styles.footerLeft}>
              <span className={styles.footerLabel}>TOTAL WINDOW ACTIVITY:</span>
              <span className={styles.footerDelta}>
                {totalOpened} OPENED • {totalMerged} MERGED
              </span>
            </div>
            <span className={styles.footerRight}>
              MERGE EFFICIENCY: {mergeRate} • UTC CALIBRATION
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default PullRequestActivityChart;
