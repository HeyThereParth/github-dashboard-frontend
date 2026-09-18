import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoadingState } from '@/components/ui/LoadingState';
import styles from './AuthGate.module.css';

/**
 * Route protection gate ensuring user has an active Supabase session before accessing dashboard routes.
 */
export const AuthGate = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingState message="Verifying session credentials..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children ? children : <Outlet />;
};

export default AuthGate;
