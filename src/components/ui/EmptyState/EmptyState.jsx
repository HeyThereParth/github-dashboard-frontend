import { Inbox } from 'lucide-react';
import styles from './EmptyState.module.css';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No data available',
  description = 'There are no records found for the current query or filter criteria.',
  action = null,
  className = '',
  ...props
}) => {
  return (
    <div className={`${styles.container} ${className}`} {...props}>
      <div className={styles.iconWrapper}>
        <Icon size={20} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
};

export default EmptyState;
