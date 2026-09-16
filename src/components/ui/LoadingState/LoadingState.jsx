import styles from './LoadingState.module.css';

export const LoadingState = ({
  message = 'Loading telemetry...',
  variant = 'spinner', // 'spinner' | 'skeleton'
  rows = 3,
  className = '',
  ...props
}) => {
  if (variant === 'skeleton') {
    return (
      <div className={`${styles.skeletonGroup} ${className}`} role="status" aria-busy="true" {...props}>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className={styles.skeletonLine}
            style={{ width: i === rows - 1 ? '60%' : '100%' }}
          />
        ))}
        <span className="sr-only" style={{ display: 'none' }}>{message}</span>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`} role="status" aria-busy="true" {...props}>
      <div className={styles.spinner} aria-hidden="true" />
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default LoadingState;
