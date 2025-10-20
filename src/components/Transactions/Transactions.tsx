import React from 'react';
import { MaterialSymbol } from 'react-material-symbols';
import { VStack } from '@chakra-ui/react';
import {
    useTransactions,
    useFilteredTransactions,
} from '@/hooks/useTransactions';
import {
    formatMoney,
    formatDate,
    formatTransactionStatus,
    exportTransactionsToCSV,
} from '@/lib';
import { Transaction } from '@/types';
import { FilterState } from '@/utils';
import {
    TransactionsHeader,
    TransactionsEmpty,
    TransactionsError,
    TransactionBody,
    TransactionDetails,
    TransactionDetailSubtitle,
    TransactionDetailTitle,
    TransactionIcon,
    TransactionList,
    TransactionMeta,
    TransactionMetaAmount,
    TransactionMetaDate,
    TransactionRecord,
} from './';

interface TransactionsProps {
    filterState?: FilterState;
    onFilterChange?: (filters: FilterState) => void;
    onClearFilters?: () => void;
}

const Transactions = React.memo<TransactionsProps>(
    ({ filterState, onFilterChange, onClearFilters }) => {
        const { transactions, error, filteredCount } =
            useFilteredTransactions(filterState);
        const { refetch } = useTransactions(); // For error retry functionality

        // Handle CSV export
        const handleExport = React.useCallback(async () => {
            if (transactions) {
                await exportTransactionsToCSV(transactions);
            }
        }, [transactions]);

        // Error state
        if (error) {
            return (
                <VStack md={{ gapY: 8 }} gapY='45px' width='100%'>
                    <TransactionsHeader onExport={handleExport} />
                    <TransactionsError error={error} onRetry={refetch} />
                </VStack>
            );
        }

        // Empty state
        if (!transactions || transactions.length === 0) {
            return (
                <VStack md={{ gapY: 8 }} gapY='45px' width='100%'>
                    <TransactionsHeader onExport={handleExport} />
                    <TransactionsEmpty onClearFilters={onClearFilters} />
                </VStack>
            );
        }

        // Helper function to get transaction icon
        const getTransactionIcon = (type: Transaction['type']) => {
            switch (type) {
                case 'deposit':
                    return 'call_received';
                case 'withdrawal':
                    return 'call_made';
                default:
                    return 'swap_horiz';
            }
        };

        return (
            <VStack md={{ gapY: 8 }} gapY='45px' width='100%'>
                {/* Transactions Header */}
                <TransactionsHeader
                    transactionCount={filteredCount}
                    onExport={handleExport}
                    onFilterChange={onFilterChange}
                    currentFilters={filterState}
                />

                {/* Transactions List */}
                <TransactionList>
                    {transactions.map((transaction, index) => (
                        <TransactionRecord
                            key={`${transaction.payment_reference || 'tx'}-${index}`}
                        >
                            <TransactionBody>
                                <TransactionIcon type={transaction.type}>
                                    <MaterialSymbol
                                        icon={getTransactionIcon(
                                            transaction.type
                                        )}
                                        size={20}
                                        weight={200}
                                    />
                                </TransactionIcon>
                                <TransactionDetails>
                                    <TransactionDetailTitle>
                                        {transaction?.metadata?.product_name ||
                                            `Cash ${transaction.type}`}
                                    </TransactionDetailTitle>
                                    <TransactionDetailSubtitle
                                        {...(transaction.type ===
                                            'withdrawal' && {
                                            status: transaction.status,
                                        })}
                                    >
                                        {transaction.type === 'withdrawal'
                                            ? formatTransactionStatus(
                                                  transaction.status
                                              )
                                            : transaction?.metadata?.name ||
                                              `Cash ${transaction.type}`}
                                    </TransactionDetailSubtitle>
                                </TransactionDetails>
                            </TransactionBody>
                            <TransactionMeta>
                                <TransactionMetaAmount>
                                    {formatMoney(transaction.amount)}
                                </TransactionMetaAmount>
                                <TransactionMetaDate>
                                    {formatDate(transaction.date)}
                                </TransactionMetaDate>
                            </TransactionMeta>
                        </TransactionRecord>
                    ))}
                </TransactionList>
            </VStack>
        );
    }
);

Transactions.displayName = 'Transactions';

export default Transactions;
