import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/authService';

export const useUsers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  hasPremium?: boolean;
}) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: ['users', 'search', query],
    queryFn: () => userService.searchUsers(query),
    enabled: !!query.trim(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useFilterUsersByPremium = (hasPremium: boolean | null) => {
  return useQuery({
    queryKey: ['users', 'filter', hasPremium],
    queryFn: () => userService.filterUsersByPremium(hasPremium),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useGivePremium = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, duration }: { userId: string; duration: '1_month' | '1_year' }) => 
      userService.givePremium(userId, duration),
    onSuccess: () => {
      // Invalidate and refetch users data
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
