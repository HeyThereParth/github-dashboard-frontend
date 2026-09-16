import styles from './Badge.module.css';

export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  pill = false,
  className = '',
  ...props
}) => {
  const classNames = [
    styles.badge,
    styles[variant] || styles.neutral,
    styles[size] || styles.md,
    pill ? styles.pill : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={classNames} {...props}>
      {children}
    </span>
  );
};

export default Badge;
