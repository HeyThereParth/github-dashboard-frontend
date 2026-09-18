import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../services/auth';
import { useAuth } from './useAuth';

/**
 * Hook to query backend current user details from GET /api/v1/me.
 * Only enabled when user is authenticated with Supabase.
 */
export const useCurrentUser = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['me'],
    queryFn: getCurrentUser,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
};

export default useCurrentUser;
