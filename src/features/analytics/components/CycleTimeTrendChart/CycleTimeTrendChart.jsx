import { useState, useMemo, useCallback } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatWeekStart } from '@/utils/date';
import styles from './CycleTimeTrendChart.module.css';

/**
 * Builds an SVG path string for a sequence of points, cleanly breaking path segments
 * wherever a point's Y coordinate is null (representing missing data).
 * This ensures NO line is drawn to 0 and NO artificial interpolation occurs across missing periods.
 *
 * @param {Array<{ x: number, y: number | null }>} points
 * @returns {string} SVG path 'd' attribute
 */
const buildDiscontinuousPath = (points) => {
  let path = '';
  let inSegment = false;

  for (const pt of points) {
    if (pt.y !== null && !isNaN(pt.y)) {
      if (!inSegment) {
        path += `M ${pt.x.toFixed(1)},${pt.y.toFixed(1)} `;
        inSegment = true;
      } else {
        path += `L ${pt.x.toFixed(1)},${pt.y.toFixed(1)} `;
      }
    } else {
      inSegment = false;
    }
  }

  return path.trim();
};

/**
 * Cycle time trend chart rendering weekly P50, P90, and average resolution times.
 * Strictly preserves null values as gaps without converting them to zero or interpolating.
 *
 * @param {object} props
 * @param {Array<object> | object | null} props.data - Raw backend response or array of weekly points
 * @param {number} [props.weeks=12] - Lookback window in weeks
 * @param {string} [props.className]
 */
export const CycleTimeTrendChart = ({
  data = null,
  weeks = 12,
  className = '',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Normalize raw backend payload: { data: [ { week_start, p50_hours, p90_hours, avg_hours, is_partial } ] }
  const items = useMemo(() => {
    if (!data) return [];
    const rawList = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
      ? data
      : [];

    return rawList.map((item, idx) => {
      const p50 = item.p50_hours != null ? Number(item.p50_hours) : null;
      const p90 = item.p90_hours != null ? Number(item.p90_hours) : null;
      const avg = item.avg_hours != null ? Number(item.avg_hours) : null;
      const isPartial = Boolean(item.is_partial);
      const label = item.week_start
        ? formatWeekStart(item.week_start)
        : (item.week || `W${idx + 1}`);

      return {
        id: item.week_start || `cycle-${idx}`,
        weekStart: item.week_start,
        label,
        p50,
        p90,
        avg,
        isPartial,
      };
    });
  }, [data]);

  // Extract all valid, non-null numeric values to compute dynamic scaling
  const allValues = useMemo(() => {
    const vals = [];
    for (const item of items) {
      if (item.p50 != null) vals.push(item.p50);
      if (item.p90 != null) vals.push(item.p90);
      if (item.avg != null) vals.push(item.avg);
    }
    return vals;
  }, [items]);

  const maxVal = useMemo(() => {
    if (allValues.length === 0) return 10;
    const peak = Math.max(...allValues);
    return Math.ceil(Math.max(10, peak * 1.15));
  }, [allValues]);

  const yTicks = useMemo(() => {
    const t4 = maxVal;
    const t3 = Math.round(maxVal * 0.75);
    const t2 = Math.round(maxVal * 0.5);
    const t1 = Math.round(maxVal * 0.25);
    return [t4, t3, t2, t1].filter((v, i, a) => a.indexOf(v) === i && v > 0);
  }, [maxVal]);

  // SVG coordinate dimensions
  const svgWidth = 680;
  const svgHeight = 240;
  const marginLeft = 42;
  const marginRight = 24;
  const marginTop = 20;
  const marginBottom = 40;

  const chartWidth = svgWidth - marginLeft - marginRight;
  const chartHeight = svgHeight - marginTop - marginBottom;

  const getY = useCallback(
    (val) => {
      if (val === null || isNaN(val)) return null;
      return marginTop + chartHeight - (val / maxVal) * chartHeight;
    },
    [chartHeight, marginTop, maxVal],
  );

  const slotWidth = items.length > 0 ? chartWidth / items.length : chartWidth;

  // Build coordinate points for lines (Y is null when metric is missing)
  const p90Points = useMemo(() => {
    return items.map((item, idx) => ({
      x: marginLeft + idx * slotWidth + slotWidth / 2,
      y: getY(item.p90),
      val: item.p90,
      label: item.label,
      isPartial: item.isPartial,
    }));
  }, [items, marginLeft, slotWidth, getY]);

  const p50Points = useMemo(() => {
    return items.map((item, idx) => ({
      x: marginLeft + idx * slotWidth + slotWidth / 2,
      y: getY(item.p50),
      val: item.p50,
      label: item.label,
      isPartial: item.isPartial,
    }));
  }, [items, marginLeft, slotWidth, getY]);

  const avgPoints = useMemo(() => {
    return items.map((item, idx) => ({
      x: marginLeft + idx * slotWidth + slotWidth / 2,
      y: getY(item.avg),
      val: item.avg,
      label: item.label,
      isPartial: item.isPartial,
    }));
  }, [items, marginLeft, slotWidth, getY]);

  // Generate SVG path 'd' strings with gaps for null periods
  const p90PathD = useMemo(() => buildDiscontinuousPath(p90Points), [p90Points]);
  const p50PathD = useMemo(() => buildDiscontinuousPath(p50Points), [p50Points]);
  const avgPathD = useMemo(() => buildDiscontinuousPath(avgPoints), [avgPoints]);

  // Find latest complete week metrics for footer summary
  const latestComplete = useMemo(() => {
    const complete = items.filter((i) => !i.isPartial && (i.p50 != null || i.p90 != null));
    return complete.length > 0 ? complete[complete.length - 1] : items[items.length - 1] || null;
  }, [items]);

  const hoveredItem = hoveredIdx !== null ? items[hoveredIdx] : null;

  return (
    <div
      className={`${styles.container} ${className}`}
      role="region"
      aria-label="Cycle time trend and percentile distribution chart"
    >
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.titleRow}>
            <span className={styles.dot} aria-hidden="true" />
            <h2 className={styles.title}>Cycle time trend &amp; percentiles</h2>
          </div>
          <p className={styles.subtitle}>
            Weekly pull request resolution duration (P50 typical, P90 longer-running, and average) over {weeks} weeks.
          </p>
        </div>

        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={styles.legendDotP50} aria-hidden="true" />
            <span>P50 Typical</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDotP90} aria-hidden="true" />
            <span>P90 Long-running</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendLineAvg} aria-hidden="true" />
            <span>Average</span>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div style={{ padding: 'var(--space-6) var(--space-4)' }}>
          <EmptyState
            title="No cycle time trend data available"
            description="No merged pull request resolution cycles were recorded for the selected window."
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
              aria-label={`Cycle time trend chart across ${items.length} weeks.`}
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
                      {tick}h
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

              {/* Hover slot column highlights */}
              {items.map((item, idx) => {
                const x = marginLeft + idx * slotWidth;
                const isHovered = hoveredIdx === idx;
                const p50Text = item.p50 != null ? `${item.p50.toFixed(1)}h` : 'No data';
                const p90Text = item.p90 != null ? `${item.p90.toFixed(1)}h` : 'No data';
                const avgText = item.avg != null ? `${item.avg.toFixed(1)}h` : 'No data';
                const partialText = item.isPartial ? ' (Partial week)' : '';

                return (
                  <g
                    key={item.id}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <rect
                      x={x}
                      y={marginTop}
                      width={slotWidth}
                      height={chartHeight}
                      className={isHovered ? styles.hoverColumn : undefined}
                      fill={isHovered ? undefined : 'transparent'}
                    >
                      <title>{`${item.label}${partialText}: P50: ${p50Text}, P90: ${p90Text}, Avg: ${avgText}`}</title>
                    </rect>

                    {isHovered && (
                      <line
                        x1={x + slotWidth / 2}
                        y1={marginTop}
                        x2={x + slotWidth / 2}
                        y2={marginTop + chartHeight}
                        className={styles.hoverLine}
                      />
                    )}

                    {/* X-axis Week Label */}
                    <text
                      x={x + slotWidth / 2}
                      y={marginTop + chartHeight + 18}
                      className={
                        item.isPartial
                          ? `${styles.xLabel} ${styles.xLabelPartial}`
                          : styles.xLabel
                      }
                    >
                      {item.label}
                    </text>

                    {/* Subtle badge for partial week */}
                    {item.isPartial && (
                      <text
                        x={x + slotWidth / 2}
                        y={marginTop + chartHeight + 30}
                        className={styles.partialBadge}
                      >
                        PARTIAL
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Trend Lines (discontinuous across null periods) */}
              {p90PathD && <path d={p90PathD} className={styles.p90Line} />}
              {avgPathD && <path d={avgPathD} className={styles.avgLine} />}
              {p50PathD && <path d={p50PathD} className={styles.p50Line} />}

              {/* Average Dots (only rendered when val !== null) */}
              {avgPoints.map((pt, idx) => {
                if (pt.y === null) return null;
                const isHovered = hoveredIdx === idx;
                return (
                  <circle
                    key={`avg-${idx}`}
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 4 : 2.5}
                    className={`${styles.avgDot} ${isHovered ? styles.dotHovered : ''}`}
                  >
                    <title>{`${pt.label} Average: ${pt.val.toFixed(1)}h`}</title>
                  </circle>
                );
              })}

              {/* P90 Dots (only rendered when val !== null) */}
              {p90Points.map((pt, idx) => {
                if (pt.y === null) return null;
                const isHovered = hoveredIdx === idx;
                return (
                  <circle
                    key={`p90-${idx}`}
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 5 : 3.5}
                    className={`${styles.p90Dot} ${isHovered ? styles.dotHovered : ''}`}
                  >
                    <title>{`${pt.label} P90: ${pt.val.toFixed(1)}h`}</title>
                  </circle>
                );
              })}

              {/* P50 Dots (only rendered when val !== null) */}
              {p50Points.map((pt, idx) => {
                if (pt.y === null) return null;
                const isHovered = hoveredIdx === idx;
                return (
                  <circle
                    key={`p50-${idx}`}
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 5 : 3.5}
                    className={`${styles.p50Dot} ${isHovered ? styles.dotHovered : ''}`}
                  >
                    <title>{`${pt.label} P50: ${pt.val.toFixed(1)}h`}</title>
                  </circle>
                );
              })}
            </svg>
          </div>

          <div className={styles.footerBar}>
            <div className={styles.footerLeft}>
              <span className={styles.footerLabel}>
                {hoveredItem ? `INSPECTING ${hoveredItem.label}:` : 'LATEST WEEK CYCLE TIME:'}
              </span>
              <div className={styles.footerMetrics}>
                <span className={styles.footerMetricItem}>
                  <strong style={{ color: 'var(--palette-mint)' }}>
                    {hoveredItem
                      ? hoveredItem.p50 != null ? `${hoveredItem.p50.toFixed(1)}h` : '—'
                      : latestComplete?.p50 != null ? `${latestComplete.p50.toFixed(1)}h` : '—'}
                  </strong>{' '}
                  <span style={{ color: 'var(--color-text-muted)' }}>P50</span>
                </span>
                <span style={{ color: 'var(--color-border)' }}>•</span>
                <span className={styles.footerMetricItem}>
                  <strong style={{ color: 'var(--palette-coral)' }}>
                    {hoveredItem
                      ? hoveredItem.p90 != null ? `${hoveredItem.p90.toFixed(1)}h` : '—'
                      : latestComplete?.p90 != null ? `${latestComplete.p90.toFixed(1)}h` : '—'}
                  </strong>{' '}
                  <span style={{ color: 'var(--color-text-muted)' }}>P90</span>
                </span>
                <span style={{ color: 'var(--color-border)' }}>•</span>
                <span className={styles.footerMetricItem}>
                  <strong style={{ color: 'var(--palette-gold)' }}>
                    {hoveredItem
                      ? hoveredItem.avg != null ? `${hoveredItem.avg.toFixed(1)}h` : '—'
                      : latestComplete?.avg != null ? `${latestComplete.avg.toFixed(1)}h` : '—'}
                  </strong>{' '}
                  <span style={{ color: 'var(--color-text-muted)' }}>AVG</span>
                </span>
              </div>
            </div>
            <span className={styles.footerRight}>
              {latestComplete?.isPartial ? 'LATEST WEEK PARTIAL (IN PROGRESS) • ' : ''}
              UTC NORMALIZED
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default CycleTimeTrendChart;
