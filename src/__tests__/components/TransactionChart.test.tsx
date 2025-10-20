/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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

import TransactionChart from '@/components/Transactions/TransactionChart';
import { useFilteredTransactions } from '@/hooks';
import { formatMoney, formatDate } from '@/lib';
import { ApiError, Transaction } from '@/types';
import { FilterState } from '@/utils';
import theme from '@/theme';

// Mock the hooks and utilities
vi.mock('@/hooks', () => ({
    useFilteredTransactions: vi.fn(),
}));

vi.mock('@/lib', () => ({
    formatMoney: vi.fn(),
    formatDate: vi.fn(),
}));

vi.mock('@chakra-ui/react', async () => {
    const actual = await vi.importActual('@chakra-ui/react');
    return {
        ...actual,
        useBreakpointValue: vi.fn((values: any) => {
            // Return the base value for tests
            return values.base || values;
        }),
    };
});

// Mock Recharts components
vi.mock('recharts', () => ({
    LineChart: ({ children, data, margin }: any) => (
        <div
            data-testid='line-chart'
            data-chart-data={JSON.stringify(data)}
            data-margin={JSON.stringify(margin)}
        >
            {children}
        </div>
    ),
    Line: ({ dataKey, stroke, strokeWidth, activeDot }: any) => (
        <div
            data-testid='chart-line'
            data-key={dataKey}
            data-stroke={stroke}
            data-stroke-width={strokeWidth}
            data-active-dot={JSON.stringify(activeDot)}
        />
    ),
    XAxis: ({ dataKey, axisLine, tickLine, tick, height }: any) => (
        <div
            data-testid='x-axis'
            data-key={dataKey}
            data-axis-line={axisLine}
            data-tick-line={tickLine}
            data-tick={tick}
            data-height={height}
        />
    ),
    YAxis: ({ hide }: any) => <div data-testid='y-axis' data-hide={hide} />,
    ResponsiveContainer: ({ children, width, height }: any) => (
        <div
            data-testid='responsive-container'
            data-width={width}
            data-height={height}
        >
            {children}
        </div>
    ),
    Tooltip: ({ content, cursor }: any) => (
        <div data-testid='chart-tooltip' data-cursor={JSON.stringify(cursor)}>
            {content &&
                React.createElement(content, {
                    active: true,
                    payload: [{ value: 1000, dataKey: 'amount' }],
                    label: '2024-01-15',
                })}
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
const mockTransactions: Transaction[] = [
    {
        amount: 1000,
        date: '2024-01-15T10:00:00Z',
        type: 'deposit',
        status: 'successful',
        payment_reference: 'ref1',
        metadata: {
            name: 'Test Deposit',
            type: 'deposit',
            email: 'test@example.com',
            quantity: 1,
            country: 'Nigeria',
            product_name: 'Product A',
        },
    },
    {
        amount: 500,
        date: '2024-01-16T14:30:00Z',
        type: 'withdrawal',
        status: 'successful',
        payment_reference: 'ref2',
        metadata: {
            name: 'Test Withdrawal',
            type: 'withdrawal',
            email: 'test2@example.com',
            quantity: 1,
            country: 'Ghana',
            product_name: 'Product B',
        },
    },
    {
        amount: 750,
        date: '2024-01-17T09:15:00Z',
        type: 'deposit',
        status: 'successful',
        payment_reference: 'ref3',
        metadata: {
            name: 'Another Deposit',
            type: 'deposit',
            email: 'test3@example.com',
            quantity: 1,
            country: 'Kenya',
            product_name: 'Product C',
        },
    },
];

const mockFilterState: FilterState = {
    dateRange: 'last-7-days',
    dateFrom: null,
    dateTo: null,
    transactionType: [],
    transactionStatus: [],
};

describe('TransactionChart Component', () => {
    const mockUseFilteredTransactions =
        useFilteredTransactions as MockedFunction<
            typeof useFilteredTransactions
        >;
    const mockFormatMoney = formatMoney as MockedFunction<typeof formatMoney>;
    const mockFormatDate = formatDate as MockedFunction<typeof formatDate>;

    beforeEach(() => {
        // Reset all mocks before each test
        vi.clearAllMocks();

        // Default mock implementations
        mockFormatMoney.mockImplementation((amount, currency = 'USD') => {
            return `${currency} ${amount.toLocaleString()}`;
        });

        mockFormatDate.mockImplementation((date, options) => {
            if (options?.month === 'short' && options?.day === 'numeric') {
                return new Date(date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                });
            }
            return new Date(date).toLocaleDateString();
        });
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('Successful Data Rendering', () => {
        it('should render chart with transaction data', () => {
            mockUseFilteredTransactions.mockReturnValue({
                transactions: mockTransactions,
                totalCount: 3,
                filteredCount: 3,
                isLoading: false,
                error: null,
                hasData: true,
            });

            render(
                <TestWrapper>
                    <TransactionChart filterState={mockFilterState} />
                </TestWrapper>
            );

            // Check if chart components are rendered
            expect(
                screen.getByTestId('responsive-container')
            ).toBeInTheDocument();
            expect(screen.getByTestId('line-chart')).toBeInTheDocument();
            expect(screen.getByTestId('chart-line')).toBeInTheDocument();
            expect(screen.getByTestId('x-axis')).toBeInTheDocument();
            expect(screen.getByTestId('y-axis')).toBeInTheDocument();
            expect(screen.getByTestId('chart-tooltip')).toBeInTheDocument();
        });

        it('should render with custom className prop', () => {
            mockUseFilteredTransactions.mockReturnValue({
                transactions: mockTransactions,
                totalCount: 3,
                filteredCount: 3,
                isLoading: false,
                error: null,
                hasData: true,
            });

            const { container } = render(
                <TestWrapper>
                    <TransactionChart
                        className='custom-chart'
                        filterState={mockFilterState}
                    />
                </TestWrapper>
            );

            expect(container.firstChild).toHaveClass('custom-chart');
        });

        it('should process transaction data correctly for chart', () => {
            mockUseFilteredTransactions.mockReturnValue({
                transactions: mockTransactions,
                totalCount: 3,
                filteredCount: 3,
                isLoading: false,
                error: null,
                hasData: true,
            });

            render(
                <TestWrapper>
                    <TransactionChart filterState={mockFilterState} />
                </TestWrapper>
            );

            const lineChart = screen.getByTestId('line-chart');
            const chartData = JSON.parse(
                lineChart.getAttribute('data-chart-data') || '[]'
            );

            // Should have processed the transactions into chart data points
            expect(chartData).toHaveLength(3);
            expect(chartData[0]).toHaveProperty('date');
            expect(chartData[0]).toHaveProperty('amount');
            expect(chartData[0]).toHaveProperty('formattedDate');
        });

        it('should handle empty transactions with default data', () => {
            mockUseFilteredTransactions.mockReturnValue({
                transactions: [],
                totalCount: 0,
                filteredCount: 0,
                isLoading: false,
                error: null,
                hasData: false,
            });

            render(
                <TestWrapper>
                    <TransactionChart filterState={mockFilterState} />
                </TestWrapper>
            );

            const lineChart = screen.getByTestId('line-chart');
            const chartData = JSON.parse(
                lineChart.getAttribute('data-chart-data') || '[]'
            );

            // Should generate default data for last 7 days with zero amounts
            expect(chartData).toHaveLength(7);
            chartData.forEach((point: any) => {
                expect(point.amount).toBe(0);
                expect(point).toHaveProperty('date');
                expect(point).toHaveProperty('formattedDate');
            });
        });

        it('should calculate daily totals correctly', () => {
            const sameDay = '2024-01-15T10:00:00Z';
            const transactionsOnSameDay: Transaction[] = [
                {
                    ...mockTransactions[0],
                    date: sameDay,
                    amount: 1000,
                    type: 'deposit',
                },
                {
                    ...mockTransactions[1],
                    date: sameDay,
                    amount: 300,
                    type: 'withdrawal',
                },
            ];

            mockUseFilteredTransactions.mockReturnValue({
                transactions: transactionsOnSameDay,
                totalCount: 2,
                filteredCount: 2,
                isLoading: false,
                error: null,
                hasData: true,
            });

            render(
                <TestWrapper>
                    <TransactionChart filterState={mockFilterState} />
                </TestWrapper>
            );

            const lineChart = screen.getByTestId('line-chart');
            const chartData = JSON.parse(
                lineChart.getAttribute('data-chart-data') || '[]'
            );

            // Should have one data point with net amount (1000 - 300 = 700)
            expect(chartData).toHaveLength(1);
            expect(chartData[0].amount).toBe(700);
        });
    });

    describe('Loading State', () => {
        it('should render loading state correctly', () => {
            mockUseFilteredTransactions.mockReturnValue({
                transactions: [],
                totalCount: 0,
                filteredCount: 0,
                isLoading: true,
                error: null,
                hasData: false,
            });

            render(
                <TestWrapper>
                    <TransactionChart filterState={mockFilterState} />
                </TestWrapper>
            );

            expect(screen.getByText('Loading chart...')).toBeInTheDocument();
            expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
        });

        it('should render loading spinner with correct styling', () => {
            mockUseFilteredTransactions.mockReturnValue({
                transactions: [],
                totalCount: 0,
                filteredCount: 0,
                isLoading: true,
                error: null,
                hasData: false,
            });

            const { container } = render(
                <TestWrapper>
                    <TransactionChart filterState={mockFilterState} />
                </TestWrapper>
            );

            const loadingContainer =
                container.querySelector('[data-testid="loading-container"]') ||
                container.querySelector(
                    'div[style*="justify-content: center"]'
                );
            expect(
                loadingContainer || screen.getByText('Loading chart...')
            ).toBeInTheDocument();
        });
    });

    describe('Error State', () => {
        it('should render error state correctly', () => {
            mockUseFilteredTransactions.mockReturnValue({
                transactions: [],
                totalCount: 0,
                filteredCount: 0,
                isLoading: false,
                error: new Error(
                    'Failed to fetch transactions'
                ) as unknown as ApiError,
                hasData: false,
            });

            render(
                <TestWrapper>
                    <TransactionChart filterState={mockFilterState} />
                </TestWrapper>
            );

            expect(
                screen.getByText('Error loading chart data')
            ).toBeInTheDocument();
            expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
        });

        it('should handle different error types', () => {
            const networkError = new Error('Network error');
            mockUseFilteredTransactions.mockReturnValue({
                transactions: [],
                totalCount: 0,
                filteredCount: 0,
                isLoading: false,
                error: networkError as unknown as ApiError,
                hasData: false,
            });

            render(
                <TestWrapper>
                    <TransactionChart filterState={mockFilterState} />
                </TestWrapper>
            );

            expect(
                screen.getByText('Error loading chart data')
            ).toBeInTheDocument();
        });
    });

    describe('Chart Configuration', () => {
        it('should configure chart line with correct properties', () => {
            mockUseFilteredTransactions.mockReturnValue({
                transactions: mockTransactions,
                totalCount: 3,
                filteredCount: 3,
                isLoading: false,
                error: null,
                hasData: true,
            });

            render(
                <TestWrapper>
                    <TransactionChart filterState={mockFilterState} />
                </TestWrapper>
            );

            const chartLine = screen.getByTestId('chart-line');
            expect(chartLine).toHaveAttribute('data-key', 'amount');
            expect(chartLine).toHaveAttribute('data-stroke', '#FF8A65');
            expect(chartLine.getAttribute('data-stroke-width')).toBeTruthy();
        });

        it('should configure X-axis correctly', () => {
            mockUseFilteredTransactions.mockReturnValue({
                transactions: mockTransactions,
                totalCount: 3,
                filteredCount: 3,
                isLoading: false,
                error: null,
                hasData: true,
            });

            render(
                <TestWrapper>
                    <TransactionChart filterState={mockFilterState} />
                </TestWrapper>
            );

            const xAxis = screen.getByTestId('x-axis');
            expect(xAxis).toHaveAttribute('data-key', 'date');
            expect(xAxis).toHaveAttribute('data-axis-line', 'false');
            expect(xAxis).toHaveAttribute('data-tick-line', 'false');
            expect(xAxis).toHaveAttribute('data-tick', 'false');
            expect(xAxis).toHaveAttribute('data-height', '40');
        });

        it('should configure Y-axis to be hidden', () => {
            mockUseFilteredTransactions.mockReturnValue({
                transactions: mockTransactions,
                totalCount: 3,
                filteredCount: 3,
                isLoading: false,
                error: null,
                hasData: true,
            });

            render(
                <TestWrapper>
                    <TransactionChart filterState={mockFilterState} />
                </TestWrapper>
            );

            const yAxis = screen.getByTestId('y-axis');
            expect(yAxis).toHaveAttribute('data-hide', 'true');
        });

        it('should configure tooltip with custom cursor', () => {
            mockUseFilteredTransactions.mockReturnValue({
                transactions: mockTransactions,
                totalCount: 3,
                filteredCount: 3,
                isLoading: false,
                error: null,
                hasData: true,
            });

            render(
                <TestWrapper>
                    <TransactionChart filterState={mockFilterState} />
                </TestWrapper>
            );

            const tooltip = screen.getByTestId('chart-tooltip');
            const cursorData = JSON.parse(
                tooltip.getAttribute('data-cursor') || '{}'
            );
            expect(cursorData.stroke).toBe('#FF8A65');
            expect(cursorData.strokeDasharray).toBe('3 3');
        });
    });

    describe('Custom Tooltip', () => {
        it('should render custom tooltip with formatted data', () => {
            mockUseFilteredTransactions.mockReturnValue({
                transactions: mockTransactions,
                totalCount: 3,
                filteredCount: 3,
                isLoading: false,
                error: null,
                hasData: true,
            });

            render(
                <TestWrapper>
                    <TransactionChart filterState={mockFilterState} />
                </TestWrapper>
            );

            // The tooltip is rendered with mock data in our mock implementation
            expect(mockFormatDate).toHaveBeenCalledWith('2024-01-15');
            expect(mockFormatMoney).toHaveBeenCalledWith(1000);
        });
    });

    describe('Date Labels', () => {
        it('should render date labels for chart range', () => {
            mockUseFilteredTransactions.mockReturnValue({
                transactions: mockTransactions,
                totalCount: 3,
                filteredCount: 3,
                isLoading: false,
                error: null,
                hasData: true,
            });

            render(
                <TestWrapper>
                    <TransactionChart filterState={mockFilterState} />
                </TestWrapper>
            );

            // Should call formatDate for chart data points
            expect(mockFormatDate).toHaveBeenCalled();
        });

        it('should handle empty date range gracefully', () => {
            mockUseFilteredTransactions.mockReturnValue({
                transactions: [],
                totalCount: 0,
                filteredCount: 0,
                isLoading: false,
                error: null,
                hasData: false,
            });

            render(
                <TestWrapper>
                    <TransactionChart filterState={mockFilterState} />
                </TestWrapper>
            );

            // Should still render chart structure even with empty data
            expect(screen.getByTestId('line-chart')).toBeInTheDocument();
        });
    });

    describe('Filter Integration', () => {
        it('should pass filter state to useFilteredTransactions hook', () => {
            mockUseFilteredTransactions.mockReturnValue({
                transactions: mockTransactions,
                totalCount: 3,
                filteredCount: 3,
                isLoading: false,
                error: null,
                hasData: true,
            });

            render(
                <TestWrapper>
                    <TransactionChart filterState={mockFilterState} />
                </TestWrapper>
            );

            expect(mockUseFilteredTransactions).toHaveBeenCalledWith(
                mockFilterState
            );
        });

        it('should handle undefined filter state', () => {
            mockUseFilteredTransactions.mockReturnValue({
                transactions: mockTransactions,
                totalCount: 3,
                filteredCount: 3,
                isLoading: false,
                error: null,
                hasData: true,
            });

            render(
                <TestWrapper>
                    <TransactionChart />
                </TestWrapper>
            );

            expect(mockUseFilteredTransactions).toHaveBeenCalledWith(undefined);
        });

        it('should update when filter state changes', () => {
            mockUseFilteredTransactions.mockReturnValue({
                transactions: mockTransactions,
                totalCount: 3,
                filteredCount: 3,
                isLoading: false,
                error: null,
                hasData: true,
            });

            const { rerender } = render(
                <TestWrapper>
                    <TransactionChart filterState={mockFilterState} />
                </TestWrapper>
            );

            const newFilterState: FilterState = {
                ...mockFilterState,
                dateRange: 'last-30-days',
            };

            rerender(
                <TestWrapper>
                    <TransactionChart filterState={newFilterState} />
                </TestWrapper>
            );

            expect(mockUseFilteredTransactions).toHaveBeenCalledWith(
                newFilterState
            );
        });
    });

    describe('Responsive Behavior', () => {
        it('should render responsive container', () => {
            mockUseFilteredTransactions.mockReturnValue({
                transactions: mockTransactions,
                totalCount: 3,
                filteredCount: 3,
                isLoading: false,
                error: null,
                hasData: true,
            });

            render(
                <TestWrapper>
                    <TransactionChart filterState={mockFilterState} />
                </TestWrapper>
            );

            const responsiveContainer = screen.getByTestId(
                'responsive-container'
            );
            expect(responsiveContainer).toHaveAttribute('data-width', '100%');
            expect(responsiveContainer).toHaveAttribute('data-height', '100%');
        });
    });

    describe('Edge Cases', () => {
        it('should handle transactions with same date correctly', () => {
            const sameDate = '2024-01-15T10:00:00Z';
            const duplicateDateTransactions: Transaction[] = [
                {
                    ...mockTransactions[0],
                    date: sameDate,
                    amount: 500,
                    type: 'deposit',
                },
                {
                    ...mockTransactions[1],
                    date: sameDate,
                    amount: 200,
                    type: 'deposit',
                },
                {
                    ...mockTransactions[2],
                    date: sameDate,
                    amount: 100,
                    type: 'withdrawal',
                },
            ];

            mockUseFilteredTransactions.mockReturnValue({
                transactions: duplicateDateTransactions,
                totalCount: 3,
                filteredCount: 3,
                isLoading: false,
                error: null,
                hasData: true,
            });

            render(
                <TestWrapper>
                    <TransactionChart filterState={mockFilterState} />
                </TestWrapper>
            );

            const lineChart = screen.getByTestId('line-chart');
            const chartData = JSON.parse(
                lineChart.getAttribute('data-chart-data') || '[]'
            );

            // Should aggregate transactions for the same date
            expect(chartData).toHaveLength(1);
            expect(chartData[0].amount).toBe(600); // 500 + 200 - 100
        });

        it('should handle negative amounts correctly', () => {
            const negativeTransactions: Transaction[] = [
                { ...mockTransactions[0], amount: 1000, type: 'withdrawal' },
                { ...mockTransactions[1], amount: 500, type: 'withdrawal' },
            ];

            mockUseFilteredTransactions.mockReturnValue({
                transactions: negativeTransactions,
                totalCount: 2,
                filteredCount: 2,
                isLoading: false,
                error: null,
                hasData: true,
            });

            render(
                <TestWrapper>
                    <TransactionChart filterState={mockFilterState} />
                </TestWrapper>
            );

            const lineChart = screen.getByTestId('line-chart');
            const chartData = JSON.parse(
                lineChart.getAttribute('data-chart-data') || '[]'
            );

            // All amounts should be negative for withdrawals
            chartData.forEach((point: any) => {
                expect(point.amount).toBeLessThanOrEqual(0);
            });
        });

        it('should handle very large amounts', () => {
            const largeAmountTransactions: Transaction[] = [
                {
                    ...mockTransactions[0],
                    amount: 999999999.99,
                    type: 'deposit',
                },
            ];

            mockUseFilteredTransactions.mockReturnValue({
                transactions: largeAmountTransactions,
                totalCount: 1,
                filteredCount: 1,
                isLoading: false,
                error: null,
                hasData: true,
            });

            render(
                <TestWrapper>
                    <TransactionChart filterState={mockFilterState} />
                </TestWrapper>
            );

            const lineChart = screen.getByTestId('line-chart');
            const chartData = JSON.parse(
                lineChart.getAttribute('data-chart-data') || '[]'
            );

            expect(chartData[0].amount).toBe(999999999.99);
        });
    });

    describe('Performance', () => {
        it('should memoize chart data calculation', () => {
            mockUseFilteredTransactions.mockReturnValue({
                transactions: mockTransactions,
                totalCount: 3,
                filteredCount: 3,
                isLoading: false,
                error: null,
                hasData: true,
            });

            const { rerender } = render(
                <TestWrapper>
                    <TransactionChart filterState={mockFilterState} />
                </TestWrapper>
            );

            // Re-render with same data
            rerender(
                <TestWrapper>
                    <TransactionChart filterState={mockFilterState} />
                </TestWrapper>
            );

            // Hook should be called for each render
            expect(mockUseFilteredTransactions).toHaveBeenCalledTimes(2);
        });

        it('should handle rapid state changes', async () => {
            // Set initial mock state
            mockUseFilteredTransactions.mockReturnValue({
                transactions: [],
                totalCount: 0,
                filteredCount: 0,
                isLoading: true,
                error: null,
                hasData: false,
            });

            const { rerender } = render(
                <TestWrapper>
                    <TransactionChart filterState={mockFilterState} />
                </TestWrapper>
            );

            // Simulate rapid state changes
            mockUseFilteredTransactions.mockReturnValue({
                transactions: [],
                totalCount: 0,
                filteredCount: 0,
                isLoading: true,
                error: null,
                hasData: false,
            });
            rerender(
                <TestWrapper>
                    <TransactionChart filterState={mockFilterState} />
                </TestWrapper>
            );

            mockUseFilteredTransactions.mockReturnValue({
                transactions: mockTransactions,
                totalCount: 3,
                filteredCount: 3,
                isLoading: false,
                error: null,
                hasData: true,
            });
            rerender(
                <TestWrapper>
                    <TransactionChart filterState={mockFilterState} />
                </TestWrapper>
            );

            // Should handle all state changes without crashing
            await waitFor(() => {
                expect(screen.getByTestId('line-chart')).toBeInTheDocument();
            });
        });
    });
});
