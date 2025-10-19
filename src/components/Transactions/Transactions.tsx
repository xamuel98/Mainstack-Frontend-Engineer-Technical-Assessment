import React from 'react'
import { MaterialSymbol } from 'react-material-symbols'
import { VStack, Spinner, For } from '@chakra-ui/react'
import { useTransactions } from '@/hooks/useTransactions'
import { formatMoney, formatDate, formatTransactionStatus } from '@/lib/formatters'
import { Transaction } from '@/types'
import { TransactionBody, TransactionDetails, TransactionDetailSubtitle, TransactionDetailTitle, TransactionIcon, TransactionList, TransactionMeta, TransactionMetaAmount, TransactionMetaDate, TransactionRecord } from './Transactions.styles'
import { TransactionsHeader, TransactionsEmpty, TransactionsError } from './'

const Transactions = React.memo(() => {
    const { data: transactions, isLoading, error, refetch } = useTransactions();

    // Loading state
    if (isLoading) {
        return (
            <VStack md={{ gapY: "65px" }} gapY={"45px"}>
                <VStack py={8}>
                    <Spinner size="xl" color="black" borderWidth="5px" />
                </VStack>
            </VStack>
        );
    }

    // Error state
    if (error) {
        return (
            <VStack md={{ gapY: "65px" }} gapY={"45px"}>
                <TransactionsHeader />
                <TransactionsError error={error} onRetry={refetch} />
            </VStack>
        );
    }

    // Empty state
    if (!transactions || transactions.length === 0) {
        return (
            <VStack md={{ gapY: "65px" }} gapY={"45px"}>
                <TransactionsHeader />
                <TransactionsEmpty />
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
        <VStack md={{ gapY: 8 }} gapY={6}>
            {/* Transactions Header */}
            <TransactionsHeader transactionCount={transactions.length} />

            {/* Transactions List */}
            <TransactionList>
                <For each={transactions}>
                    {(transaction, index) => (
                        <TransactionRecord key={`${transaction.payment_reference || 'tx'}-${index}`}>
                            <TransactionBody>
                                <TransactionIcon type={transaction.type}>
                                    <MaterialSymbol 
                                    icon={getTransactionIcon(transaction.type)} 
                                    size={20} 
                                    weight={200} 
                                />
                            </TransactionIcon>
                            <TransactionDetails>
                                <TransactionDetailTitle>
                                    {transaction?.metadata?.product_name || `Cash ${transaction.type}`}
                                </TransactionDetailTitle>
                                <TransactionDetailSubtitle 
                                    {...(transaction.type === 'withdrawal' && { status: transaction.status })}
                                >
                                    {transaction.type === 'withdrawal' 
                                        ? formatTransactionStatus(transaction.status)
                                        : transaction?.metadata?.name || `Cash ${transaction.type}`
                                    }
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
                    )}
                </For>
            </TransactionList>
        </VStack>
    )
});

Transactions.displayName = 'Transactions';

export default Transactions