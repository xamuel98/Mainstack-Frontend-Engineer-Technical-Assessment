import React from 'react';
import { Box, Button, VStack, Text } from '@chakra-ui/react';

interface TransactionsEmptyProps {
    onClearFilters?: () => void;
}

const TransactionsEmpty: React.FC<TransactionsEmptyProps> = ({
    onClearFilters,
}) => {
    return (
        <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            width='100%'
            maxW='sm'
            mx='auto'
        >
            <VStack
                display='flex'
                flex-direction='column'
                alignItems='flex-start'
                gap={8}
                width='100%'
            >
                <VStack
                    display='flex'
                    flex-direction='column'
                    justifyContent='center'
                    alignItems='flex-start'
                    alignSelf='stretch'
                    gapY={5}
                >
                    <Box
                        display='flex'
                        justifyContent='center'
                        alignItems='center'
                        width='48px'
                        height='48px'
                        borderRadius='16px'
                        bg='linear-gradient(135deg, #DBDEE5 1.89%, #F6F7F9 98.77%)'
                        padding={3}
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='24'
                            height='24'
                            viewBox='0 0 24 24'
                            fill='none'
                        >
                            <mask
                                id='mask0_105_611'
                                style={{ maskType: 'alpha' }}
                                maskUnits='userSpaceOnUse'
                                x='0'
                                y='0'
                                width='24'
                                height='24'
                            >
                                <rect width='24' height='24' fill='#D9D9D9' />
                            </mask>
                            <g mask='url(#mask0_105_611)'>
                                <path
                                    d='M6 21C5.43333 21 4.95833 20.8083 4.575 20.425C4.19167 20.0417 4 19.5667 4 19V17H7V3.375L8.275 4.275L9.575 3.375L10.875 4.275L12.2 3.375L13.5 4.275L14.8 3.375L16.125 4.275L17.425 3.375L18.725 4.275L20 3.375V19C20 19.5667 19.8083 20.0417 19.425 20.425C19.0417 20.8083 18.5667 21 18 21H6ZM18 20C18.2833 20 18.5207 19.904 18.712 19.712C18.904 19.5207 19 19.2833 19 19V5H8V17H17V19C17 19.2833 17.096 19.5207 17.288 19.712C17.4793 19.904 17.7167 20 18 20ZM9.375 8.5V7.5H14.725V8.5H9.375ZM9.375 11.5V10.5H14.725V11.5H9.375ZM16.875 8.775C16.675 8.775 16.5 8.69567 16.35 8.537C16.2 8.379 16.125 8.2 16.125 8C16.125 7.8 16.2 7.62067 16.35 7.462C16.5 7.304 16.675 7.225 16.875 7.225C17.0917 7.225 17.275 7.304 17.425 7.462C17.575 7.62067 17.65 7.8 17.65 8C17.65 8.2 17.575 8.379 17.425 8.537C17.275 8.69567 17.0917 8.775 16.875 8.775ZM16.875 11.775C16.675 11.775 16.5 11.6957 16.35 11.537C16.2 11.379 16.125 11.2 16.125 11C16.125 10.8 16.2 10.6207 16.35 10.462C16.5 10.304 16.675 10.225 16.875 10.225C17.0917 10.225 17.275 10.304 17.425 10.462C17.575 10.6207 17.65 10.8 17.65 11C17.65 11.2 17.575 11.379 17.425 11.537C17.275 11.6957 17.0917 11.775 16.875 11.775Z'
                                    fill='url(#paint0_linear_105_611)'
                                />
                            </g>
                            <defs>
                                <linearGradient
                                    id='paint0_linear_105_611'
                                    x1='4.8'
                                    y1='3.375'
                                    x2='20.2687'
                                    y2='19.5158'
                                    gradientUnits='userSpaceOnUse'
                                >
                                    <stop stop-color='#5C6670' />
                                    <stop offset='1' stop-color='#131316' />
                                </linearGradient>
                            </defs>
                        </svg>
                    </Box>
                    <VStack
                        display='flex'
                        flex-direction='column'
                        justifyContent='center'
                        alignItems='flex-start'
                        alignSelf='stretch'
                        gapY={2.5}
                    >
                        <Text
                            md={{ fontSize: '28px', lineHeight: '40px' }}
                            fontSize='24px'
                            lineHeight='32px'
                            fontWeight={700}
                            fontFamily='heading'
                            color='black.300'
                        >
                            No matching transaction found for the selected
                            filter
                        </Text>
                        <Text
                            fontSize='16px'
                            lineHeight='24px'
                            fontWeight={500}
                            fontFamily='body'
                            color='gray.400'
                        >
                            Change your filters to see more results, or add a
                            new product.
                        </Text>
                    </VStack>
                </VStack>
                <Button
                    variant='subtle'
                    bg='gray.50'
                    rounded='full'
                    height={12}
                    paddingBlock={3}
                    paddingInline={6}
                    fontSize='16px'
                    fontWeight={600}
                    fontFamily='body'
                    onClick={onClearFilters}
                >
                    Clear
                </Button>
            </VStack>
        </Box>
    );
};

export default TransactionsEmpty;
