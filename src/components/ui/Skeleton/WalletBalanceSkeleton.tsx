import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import SkeletonBox from './SkeletonBox';

const WalletBalanceSkeleton: React.FC = () => {
    return (
        <Flex
            align='center'
            w='100%'
            direction={{ base: 'column', md: 'row' }}
            alignItems={{ base: 'flex-start', md: 'center' }}
            css={{
                gap: '16px',
                '@media (min-width: 768px)': {
                    gap: '64px',
                },
            }}
        >
            {/* Left side - Balance info */}
            <Box
                display='flex'
                flexDirection='column'
                flexShrink={0}
                alignItems='flex-start'
                gap='8px'
            >
                {/* "Available Balance" label */}
                <SkeletonBox width='120px' height='16px' flexShrink={0} />

                {/* Balance amount - using fluid calc equivalent */}
                <SkeletonBox
                    width='200px'
                    height={{ base: '36px', md: '48px' }}
                    flexShrink={0}
                />
            </Box>

            {/* Right side - Withdraw button */}
            <SkeletonBox
                width={{ base: '100%', md: '167px' }}
                height='48px'
                minW='167px'
                borderRadius='100px'
                px='28px'
                py='14px'
                css={{
                    '@media (max-width: 768px)': {
                        width: '100%',
                    },
                }}
            />
        </Flex>
    );
};

export default WalletBalanceSkeleton;
