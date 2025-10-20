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
import { fetchTransactions } from '@/lib';
import { Transaction, ApiError } from '@/types';
import {
    FilterState,
    filterTransactions,
    sortTransactionsByDate,
} from '@/utils';

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
 * Enhanced hook to get filtered and sorted transactions using FilterState
 * @param filterState - Complex filter state from FilterPanel
 * @returns Filtered and sorted transactions with metadata
 */
export const useFilteredTransactions = (filterState?: FilterState) => {
    const { data: transactions, isLoading, error } = useTransactions();

    const filteredTransactions = useMemo(() => {
        if (!transactions || !Array.isArray(transactions)) return [];

        // If no filter state, return all transactions
        if (!filterState) return transactions;

        // Apply complex filtering using the utility functions
        const filtered = filterTransactions(transactions, filterState);

        // Sort by date (newest first)
        return sortTransactionsByDate(filtered);
    }, [transactions, filterState]);

    return {
        transactions: filteredTransactions,
        totalCount: transactions?.length || 0,
        filteredCount: filteredTransactions.length,
        isLoading,
        error,
        hasData: !!transactions,
    };
};
