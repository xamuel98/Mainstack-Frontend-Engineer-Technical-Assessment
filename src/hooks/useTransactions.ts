/**
 * @description
 * Custom hook for transactions data fetching
 * Uses React Query for caching and state management
 * @author Sanni Samuel <samuelakintomiwa98@gmail.com>
 * @date 2025-10-17
 * @lastModified 2025-10-17
 * @version 1.0.0
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchTransactions } from '@/lib/api';
import { Transaction, ApiError } from '@/types';

// Query key for transactions data
export const TRANSACTIONS_QUERY_KEY = ['transactions'] as const;

/**
 * Hook to fetch and manage transactions data
 * @returns React Query result with transactions data, loading state, and error handling
 */
export const useTransactions = (): UseQueryResult<Transaction[], ApiError> => {
  return useQuery({
    queryKey: TRANSACTIONS_QUERY_KEY,
    queryFn: fetchTransactions,
  });
};

/**
 * Hook to get filtered and sorted transactions
 * @param filters - Filter options for transactions
 * @returns Filtered and sorted transactions with metadata
 */
export const useFilteredTransactions = (filters?: {
  type?: 'deposit' | 'withdrawal';
  status?: 'successful' | 'pending' | 'failed';
  dateFrom?: string;
  dateTo?: string;
}) => {
  const { data: transactions, isLoading, error } = useTransactions();

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];

    let filtered = [...transactions];

    // Filter by type
    if (filters?.type) {
      filtered = filtered.filter(tx => tx.type === filters.type);
    }

    // Filter by status
    if (filters?.status) {
      filtered = filtered.filter(tx => tx.status === filters.status);
    }

    // Filter by date range
    if (filters?.dateFrom) {
      filtered = filtered.filter(
        tx => new Date(tx.date) >= new Date(filters.dateFrom!)
      );
    }

    if (filters?.dateTo) {
      filtered = filtered.filter(
        tx => new Date(tx.date) <= new Date(filters.dateTo!)
      );
    }

    // Sort by date (newest first)
    filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return filtered;
  }, [transactions, filters]);

  return {
    transactions: filteredTransactions,
    totalCount: transactions?.length || 0,
    filteredCount: filteredTransactions.length,
    isLoading,
    error,
    hasData: !!transactions,
  };
};
