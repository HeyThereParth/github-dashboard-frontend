const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/**
 * Parse an ISO date input, ensuring naive UTC strings (e.g. "2026-09-14T00:00:00")
 * are correctly normalized by appending 'Z' before JavaScript Date parsing.
 *
 * @param {string | Date | null | undefined} dateInput
 * @returns {Date | null}
 */
export const parseUtcDate = (dateInput) => {
  if (!dateInput) return null;
  if (dateInput instanceof Date) {
    return isNaN(dateInput.getTime()) ? null : dateInput;
  }
  if (typeof dateInput === 'string') {
    const trimmed = dateInput.trim();
    if (!trimmed) return null;
    // Check for naive ISO datetime string without timezone (e.g. 2026-09-14T00:00:00)
    const isNaiveIso = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?$/.test(trimmed);
    const normalized = isNaiveIso ? `${trimmed}Z` : trimmed;
    const date = new Date(normalized);
    return isNaN(date.getTime()) ? null : date;
  }
  const date = new Date(dateInput);
  return isNaN(date.getTime()) ? null : date;
};

/**
 * Format a week_start or day UTC string into a short label (e.g. "Sep 14").
 * Strictly uses UTC getters to prevent browser timezone shifts.
 *
 * @param {string | Date | null | undefined} weekStartInput
 * @returns {string}
 */
export const formatWeekStart = (weekStartInput) => {
  const date = parseUtcDate(weekStartInput);
  if (!date) return String(weekStartInput || '');
  const month = MONTH_NAMES[date.getUTCMonth()];
  const day = date.getUTCDate();
  return `${month} ${day}`;
};

/**
 * Format an ISO UTC string into a long date label (e.g. "Sep 14, 2026").
 * Strictly uses UTC getters to prevent browser timezone shifts.
 *
 * @param {string | Date | null | undefined} dateInput
 * @returns {string}
 */
export const formatUtcDateLong = (dateInput) => {
  const date = parseUtcDate(dateInput);
  if (!date) return String(dateInput || '');
  const month = MONTH_NAMES[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  return `${month} ${day}, ${year}`;
};

/**
 * Format an ISO date string into a clean relative time label (e.g., "42s ago", "12m ago", "3h ago", "2d ago").
 * If the date is invalid or missing, returns a fallback string.
 *
 * @param {string | Date | null | undefined} dateInput
 * @returns {string}
 */
export const formatRelativeTime = (dateInput) => {
  const date = parseUtcDate(dateInput);
  if (!date) return '';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));

  if (diffSec < 45) {
    return `${diffSec}s ago`;
  }
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return `${diffMin}m ago`;
  }
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) {
    return `${diffDays}d ago`;
  }
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `${diffMonths}mo ago`;
  }
  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears}y ago`;
};

export default {
  parseUtcDate,
  formatWeekStart,
  formatUtcDateLong,
  formatRelativeTime,
};

