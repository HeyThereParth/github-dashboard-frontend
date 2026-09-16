import { forwardRef } from 'react';
import styles from './IconButton.module.css';

export const IconButton = forwardRef(({
  icon,
  children,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
  'aria-label': ariaLabel,
  ...props
}, ref) => {
  const classNames = [
    styles.iconButton,
    styles[variant] || styles.ghost,
    styles[size] || styles.md,
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      type={type}
      className={classNames}
      disabled={disabled}
      aria-label={ariaLabel}
      {...props}
    >
      {icon || children}
    </button>
  );
});

IconButton.displayName = 'IconButton';

export default IconButton;
