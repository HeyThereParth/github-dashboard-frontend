import { Calendar } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import styles from './AnalyticsWindowSelector.module.css';

const WINDOW_OPTIONS = [
  { value: '7', days: 7, weeks: 2, label: 'Last 7 days' },
  { value: '30', days: 30, weeks: 8, label: 'Last 30 days' },
  { value: '90', days: 90, weeks: 12, label: 'Last 90 days' },
];

/**
 * Date window selector that drives `days` (overview/authors) and `weeks` (throughput) query parameters.
 *
 * @param {object} props
 * @param {number} props.days - Active days window (e.g. 7, 30, 90)
 * @param {({ days: number, weeks: number }) => void} props.onChange - Selection change callback
 * @param {string} [props.className]
 */
export const AnalyticsWindowSelector = ({
  days = 30,
  onChange,
  className = '',
}) => {
  const currentVal = String(days);

  const handleChange = (e) => {
    const selected = WINDOW_OPTIONS.find((opt) => opt.value === e.target.value);
    if (selected && onChange) {
      onChange({ days: selected.days, weeks: selected.weeks });
    }
  };

  const selectOptions = WINDOW_OPTIONS.map((opt) => ({
    value: opt.value,
    label: opt.label,
  }));

  return (
    <div className={`${styles.container} ${className}`}>
      <span className={styles.label} aria-hidden="true">
        <Calendar size={14} />
        <span>Window:</span>
      </span>
      <div className={styles.selectWrapper}>
        <Select
          size="sm"
          value={currentVal}
          onChange={handleChange}
          options={selectOptions}
          aria-label="Select analytics date window"
        />
      </div>
    </div>
  );
};

export default AnalyticsWindowSelector;
