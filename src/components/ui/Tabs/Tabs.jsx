import styles from './Tabs.module.css';

export const Tabs = ({
  tabs = [],
  value,
  onChange,
  className = '',
  ...props
}) => {
  return (
    <div role="tablist" className={`${styles.tabList} ${className}`} {...props}>
      {tabs.map((tab) => {
        const isActive = tab.value === value;
        return (
          <button
            key={tab.value}
            role="tab"
            type="button"
            aria-selected={isActive}
            disabled={tab.disabled}
            className={`${styles.tab} ${isActive ? styles.active : ''}`}
            onClick={() => onChange && onChange(tab.value)}
          >
            {tab.dotColor && (
              <span
                className={styles.dot}
                style={{ backgroundColor: tab.dotColor }}
                aria-hidden="true"
              />
            )}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={styles.count}>{tab.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
