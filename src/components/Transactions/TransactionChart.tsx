import React, { useMemo } from 'react';
import {
    Box,
    Spinner,
    Text,
    VStack,
    useBreakpointValue,
} from '@chakra-ui/react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
import { useFilteredTransactions } from '@/hooks';
import { Transaction } from '@/types';
import { FilterState } from '@/utils';
import { formatMoney, formatDate } from '@/lib';

interface ChartDataPoint {
    date: string;
    amount: number;
    formattedDate: string;
}

interface TransactionChartProps {
    className?: string;
    filterState?: FilterState;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
        value: number;
        dataKey: string;
    }>;
    label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
    active,
    payload,
    label,
}) => {
    if (active && payload && payload.length) {
        return (
            <Box
                bg='white'
                p={{ base: '8px', sm: '10px', md: '12px' }}
                borderRadius={{ base: '6px', md: '8px' }}
                boxShadow='0 4px 12px rgba(0, 0, 0, 0.1)'
                border='1px solid #E5E7EB'
                maxW={{ base: '200px', sm: '250px', md: '300px' }}
                fontSize={{ base: '12px', md: '14px' }}
            >
                <Text
                    fontSize={{ base: '10px', sm: '11px', md: '12px' }}
                    color='#6B7280'
                    mb={{ base: '2px', md: '4px' }}
                >
                    {formatDate(label as string)}
                </Text>
                <Text
                    fontSize={{ base: '12px', sm: '13px', md: '14px' }}
                    fontWeight='600'
                    color='#131316'
                >
                    {formatMoney(payload[0]?.value || 0)}
                </Text>
            </Box>
        );
    }
    return null;
};

const TransactionChart: React.FC<TransactionChartProps> = ({
    className,
    filterState,
}) => {
    const { transactions, isLoading, error } =
        useFilteredTransactions(filterState);

    // Responsive values for different screen sizes
    const chartHeight = useBreakpointValue({
        base: '200px',
        sm: '220px',
        md: '240px',
        lg: '257px',
        xl: '280px',
    });

    const chartMargins = useBreakpointValue({
        base: { top: 15, right: 15, left: 10, bottom: 30 },
        sm: { top: 18, right: 20, left: 15, bottom: 35 },
        md: { top: 20, right: 25, left: 20, bottom: 40 },
        lg: { top: 20, right: 30, left: 20, bottom: 40 },
        xl: { top: 25, right: 35, left: 25, bottom: 45 },
    });

    const strokeWidth = useBreakpointValue({
        base: 1.5,
        sm: 1.8,
        md: 2,
        lg: 2,
        xl: 2.5,
    });

    const activeDotRadius = useBreakpointValue({
        base: 3,
        sm: 3.5,
        md: 4,
        lg: 4,
        xl: 5,
    });

    const activeDotStrokeWidth = useBreakpointValue({
        base: 1.5,
        sm: 2,
        md: 2,
        lg: 2,
        xl: 2.5,
    });

    const chartData: ChartDataPoint[] = useMemo(() => {
        // If no transactions, generate a flat line at zero
        if (!transactions || transactions.length === 0) {
            const defaultData: ChartDataPoint[] = [];

            // Check if a specific date range is set
            if (filterState?.dateFrom && filterState?.dateTo) {
                // Generate flat line for the specified date range
                const startDate = new Date(filterState.dateFrom);
                const endDate = new Date(filterState.dateTo);

                // Ensure we have valid dates
                if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                    const currentDate = new Date(startDate);

                    while (currentDate <= endDate) {
                        const dateString = currentDate
                            .toISOString()
                            .split('T')[0];

                        defaultData.push({
                            date: dateString,
                            amount: 0,
                            formattedDate: formatDate(dateString, {
                                month: 'short',
                                day: 'numeric',
                            }),
                        });

                        // Move to next day
                        currentDate.setDate(currentDate.getDate() + 1);
                    }
                }
            } else {
                // Default to last 7 days if no date range is specified
                const today = new Date();

                for (let i = 6; i >= 0; i--) {
                    const date = new Date(today);
                    date.setDate(today.getDate() - i);
                    const dateString = date.toISOString().split('T')[0];

                    defaultData.push({
                        date: dateString,
                        amount: 0,
                        formattedDate: formatDate(dateString, {
                            month: 'short',
                            day: 'numeric',
                        }),
                    });
                }
            }

            return defaultData;
        }

        // Group transactions by date and calculate daily totals
        const dailyTotals = transactions.reduce(
            (acc, transaction: Transaction) => {
                const date = new Date(transaction.date)
                    .toISOString()
                    .split('T')[0];

                if (!acc[date]) {
                    acc[date] = 0;
                }

                // Add amount for deposits, subtract for withdrawals
                const amount: number =
                    transaction.type === 'deposit'
                        ? transaction.amount
                        : -transaction.amount;
                acc[date] += amount;

                return acc;
            },
            {} as Record<string, number>
        );

        // Convert to array and sort by date
        const sortedData = Object.entries(dailyTotals)
            .map(
                ([date, amount]): ChartDataPoint => ({
                    date,
                    amount: amount as number,
                    formattedDate: formatDate(date, {
                        month: 'short',
                        day: 'numeric',
                    }),
                })
            )
            .sort(
                (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
            );

        return sortedData;
    }, [transactions, filterState]);

    if (isLoading) {
        return (
            <Box
                className={className}
                w='100%'
                h={chartHeight}
                display='flex'
                alignItems='center'
                justifyContent='center'
                bg='#FFFFFF'
                borderRadius={{ base: '6px', md: '8px' }}
                minH={{ base: '180px', md: '200px' }}
            >
                <VStack gap={{ base: '8px', md: '12px' }}>
                    <Spinner
                        size={{ base: 'sm', md: 'md' }}
                        color='black'
                        borderWidth={{ base: '1.5px', md: '2px' }}
                    />
                    <Text
                        color='#6B7280'
                        fontSize={{ base: '12px', sm: '13px', md: '14px' }}
                    >
                        Loading chart...
                    </Text>
                </VStack>
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                className={className}
                w='100%'
                h={chartHeight}
                display='flex'
                alignItems='center'
                justifyContent='center'
                bg='#F9FAFB'
                borderRadius={{ base: '6px', md: '8px' }}
                minH={{ base: '180px', md: '200px' }}
            >
                <Text
                    color='#6B7280'
                    fontSize={{ base: '12px', sm: '13px', md: '14px' }}
                    textAlign='center'
                    px={{ base: '16px', md: '24px' }}
                >
                    Error loading chart data
                </Text>
            </Box>
        );
    }

    const minDate = chartData[0]?.formattedDate || '';
    const maxDate = chartData[chartData.length - 1]?.formattedDate || '';

    return (
        <Box
            className={className}
            w='100%'
            h={chartHeight}
            minH={{ base: '180px', md: '200px' }}
            maxW={{ base: '100%', lg: '765px', xl: '900px' }}
        >
            <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={chartData} margin={chartMargins}>
                    <XAxis
                        dataKey='date'
                        axisLine={false}
                        tickLine={false}
                        tick={false}
                        height={40}
                    />
                    <YAxis hide />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{
                            stroke: '#FF8A65',
                            strokeWidth: strokeWidth,
                            strokeDasharray: '3 3',
                        }}
                    />
                    <Line
                        type='monotone'
                        dataKey='amount'
                        stroke='#FF8A65'
                        strokeWidth={strokeWidth}
                        dot={false}
                        activeDot={{
                            r: activeDotRadius,
                            fill: '#FF8A65',
                            stroke: '#fff',
                            strokeWidth: activeDotStrokeWidth,
                        }}
                    />
                </LineChart>
            </ResponsiveContainer>

            {/* Custom date labels */}
            <Box
                display='flex'
                justifyContent='space-between'
                mt={{ base: '-25px', sm: '-28px', md: '-30px' }}
                px={{
                    base: '12px',
                    sm: '16px',
                    md: '20px',
                    lg: '20px',
                    xl: '25px',
                }}
                pt={{ base: '12px', sm: '14px', md: '15px' }}
                borderTop='1px solid #DBDEE5'
            >
                <Text
                    fontSize={{
                        base: '11px',
                        sm: '12px',
                        md: '14px',
                        lg: '16px',
                    }}
                    fontWeight={500}
                    color='#6B7280'
                >
                    {minDate}
                </Text>
                <Text
                    fontSize={{
                        base: '11px',
                        sm: '12px',
                        md: '14px',
                        lg: '16px',
                    }}
                    fontWeight={500}
                    color='#6B7280'
                >
                    {maxDate}
                </Text>
            </Box>
        </Box>
    );
};

export default TransactionChart;
