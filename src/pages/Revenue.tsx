import React, { useState } from 'react';
import { Box, Container, VStack } from '@chakra-ui/react';
import { FilterState } from '@/utils';
import { WalletBalance, WalletStats } from '@/components/WalletStats';
import { Transactions, TransactionChart } from '@/components/Transactions';
import { useWallet, useWalletStats, useFilteredTransactions } from '@/hooks';
import { RevenueSkeleton } from '../components/ui/Skeleton';

const Revenue: React.FC = () => {
    const [filterState, setFilterState] = useState<FilterState>({
        dateRange: 'all-time',
        dateFrom: null,
        dateTo: null,
        transactionType: [],
        transactionStatus: [],
    });

    // Fetch all data to check loading states
    const { isLoading: walletLoading } = useWallet();
    const { isLoading: walletStatsLoading } = useWalletStats();
    const { isLoading: transactionsLoading } =
        useFilteredTransactions(filterState);

    // Unified loading state
    const isAnyLoading =
        walletLoading || walletStatsLoading || transactionsLoading;

    const handleFilterChange = (newFilters: FilterState) => {
        setFilterState(newFilters);
    };

    const handleClearFilters = () => {
        setFilterState({
            dateRange: 'all-time',
            dateFrom: null,
            dateTo: null,
            transactionType: [],
            transactionStatus: [],
        });
    };

    const handleWithdraw = () => {
        console.log('Withdraw button clicked');
    };

    // Show skeleton loading state if any data is loading
    if (isAnyLoading) {
        return <RevenueSkeleton />;
    }

    return (
        <Container>
            <VStack
                css={{
                    width: '100%',
                    rowGap: '50px',

                    '@media (min-width: 768px)': {
                        rowGap: '82px',
                    },
                }}
            >
                <Box
                    display='flex'
                    flexDirection='column'
                    justifyContent='center'
                    alignItems='flex-start'
                    width='100%'
                    gap='50px'
                    css={{
                        '@media (min-width: 768px)': {
                            flexDirection: 'row',
                        },
                    }}
                >
                    <VStack
                        alignItems='flex-start'
                        gapY='32px'
                        css={{
                            '@media (min-width: 768px)': {
                                flex: 1,
                            },

                            '@media (max-width: 768px)': {
                                width: '100%',
                            },
                        }}
                    >
                        {/* Wallet Balance */}
                        <WalletBalance onWithdraw={handleWithdraw} />

                        {/* Transaction Chart */}
                        <TransactionChart filterState={filterState} />
                    </VStack>
                    <Box
                        css={{
                            '@media (max-width: 768px)': {
                                width: '100%',
                            },
                        }}
                    >
                        {/* Wallet Stats */}
                        <WalletStats />
                    </Box>
                </Box>

                {/* Transaction Records */}
                <Transactions
                    filterState={filterState}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                />
            </VStack>
        </Container>
    );
};

export default Revenue;
