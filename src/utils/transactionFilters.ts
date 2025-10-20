/**
 * @description
 * Transaction Filtering Utilities
 * Contains logic for mapping filter options to actual transaction data
 * @author Sanni Samuel <samuelakintomiwa98@gmail.com>
 * @date 2025-10-19
 * @lastModified 2025-10-19
 * @version 1.0.0
 */

import { Transaction } from '@/types';

export interface FilterState {
    dateRange: string;
    dateFrom: Date | null;
    dateTo: Date | null;
    transactionType: string[];
    transactionStatus: string[];
}

/**
 * Maps filter transaction type options to actual transaction data
 * @param transaction - The transaction to check
 * @param filterTypes - Array of filter type values
 * @returns boolean indicating if transaction matches any of the filter types
 */
export const matchesTransactionType = (
    transaction: Transaction,
    filterTypes: string[]
): boolean => {
    if (!filterTypes || filterTypes.length === 0) return true;

    return filterTypes.some(filterType => {
        switch (filterType) {
            case 'store-transactions':
                // Store transactions are deposits with product metadata
                return (
                    transaction.type === 'deposit' &&
                    transaction.metadata?.product_name
                );

            case 'get-tipped':
                // Tips are deposits without product metadata (could be a direct payments)
                return (
                    transaction.type === 'deposit' &&
                    !transaction.metadata?.product_name
                );

            case 'withdrawals':
                // All withdrawal transactions
                return transaction.type === 'withdrawal';

            default:
                return false;
        }
    });
};

/**
 * Checks if transaction matches the status filter
 * @param transaction - The transaction to check
 * @param filterStatuses - Array of filter status values
 * @returns boolean indicating if transaction matches any of the filter statuses
 */
export const matchesTransactionStatus = (
    transaction: Transaction,
    filterStatuses: string[]
): boolean => {
    if (!filterStatuses || filterStatuses.length === 0) return true;
    return filterStatuses.includes(transaction.status);
};

/**
 * Checks if transaction falls within the date range
 * @param transaction - The transaction to check
 * @param dateFrom - Start date (inclusive)
 * @param dateTo - End date (inclusive)
 * @returns boolean indicating if transaction is within date range
 */
export const matchesDateRange = (
    transaction: Transaction,
    dateFrom: Date | null,
    dateTo: Date | null
): boolean => {
    if (!dateFrom && !dateTo) return true;

    const transactionDate = new Date(transaction.date);

    // Check if the transaction date is valid
    if (isNaN(transactionDate.getTime())) {
        return false;
    }

    if (dateFrom && transactionDate < dateFrom) return false;
    if (dateTo && transactionDate > dateTo) return false;

    return true;
};

/**
 * Filters transactions based on the provided filter state
 * @param transactions - Array of transactions to filter
 * @param filters - Filter state object
 * @returns Filtered array of transactions
 */
export const filterTransactions = (
    transactions: Transaction[],
    filters: FilterState
): Transaction[] => {
    if (!transactions) return [];

    return transactions.filter(transaction => {
        // Check transaction type filter
        if (!matchesTransactionType(transaction, filters.transactionType)) {
            return false;
        }

        // Check transaction status filter
        if (!matchesTransactionStatus(transaction, filters.transactionStatus)) {
            return false;
        }

        // Check date range filter
        if (!matchesDateRange(transaction, filters.dateFrom, filters.dateTo)) {
            return false;
        }

        return true;
    });
};

/**
 * Sorts transactions by date (newest first)
 * @param transactions - Array of transactions to sort
 * @returns Sorted array of transactions
 */
export const sortTransactionsByDate = (
    transactions: Transaction[]
): Transaction[] => {
    if (!transactions || !Array.isArray(transactions)) {
        return [];
    }
    return [...transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
};
