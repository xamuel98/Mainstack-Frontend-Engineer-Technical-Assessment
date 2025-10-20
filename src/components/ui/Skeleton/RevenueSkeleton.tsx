import React from 'react';
import { Container, VStack, Box, SimpleGrid, GridItem } from '@chakra-ui/react';
import {
    WalletBalanceSkeleton,
    WalletStatsSkeleton,
    TransactionChartSkeleton,
    TransactionsSkeleton,
} from '.';

const RevenueSkeleton: React.FC = () => {
    return (
        <Container maxW='7xl' py={{ base: 6, md: 8 }}>
            <VStack gap={{ base: 6, md: 8 }} alignItems='stretch'>
                {/* Wallet Balance Section */}
                <WalletBalanceSkeleton />

                <SimpleGrid
                    columns={{ base: 1, lg: 4 }}
                    gap={{ base: 6, md: 8 }}
                >
                    {/* Transaction Chart */}
                    <GridItem colSpan={{ base: 1, md: 3 }}>
                        <TransactionChartSkeleton />
                    </GridItem>

                    {/* Wallet Stats Section */}
                    <WalletStatsSkeleton />
                </SimpleGrid>
            </VStack>

            {/* Transactions List */}
            <Box mt={{ base: 12, md: 16 }}>
                <TransactionsSkeleton />
            </Box>
        </Container>
    );
};

export default RevenueSkeleton;
