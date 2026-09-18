import { useState } from 'react';
import styles from './PullRequestActivityChart.module.css';

const DEFAULT_WEEKS_DATA = [
  { week: 'WK 44 (NOV 04)', opened: 138, merged: 116, velocity: 116, isCurrent: false },
  { week: 'WK 45 (NOV 11)', opened: 125, merged: 134, velocity: 132, isCurrent: false },
  { week: 'WK 46 (NOV 18)', opened: 148, merged: 144, velocity: 144, isCurrent: false },
  { week: 'WK 47 (NOV 25)', opened: 110, merged: 154, velocity: 155, isCurrent: false },
  { week: 'WK 48 (DEC 02)', opened: 135, merged: 166, velocity: 167, isCurrent: false },
  { week: 'WK 49 (CURRENT)', opened: 120, merged: 178, velocity: 178, isCurrent: true },
];

export const PullRequestActivityChart = ({
  data = DEFAULT_WEEKS_DATA,
  className = '',
}) => {
  const [hoveredWeek, setHoveredWeek] = useState(null);

  // SVG coordinate dimensions
  const svgWidth = 620;
  const svgHeight = 240;
  const marginLeft = 38;
  const marginRight = 24;
  const marginTop = 20;
  const marginBottom = 40;

  const chartWidth = svgWidth - marginLeft - marginRight;
  const chartHeight = svgHeight - marginTop - marginBottom;

  const maxVal = 200;
  const yTicks = [200, 150, 100, 50];

  const getY = (val) => marginTop + chartHeight - (val / maxVal) * chartHeight;

  const slotWidth = chartWidth / data.length;
  const barWidth = 14;
  const barGap = 3;

  // Build points path for the velocity trend line
  const velocityPoints = data.map((item, idx) => {
    const groupCenterX = marginLeft + idx * slotWidth + slotWidth / 2;
    // Align with the center of the merged bar
    const x = groupCenterX + (barGap + barWidth) / 2;
    const y = getY(item.velocity);
    return { x, y, isCurrent: item.isCurrent, velocity: item.velocity, week: item.week };
  });

  const linePathD = velocityPoints.reduce(
    (acc, pt, idx) => (idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`),
    '',
  );

  return (
    <div className={`${styles.container} ${className}`} role="region" aria-label="Pull request activity over time chart">
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h2 className={styles.title}>Pull request activity over time</h2>
          <p className={styles.subtitle}>Weekly volume: opened versus merged pull requests</p>
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

      <div className={styles.chartBody}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className={styles.svgChart}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Bar chart showing weekly opened and merged pull requests"
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
          {data.map((item, idx) => {
            const groupCenterX = marginLeft + idx * slotWidth + slotWidth / 2;
            const openedX = groupCenterX - barWidth - barGap / 2;
            const mergedX = groupCenterX + barGap / 2;

            const openedH = (item.opened / maxVal) * chartHeight;
            const openedY = marginTop + chartHeight - openedH;

            const mergedH = (item.merged / maxVal) * chartHeight;
            const mergedY = marginTop + chartHeight - mergedH;

            const isHovered = hoveredWeek === item.week;

            return (
              <g
                key={item.week}
                onMouseEnter={() => setHoveredWeek(item.week)}
                onMouseLeave={() => setHoveredWeek(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Opened Bar */}
                <rect
                  x={openedX}
                  y={openedY}
                  width={barWidth}
                  height={openedH}
                  className={styles.barOpened}
                  opacity={hoveredWeek && !isHovered ? 0.4 : 1}
                >
                  <title>{`${item.week}: ${item.opened} opened`}</title>
                </rect>

                {/* Merged Bar */}
                <rect
                  x={mergedX}
                  y={mergedY}
                  width={barWidth}
                  height={mergedH}
                  className={styles.barMerged}
                  opacity={hoveredWeek && !isHovered ? 0.4 : 1}
                >
                  <title>{`${item.week}: ${item.merged} merged`}</title>
                </rect>

                {/* X-axis Week Label */}
                {item.isCurrent ? (
                  <>
                    <text
                      x={groupCenterX}
                      y={marginTop + chartHeight + 16}
                      className={`${styles.xLabel} ${styles.xLabelCurrent}`}
                    >
                      WK 49
                    </text>
                    <text
                      x={groupCenterX}
                      y={marginTop + chartHeight + 28}
                      className={`${styles.xLabel} ${styles.xLabelCurrent}`}
                    >
                      (CURRENT)
                    </text>
                  </>
                ) : (
                  <text
                    x={groupCenterX}
                    y={marginTop + chartHeight + 22}
                    className={styles.xLabel}
                  >
                    {item.week}
                  </text>
                )}
              </g>
            );
          })}

          {/* Dotted velocity line */}
          <path d={linePathD} className={styles.velocityLine} />

          {/* Velocity points */}
          {velocityPoints.map((pt, idx) => (
            <circle
              key={idx}
              cx={pt.x}
              cy={pt.y}
              r={pt.isCurrent ? 4.5 : 2.5}
              className={pt.isCurrent ? styles.velocityDotCurrent : styles.velocityDot}
            >
              <title>{`${pt.week} Velocity: ${pt.velocity}`}</title>
            </circle>
          ))}
        </svg>
      </div>

      <div className={styles.footerBar}>
        <div className={styles.footerLeft}>
          <span className={styles.footerLabel}>AGGREGATE VELOCITY RATE:</span>
          <span className={styles.footerDelta}>+18.4% EFFICIENCY DELTA</span>
        </div>
        <span className={styles.footerRight}>CALIBRATED TO PRODUCTION TRUNKS &amp; RELEASE CANDIDATES</span>
      </div>
    </div>
  );
};

export default PullRequestActivityChart;
