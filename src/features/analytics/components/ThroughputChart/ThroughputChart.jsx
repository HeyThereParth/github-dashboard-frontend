import { useMemo } from 'react';
import { Info } from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import {
  AnalyticsChartContainer,
  AnalyticsTooltip,
  CHART_COLORS,
  CHART_MARGINS,
  Y_AXIS_WIDTH,
  COMMON_AXIS_PROPS,
  COMMON_GRID_PROPS,
  calculateCountDomain,
} from '@/components/charts';
import { formatWeekStart, formatUtcDateLong } from '@/utils/date';
import styles from './ThroughputChart.module.css';

/**
 * Weekly PR throughput bar chart rendering merged PR delivery velocity via Recharts.
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
      const fullDateLabel = item.week_start ? formatUtcDateLong(item.week_start) : label;
      const isPartial = Boolean(item.is_partial);
      return {
        id: item.week_start || item.id || `week-${idx}`,
        weekStart: item.week_start,
        count,
        label,
        fullDateLabel,
        isPartial,
      };
    });
  }, [data]);

  const totalMerged = useMemo(
    () => items.reduce((sum, item) => sum + item.count, 0),
    [items],
  );

  const avgWeekly = items.length > 0 ? (totalMerged / items.length).toFixed(1) : '0.0';

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

  // Mark isPeak on items so the custom tooltip displays the Peak badge
  const chartItems = useMemo(() => {
    return items.map((item, idx) => ({
      ...item,
      isPeak: idx === peakIndex && item.count > 0,
    }));
  }, [items, peakIndex]);

  const maxVal = useMemo(
    () => (chartItems.length > 0 ? Math.max(...chartItems.map((i) => i.count)) : 0),
    [chartItems],
  );

  const { domain: yDomain, ticks: yTicks } = useMemo(
    () => calculateCountDomain(maxVal),
    [maxVal],
  );

  const legend = (
    <>
      <div className={styles.legendItem}>
        <span className={styles.legendSquareMerged} aria-hidden="true" />
        <span>Merged PRs</span>
      </div>
      <div className={styles.legendItem}>
        <span className={styles.legendSquarePeak} aria-hidden="true" />
        <span>Peak Output</span>
      </div>
      <div className={styles.legendItem}>
        <span className={styles.legendLineAvg} aria-hidden="true" />
        <span>Avg ({avgWeekly}/wk)</span>
      </div>
    </>
  );

  const footerLeft = (
    <div className={styles.footerInfo}>
      <Info size={13} className={styles.footerIcon} aria-hidden="true" />
      <span>
        {peakIndex >= 0
          ? `Peak velocity occurred in ${chartItems[peakIndex].label} (${chartItems[peakIndex].count} PRs merged).`
          : 'Velocity stable across recent delivery cycles.'}
      </span>
    </div>
  );

  const footerRight = (
    <span>
      TOTAL {totalMerged} MERGED ACROSS {chartItems.length} WEEKS
    </span>
  );

  // Dynamic interval to prevent cramped labels on narrow viewports
  const tickInterval = chartItems.length > 16 ? 2 : 0;

  return (
    <AnalyticsChartContainer
      title="Weekly PR activity & delivery velocity"
      subtitle={`Pull requests merged per release train over the last ${weeks} weeks.`}
      dotColor={CHART_COLORS.gold}
      legend={legend}
      footerLeft={footerLeft}
      footerRight={footerRight}
      isEmpty={chartItems.length === 0}
      emptyTitle="No throughput data available"
      emptyDescription="No weekly throughput records were found for the selected repository window."
      className={className}
    >
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <ComposedChart
          data={chartItems}
          margin={CHART_MARGINS}
          barCategoryGap="20%"
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
            allowDecimals={false}
            {...COMMON_AXIS_PROPS}
          />
          <Tooltip
            content={<AnalyticsTooltip titlePrefix="Throughput" unit=" PRs" />}
            cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
          />

          {/* Average reference line sharing the exact coordinate space */}
          {Number(avgWeekly) > 0 && (
            <ReferenceLine
              y={Number(avgWeekly)}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeDasharray="3 3"
              strokeWidth={1}
            />
          )}

          <Bar
            dataKey="count"
            name="Merged PRs"
            maxBarSize={28}
            isAnimationActive={false}
            shape={(props) => {
              const { x, y, width, height, index, payload } = props;
              const isPeak = index === peakIndex && payload?.count > 0;
              const fill = isPeak ? CHART_COLORS.gold : '#182d23';
              const stroke = isPeak ? CHART_COLORS.gold : 'rgba(255, 255, 255, 0.12)';

              if (height <= 0 || !payload?.count || payload.count <= 0) {
                return null;
              }

              return (
                <g key={`bar-${index}`}>
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={1}
                    rx={2}
                    ry={2}
                  />
                  {isPeak && (
                    <text
                      x={Number(x) + Number(width) / 2}
                      y={Number(y) - 8}
                      fill={CHART_COLORS.gold}
                      textAnchor="middle"
                      fontSize={11}
                      fontWeight={600}
                      fontFamily="var(--font-mono, monospace)"
                    >
                      {`${payload.count} ★`}
                    </text>
                  )}
                </g>
              );
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </AnalyticsChartContainer>
  );
};

export default ThroughputChart;
