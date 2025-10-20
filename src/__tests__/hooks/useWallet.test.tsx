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

import { useWallet, useWalletStats, WALLET_QUERY_KEY } from '@/hooks/useWallet';
import { fetchWallet } from '@/lib';
import { Wallet, ApiError } from '@/types';

// Mock the API function
vi.mock('@/lib', () => ({
    fetchWallet: vi.fn(),
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

// Mock data
const mockWallet: Wallet = {
    balance: 5000.75,
    total_payout: 2500.5,
    total_revenue: 10000.25,
    pending_payout: 750.0,
    ledger_balance: 4250.25,
};

const mockWalletWithZeros: Wallet = {
    balance: 0,
    total_payout: 0,
    total_revenue: 0,
    pending_payout: 0,
    ledger_balance: 0,
};

describe('useWallet Hook', () => {
    const mockFetchWallet = fetchWallet as MockedFunction<typeof fetchWallet>;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('Successful Data Fetching', () => {
        it('should fetch wallet data successfully', async () => {
            mockFetchWallet.mockResolvedValue(mockWallet);

            const { result } = renderHook(() => useWallet(), {
                wrapper: createWrapper(),
            });

            // Initially loading
            expect(result.current.isLoading).toBe(true);
            expect(result.current.data).toBeUndefined();

            // Wait for data to load
            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.data).toEqual(mockWallet);
            expect(result.current.error).toBeNull();
            expect(mockFetchWallet).toHaveBeenCalledTimes(1);
        });

        it('should use correct query key', async () => {
            mockFetchWallet.mockResolvedValue(mockWallet);

            const { result } = renderHook(() => useWallet(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            // Verify the query key is exported correctly
            expect(WALLET_QUERY_KEY).toEqual(['wallet']);
        });

        it('should handle wallet data with zero values', async () => {
            mockFetchWallet.mockResolvedValue(mockWalletWithZeros);

            const { result } = renderHook(() => useWallet(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.data).toEqual(mockWalletWithZeros);
            expect(result.current.error).toBeNull();
        });
    });

    describe('Error Handling', () => {
        it('should handle fetch errors correctly', async () => {
            const mockError: ApiError = {
                message: 'Failed to fetch wallet data',
                status: 500,
            };
            mockFetchWallet.mockRejectedValue(mockError);

            const { result } = renderHook(() => useWallet(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.data).toBeUndefined();
            expect(result.current.error).toEqual(mockError);
            expect(mockFetchWallet).toHaveBeenCalledTimes(1);
        });

        it('should handle network errors', async () => {
            const mockError: ApiError = {
                message: 'Network error',
                status: 0,
            };
            mockFetchWallet.mockRejectedValue(mockError);

            const { result } = renderHook(() => useWallet(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.error).toEqual(mockError);
        });

        it('should handle API errors with status codes', async () => {
            const apiError = {
                message: 'Unauthorized',
                status: 401,
            } as ApiError;
            mockFetchWallet.mockRejectedValue(apiError);

            const { result } = renderHook(() => useWallet(), {
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
            mockFetchWallet.mockImplementation(() => new Promise(() => {})); // Never resolves

            const { result } = renderHook(() => useWallet(), {
                wrapper: createWrapper(),
            });

            expect(result.current.isLoading).toBe(true);
            expect(result.current.data).toBeUndefined();
            expect(result.current.error).toBeNull();
        });

        it('should transition from loading to success', async () => {
            mockFetchWallet.mockResolvedValue(mockWallet);

            const { result } = renderHook(() => useWallet(), {
                wrapper: createWrapper(),
            });

            // Initially loading
            expect(result.current.isLoading).toBe(true);

            // After data loads
            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
                expect(result.current.data).toEqual(mockWallet);
            });
        });
    });

    describe('Caching Behavior', () => {
        it('should cache wallet data between renders', async () => {
            mockFetchWallet.mockResolvedValue(mockWallet);

            const { result, rerender } = renderHook(() => useWallet(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            // Rerender the hook
            rerender();

            // Should not fetch again due to caching
            expect(mockFetchWallet).toHaveBeenCalledTimes(1);
            expect(result.current.data).toEqual(mockWallet);
        });
    });
});

describe('useWalletStats Hook', () => {
    const mockFetchWallet = fetchWallet as MockedFunction<typeof fetchWallet>;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('Successful Stats Calculation', () => {
        it('should calculate wallet stats correctly', async () => {
            mockFetchWallet.mockResolvedValue(mockWallet);

            const { result } = renderHook(() => useWalletStats(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.ledgerBalance).toBe(4250.25);
            });

            expect(result.current.totalPayout).toBe(2500.5);
            expect(result.current.totalRevenue).toBe(10000.25);
            expect(result.current.pendingPayout).toBe(750.0);
            expect(result.current.error).toBeNull();
        });

        it('should handle zero values in calculations', async () => {
            mockFetchWallet.mockResolvedValue(mockWalletWithZeros);

            const { result } = renderHook(() => useWalletStats(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.ledgerBalance).toBe(0);
            });

            expect(result.current.totalPayout).toBe(0);
            expect(result.current.totalRevenue).toBe(0);
            expect(result.current.pendingPayout).toBe(0);
            expect(result.current.error).toBeNull();
        });

        it('should calculate ledger balance correctly', async () => {
            const customWallet: Wallet = {
                ...mockWallet,
                balance: 1000,
                pending_payout: 200,
                ledger_balance: 800, // balance - pending_payout
            };
            mockFetchWallet.mockResolvedValue(customWallet);

            const { result } = renderHook(() => useWalletStats(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.ledgerBalance).toBe(800);
            });
        });
    });

    describe('Error Handling in Stats', () => {
        it('should handle wallet fetch errors in stats', async () => {
            const mockError: ApiError = {
                message: 'Failed to fetch wallet',
                status: 500,
            };
            mockFetchWallet.mockRejectedValue(mockError);

            const { result } = renderHook(() => useWalletStats(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.error).toEqual(mockError);
            });

            // When there's an error, the hook returns 0 as fallback values
            expect(result.current.ledgerBalance).toBe(0);
            expect(result.current.totalPayout).toBe(0);
            expect(result.current.totalRevenue).toBe(0);
            expect(result.current.pendingPayout).toBe(0);
            expect(result.current.hasData).toBe(false);
        });

        it('should handle undefined wallet data gracefully', async () => {
            const mockError: ApiError = {
                message: 'No wallet data available',
                status: 404,
            };
            mockFetchWallet.mockRejectedValue(mockError);

            const { result } = renderHook(() => useWalletStats(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.error).toEqual(mockError);
            });

            // When there's an error, the hook returns 0 as fallback values
            expect(result.current.ledgerBalance).toBe(0);
            expect(result.current.totalPayout).toBe(0);
            expect(result.current.totalRevenue).toBe(0);
            expect(result.current.pendingPayout).toBe(0);
            expect(result.current.hasData).toBe(false);
        });
    });

    describe('Edge Cases', () => {
        it('should handle negative values correctly', async () => {
            const negativeWallet: Wallet = {
                balance: -100,
                total_payout: -50,
                total_revenue: -200,
                pending_payout: -25,
                ledger_balance: -75,
            };
            mockFetchWallet.mockResolvedValue(negativeWallet);

            const { result } = renderHook(() => useWalletStats(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.ledgerBalance).toBe(-75);
            });

            expect(result.current.totalPayout).toBe(-50);
            expect(result.current.totalRevenue).toBe(-200);
            expect(result.current.pendingPayout).toBe(-25);
        });

        it('should handle very large numbers', async () => {
            const largeWallet: Wallet = {
                balance: 999999999.99,
                total_payout: 500000000.5,
                total_revenue: 2000000000.75,
                pending_payout: 100000000.25,
                ledger_balance: 899999999.74,
            };
            mockFetchWallet.mockResolvedValue(largeWallet);

            const { result } = renderHook(() => useWalletStats(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.ledgerBalance).toBe(899999999.74);
            });

            expect(result.current.totalPayout).toBe(500000000.5);
            expect(result.current.totalRevenue).toBe(2000000000.75);
            expect(result.current.pendingPayout).toBe(100000000.25);
        });

        it('should handle decimal precision correctly', async () => {
            const precisionWallet: Wallet = {
                balance: 123.456789,
                total_payout: 67.891234,
                total_revenue: 456.789123,
                pending_payout: 12.345678,
                ledger_balance: 111.111111,
            };
            mockFetchWallet.mockResolvedValue(precisionWallet);

            const { result } = renderHook(() => useWalletStats(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.ledgerBalance).toBe(111.111111);
            });

            expect(result.current.totalPayout).toBe(67.891234);
            expect(result.current.totalRevenue).toBe(456.789123);
            expect(result.current.pendingPayout).toBe(12.345678);
        });
    });

    describe('Performance and Optimization', () => {
        it('should not refetch data unnecessarily', async () => {
            mockFetchWallet.mockResolvedValue(mockWallet);

            const { result, rerender } = renderHook(() => useWalletStats(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.ledgerBalance).toBe(4250.25);
            });

            // Rerender multiple times
            rerender();
            rerender();
            rerender();

            // Should only fetch once due to React Query caching
            expect(mockFetchWallet).toHaveBeenCalledTimes(1);
        });

        it('should handle rapid successive calls', async () => {
            mockFetchWallet.mockResolvedValue(mockWallet);

            // Create a shared QueryClient for this test
            const sharedQueryClient = new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: false,
                        gcTime: 0,
                    },
                },
            });

            const SharedWrapper = ({
                children,
            }: {
                children: React.ReactNode;
            }) => (
                <QueryClientProvider client={sharedQueryClient}>
                    {children}
                </QueryClientProvider>
            );

            const { result: result1 } = renderHook(() => useWalletStats(), {
                wrapper: SharedWrapper,
            });

            const { result: result2 } = renderHook(() => useWalletStats(), {
                wrapper: SharedWrapper,
            });

            await waitFor(() => {
                expect(result1.current.ledgerBalance).toBe(4250.25);
                expect(result2.current.ledgerBalance).toBe(4250.25);
            });

            // Should share cache between hook instances
            expect(mockFetchWallet).toHaveBeenCalledTimes(1);
        });
    });

    describe('Data Consistency', () => {
        it('should maintain data consistency across multiple hook instances', async () => {
            mockFetchWallet.mockResolvedValue(mockWallet);

            const { result: walletResult } = renderHook(() => useWallet(), {
                wrapper: createWrapper(),
            });

            const { result: statsResult } = renderHook(() => useWalletStats(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(walletResult.current.data).toEqual(mockWallet);
                expect(statsResult.current.ledgerBalance).toBe(4250.25);
            });

            // Both hooks should use the same underlying data
            expect(statsResult.current.totalPayout).toBe(
                walletResult.current.data?.total_payout
            );
            expect(statsResult.current.totalRevenue).toBe(
                walletResult.current.data?.total_revenue
            );
            expect(statsResult.current.pendingPayout).toBe(
                walletResult.current.data?.pending_payout
            );
        });

        it('should update stats when wallet data changes', async () => {
            mockFetchWallet.mockResolvedValue(mockWallet);

            const { result } = renderHook(() => useWalletStats(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.ledgerBalance).toBe(4250.25);
            });

            // Update mock data
            const updatedWallet: Wallet = {
                ...mockWallet,
                balance: 6000,
                ledger_balance: 5250,
            };
            mockFetchWallet.mockResolvedValue(updatedWallet);

            // Force refetch by creating new wrapper
            const { result: newResult } = renderHook(() => useWalletStats(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(newResult.current.ledgerBalance).toBe(5250);
            });
        });
    });
});
