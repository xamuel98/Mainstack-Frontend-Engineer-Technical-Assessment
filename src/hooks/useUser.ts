/**
 * @description
 * Custom hook for user data fetching
 * Uses React Query for caching and state management
 * @author Sanni Samuel <samuelakintomiwa98@gmail.com>
 * @date 2025-10-17
 * @lastModified 2025-10-17
 * @version 1.0.0
 */


import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchUser } from '@/lib/api';
import { User, ApiError } from '@/types';

// Query key for user data
export const USER_QUERY_KEY = ['user'] as const;

/**
 * Hook to fetch and manage user data
 * @returns React Query result with user data, loading state, and error handling
 */
export const useUser = (): UseQueryResult<User, ApiError> => {
  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: fetchUser,
  });
};

/**
 * Hook to get user full name
 * @returns Formatted full name or fallback
 */
export const useUserFullName = (): string => {
  const { data: user } = useUser();
  
  if (!user) return 'User';
  
  return `${user.first_name} ${user.last_name}`.trim() || 'User';
};

/**
 * Hook to get user initials for avatar
 * @returns User initials (e.g., "JD" for John Doe)
 */
export const useUserInitials = (): string => {
  const { data: user } = useUser();
  
  if (!user) return 'U';
  
  const firstInitial = user.first_name?.charAt(0)?.toUpperCase() || '';
  const lastInitial = user.last_name?.charAt(0)?.toUpperCase() || '';
  
  return `${firstInitial}${lastInitial}` || 'U';
};