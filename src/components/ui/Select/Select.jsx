import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './Select.module.css';

export const Select = forwardRef(({
  options = [],
  value,
  onChange,
  size = 'md',
  disabled = false,
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <div className={`${styles.container} ${styles[size] || styles.md} ${disabled ? styles.disabled : ''} ${className}`}>
      <select
        ref={ref}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={styles.select}
        {...props}
      >
        {options.length > 0
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
      <span className={styles.chevron}>
        <ChevronDown size={14} />
      </span>
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
