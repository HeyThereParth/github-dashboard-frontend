import { forwardRef } from 'react';
import styles from './Button.module.css';

export const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon = null,
  rightIcon = null,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}, ref) => {
  const classNames = [
    styles.button,
    styles[variant] || styles.primary,
    styles[size] || styles.md,
    fullWidth ? styles.fullWidth : '',
    disabled ? styles.disabled : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      type={type}
      className={classNames}
      disabled={disabled}
      {...props}
    >
      {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
