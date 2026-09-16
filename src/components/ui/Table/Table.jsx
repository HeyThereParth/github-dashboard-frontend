import { forwardRef } from 'react';
import styles from './Table.module.css';

export const Table = forwardRef(({ children, className = '', containerClassName = '', ...props }, ref) => (
  <div className={`${styles.container} ${containerClassName}`}>
    <table ref={ref} className={`${styles.table} ${className}`} {...props}>
      {children}
    </table>
  </div>
));

Table.displayName = 'Table';

export const TableHeader = forwardRef(({ children, className = '', ...props }, ref) => (
  <thead ref={ref} className={`${styles.thead} ${className}`} {...props}>
    {children}
  </thead>
));

TableHeader.displayName = 'TableHeader';

export const TableBody = forwardRef(({ children, className = '', ...props }, ref) => (
  <tbody ref={ref} className={`${styles.tbody} ${className}`} {...props}>
    {children}
  </tbody>
));

TableBody.displayName = 'TableBody';

export const TableRow = forwardRef(({ children, className = '', ...props }, ref) => (
  <tr ref={ref} className={className} {...props}>
    {children}
  </tr>
));

TableRow.displayName = 'TableRow';

export const TableHead = forwardRef(({
  children,
  align = 'left',
  className = '',
  ...props
}, ref) => {
  const alignClass = align === 'center' ? styles.alignCenter : align === 'right' ? styles.alignRight : styles.alignLeft;
  return (
    <th ref={ref} className={`${styles.th} ${alignClass} ${className}`} {...props}>
      {children}
    </th>
  );
});

TableHead.displayName = 'TableHead';

export const TableCell = forwardRef(({
  children,
  align = 'left',
  className = '',
  ...props
}, ref) => {
  const alignClass = align === 'center' ? styles.alignCenter : align === 'right' ? styles.alignRight : styles.alignLeft;
  return (
    <td ref={ref} className={`${styles.td} ${alignClass} ${className}`} {...props}>
      {children}
    </td>
  );
});

TableCell.displayName = 'TableCell';

export const TableFooter = forwardRef(({ children, className = '', ...props }, ref) => (
  <tfoot ref={ref} className={`${styles.tfoot} ${className}`} {...props}>
    {children}
  </tfoot>
));

TableFooter.displayName = 'TableFooter';

export default Table;
