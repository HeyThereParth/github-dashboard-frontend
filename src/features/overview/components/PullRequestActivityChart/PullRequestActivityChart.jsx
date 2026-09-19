import { useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
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
  calculateCountDomain,
} from '@/components/charts';
import { formatWeekStart, formatUtcDateLong } from '@/utils/date';
import styles from './PullRequestActivityChart.module.css';

/**
 * Pull request activity chart rendering daily or weekly opened vs merged volumes via Recharts.
 *
 * @param {object} props
 * @param {Array<object> | object | null} props.data - Raw backend activity data or items array
 * @param {number} [props.days=30] - Lookback window in days
 * @param {string} [props.repositoryName] - Optional active repository name for context
 * @param {string} [props.title] - Chart title
 * @param {string} [props.subtitle] - Chart subtitle
 * @param {string} [props.className]
 */
export const PullRequestActivityChart = ({
  data = null,
  days = 30,
  repositoryName = '',
  title = 'Pull request activity over time',
  subtitle = null,
  className = '',
}) => {
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
      const label = item.day
        ? formatWeekStart(item.day)
        : (item.week || `D${idx + 1}`);
      const fullDateLabel = item.day ? formatUtcDateLong(item.day) : label;
      const isCurrent = Boolean(item.isCurrent || item.is_partial);
      return {
        id: item.day || item.week || `activity-${idx}`,
        label,
        fullDateLabel,
        opened,
        merged,
        isCurrent,
        isPartial: isCurrent,
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

  const maxVal = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.max(...items.map((i) => Math.max(i.opened, i.merged)));
  }, [items]);

  const { domain: yDomain, ticks: yTicks } = useMemo(
    () => calculateCountDomain(maxVal),
    [maxVal],
  );

  const mergeRate =
    totalOpened > 0
      ? `${((totalMerged / totalOpened) * 100).toFixed(1)}%`
      : totalMerged > 0
      ? '100%'
      : '0.0%';

  const legend = (
    <>
      <div className={styles.legendItem}>
        <span className={styles.legendSquareMerged} aria-hidden="true" />
        <span>Merged</span>
      </div>
      <div className={styles.legendItem}>
        <span className={styles.legendSquareOpened} aria-hidden="true" />
        <span>Opened</span>
      </div>
    </>
  );

  const footerLeft = (
    <>
      <span className={styles.footerLabel}>TOTAL WINDOW ACTIVITY:</span>
      <span className={styles.footerDelta}>
        {totalOpened} OPENED • {totalMerged} MERGED
      </span>
    </>
  );

  const footerRight = (
    <span>MERGE EFFICIENCY: {mergeRate} • UTC CALIBRATED</span>
  );

  // Dynamic interval to prevent cramped labels when inspecting 30d or 90d
  const tickInterval = items.length > 35 ? 5 : items.length > 18 ? 2 : 0;

  const resolvedSubtitle =
    subtitle ||
    `Volume of opened versus merged pull requests over the last ${days} days${
      repositoryName ? ` for ${repositoryName}` : ''
    }.`;

  return (
    <AnalyticsChartContainer
      title={title}
      subtitle={resolvedSubtitle}
      dotColor={CHART_COLORS.gold}
      legend={legend}
      footerLeft={footerLeft}
      footerRight={footerRight}
      isEmpty={items.length === 0}
      emptyTitle="No pull request activity available"
      emptyDescription="No pull request events were recorded for the selected window."
      className={className}
    >
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <ComposedChart
          data={items}
          margin={CHART_MARGINS}
          barGap={2}
          barCategoryGap="25%"
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
            content={<AnalyticsTooltip titlePrefix="Activity" unit=" PRs" />}
            cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
          />
          <Bar
            dataKey="opened"
            name="Opened"
            fill="#182d23"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth={1}
            radius={[2, 2, 0, 0]}
            maxBarSize={16}
            animationDuration={350}
          />
          <Bar
            dataKey="merged"
            name="Merged"
            fill={CHART_COLORS.gold}
            radius={[2, 2, 0, 0]}
            maxBarSize={16}
            animationDuration={350}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </AnalyticsChartContainer>
  );
};

export default PullRequestActivityChart;
