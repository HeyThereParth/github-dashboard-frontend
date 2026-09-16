import { forwardRef, useState } from 'react';
import styles from './Input.module.css';

export const Input = forwardRef(({
  size = 'md',
  leftIcon = null,
  rightIcon = null,
  error = false,
  disabled = false,
  className = '',
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const containerClasses = [
    styles.container,
    styles[size] || styles.md,
    isFocused ? styles.focused : '',
    error ? styles.hasError : '',
    disabled ? styles.disabled : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {leftIcon && <span className={`${styles.iconSlot} ${styles.leftIconSlot}`}>{leftIcon}</span>}
      <input
        ref={ref}
        className={styles.input}
        disabled={disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {rightIcon && <span className={`${styles.iconSlot} ${styles.rightIconSlot}`}>{rightIcon}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
