import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from '../Button';
import styles from './ErrorState.module.css';

export const ErrorState = ({
  icon: Icon = AlertTriangle,
  title = 'Failed to load telemetry data',
  message = 'An unexpected error occurred while communicating with the service.',
  onRetry = null,
  retryLabel = 'Retry Request',
  className = '',
  ...props
}) => {
  return (
    <div className={`${styles.container} ${className}`} role="alert" {...props}>
      <div className={styles.iconWrapper}>
        <Icon size={20} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      {message && <p className={styles.message}>{message}</p>}
      {onRetry && (
        <div className={styles.action}>
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            leftIcon={<RefreshCw size={14} />}
          >
            {retryLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ErrorState;
