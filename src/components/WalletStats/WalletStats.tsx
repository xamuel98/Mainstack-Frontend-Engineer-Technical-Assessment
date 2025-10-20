import React from 'react';
import { MaterialSymbol } from 'react-material-symbols';
import { useWalletStats } from '@/hooks';
import { formatMoney } from '@/lib';
import { InfoTooltip } from '@/components/ui';
import {
    WalletStatsContainer,
    WalletStatItem,
    WalletStatHeader,
    WalletStatLabel,
    WalletStatValue,
    WalletStatIcon,
} from './';
import { For, VStack, Text } from '@chakra-ui/react';

interface WalletStatsProps {
    className?: string;
}

const WalletStats: React.FC<WalletStatsProps> = ({ className }) => {
    const { ledgerBalance, totalPayout, totalRevenue, pendingPayout, error } =
        useWalletStats();

    if (error) {
        return (
            <WalletStatsContainer className={className}>
                <VStack
                    gap={{ base: '8px', md: '12px' }}
                    justifyContent='center'
                    alignItems='center'
                    height='100%'
                >
                    <MaterialSymbol
                        icon='error'
                        size={24}
                        weight={300}
                        color='#F04438'
                    />
                    <Text
                        color='#6B7280'
                        fontSize={{ base: '12px', sm: '13px', md: '14px' }}
                    >
                        Error loading wallet data
                    </Text>
                </VStack>
            </WalletStatsContainer>
        );
    }

    const walletStats = [
        {
            label: 'Ledger Balance',
            value: ledgerBalance,
            title: 'Ledger Balance Information',
            description:
                'Your current ledger balance available for transactions and withdrawals',
        },
        {
            label: 'Total Payout',
            value: totalPayout,
            title: 'Total Payout Details',
            description: 'Total amount paid out from your account to date',
        },
        {
            label: 'Total Revenue',
            value: totalRevenue,
            title: 'Revenue Overview',
            description:
                'Total revenue generated across all transactions and activities',
        },
        {
            label: 'Pending Payout',
            value: pendingPayout,
            title: 'Pending Payout Status',
            description: 'Amount currently pending for payout processing',
        },
    ];

    return (
        <WalletStatsContainer className={className}>
            <For each={walletStats}>
                {stat => (
                    <WalletStatItem key={`wallet-stat-${stat.label}`}>
                        <WalletStatHeader>
                            <WalletStatLabel>{stat.label}</WalletStatLabel>
                            <InfoTooltip
                                title={stat.title}
                                description={stat.description}
                                action={{ label: 'Got it', onClick: () => {} }}
                            >
                                <WalletStatIcon>
                                    <MaterialSymbol
                                        icon='info'
                                        size={20}
                                        weight={300}
                                        color='#888F95'
                                    />
                                </WalletStatIcon>
                            </InfoTooltip>
                        </WalletStatHeader>
                        <WalletStatValue>
                            {formatMoney(stat.value, 'USD', true)}
                        </WalletStatValue>
                    </WalletStatItem>
                )}
            </For>
        </WalletStatsContainer>
    );
};

WalletStats.displayName = 'WalletStats';

export default WalletStats;
