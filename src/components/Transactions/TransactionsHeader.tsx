import React from 'react'
import { Button, Text, Badge } from '@chakra-ui/react'
import { TransactionsHeaderActions, TransactionsHeaderContainer, TransactionsHeaderSubtitle, TransactionsHeaderText, TransactionsHeaderTitle } from './Transactions.styles'
import { MaterialSymbol } from 'react-material-symbols'

interface TransactionsHeaderProps {
    transactionCount?: number;
}

const TransactionsHeader = React.memo<TransactionsHeaderProps>(({ transactionCount = 0 }) => {
    const displayCount = transactionCount === 1 ? '1 Transaction' : `${transactionCount} Transactions`;
    
    return (
        <TransactionsHeaderContainer>
            {/* Transactions Header Text */}
            <TransactionsHeaderText>
                <TransactionsHeaderTitle>
                    {displayCount}
                </TransactionsHeaderTitle>
                <TransactionsHeaderSubtitle>
                    Your transactions for All Time
                </TransactionsHeaderSubtitle>
            </TransactionsHeaderText>

            {/* Transactions Header Actions */}
            <TransactionsHeaderActions>
                <Button
                    variant='subtle'
                    bg='gray.50'
                    rounded='full'
                    height={12}
                    gapX={1}
                    paddingBlock={3}
                    paddingInlineStart="30px"
                    paddingInlineEnd={5}
                    fontSize='16px'
                    fontWeight={600}
                    fontFamily={
                        '"Degular", "Degular Display" system-ui'
                    }
                >
                    <Text>Filter</Text>
                    <Badge variant="solid" size="sm" rounded="full">3</Badge>
                    <MaterialSymbol
                        icon='keyboard_arrow_down'
                        color='#131316'
                        size={20}
                    />
                </Button>
                <Button
                    variant='subtle'
                    bg='gray.50'
                    rounded='full'
                    height={12}
                    gapX={1}
                    paddingBlock={3}
                    paddingInlineStart="30px"
                    paddingInlineEnd={5}
                    fontSize='16px'
                    fontWeight={600}
                    fontFamily={
                        '"Degular", "Degular Display" system-ui'
                    }
                >
                    <Text>Export list</Text>
                    <MaterialSymbol
                        icon='download'
                        color='#131316'
                        size={20}
                    />
                </Button>
            </TransactionsHeaderActions>
        </TransactionsHeaderContainer>
    )
})

TransactionsHeader.displayName = 'TransactionsHeader';

export default TransactionsHeader