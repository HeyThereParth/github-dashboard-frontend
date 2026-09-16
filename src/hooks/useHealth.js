import { useQuery } from '@tanstack/react-query';
import { getHealth } from '../services/api/health';

export const useHealth = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
    retry: 1,
  });
};
