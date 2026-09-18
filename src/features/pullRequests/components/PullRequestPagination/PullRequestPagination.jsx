import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './PullRequestPagination.module.css';

/**
 * Server-driven pagination controls for pull requests list.
 *
 * @param {object} props
 * @param {number} props.page - Current 1-based page
 * @param {number} props.total - Total number of matching items
 * @param {number} props.perPage - Number of items per page
 * @param {(page: number) => void} props.onPageChange - Page change callback
 * @param {string} [props.className]
 */
export const PullRequestPagination = ({
  page = 1,
  total = 0,
  perPage = 10,
  onPageChange,
  className = '',
}) => {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  const startItem = total === 0 ? 0 : (page - 1) * perPage + 1;
  const endItem = Math.min(page * perPage, total);

  if (total === 0) return null;

  return (
    <nav
      className={`${styles.pagination} ${className}`}
      aria-label="Pull requests pagination"
    >
      <div className={styles.summary}>
        Showing {startItem}–{endItem} of {total} pull requests
      </div>

      <div className={styles.controls}>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<ChevronLeft size={14} />}
          onClick={() => hasPrevious && onPageChange(page - 1)}
          disabled={!hasPrevious}
          aria-label="Previous page"
        >
          Previous
        </Button>

        <span className={styles.pageIndicator} aria-current="page">
          Page {page} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          rightIcon={<ChevronRight size={14} />}
          onClick={() => hasNext && onPageChange(page + 1)}
          disabled={!hasNext}
          aria-label="Next page"
        >
          Next
        </Button>
      </div>
    </nav>
  );
};

export default PullRequestPagination;
