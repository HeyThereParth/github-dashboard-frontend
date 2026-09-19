import { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  AnalyticsChartContainer,
  AnalyticsTooltip,
  CHART_COLORS,
  CHART_MARGINS,
  Y_AXIS_WIDTH,
  COMMON_AXIS_PROPS,
  COMMON_GRID_PROPS,
  calculateHoursDomain,
} from '@/components/charts';
import { formatWeekStart, formatUtcDateLong } from '@/utils/date';
import styles from './CycleTimeTrendChart.module.css';

/**
 * Cycle time trend chart rendering weekly P50, P90, and average resolution times via Recharts.
 * Strictly preserves null values as gaps (connectNulls={false}) without converting them to zero or interpolating.
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
      const fullDateLabel = item.week_start ? formatUtcDateLong(item.week_start) : label;

      return {
        id: item.week_start || `cycle-${idx}`,
        weekStart: item.week_start,
        label: isPartial ? `${label} *` : label,
        fullDateLabel,
        baseLabel: label,
        p50,
        p90,
        avg,
        isPartial,
      };
    });
  }, [data]);

  // Find latest complete week metrics for footer summary
  const latestComplete = useMemo(() => {
    const complete = items.filter((i) => !i.isPartial && (i.p50 != null || i.p90 != null));
    return complete.length > 0 ? complete[complete.length - 1] : items[items.length - 1] || null;
  }, [items]);

  const maxHours = useMemo(() => {
    let max = 0;
    items.forEach((item) => {
      if (item.p50 != null && item.p50 > max) max = item.p50;
      if (item.p90 != null && item.p90 > max) max = item.p90;
      if (item.avg != null && item.avg > max) max = item.avg;
    });
    return max;
  }, [items]);

  const { domain: yDomain, ticks: yTicks } = useMemo(
    () => calculateHoursDomain(maxHours),
    [maxHours],
  );

  const legend = (
    <>
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
    </>
  );

  const footerLeft = (
    <>
      <span className={styles.footerLabel}>LATEST RECORDED CYCLE TIME:</span>
      <div className={styles.footerMetrics}>
        <span className={styles.footerMetricItem}>
          <strong style={{ color: 'var(--palette-mint)' }}>
            {latestComplete?.p50 != null ? `${latestComplete.p50.toFixed(1)}h` : '—'}
          </strong>{' '}
          <span style={{ color: 'var(--color-text-muted)' }}>P50</span>
        </span>
        <span style={{ color: 'var(--color-border)' }}>•</span>
        <span className={styles.footerMetricItem}>
          <strong style={{ color: 'var(--palette-coral)' }}>
            {latestComplete?.p90 != null ? `${latestComplete.p90.toFixed(1)}h` : '—'}
          </strong>{' '}
          <span style={{ color: 'var(--color-text-muted)' }}>P90</span>
        </span>
        <span style={{ color: 'var(--color-border)' }}>•</span>
        <span className={styles.footerMetricItem}>
          <strong style={{ color: 'var(--palette-gold)' }}>
            {latestComplete?.avg != null ? `${latestComplete.avg.toFixed(1)}h` : '—'}
          </strong>{' '}
          <span style={{ color: 'var(--color-text-muted)' }}>AVG</span>
        </span>
      </div>
    </>
  );

  const footerRight = (
    <span>
      {latestComplete?.isPartial ? '* PARTIAL WEEK IN PROGRESS • ' : ''}
      HOURS TO RESOLUTION (UTC)
    </span>
  );

  // Dynamic interval to prevent cramped labels
  const tickInterval = items.length > 24 ? 3 : items.length > 12 ? 1 : 0;

  return (
    <AnalyticsChartContainer
      title="Cycle time trend & percentiles"
      subtitle={`Weekly pull request resolution duration (P50 typical, P90 longer-running, and average) over ${weeks} weeks.`}
      dotColor={CHART_COLORS.mint}
      legend={legend}
      footerLeft={footerLeft}
      footerRight={footerRight}
      isEmpty={items.length === 0}
      emptyTitle="No cycle time trend data available"
      emptyDescription="No merged pull request resolution cycles were recorded for the selected window."
      className={className}
    >
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <LineChart
          data={items}
          margin={CHART_MARGINS}
        >
          <CartesianGrid {...COMMON_GRID_PROPS} />
          <XAxis
            dataKey="label"
            interval={tickInterval}
            {...COMMON_AXIS_PROPS}
          />
          <YAxis
            width={Y_AXIS_WIDTH}
            domain={yDomain}
            ticks={yTicks}
            tickFormatter={(val) => `${val}h`}
            {...COMMON_AXIS_PROPS}
          />
          <Tooltip
            content={<AnalyticsTooltip titlePrefix="Cycle Time" unit="h" />}
            cursor={{ stroke: CHART_COLORS.crosshair, strokeDasharray: '3 3' }}
          />
          {/* P90 longer-running line */}
          <Line
            type="monotone"
            dataKey="p90"
            name="P90 Long-running"
            stroke={CHART_COLORS.coral}
            strokeWidth={2}
            connectNulls={false}
            dot={{ r: 3, fill: CHART_COLORS.coral, stroke: '#0D1714', strokeWidth: 1.5 }}
            activeDot={{ r: 5, fill: CHART_COLORS.coral, stroke: '#FFFFFF', strokeWidth: 1.5 }}
            animationDuration={350}
          />
          {/* Average line */}
          <Line
            type="monotone"
            dataKey="avg"
            name="Average"
            stroke={CHART_COLORS.gold}
            strokeWidth={1.5}
            strokeDasharray="3 3"
            connectNulls={false}
            dot={{ r: 2.5, fill: CHART_COLORS.gold, stroke: '#0D1714', strokeWidth: 1.5 }}
            activeDot={{ r: 4, fill: CHART_COLORS.gold, stroke: '#FFFFFF', strokeWidth: 1.5 }}
            animationDuration={350}
          />
          {/* P50 typical line */}
          <Line
            type="monotone"
            dataKey="p50"
            name="P50 Typical"
            stroke={CHART_COLORS.mint}
            strokeWidth={2}
            connectNulls={false}
            dot={{ r: 3, fill: CHART_COLORS.mint, stroke: '#0D1714', strokeWidth: 1.5 }}
            activeDot={{ r: 5, fill: CHART_COLORS.mint, stroke: '#FFFFFF', strokeWidth: 1.5 }}
            animationDuration={350}
          />
        </LineChart>
      </ResponsiveContainer>
    </AnalyticsChartContainer>
  );
};

export default CycleTimeTrendChart;
