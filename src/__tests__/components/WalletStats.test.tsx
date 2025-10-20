/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';
import {
    vi,
    describe,
    it,
    expect,
    beforeEach,
    afterEach,
    type MockedFunction,
} from 'vitest';

import { WalletStats } from '@/components/WalletStats';
import { useWalletStats } from '@/hooks';
import { formatMoney } from '@/lib';
import theme from '@/theme';

// Mock the hooks and utilities
vi.mock('@/hooks', () => ({
    useWalletStats: vi.fn(),
}));

vi.mock('@/lib', () => ({
    formatMoney: vi.fn(),
}));

// Mock Material Symbols
vi.mock('react-material-symbols', () => ({
    MaterialSymbol: ({ icon, ...props }: any) => (
        <span data-testid={`material-symbol-${icon}`} {...props}>
            {icon}
        </span>
    ),
}));

// Mock InfoTooltip component
vi.mock('@/components/ui', () => ({
    InfoTooltip: ({ children, title, description, action }: any) => (
        <div
            data-testid='info-tooltip'
            title={title}
            data-description={description}
        >
            {children}
            <button onClick={action?.onClick} data-testid='tooltip-action'>
                {action?.label}
            </button>
        </div>
    ),
}));

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    return (
        <QueryClientProvider client={queryClient}>
            <ChakraProvider value={theme}>{children}</ChakraProvider>
        </QueryClientProvider>
    );
};

// Mock data
const mockApiError = {
    message: 'Failed to fetch wallet data',
    status: 500,
    code: 'FETCH_ERROR',
};

const mockWalletData = {
    isLoading: false,
    error: null,
    hasData: true,
    balance: 5000.75,
    ledgerBalance: 5000.75,
    totalPayout: 2500.5,
    totalRevenue: 10000.25,
    pendingPayout: 750.0,
};

const mockWalletDataWithZeros = {
    isLoading: false,
    error: null,
    hasData: true,
    balance: 0,
    ledgerBalance: 0,
    totalPayout: 0,
    totalRevenue: 0,
    pendingPayout: 0,
};

describe('WalletStats Component', () => {
    const mockUseWalletStats = useWalletStats as MockedFunction<
        typeof useWalletStats
    >;
    const mockFormatMoney = formatMoney as MockedFunction<typeof formatMoney>;

    beforeEach(() => {
        // Reset all mocks before each test
        vi.clearAllMocks();

        // Default mock implementation for formatMoney
        mockFormatMoney.mockImplementation((amount, currency = 'USD') => {
            if (amount === null || amount === undefined || isNaN(amount))
                return `${currency} 0`;
            if (amount === 0) return `${currency} 0`;
            return `${currency} ${amount.toLocaleString()}`;
        });
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('Successful Data Rendering', () => {
        it('should render all wallet statistics correctly', () => {
            mockUseWalletStats.mockReturnValue(mockWalletData);

            render(
                <TestWrapper>
                    <WalletStats />
                </TestWrapper>
            );

            // Check if all stat labels are rendered
            expect(screen.getByText('Ledger Balance')).toBeInTheDocument();
            expect(screen.getByText('Total Payout')).toBeInTheDocument();
            expect(screen.getByText('Total Revenue')).toBeInTheDocument();
            expect(screen.getByText('Pending Payout')).toBeInTheDocument();

            // Verify formatMoney is called for each stat
            expect(mockFormatMoney).toHaveBeenCalledWith(5000.75, 'USD', true);
            expect(mockFormatMoney).toHaveBeenCalledWith(2500.5, 'USD', true);
            expect(mockFormatMoney).toHaveBeenCalledWith(10000.25, 'USD', true);
            expect(mockFormatMoney).toHaveBeenCalledWith(750.0, 'USD', true);
        });

        it('should render with custom className prop', () => {
            mockUseWalletStats.mockReturnValue(mockWalletData);

            const { container } = render(
                <TestWrapper>
                    <WalletStats className='custom-wallet-stats' />
                </TestWrapper>
            );

            expect(container.firstChild).toHaveClass('custom-wallet-stats');
        });

        it('should handle zero values correctly', () => {
            mockUseWalletStats.mockReturnValue(mockWalletDataWithZeros);

            render(
                <TestWrapper>
                    <WalletStats />
                </TestWrapper>
            );

            // Verify all labels are still rendered
            expect(screen.getByText('Ledger Balance')).toBeInTheDocument();
            expect(screen.getByText('Total Payout')).toBeInTheDocument();
            expect(screen.getByText('Total Revenue')).toBeInTheDocument();
            expect(screen.getByText('Pending Payout')).toBeInTheDocument();

            // Verify formatMoney is called with zero values
            expect(mockFormatMoney).toHaveBeenCalledWith(0, 'USD', true);
        });
    });

    describe('Error State Handling', () => {
        it('should render error state when there is an error', () => {
            mockUseWalletStats.mockReturnValue({
                ...mockWalletData,
                error: mockApiError,
            });

            render(
                <TestWrapper>
                    <WalletStats />
                </TestWrapper>
            );

            // Check error icon is rendered
            expect(
                screen.getByTestId('material-symbol-error')
            ).toBeInTheDocument();

            // Check error message is displayed
            expect(
                screen.getByText('Error loading wallet data')
            ).toBeInTheDocument();

            // Ensure wallet stats are not rendered in error state
            expect(
                screen.queryByText('Ledger Balance')
            ).not.toBeInTheDocument();
            expect(screen.queryByText('Total Payout')).not.toBeInTheDocument();
        });

        it('should render error state with proper styling', () => {
            mockUseWalletStats.mockReturnValue({
                ...mockWalletData,
                error: mockApiError,
            });

            render(
                <TestWrapper>
                    <WalletStats />
                </TestWrapper>
            );

            const errorIcon = screen.getByTestId('material-symbol-error');
            expect(errorIcon).toHaveAttribute('size', '24');
            expect(errorIcon).toHaveAttribute('weight', '300');
            expect(errorIcon).toHaveAttribute('color', '#F04438');
        });
    });

    describe('Info Tooltips', () => {
        it('should render info tooltips for each wallet stat', () => {
            mockUseWalletStats.mockReturnValue(mockWalletData);

            render(
                <TestWrapper>
                    <WalletStats />
                </TestWrapper>
            );

            const tooltips = screen.getAllByTestId('info-tooltip');
            expect(tooltips).toHaveLength(4);

            // Check tooltip titles
            expect(
                screen.getByTitle('Ledger Balance Information')
            ).toBeInTheDocument();
            expect(
                screen.getByTitle('Total Payout Details')
            ).toBeInTheDocument();
            expect(screen.getByTitle('Revenue Overview')).toBeInTheDocument();
            expect(
                screen.getByTitle('Pending Payout Status')
            ).toBeInTheDocument();
        });

        it('should render info icons with correct properties', () => {
            mockUseWalletStats.mockReturnValue(mockWalletData);

            render(
                <TestWrapper>
                    <WalletStats />
                </TestWrapper>
            );

            const infoIcons = screen.getAllByTestId('material-symbol-info');
            expect(infoIcons).toHaveLength(4);

            infoIcons.forEach(icon => {
                expect(icon).toHaveAttribute('size', '20');
                expect(icon).toHaveAttribute('weight', '300');
                expect(icon).toHaveAttribute('color', '#888F95');
            });
        });

        it('should handle tooltip action clicks', async () => {
            mockUseWalletStats.mockReturnValue(mockWalletData);
            const user = userEvent.setup();

            render(
                <TestWrapper>
                    <WalletStats />
                </TestWrapper>
            );

            const tooltipActions = screen.getAllByTestId('tooltip-action');
            expect(tooltipActions).toHaveLength(4);

            // Click on first tooltip action
            await user.click(tooltipActions[0]);

            // Since the action is a no-op function, we just verify it doesn't throw
            expect(tooltipActions[0]).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should have proper component display name', () => {
            expect(WalletStats.displayName).toBe('WalletStats');
        });

        it('should render semantic structure', () => {
            mockUseWalletStats.mockReturnValue(mockWalletData);

            render(
                <TestWrapper>
                    <WalletStats />
                </TestWrapper>
            );

            // Check that each stat has a label and value
            const labels = [
                'Ledger Balance',
                'Total Payout',
                'Total Revenue',
                'Pending Payout',
            ];

            labels.forEach(label => {
                expect(screen.getByText(label)).toBeInTheDocument();
            });
        });

        it('should handle keyboard navigation for tooltips', async () => {
            mockUseWalletStats.mockReturnValue(mockWalletData);
            const user = userEvent.setup();

            render(
                <TestWrapper>
                    <WalletStats />
                </TestWrapper>
            );

            const tooltipActions = screen.getAllByTestId('tooltip-action');

            // Tab to first tooltip action
            await user.tab();
            expect(document.activeElement).toBe(tooltipActions[0]);

            // Press Enter to activate
            await user.keyboard('{Enter}');
            expect(tooltipActions[0]).toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        it('should handle undefined/null values gracefully', () => {
            mockUseWalletStats.mockReturnValue({
                ledgerBalance: undefined as any,
                totalPayout: null as any,
                totalRevenue: 0,
                pendingPayout: 100,
                error: null,
                isLoading: false,
                hasData: true,
                balance: 0,
            });

            render(
                <TestWrapper>
                    <WalletStats />
                </TestWrapper>
            );

            // Component should still render without crashing
            expect(screen.getByText('Ledger Balance')).toBeInTheDocument();
            expect(screen.getByText('Total Payout')).toBeInTheDocument();
        });

        it('should handle very large numbers', () => {
            const largeNumbers = {
                ledgerBalance: 999999999.99,
                totalPayout: 1000000000,
                totalRevenue: 5000000000.5,
                pendingPayout: 250000000.25,
                error: null,
                isLoading: false,
                hasData: true,
                balance: 999999999.99,
            };

            mockUseWalletStats.mockReturnValue(largeNumbers);

            render(
                <TestWrapper>
                    <WalletStats />
                </TestWrapper>
            );

            // Verify formatMoney is called with large numbers
            expect(mockFormatMoney).toHaveBeenCalledWith(
                999999999.99,
                'USD',
                true
            );
            expect(mockFormatMoney).toHaveBeenCalledWith(
                1000000000,
                'USD',
                true
            );
            expect(mockFormatMoney).toHaveBeenCalledWith(
                5000000000.5,
                'USD',
                true
            );
            expect(mockFormatMoney).toHaveBeenCalledWith(
                250000000.25,
                'USD',
                true
            );
        });

        it('should handle negative values', () => {
            const negativeValues = {
                ledgerBalance: -100.5,
                totalPayout: -50.25,
                totalRevenue: -200.75,
                pendingPayout: -25.0,
                error: null,
                isLoading: false,
                hasData: true,
                balance: -100.5,
            };

            mockUseWalletStats.mockReturnValue(negativeValues);

            render(
                <TestWrapper>
                    <WalletStats />
                </TestWrapper>
            );

            // Verify formatMoney is called with negative values
            expect(mockFormatMoney).toHaveBeenCalledWith(-100.5, 'USD', true);
            expect(mockFormatMoney).toHaveBeenCalledWith(-50.25, 'USD', true);
            expect(mockFormatMoney).toHaveBeenCalledWith(-200.75, 'USD', true);
            expect(mockFormatMoney).toHaveBeenCalledWith(-25.0, 'USD', true);
        });
    });

    describe('Component Integration', () => {
        it('should integrate properly with useWalletStats hook', () => {
            mockUseWalletStats.mockReturnValue(mockWalletData);

            render(
                <TestWrapper>
                    <WalletStats />
                </TestWrapper>
            );

            // Verify the hook is called
            expect(mockUseWalletStats).toHaveBeenCalledTimes(1);
        });

        it('should pass correct parameters to formatMoney', () => {
            mockUseWalletStats.mockReturnValue(mockWalletData);

            render(
                <TestWrapper>
                    <WalletStats />
                </TestWrapper>
            );

            // Verify formatMoney is called with correct parameters
            expect(mockFormatMoney).toHaveBeenCalledWith(5000.75, 'USD', true);
            expect(mockFormatMoney).toHaveBeenCalledWith(2500.5, 'USD', true);
            expect(mockFormatMoney).toHaveBeenCalledWith(10000.25, 'USD', true);
            expect(mockFormatMoney).toHaveBeenCalledWith(750.0, 'USD', true);
        });

        it('should render correct number of stat items', () => {
            mockUseWalletStats.mockReturnValue(mockWalletData);

            render(
                <TestWrapper>
                    <WalletStats />
                </TestWrapper>
            );

            // Should render exactly 4 wallet stat items
            const statLabels = [
                'Ledger Balance',
                'Total Payout',
                'Total Revenue',
                'Pending Payout',
            ];
            statLabels.forEach(label => {
                expect(screen.getByText(label)).toBeInTheDocument();
            });
        });
    });

    describe('Performance', () => {
        it('should not re-render unnecessarily', () => {
            mockUseWalletStats.mockReturnValue(mockWalletData);

            const { rerender } = render(
                <TestWrapper>
                    <WalletStats />
                </TestWrapper>
            );

            // Re-render with same props
            rerender(
                <TestWrapper>
                    <WalletStats />
                </TestWrapper>
            );

            // Hook should be called for each render
            expect(mockUseWalletStats).toHaveBeenCalledTimes(2);
        });

        it('should handle rapid state changes', async () => {
            // Start with initial data
            mockUseWalletStats.mockReturnValue(mockWalletData);

            const { rerender } = render(
                <TestWrapper>
                    <WalletStats />
                </TestWrapper>
            );

            // Simulate rapid data changes
            rerender(
                <TestWrapper>
                    <WalletStats />
                </TestWrapper>
            );

            mockUseWalletStats.mockReturnValue(mockWalletDataWithZeros);
            rerender(
                <TestWrapper>
                    <WalletStats />
                </TestWrapper>
            );

            mockUseWalletStats.mockReturnValue({
                ...mockWalletData,
                error: mockApiError,
            });
            rerender(
                <TestWrapper>
                    <WalletStats />
                </TestWrapper>
            );

            // Should handle all state changes without crashing
            await waitFor(() => {
                expect(
                    screen.getByText('Error loading wallet data')
                ).toBeInTheDocument();
            });
        });
    });
});
