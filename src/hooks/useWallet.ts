/**
 * @description
 * Custom hook for wallet data fetching
 * Uses React Query for caching and state management
 * @author Sanni Samuel <samuelakintomiwa98@gmail.com>
 * @date 2025-10-17
 * @lastModified 2025-10-17
 * @version 1.0.0
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchWallet } from '@/lib';
import { Wallet, ApiError } from '@/types';

// Query key for wallet data
export const WALLET_QUERY_KEY = ['wallet'] as const;

/**
 * Hook to fetch and manage wallet data
 * @returns React Query result with wallet data, loading state, and error handling
 */
export const useWallet = (): UseQueryResult<Wallet, ApiError> => {
    return useQuery({
        queryKey: WALLET_QUERY_KEY,
        queryFn: fetchWallet,
    });
};

/**
 * Hook to calculate wallet statistics
 * @returns Computed wallet metrics and percentages
 */
export const useWalletStats = () => {
    const { data: wallet, isLoading, error } = useWallet();

    const stats = {
        // Basic wallet data
        balance: wallet?.balance || 0,
        totalRevenue: wallet?.total_revenue || 0,
        totalPayout: wallet?.total_payout || 0,
        pendingPayout: wallet?.pending_payout || 0,
        ledgerBalance: wallet?.ledger_balance || 0,
    };

    return {
        ...stats,
        isLoading,
        error,
        hasData: !!wallet,
    };
};

/**
 * Hook to check if wallet has sufficient balance
 * @param amount - Amount to check against balance
 * @returns Boolean indicating if balance is sufficient
 */
export const useHasSufficientBalance = (amount: number): boolean => {
    const { data: wallet } = useWallet();

    if (!wallet || amount <= 0) return false;

    const availableBalance = wallet.balance - wallet.pending_payout;
    return availableBalance >= amount;
};
