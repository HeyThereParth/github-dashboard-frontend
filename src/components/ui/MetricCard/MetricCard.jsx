import { forwardRef } from 'react';
import styles from './MetricCard.module.css';

export const MetricCard = forwardRef(({
  label,
  value,
  suffix = null,
  subtext = null,
  badge = null,
  icon = null,
  segments = null,
  progress = null,
  progressColor = 'mint',
  className = '',
  children,
  ...props
}, ref) => {
  // Calculate segments if provided or if single progress percentage provided
  let renderedMeter = null;
  if (Array.isArray(segments) && segments.length > 0) {
    const total = segments.reduce((acc, s) => acc + (Number(s.value) || 0), 0) || 1;
    renderedMeter = (
      <div className={styles.meterTrack} aria-hidden="true">
        {segments.map((segment, idx) => {
          const pct = Math.max(0, Math.min(100, ((Number(segment.value) || 0) / total) * 100));
          const colorClass = segment.color === 'coral' 
            ? styles.meterCoral 
            : segment.color === 'gold' 
            ? styles.meterGold 
            : segment.color === 'neutral'
            ? styles.meterNeutral
            : styles.meterMint;
          return (
            <div
              key={idx}
              className={`${styles.meterSegment} ${colorClass}`}
              style={{ width: `${pct}%` }}
              title={segment.label ? `${segment.label}: ${segment.value}` : undefined}
            />
          );
        })}
      </div>
    );
  } else if (typeof progress === 'number') {
    const pct = Math.max(0, Math.min(100, progress));
    const colorClass = progressColor === 'coral'
      ? styles.meterCoral
      : progressColor === 'gold'
      ? styles.meterGold
      : progressColor === 'neutral'
      ? styles.meterNeutral
      : styles.meterMint;
    renderedMeter = (
      <div className={styles.meterTrack} aria-hidden="true">
        <div className={`${styles.meterSegment} ${colorClass}`} style={{ width: `${pct}%` }} />
      </div>
    );
  }

  return (
    <div ref={ref} className={`${styles.metricCard} ${className}`} {...props}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        <div className={styles.badgeContainer}>
          {badge}
          {icon}
        </div>
      </div>

      <div className={styles.valueContainer}>
        <span className={styles.value}>{value}</span>
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>

      {(subtext || children) && (
        <div className={styles.supportingInfo}>
          {subtext}
          {children}
        </div>
      )}

      {renderedMeter}
    </div>
  );
});

MetricCard.displayName = 'MetricCard';

export default MetricCard;
