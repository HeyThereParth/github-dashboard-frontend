import styles from './AnalyticsTooltip.module.css';

/**
 * Custom polished tooltip component for Recharts charts.
 * Adheres strictly to the GitHub Intelligence Dark Mineral design language.
 *
 * @param {object} props
 * @param {boolean} [props.active] - Whether tooltip is active
 * @param {Array<object>} [props.payload] - Recharts tooltip payload items
 * @param {string} [props.label] - X-axis tick label
 * @param {string} [props.unit=''] - Metric unit suffix (e.g., 'h', ' PRs')
 * @param {string} [props.titlePrefix=''] - Optional title prefix
 */
export const AnalyticsTooltip = ({
  active,
  payload,
  label,
  unit = '',
  titlePrefix = '',
}) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  // Extract is_partial, isPeak or isCurrent flag from data point if available
  const dataPoint = payload[0]?.payload;
  const isPartial = Boolean(dataPoint?.is_partial || dataPoint?.isPartial);
  const isPeak = Boolean(dataPoint?.isPeak);
  const displayTitle =
    dataPoint?.fullDateLabel ||
    label ||
    dataPoint?.label ||
    dataPoint?.week ||
    '';

  return (
    <div className={styles.tooltip} role="tooltip">
      <div className={styles.header}>
        <span className={styles.title}>
          {titlePrefix ? `${titlePrefix} • ` : ''}
          {displayTitle}
        </span>
        <div style={{ display: 'inline-flex', gap: '4px' }}>
          {isPeak && <span className={styles.peakBadge}>Peak</span>}
          {isPartial && <span className={styles.partialBadge}>Partial</span>}
        </div>
      </div>

      <div className={styles.seriesList}>
        {payload.map((entry) => {
          const isNull = entry.value === null || entry.value === undefined;
          const color = entry.color || entry.stroke || entry.fill || 'var(--palette-gold)';
          const name = entry.name || entry.dataKey;

          let displayVal = 'No data';
          if (!isNull) {
            if (typeof entry.value === 'number') {
              displayVal = Number.isInteger(entry.value)
                ? `${entry.value}${unit}`
                : `${entry.value.toFixed(1)}${unit}`;
            } else {
              displayVal = `${entry.value}${unit}`;
            }
          }

          return (
            <div key={entry.dataKey || entry.name} className={styles.seriesItem}>
              <span className={styles.seriesLeft}>
                <span
                  className={styles.seriesDot}
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
                <span>{name}</span>
              </span>
              <span
                className={isNull ? styles.seriesValueNull : styles.seriesValue}
              >
                {displayVal}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnalyticsTooltip;
