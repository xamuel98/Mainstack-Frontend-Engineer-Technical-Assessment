/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
    vi,
    describe,
    it,
    expect,
    beforeEach,
    afterEach,
    type MockedFunction,
} from 'vitest';
import React from 'react';

import {
    useTransactions,
    useFilteredTransactions,
    TRANSACTIONS_QUERY_KEY,
} from '@/hooks/useTransactions';
import { fetchTransactions } from '@/lib';
import {
    Transaction,
    TransactionType,
    TransactionStatus,
    ApiError,
} from '@/types';
import { FilterState } from '@/utils';

// Mock the API function
vi.mock('@/lib', () => ({
    fetchTransactions: vi.fn(),
}));

// Test wrapper component
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                gcTime: 0,
            },
        },
    });

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

// Mock transaction data
const mockTransactions: Transaction[] = [
    {
        amount: 1000,
        metadata: {
            name: 'John Doe',
            type: 'deposit' as TransactionType,
            email: 'john@example.com',
            quantity: 1,
            country: 'US',
            product_name: 'Product A',
        },
        payment_reference: 'ref_001',
        status: 'successful' as TransactionStatus,
        type: 'deposit' as TransactionType,
        date: '2024-01-15T10:00:00Z',
    },
    {
        amount: 500,
        metadata: {
            name: 'Jane Smith',
            type: 'withdrawal' as TransactionType,
            email: 'jane@example.com',
            quantity: 2,
            country: 'UK',
            product_name: 'Product B',
        },
        payment_reference: 'ref_002',
        status: 'pending' as TransactionStatus,
        type: 'withdrawal' as TransactionType,
        date: '2024-01-14T15:30:00Z',
    },
    {
        amount: 750,
        metadata: {
            name: 'Bob Johnson',
            type: 'deposit' as TransactionType,
            email: 'bob@example.com',
            quantity: 1,
            country: 'CA',
            product_name: 'Product C',
        },
        payment_reference: 'ref_003',
        status: 'successful' as TransactionStatus,
        type: 'deposit' as TransactionType,
        date: '2024-01-13T09:15:00Z',
    },
    {
        amount: 200,
        metadata: {
            name: 'Alice Brown',
            type: 'withdrawal' as TransactionType,
            email: 'alice@example.com',
            quantity: 3,
            country: 'AU',
            product_name: 'Product D',
        },
        payment_reference: 'ref_004',
        status: 'failed' as TransactionStatus,
        type: 'withdrawal' as TransactionType,
        date: '2024-01-12T14:45:00Z',
    },
];

const emptyFilterState: FilterState = {
    transactionType: [],
    transactionStatus: [],
    dateFrom: null,
    dateTo: null,
    dateRange: null,
};

describe('useTransactions Hook', () => {
    const mockFetchTransactions = fetchTransactions as MockedFunction<
        typeof fetchTransactions
    >;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('Successful Data Fetching', () => {
        it('should fetch transactions successfully', async () => {
            mockFetchTransactions.mockResolvedValue(mockTransactions);

            const { result } = renderHook(() => useTransactions(), {
                wrapper: createWrapper(),
            });

            // Initially loading
            expect(result.current.isLoading).toBe(true);
            expect(result.current.data).toBeUndefined();

            // Wait for data to load
            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.data).toEqual(mockTransactions);
            expect(result.current.error).toBeNull();
            expect(mockFetchTransactions).toHaveBeenCalledTimes(1);
        });

        it('should use correct query key', async () => {
            mockFetchTransactions.mockResolvedValue(mockTransactions);

            const { result } = renderHook(() => useTransactions(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            // Verify the query key is exported correctly
            expect(TRANSACTIONS_QUERY_KEY).toEqual(['transactions']);
        });

        it('should handle empty transactions array', async () => {
            mockFetchTransactions.mockResolvedValue([]);

            const { result } = renderHook(() => useTransactions(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.data).toEqual([]);
            expect(result.current.error).toBeNull();
        });
    });

    describe('Error Handling', () => {
        it('should handle fetch errors correctly', async () => {
            const mockError = new Error(
                'Failed to fetch transactions'
            ) as unknown as ApiError;
            mockFetchTransactions.mockRejectedValue(mockError);

            const { result } = renderHook(() => useTransactions(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.data).toBeUndefined();
            expect(result.current.error).toEqual(mockError);
            expect(mockFetchTransactions).toHaveBeenCalledTimes(1);
        });

        it('should handle network errors', async () => {
            const networkError = new Error(
                'Network error'
            ) as unknown as ApiError;
            mockFetchTransactions.mockRejectedValue(networkError);

            const { result } = renderHook(() => useTransactions(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.data).toBeUndefined();
            expect(result.current.error).toEqual(networkError);
        });

        it('should handle API errors with status codes', async () => {
            const apiError: ApiError = {
                message: 'Unauthorized access',
                status: 401,
            };
            mockFetchTransactions.mockRejectedValue(apiError);

            const { result } = renderHook(() => useTransactions(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.error).toEqual(apiError);
        });
    });

    describe('Loading States', () => {
        it('should show loading state initially', () => {
            mockFetchTransactions.mockImplementation(
                () => new Promise(() => {})
            ); // Never resolves

            const { result } = renderHook(() => useTransactions(), {
                wrapper: createWrapper(),
            });

            expect(result.current.isLoading).toBe(true);
            expect(result.current.data).toBeUndefined();
            expect(result.current.error).toBeNull();
        });

        it('should transition from loading to success', async () => {
            mockFetchTransactions.mockResolvedValue(mockTransactions);

            const { result } = renderHook(() => useTransactions(), {
                wrapper: createWrapper(),
            });

            expect(result.current.isLoading).toBe(true);

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.data).toEqual(mockTransactions);
        });
    });

    describe('Caching Behavior', () => {
        it('should cache transactions data between renders', async () => {
            mockFetchTransactions.mockResolvedValue(mockTransactions);

            const { result, rerender } = renderHook(() => useTransactions(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.data).toEqual(mockTransactions);

            // Rerender should not trigger another fetch
            rerender();
            expect(result.current.data).toEqual(mockTransactions);
            expect(mockFetchTransactions).toHaveBeenCalledTimes(1);
        });
    });
});

describe('useFilteredTransactions Hook', () => {
    const mockFetchTransactions = fetchTransactions as MockedFunction<
        typeof fetchTransactions
    >;

    beforeEach(() => {
        vi.clearAllMocks();
        mockFetchTransactions.mockResolvedValue(mockTransactions);
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('Filtering by Type', () => {
        it('should filter transactions by deposit type', async () => {
            const filterState: FilterState = {
                transactionType: ['store-transactions'],
                transactionStatus: [],
                dateFrom: null,
                dateTo: null,
                dateRange: null,
            };

            const { result } = renderHook(
                () => useFilteredTransactions(filterState),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            const depositTransactions = mockTransactions.filter(
                t => t.type === 'deposit'
            );
            expect(result.current.transactions).toHaveLength(2);
            expect(result.current.transactions).toEqual(
                expect.arrayContaining(depositTransactions)
            );
        });

        it('should filter transactions by withdrawal type', async () => {
            const filterState: FilterState = {
                transactionType: ['withdrawals'],
                transactionStatus: [],
                dateFrom: null,
                dateTo: null,
                dateRange: null,
            };

            const { result } = renderHook(
                () => useFilteredTransactions(filterState),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            const withdrawalTransactions = mockTransactions.filter(
                t => t.type === 'withdrawal'
            );
            expect(result.current.transactions).toHaveLength(2);
            expect(result.current.transactions).toEqual(
                expect.arrayContaining(withdrawalTransactions)
            );
        });

        it('should filter transactions by multiple types', async () => {
            const filterState: FilterState = {
                transactionType: ['store-transactions', 'withdrawals'],
                transactionStatus: [],
                dateFrom: null,
                dateTo: null,
                dateRange: null,
            };

            const { result } = renderHook(
                () => useFilteredTransactions(filterState),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.transactions).toHaveLength(4);
            expect(result.current.transactions).toEqual(
                expect.arrayContaining(mockTransactions)
            );
        });

        it('should return empty array when filtering by non-existent type', async () => {
            const filterState: FilterState = {
                transactionType: ['refund' as TransactionType],
                transactionStatus: [],
                dateFrom: null,
                dateTo: null,
                dateRange: null,
            };

            const { result } = renderHook(
                () => useFilteredTransactions(filterState),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.transactions).toHaveLength(0);
        });
    });

    describe('Filtering by Status', () => {
        it('should filter transactions by successful status', async () => {
            const filterState: FilterState = {
                transactionType: [],
                transactionStatus: ['successful'],
                dateFrom: null,
                dateTo: null,
                dateRange: null,
            };

            const { result } = renderHook(
                () => useFilteredTransactions(filterState),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            const successfulTransactions = mockTransactions.filter(
                t => t.status === 'successful'
            );
            expect(result.current.transactions).toHaveLength(2);
            expect(result.current.transactions).toEqual(
                expect.arrayContaining(successfulTransactions)
            );
        });

        it('should filter transactions by pending status', async () => {
            const filterState: FilterState = {
                transactionType: [],
                transactionStatus: ['pending'],
                dateFrom: null,
                dateTo: null,
                dateRange: null,
            };

            const { result } = renderHook(
                () => useFilteredTransactions(filterState),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            const pendingTransactions = mockTransactions.filter(
                t => t.status === 'pending'
            );
            expect(result.current.transactions).toHaveLength(1);
            expect(result.current.transactions).toEqual(
                expect.arrayContaining(pendingTransactions)
            );
        });

        it('should filter transactions by failed status', async () => {
            const filterState: FilterState = {
                transactionType: [],
                transactionStatus: ['failed'],
                dateFrom: null,
                dateTo: null,
                dateRange: null,
            };

            const { result } = renderHook(
                () => useFilteredTransactions(filterState),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            const failedTransactions = mockTransactions.filter(
                t => t.status === 'failed'
            );
            expect(result.current.transactions).toHaveLength(1);
            expect(result.current.transactions).toEqual(
                expect.arrayContaining(failedTransactions)
            );
        });

        it('should filter transactions by multiple statuses', async () => {
            const filterState: FilterState = {
                transactionType: [],
                transactionStatus: ['successful', 'pending'],
                dateFrom: null,
                dateTo: null,
                dateRange: null,
            };

            const { result } = renderHook(
                () => useFilteredTransactions(filterState),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            const filteredTransactions = mockTransactions.filter(
                t => t.status === 'successful' || t.status === 'pending'
            );
            expect(result.current.transactions).toHaveLength(3);
            expect(result.current.transactions).toEqual(
                expect.arrayContaining(filteredTransactions)
            );
        });
    });

    describe('Filtering by Date Range', () => {
        it('should filter transactions by date range', async () => {
            const filterState: FilterState = {
                transactionType: [],
                transactionStatus: [],
                dateFrom: new Date('2024-01-13T00:00:00Z'),
                dateTo: new Date('2024-01-15T23:59:59Z'),
                dateRange: 'all-time',
            };

            const { result } = renderHook(
                () => useFilteredTransactions(filterState),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            // Should include transactions from Jan 13-15
            expect(result.current.transactions).toHaveLength(3);
            expect(
                result.current.transactions?.map(t => t.payment_reference)
            ).toEqual(
                expect.arrayContaining(['ref_001', 'ref_002', 'ref_003'])
            );
        });

        it('should filter transactions by single day', async () => {
            const filterState: FilterState = {
                transactionType: [],
                transactionStatus: [],
                dateFrom: new Date('2024-01-15T00:00:00Z'),
                dateTo: new Date('2024-01-15T23:59:59Z'),
                dateRange: 'all-time',
            };

            const { result } = renderHook(
                () => useFilteredTransactions(filterState),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            // Should only include transaction from Jan 15
            expect(result.current.transactions).toHaveLength(1);
            expect(result.current.transactions?.[0].payment_reference).toBe(
                'ref_001'
            );
        });

        it('should return empty array for date range with no transactions', async () => {
            const filterState: FilterState = {
                transactionType: [],
                transactionStatus: [],
                dateFrom: new Date('2024-01-01T00:00:00Z'),
                dateTo: new Date('2024-01-10T23:59:59Z'),
                dateRange: 'all-time',
            };

            const { result } = renderHook(
                () => useFilteredTransactions(filterState),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.transactions).toHaveLength(0);
        });
    });

    describe('Combined Filtering', () => {
        it('should filter by type and status combined', async () => {
            const filterState: FilterState = {
                transactionType: ['store-transactions'],
                transactionStatus: ['successful'],
                dateFrom: null,
                dateTo: null,
                dateRange: null,
            };

            const { result } = renderHook(
                () => useFilteredTransactions(filterState),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            // Should only include successful deposits
            expect(result.current.transactions).toHaveLength(2);
            expect(
                result.current.transactions?.every(
                    t => t.type === 'deposit' && t.status === 'successful'
                )
            ).toBe(true);
        });

        it('should filter by type, status, and date range combined', async () => {
            const filterState: FilterState = {
                transactionType: ['store-transactions'],
                transactionStatus: ['successful'],
                dateFrom: null,
                dateTo: null,
                dateRange: {
                    start: new Date('2024-01-13T00:00:00Z'),
                    end: new Date('2024-01-15T23:59:59Z'),
                } as any,
            };

            const { result } = renderHook(
                () => useFilteredTransactions(filterState),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            // Should include successful deposits within date range
            expect(result.current.transactions).toHaveLength(2);
            expect(
                result.current.transactions?.every(
                    t =>
                        t.type === 'deposit' &&
                        t.status === 'successful' &&
                        new Date(t.date) >= new Date('2024-01-13T00:00:00Z') &&
                        new Date(t.date) <= new Date('2024-01-15T23:59:59Z')
                )
            ).toBe(true);
        });

        it('should return empty array when combined filters match nothing', async () => {
            const filterState: FilterState = {
                transactionType: ['withdrawals'],
                transactionStatus: ['successful'],
                dateFrom: null,
                dateTo: null,
                dateRange: {
                    start: new Date('2024-01-01T00:00:00Z'),
                    end: new Date('2024-01-10T23:59:59Z'),
                } as any,
            };

            const { result } = renderHook(
                () => useFilteredTransactions(filterState),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.transactions).toHaveLength(0);
        });
    });

    describe('Sorting', () => {
        it('should sort transactions by date in descending order by default', async () => {
            const { result } = renderHook(
                () => useFilteredTransactions(emptyFilterState),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            const sortedData = result.current.transactions;
            expect(sortedData).toHaveLength(4);

            // Should be sorted by date descending (newest first)
            expect(sortedData?.[0].payment_reference).toBe('ref_001'); // 2024-01-15
            expect(sortedData?.[1].payment_reference).toBe('ref_002'); // 2024-01-14
            expect(sortedData?.[2].payment_reference).toBe('ref_003'); // 2024-01-13
            expect(sortedData?.[3].payment_reference).toBe('ref_004'); // 2024-01-12
        });

        it('should maintain sort order after filtering', async () => {
            const filterState: FilterState = {
                transactionType: ['store-transactions'],
                transactionStatus: [],
                dateFrom: null,
                dateTo: null,
                dateRange: null,
            };

            const { result } = renderHook(
                () => useFilteredTransactions(filterState),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            const sortedData = result.current.transactions;
            expect(sortedData).toHaveLength(2);

            // Should be sorted by date descending
            expect(sortedData?.[0].payment_reference).toBe('ref_001'); // 2024-01-15
            expect(sortedData?.[1].payment_reference).toBe('ref_003'); // 2024-01-13
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty transactions array', async () => {
            mockFetchTransactions.mockResolvedValue([]);

            const { result } = renderHook(
                () => useFilteredTransactions(emptyFilterState),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.transactions).toEqual([]);
        });

        it('should handle undefined transactions data', async () => {
            const mockError: ApiError = {
                message: 'Transactions data not found',
                status: 404,
            };
            mockFetchTransactions.mockRejectedValue(mockError);

            const { result } = renderHook(
                () => useFilteredTransactions(emptyFilterState),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.transactions).toEqual([]);
        });

        it('should handle null filter state gracefully', async () => {
            const { result } = renderHook(
                () => useFilteredTransactions(null as any),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            // Should return all transactions when filter is null
            expect(result.current.transactions).toHaveLength(4);
        });

        it('should handle invalid date formats', async () => {
            const filterState: FilterState = {
                transactionType: [],
                transactionStatus: [],
                dateFrom: null,
                dateTo: null,
                dateRange: {
                    start: new Date('invalid-date'),
                    end: new Date('invalid-date'),
                } as any,
            };

            const { result } = renderHook(
                () => useFilteredTransactions(filterState),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            // Should handle invalid dates gracefully
            expect(result.current.transactions).toBeDefined();
        });

        it('should handle transactions with missing metadata', async () => {
            const transactionsWithMissingData: Transaction[] = [
                {
                    amount: 100,
                    metadata: {} as any,
                    payment_reference: 'ref_005',
                    status: 'successful' as TransactionStatus,
                    type: 'deposit' as TransactionType,
                    date: '2024-01-16T10:00:00Z',
                },
            ];

            mockFetchTransactions.mockResolvedValue(
                transactionsWithMissingData
            );

            const { result } = renderHook(
                () => useFilteredTransactions(emptyFilterState),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.transactions).toHaveLength(1);
            expect(result.current.transactions?.[0].payment_reference).toBe(
                'ref_005'
            );
        });
    });

    describe('Performance and Optimization', () => {
        it('should not refetch data unnecessarily', async () => {
            const { result, rerender } = renderHook(
                () => useFilteredTransactions(emptyFilterState),
                {
                    wrapper: createWrapper(),
                }
            );

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            // Rerender multiple times
            rerender();
            rerender();
            rerender();

            // Should only fetch once due to React Query caching
            expect(mockFetchTransactions).toHaveBeenCalledTimes(1);
        });

        it('should handle rapid filter changes efficiently', async () => {
            const { result, rerender } = renderHook(
                ({ filterState }) => useFilteredTransactions(filterState),
                {
                    wrapper: createWrapper(),
                    initialProps: { filterState: emptyFilterState },
                }
            );

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            // Change filters rapidly
            rerender({
                filterState: {
                    transactionType: ['store-transactions'],
                    transactionStatus: [],
                    dateFrom: null,
                    dateTo: null,
                    dateRange: null,
                },
            });
            rerender({
                filterState: {
                    transactionType: ['withdrawals'],
                    transactionStatus: [],
                    dateFrom: null,
                    dateTo: null,
                    dateRange: null,
                },
            });
            rerender({
                filterState: {
                    transactionType: [],
                    transactionStatus: ['successful'],
                    dateFrom: null,
                    dateTo: null,
                    dateRange: null,
                },
            });

            // Should still only fetch once due to caching
            expect(mockFetchTransactions).toHaveBeenCalledTimes(1);
        });

        it('should handle large datasets efficiently', async () => {
            // Create a large dataset
            const largeDataset: Transaction[] = Array.from(
                { length: 1000 },
                (_, index) => ({
                    amount: Math.random() * 1000,
                    metadata: {
                        name: `User ${index + 1}`,
                        type:
                            index % 2 === 0
                                ? ('deposit' as TransactionType)
                                : ('withdrawal' as TransactionType),
                        email: `user${index + 1}@example.com`,
                        quantity: 1,
                        country: 'US',
                        // For deposits (even indices), add product_name to make them 'store-transactions'
                        product_name:
                            index % 2 === 0
                                ? `Product ${index + 1}`
                                : undefined,
                    },
                    payment_reference: `ref_${index + 1}`,
                    status: 'successful' as TransactionStatus,
                    type:
                        index % 2 === 0
                            ? ('deposit' as TransactionType)
                            : ('withdrawal' as TransactionType),
                    date: new Date(2024, 0, 1 + (index % 30)).toISOString(),
                })
            );

            // Clear all mocks and set up fresh mock for this test
            vi.clearAllMocks();
            mockFetchTransactions.mockResolvedValue(largeDataset);

            const filterState: FilterState = {
                transactionType: ['store-transactions'],
                transactionStatus: ['successful'],
                dateFrom: null,
                dateTo: null,
                dateRange: null,
            };

            // Create a fresh wrapper with new QueryClient to avoid caching issues
            const freshWrapper = createWrapper();

            const { result } = renderHook(
                () => useFilteredTransactions(filterState),
                {
                    wrapper: freshWrapper,
                }
            );

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            // Should handle large dataset filtering efficiently
            expect(result.current.transactions).toHaveLength(500); // Half should be store-transactions (deposits with product_name)
            expect(
                result.current.transactions?.every(
                    t => t.type === 'deposit' && t.metadata?.product_name
                )
            ).toBe(true);
        });
    });
});
