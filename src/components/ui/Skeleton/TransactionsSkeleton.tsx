import React from 'react';
import { VStack, Flex } from '@chakra-ui/react';
import SkeletonBox from './SkeletonBox';

const TransactionRowSkeleton: React.FC = () => (
    <Flex
        justify='flex-start'
        align='flex-start'
        columnGap='1rem'
        width='100%'
        bg='white'
    >
        {/* Transaction Body */}
        <Flex
            justify='flex-start'
            align='center'
            columnGap='0.875rem'
            flex='1 0 0%'
        >
            {/* Transaction icon - using fluid calc equivalent (36px to 48px) */}
            <SkeletonBox
                width={{ base: '36px', md: '48px' }}
                height={{ base: '36px', md: '48px' }}
                borderRadius='full'
                flexShrink={0}
            />

            {/* Transaction details */}
            <Flex
                direction='column'
                align='flex-start'
                flex='1 0 0%'
                rowGap='0.5625rem'
            >
                {/* Transaction title */}
                <SkeletonBox width='180px' height='24px' />

                {/* Transaction subtitle */}
                <SkeletonBox width='120px' height='16px' />
            </Flex>
        </Flex>

        {/* Transaction Meta */}
        <Flex
            direction='column'
            justify='flex-end'
            align='flex-end'
            rowGap='0.25rem'
        >
            {/* Amount */}
            <SkeletonBox width='80px' height='24px' />

            {/* Date */}
            <SkeletonBox width='60px' height='16px' />
        </Flex>
    </Flex>
);

const TransactionsHeaderSkeleton: React.FC = () => (
    <Flex
        align='flex-start'
        bg='white'
        width='100%'
        pb='1.5rem'
        columnGap='1.5rem'
        borderBottom='1px solid'
        borderColor='#EFF1F6'
        direction={{ base: 'column', md: 'row' }}
        rowGap={{ base: '1rem', md: '0' }}
    >
        {/* Header Text */}
        <Flex direction='column' align='flex-start' flex='1 0 0%' gap='0.5rem'>
            {/* Title */}
            <SkeletonBox width='150px' height={{ base: '24px', md: '32px' }} />

            {/* Subtitle */}
            <SkeletonBox width='200px' height='16px' />
        </Flex>

        {/* Header Actions */}
        <Flex
            justify={{ base: 'flex-start', md: 'flex-end' }}
            align='center'
            gap='0.75rem'
            width={{ base: '100%', md: 'auto' }}
        >
            {/* Filter button */}
            <SkeletonBox width='90px' height='48px' borderRadius='full' />

            {/* Export button */}
            <SkeletonBox width='120px' height='48px' borderRadius='full' />
        </Flex>
    </Flex>
);

const TransactionsSkeleton: React.FC = () => {
    return (
        <VStack md={{ gapY: 8 }} gapY='45px' width='100%'>
            {/* Transactions Header */}
            <TransactionsHeaderSkeleton />

            {/* Transaction List */}
            <Flex
                direction='column'
                align='flex-start'
                gap='1.5rem'
                width='100%'
            >
                {Array.from({ length: 6 }, (_, index) => (
                    <TransactionRowSkeleton key={index} />
                ))}
            </Flex>
        </VStack>
    );
};

export default TransactionsSkeleton;
