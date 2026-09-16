import styles from './StatusBadge.module.css';

export const StatusBadge = ({
  status = 'neutral', // 'open' | 'merged' | 'closed' | 'draft' | 'neutral'
  showDot = true,
  pill = true,
  children,
  className = '',
  ...props
}) => {
  const normalizedStatus = String(status).toLowerCase();
  const statusClass = styles[normalizedStatus] || styles.neutral;

  return (
    <span
      className={`${styles.statusBadge} ${statusClass} ${pill ? styles.pill : ''} ${className}`}
      {...props}
    >
      {showDot && <span className={styles.dot} aria-hidden="true" />}
      <span>{children || status.toUpperCase()}</span>
    </span>
  );
};

export default StatusBadge;
