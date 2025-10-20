import React from 'react';
import { Box, useBreakpointValue } from '@chakra-ui/react';
import SkeletonBox from './SkeletonBox';

const TransactionChartSkeleton: React.FC = () => {
    // Match the exact responsive values from TransactionChart
    const chartHeight = useBreakpointValue({
        base: '200px',
        sm: '220px',
        md: '240px',
        lg: '257px',
        xl: '280px',
    });

    return (
        <Box
            w='100%'
            h={chartHeight}
            minH={{ base: '180px', md: '200px' }}
            maxW={{ base: '100%', lg: '765px', xl: '900px' }}
        >
            {/* Chart area skeleton - matches ResponsiveContainer */}
            <Box
                w='100%'
                h='100%'
                position='relative'
                mb={{ base: '-25px', sm: '-28px', md: '-30px' }}
            >
                <SkeletonBox width='100%' height='100%' borderRadius='md' />
            </Box>

            {/* Custom date labels - matches the exact structure */}
            <Box
                display='flex'
                justifyContent='space-between'
                px={{
                    base: '12px',
                    sm: '16px',
                    md: '20px',
                    lg: '20px',
                    xl: '25px',
                }}
                pt={{ base: '12px', sm: '14px', md: '15px' }}
                borderTop='1px solid #DBDEE5'
            >
                {/* Left date */}
                <SkeletonBox
                    width='60px'
                    height={{
                        base: '11px',
                        sm: '12px',
                        md: '14px',
                        lg: '16px',
                    }}
                />

                {/* Right date */}
                <SkeletonBox
                    width='60px'
                    height={{
                        base: '11px',
                        sm: '12px',
                        md: '14px',
                        lg: '16px',
                    }}
                />
            </Box>
        </Box>
    );
};

export default TransactionChartSkeleton;
