import { EmptyState } from '@/components/ui/EmptyState';
import styles from './AnalyticsChartContainer.module.css';

/**
 * Standard container and visual foundation for Recharts analytics charts.
 *
 * @param {object} props
 * @param {string} props.title - Chart section title
 * @param {string} [props.subtitle] - Explanatory subtitle
 * @param {string} [props.dotColor] - Leading status dot color
 * @param {React.ReactNode} [props.legend] - Legend component or nodes
 * @param {React.ReactNode} [props.footerLeft] - Footer left side summary
 * @param {React.ReactNode} [props.footerRight] - Footer right side metadata
 * @param {boolean} [props.isEmpty=false] - Whether data is empty
 * @param {string} [props.emptyTitle] - Title for empty state
 * @param {string} [props.emptyDescription] - Description for empty state
 * @param {React.ReactNode} props.children - Chart body (e.g. ResponsiveContainer)
 * @param {string} [props.className]
 * @param {number | string} [props.height] - Optional body height override
 */
export const AnalyticsChartContainer = ({
  title,
  subtitle,
  dotColor,
  legend,
  footerLeft,
  footerRight,
  isEmpty = false,
  emptyTitle = 'No data available',
  emptyDescription = 'No records found for the selected window.',
  children,
  className = '',
  height,
}) => {
  return (
    <div
      className={`${styles.container} ${className}`}
      role="region"
      aria-label={title}
    >
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.titleRow}>
            <span
              className={styles.dot}
              style={dotColor ? { backgroundColor: dotColor } : undefined}
              aria-hidden="true"
            />
            <h2 className={styles.title}>{title}</h2>
          </div>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>

        {legend && <div className={styles.legend}>{legend}</div>}
      </div>

      {isEmpty ? (
        <div className={styles.emptyWrapper}>
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </div>
      ) : (
        <div
          className={styles.chartBody}
          style={height ? { height, minHeight: height } : undefined}
        >
          {children}
        </div>
      )}

      {(footerLeft || footerRight) && (
        <div className={styles.footerBar}>
          <div className={styles.footerLeft}>{footerLeft}</div>
          {footerRight && <div className={styles.footerRight}>{footerRight}</div>}
        </div>
      )}
    </div>
  );
};

export default AnalyticsChartContainer;
