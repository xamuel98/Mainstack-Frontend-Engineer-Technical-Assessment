import React from 'react';
import { Flex } from '@chakra-ui/react';
import SkeletonBox from './SkeletonBox';

const StatItemSkeleton: React.FC = () => (
    <Flex
        direction='column'
        flexShrink={0}
        align='flex-start'
        alignSelf='stretch'
        gap='8px'
    >
        {/* Stat Header */}
        <Flex flexShrink={0} align='center' alignSelf='stretch' gap='8px'>
            {/* Stat label */}
            <SkeletonBox width='80px' height='16px' flexGrow={1} />

            {/* Info icon */}
            <SkeletonBox
                width='20px'
                height='20px'
                borderRadius='full'
                flexShrink={0}
            />
        </Flex>

        {/* Stat value */}
        <SkeletonBox
            width='120px'
            height={{ base: '32px', md: '38px' }}
            flexShrink={0}
            alignSelf='stretch'
        />
    </Flex>
);

const WalletStatsSkeleton: React.FC = () => {
    return (
        <Flex
            direction='column'
            align='flex-start'
            width='271px'
            height='360px'
            gap='32px'
            css={{
                '@media (max-width: 768px)': {
                    width: '100%',
                    height: 'auto',
                    gap: '24px',
                },
                '@media (max-width: 480px)': {
                    gap: '20px',
                },
            }}
        >
            <StatItemSkeleton />
            <StatItemSkeleton />
            <StatItemSkeleton />
            <StatItemSkeleton />
        </Flex>
    );
};

export default WalletStatsSkeleton;
