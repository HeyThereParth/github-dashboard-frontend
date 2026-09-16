import { useState } from 'react';
import styles from './Tooltip.module.css';

export const Tooltip = ({
  content,
  children,
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);

  if (!content) return children;

  return (
    <div
      className={`${styles.wrapper} ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      {...props}
    >
      {children}
      <div
        role="tooltip"
        className={`${styles.tooltip} ${isVisible ? styles.visible : ''}`}
      >
        {content}
      </div>
    </div>
  );
};

export default Tooltip;
