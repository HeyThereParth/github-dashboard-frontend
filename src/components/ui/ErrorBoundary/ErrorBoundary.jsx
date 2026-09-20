import { Component } from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { AlertTriangle, RefreshCw, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './ErrorBoundary.module.css';

/**
 * Visual presentation for application runtime errors.
 */
export const ErrorFallbackView = ({ onRetry, onNavigateHome, message }) => {
  return (
    <div className={styles.container} role="alert">
      <div className={styles.card}>
        <div className={styles.iconWrapper} aria-hidden="true">
          <AlertTriangle size={22} />
        </div>
        <span className={styles.badge}>System Diagnostic • Fault Intercepted</span>
        <h2 className={styles.title}>Application encountered an error</h2>
        <p className={styles.message}>
          {message ||
            'An unexpected runtime condition occurred. Application state has been protected.'}
        </p>
        <div className={styles.actions}>
          {onRetry && (
            <Button
              variant="outline"
              size="md"
              onClick={onRetry}
              leftIcon={<RefreshCw size={15} />}
            >
              Try Again
            </Button>
          )}
          <Button
            variant="primary"
            size="md"
            onClick={onNavigateHome}
            leftIcon={<LayoutDashboard size={15} />}
          >
            Return to Overview
          </Button>
        </div>
      </div>
    </div>
  );
};

/**
 * Route-level error boundary used as `errorElement` in React Router.
 */
export const RouteErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const handleRetry = () => {
    // Navigate 0 re-executes current route loader / component
    navigate(0);
  };

  const handleNavigateHome = () => {
    navigate('/app/overview', { replace: true });
  };

  const displayMessage =
    error?.status === 404
      ? 'The requested telemetry route does not exist.'
      : 'An unexpected runtime error occurred while loading this view.';

  return (
    <ErrorFallbackView
      onRetry={handleRetry}
      onNavigateHome={handleNavigateHome}
      message={displayMessage}
    />
  );
};

/**
 * Component-level React Error Boundary to catch render phase errors
 * without unmounting parent layouts.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Avoid leaking stack traces in user-facing UI; can log to diagnostic console
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleNavigateHome = () => {
    this.setState({ hasError: false, error: null });
    if (window.location.pathname !== '/app/overview') {
      window.location.assign('/app/overview');
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallbackView
          onRetry={this.handleReset}
          onNavigateHome={this.handleNavigateHome}
          message="An unexpected error occurred while rendering this section."
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
