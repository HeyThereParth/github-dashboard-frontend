import { forwardRef } from 'react';
import styles from './Card.module.css';

export const Card = forwardRef(({
  children,
  variant = 'default',
  className = '',
  ...props
}, ref) => {
  const classNames = [
    styles.card,
    styles[variant] || styles.default,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classNames} {...props}>
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`${styles.header} ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, as: Component = 'h3', className = '', ...props }) => (
  <Component className={`${styles.title} ${className}`} {...props}>
    {children}
  </Component>
);

export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`${styles.description} ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={`${styles.content} ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`${styles.footer} ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
