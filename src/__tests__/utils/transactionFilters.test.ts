/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach } from 'vitest';
import {
    FilterState,
    matchesTransactionType,
    matchesTransactionStatus,
    matchesDateRange,
    filterTransactions,
    sortTransactionsByDate,
} from '@/utils/transactionFilters';
import { Transaction, TransactionType, TransactionStatus } from '@/types';

describe('Transaction Filters Utilities', () => {
    let mockTransactions: Transaction[];

    beforeEach(() => {
        mockTransactions = [
            {
                amount: 5000,
                metadata: {
                    name: 'John Doe',
                    type: 'deposit',
                    email: 'john@example.com',
                    quantity: 1,
                    country: 'Nigeria',
                    product_name: 'Premium Plan',
                },
                payment_reference: 'ref_001',
                status: 'successful' as TransactionStatus,
                type: 'deposit' as TransactionType,
                date: '2024-01-15T10:00:00Z',
            },
            {
                amount: 2500,
                metadata: {
                    name: 'Jane Smith',
                    type: 'deposit',
                    email: 'jane@example.com',
                    quantity: 1,
                    country: 'Ghana',
                },
                payment_reference: 'ref_002',
                status: 'successful' as TransactionStatus,
                type: 'deposit' as TransactionType,
                date: '2024-01-14T15:30:00Z',
            },
            {
                amount: 1500,
                metadata: {
                    name: 'Bob Wilson',
                    type: 'withdrawal',
                    email: 'bob@example.com',
                    quantity: 1,
                    country: 'Kenya',
                    product_name: 'Standard Plan',
                },
                payment_reference: 'ref_003',
                status: 'pending' as TransactionStatus,
                type: 'withdrawal' as TransactionType,
                date: '2024-01-13T09:15:00Z',
            },
            {
                amount: 750,
                metadata: {
                    name: 'Alice Brown',
                    type: 'withdrawal',
                    email: 'alice@example.com',
                    quantity: 1,
                    country: 'South Africa',
                    product_name: 'Pro Plan',
                },
                payment_reference: 'ref_004',
                status: 'failed' as TransactionStatus,
                type: 'withdrawal' as TransactionType,
                date: '2024-01-12T14:45:00Z',
            },
        ];
    });

    describe('matchesTransactionType', () => {
        it('should return true when no filter types are provided', () => {
            const result = matchesTransactionType(mockTransactions[0], []);
            expect(result).toBe(true);
        });

        it('should return true when filter types array is empty', () => {
            const result = matchesTransactionType(mockTransactions[0], []);
            expect(result).toBe(true);
        });

        it('should match store-transactions for deposits with product metadata', () => {
            const storeTransaction = mockTransactions[0]; // Has product_name
            const result = matchesTransactionType(storeTransaction, [
                'store-transactions',
            ]);
            expect(result).toBe(true);
        });

        it('should not match store-transactions for deposits without product metadata', () => {
            const tipTransaction = mockTransactions[1]; // No product_name
            const result = matchesTransactionType(tipTransaction, [
                'store-transactions',
            ]);
            expect(result).toBe(false);
        });

        it('should match get-tipped for deposits without product metadata', () => {
            const tipTransaction = mockTransactions[1]; // No product_name
            const result = matchesTransactionType(tipTransaction, [
                'get-tipped',
            ]);
            expect(result).toBe(true);
        });

        it('should not match get-tipped for deposits with product metadata', () => {
            const storeTransaction = mockTransactions[0]; // Has product_name
            const result = matchesTransactionType(storeTransaction, [
                'get-tipped',
            ]);
            expect(result).toBe(false);
        });

        it('should match withdrawals for withdrawal transactions', () => {
            const withdrawalTransaction = mockTransactions[2];
            const result = matchesTransactionType(withdrawalTransaction, [
                'withdrawals',
            ]);
            expect(result).toBe(true);
        });

        it('should not match withdrawals for deposit transactions', () => {
            const depositTransaction = mockTransactions[0];
            const result = matchesTransactionType(depositTransaction, [
                'withdrawals',
            ]);
            expect(result).toBe(false);
        });

        it('should match multiple filter types', () => {
            const storeTransaction = mockTransactions[0];
            const result = matchesTransactionType(storeTransaction, [
                'store-transactions',
                'get-tipped',
            ]);
            expect(result).toBe(true);
        });

        it('should return false for unknown filter types', () => {
            const transaction = mockTransactions[0];
            const result = matchesTransactionType(transaction, [
                'unknown-type',
            ]);
            expect(result).toBe(false);
        });

        it('should handle null/undefined filter types gracefully', () => {
            const transaction = mockTransactions[0];
            const result = matchesTransactionType(transaction, null as any);
            expect(result).toBe(true);
        });

        it('should handle transactions with missing metadata', () => {
            const transactionWithoutMetadata: Transaction = {
                ...mockTransactions[0],
                metadata: {} as any,
            };
            const result = matchesTransactionType(transactionWithoutMetadata, [
                'store-transactions',
            ]);
            expect(result).toBe(false);
        });
    });

    describe('matchesTransactionStatus', () => {
        it('should return true when no filter statuses are provided', () => {
            const result = matchesTransactionStatus(mockTransactions[0], []);
            expect(result).toBe(true);
        });

        it('should return true when filter statuses array is empty', () => {
            const result = matchesTransactionStatus(mockTransactions[0], []);
            expect(result).toBe(true);
        });

        it('should match successful status', () => {
            const successfulTransaction = mockTransactions[0];
            const result = matchesTransactionStatus(successfulTransaction, [
                'successful',
            ]);
            expect(result).toBe(true);
        });

        it('should match pending status', () => {
            const pendingTransaction = mockTransactions[2];
            const result = matchesTransactionStatus(pendingTransaction, [
                'pending',
            ]);
            expect(result).toBe(true);
        });

        it('should match failed status', () => {
            const failedTransaction = mockTransactions[3];
            const result = matchesTransactionStatus(failedTransaction, [
                'failed',
            ]);
            expect(result).toBe(true);
        });

        it('should match multiple statuses', () => {
            const successfulTransaction = mockTransactions[0];
            const result = matchesTransactionStatus(successfulTransaction, [
                'successful',
                'pending',
            ]);
            expect(result).toBe(true);
        });

        it('should not match when status is not in filter', () => {
            const successfulTransaction = mockTransactions[0];
            const result = matchesTransactionStatus(successfulTransaction, [
                'pending',
                'failed',
            ]);
            expect(result).toBe(false);
        });

        it('should handle null/undefined filter statuses gracefully', () => {
            const transaction = mockTransactions[0];
            const result = matchesTransactionStatus(transaction, null as any);
            expect(result).toBe(true);
        });
    });

    describe('matchesDateRange', () => {
        it('should return true when no date range is provided', () => {
            const result = matchesDateRange(mockTransactions[0], null, null);
            expect(result).toBe(true);
        });

        it('should match transaction within date range', () => {
            const transaction = mockTransactions[0]; // 2024-01-15
            const dateFrom = new Date('2024-01-14T00:00:00Z');
            const dateTo = new Date('2024-01-16T00:00:00Z');
            const result = matchesDateRange(transaction, dateFrom, dateTo);
            expect(result).toBe(true);
        });

        it('should not match transaction before date range', () => {
            const transaction = mockTransactions[3]; // 2024-01-12
            const dateFrom = new Date('2024-01-14T00:00:00Z');
            const dateTo = new Date('2024-01-16T00:00:00Z');
            const result = matchesDateRange(transaction, dateFrom, dateTo);
            expect(result).toBe(false);
        });

        it('should not match transaction after date range', () => {
            const transaction = mockTransactions[0]; // 2024-01-15
            const dateFrom = new Date('2024-01-10T00:00:00Z');
            const dateTo = new Date('2024-01-13T00:00:00Z');
            const result = matchesDateRange(transaction, dateFrom, dateTo);
            expect(result).toBe(false);
        });

        it('should match transaction on exact start date', () => {
            const transaction = mockTransactions[0]; // 2024-01-15
            const dateFrom = new Date('2024-01-15T00:00:00Z');
            const dateTo = new Date('2024-01-16T00:00:00Z');
            const result = matchesDateRange(transaction, dateFrom, dateTo);
            expect(result).toBe(true);
        });

        it('should match transaction on exact end date', () => {
            const transaction = mockTransactions[0]; // 2024-01-15
            const dateFrom = new Date('2024-01-14T00:00:00Z');
            const dateTo = new Date('2024-01-15T23:59:59Z');
            const result = matchesDateRange(transaction, dateFrom, dateTo);
            expect(result).toBe(true);
        });

        it('should handle only dateFrom provided', () => {
            const transaction = mockTransactions[0]; // 2024-01-15
            const dateFrom = new Date('2024-01-14T00:00:00Z');
            const result = matchesDateRange(transaction, dateFrom, null);
            expect(result).toBe(true);
        });

        it('should handle only dateTo provided', () => {
            const transaction = mockTransactions[0]; // 2024-01-15
            const dateTo = new Date('2024-01-16T00:00:00Z');
            const result = matchesDateRange(transaction, null, dateTo);
            expect(result).toBe(true);
        });

        it('should handle invalid date strings gracefully', () => {
            const transactionWithInvalidDate: Transaction = {
                ...mockTransactions[0],
                date: 'invalid-date',
            };
            const dateFrom = new Date('2024-01-14T00:00:00Z');
            const dateTo = new Date('2024-01-16T00:00:00Z');
            const result = matchesDateRange(
                transactionWithInvalidDate,
                dateFrom,
                dateTo
            );
            expect(result).toBe(false); // Invalid date should not match
        });
    });

    describe('filterTransactions', () => {
        let filterState: FilterState;

        beforeEach(() => {
            filterState = {
                dateRange: 'all-time',
                dateFrom: null,
                dateTo: null,
                transactionType: [],
                transactionStatus: [],
            };
        });

        it('should return all transactions when no filters are applied', () => {
            const result = filterTransactions(mockTransactions, filterState);
            expect(result).toHaveLength(4);
            expect(result).toEqual(mockTransactions);
        });

        it('should filter by transaction type', () => {
            filterState.transactionType = ['store-transactions'];
            const result = filterTransactions(mockTransactions, filterState);
            expect(result).toHaveLength(1);
            expect(result[0].payment_reference).toBe('ref_001');
        });

        it('should filter by transaction status', () => {
            filterState.transactionStatus = ['successful'];
            const result = filterTransactions(mockTransactions, filterState);
            expect(result).toHaveLength(2);
            expect(result.map(t => t.payment_reference)).toEqual([
                'ref_001',
                'ref_002',
            ]);
        });

        it('should filter by date range', () => {
            filterState.dateFrom = new Date('2024-01-14T00:00:00Z');
            filterState.dateTo = new Date('2024-01-15T23:59:59Z');
            const result = filterTransactions(mockTransactions, filterState);
            expect(result).toHaveLength(2);
            expect(result.map(t => t.payment_reference)).toEqual([
                'ref_001',
                'ref_002',
            ]);
        });

        it('should apply multiple filters simultaneously', () => {
            filterState.transactionType = ['store-transactions'];
            filterState.transactionStatus = ['successful'];
            filterState.dateFrom = new Date('2024-01-15T00:00:00Z');
            filterState.dateTo = new Date('2024-01-15T23:59:59Z');
            const result = filterTransactions(mockTransactions, filterState);
            expect(result).toHaveLength(1);
            expect(result[0].payment_reference).toBe('ref_001');
        });

        it('should return empty array when no transactions match filters', () => {
            filterState.transactionType = ['store-transactions'];
            filterState.transactionStatus = ['failed'];
            const result = filterTransactions(mockTransactions, filterState);
            expect(result).toHaveLength(0);
        });

        it('should handle empty transactions array', () => {
            const result = filterTransactions([], filterState);
            expect(result).toEqual([]);
        });

        it('should handle multiple transaction types', () => {
            filterState.transactionType = ['store-transactions', 'withdrawals'];
            const result = filterTransactions(mockTransactions, filterState);
            expect(result).toHaveLength(3); // 1 store transaction + 2 withdrawals
        });

        it('should handle multiple transaction statuses', () => {
            filterState.transactionStatus = ['successful', 'pending'];
            const result = filterTransactions(mockTransactions, filterState);
            expect(result).toHaveLength(3); // 2 successful + 1 pending
        });
    });

    describe('sortTransactionsByDate', () => {
        it('should sort transactions by date in descending order (newest first)', () => {
            const unsortedTransactions = [...mockTransactions].reverse();
            const result = sortTransactionsByDate(unsortedTransactions);

            expect(result).toHaveLength(4);
            expect(result[0].payment_reference).toBe('ref_001'); // 2024-01-15 (newest)
            expect(result[1].payment_reference).toBe('ref_002'); // 2024-01-14
            expect(result[2].payment_reference).toBe('ref_003'); // 2024-01-13
            expect(result[3].payment_reference).toBe('ref_004'); // 2024-01-12 (oldest)
        });

        it('should handle empty transactions array', () => {
            const result = sortTransactionsByDate([]);
            expect(result).toEqual([]);
        });

        it('should handle single transaction', () => {
            const singleTransaction = [mockTransactions[0]];
            const result = sortTransactionsByDate(singleTransaction);
            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(mockTransactions[0]);
        });

        it('should handle transactions with same date', () => {
            const sameDate = '2024-01-15T10:00:00Z';
            const transactionsWithSameDate: Transaction[] = [
                { ...mockTransactions[0], date: sameDate },
                { ...mockTransactions[1], date: sameDate },
                { ...mockTransactions[2], date: sameDate },
            ];

            const result = sortTransactionsByDate(transactionsWithSameDate);
            expect(result).toHaveLength(3);
            // Should maintain relative order for same dates
        });

        it('should handle invalid date strings gracefully', () => {
            const transactionsWithInvalidDates: Transaction[] = [
                { ...mockTransactions[0], date: 'invalid-date-1' },
                { ...mockTransactions[1], date: '2024-01-14T15:30:00Z' },
                { ...mockTransactions[2], date: 'invalid-date-2' },
            ];

            const result = sortTransactionsByDate(transactionsWithInvalidDates);
            expect(result).toHaveLength(3);
            // Should handle gracefully without throwing errors
        });

        it('should not mutate the original array', () => {
            const originalTransactions = [...mockTransactions];
            const result = sortTransactionsByDate(mockTransactions);

            expect(mockTransactions).toEqual(originalTransactions);
            expect(result).not.toBe(mockTransactions); // Different reference
        });
    });

    describe('Edge Cases and Performance', () => {
        it('should handle large datasets efficiently', () => {
            const largeDataset: Transaction[] = Array.from(
                { length: 1000 },
                (_, index) => ({
                    amount: Math.random() * 10000,
                    metadata: {
                        name: `User ${index}`,
                        type: index % 2 === 0 ? 'deposit' : 'withdrawal',
                        email: `user${index}@example.com`,
                        quantity: 1,
                        country: 'Nigeria',
                        product_name:
                            index % 3 === 0 ? 'Premium Plan' : undefined,
                    },
                    payment_reference: `ref_${index}`,
                    status: (
                        [
                            'successful',
                            'pending',
                            'failed',
                        ] as TransactionStatus[]
                    )[index % 3],
                    type: (index % 2 === 0
                        ? 'deposit'
                        : 'withdrawal') as TransactionType,
                    date: new Date(2024, 0, (index % 30) + 1).toISOString(),
                })
            );

            const filterState: FilterState = {
                dateRange: 'all-time',
                dateFrom: null,
                dateTo: null,
                transactionType: ['store-transactions'],
                transactionStatus: ['successful'],
            };

            const startTime = performance.now();
            const result = filterTransactions(largeDataset, filterState);
            const endTime = performance.now();

            expect(result.length).toBeGreaterThan(0);
            expect(endTime - startTime).toBeLessThan(100); // Should complete within 100ms
        });

        it('should handle transactions with missing required fields', () => {
            const incompleteTransactions: Partial<Transaction>[] = [
                { amount: 1000 }, // Missing other fields
                { type: 'deposit' as TransactionType }, // Missing amount
                { status: 'successful' as TransactionStatus }, // Missing type
            ];

            const filterState: FilterState = {
                dateRange: 'all-time',
                dateFrom: null,
                dateTo: null,
                transactionType: ['store-transactions'],
                transactionStatus: ['successful'],
            };

            // Should handle gracefully without throwing errors
            expect(() => {
                filterTransactions(
                    incompleteTransactions as Transaction[],
                    filterState
                );
            }).not.toThrow();
        });

        it('should handle null/undefined inputs gracefully', () => {
            expect(() => {
                filterTransactions(null as any, null as any);
            }).not.toThrow();

            expect(() => {
                sortTransactionsByDate(null as any);
            }).not.toThrow();

            expect(() => {
                matchesTransactionType(null as any, null as any);
            }).not.toThrow();
        });
    });
});
