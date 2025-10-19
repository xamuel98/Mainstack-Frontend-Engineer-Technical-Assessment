import React from 'react'
import { Box, Text, Button, VStack } from '@chakra-ui/react'
import { ApiError } from '@/types'
import { MaterialSymbol } from 'react-material-symbols'

interface TransactionsErrorProps {
    error?: ApiError;
    onRetry?: () => void;
}

const TransactionsError: React.FC<TransactionsErrorProps> = ({ error, onRetry }) => {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" width="100%" maxW="sm" mx="auto">
            <VStack display="flex" flex-direction="column" alignItems="flex-start" gap={8} width="100%">
                <VStack display="flex" flex-direction="column" justifyContent="center" alignItems="flex-start" alignSelf="stretch" gapY={5}>
                    <Box display="flex" justifyContent="center" alignItems="center" width="48px" height="48px" borderRadius="16px" bg="red.200" padding={3}>
                        <MaterialSymbol icon="error" size={24} weight={300} color="#F04438" />
                    </Box>
                    <VStack display="flex" flex-direction="column" justifyContent="center" alignItems="flex-start" alignSelf="stretch" gapY={2.5}>
                        <Text md={{ fontSize: '28px', lineHeight: '40px' }} fontSize="24px" lineHeight="32px" fontWeight={700} fontFamily="heading" color="red.600">Error loading transactions!</Text>
                        <Text fontSize="16px" lineHeight="24px" fontWeight={500} fontFamily="body" color="red.500">{error?.message || 'Failed to fetch transaction data. Please try again.'}</Text>
                    </VStack>
                </VStack>
                <Button
                    variant='subtle'
                    bg='red.600'
                    color="white"
                    rounded='full'
                    height={12}
                    paddingBlock={3}
                    paddingInline={6}
                    fontSize='16px'
                    fontWeight={600}
                    fontFamily="body"
                    onClick={onRetry}
                >
                    Retry
                </Button>
            </VStack>
        </Box>
    )
}

export default TransactionsError