import React from 'react';
import { Box, Text, Button, Flex } from '@chakra-ui/react';
import { formatMoney } from '@/lib';
import { fluidCalc } from '@/utils';
import { useWallet } from '@/hooks';

export interface WalletBalanceProps {
    currency?: string;
    onWithdraw?: () => void;
    className?: string;
}

export const WalletBalance: React.FC<WalletBalanceProps> = ({
    onWithdraw,
    className,
}) => {
    const { data: wallet, error } = useWallet();

    // Show error state
    if (error) {
        return (
            <Flex
                className={className}
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
                <Box
                    display='flex'
                    flexDirection='column'
                    flexShrink={0}
                    alignItems='flex-start'
                    gap='8px'
                >
                    <Text
                        flexShrink={0}
                        lineHeight='16px'
                        letterSpacing='-0.2px'
                        color='#56616b'
                        fontFamily='body'
                        fontSize='14px'
                        fontWeight='500'
                        margin={0}
                    >
                        Available Balance
                    </Text>
                    <Text
                        flexShrink={0}
                        letterSpacing={{ base: '-1px', md: '-1.5px' }}
                        color='#e53e3e'
                        fontFamily='heading'
                        fontWeight='700'
                        margin={0}
                        css={{
                            fontSize: `${fluidCalc('28px', '36px')}`,
                            lineHeight: `${fluidCalc('36px', '48px')}`,
                        }}
                    >
                        Error loading balance
                    </Text>
                </Box>
                <Button
                    disabled
                    variant='solid'
                    size='md'
                    borderRadius='100px'
                    bg='#131316'
                    color='white'
                    fontWeight='600'
                    fontSize='16px'
                    px='28px'
                    py='14px'
                    h='auto'
                    minW='167px'
                    opacity={0.6}
                    css={{
                        '@media (max-width: 768px)': {
                            width: '100%',
                        },
                    }}
                >
                    Withdraw
                </Button>
            </Flex>
        );
    }

    // Show wallet balance
    if (!wallet) {
        return null;
    }

    const balance = wallet.balance;

    return (
        <Flex
            className={className}
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
            <Box
                display='flex'
                flexDirection='column'
                flexShrink={0}
                alignItems='flex-start'
                gap='8px'
            >
                <Text
                    flexShrink={0}
                    lineHeight='16px'
                    letterSpacing='-0.2px'
                    color='#56616b'
                    fontFamily='body'
                    fontSize='14px'
                    fontWeight='500'
                    margin={0}
                >
                    Available Balance
                </Text>
                <Text
                    flexShrink={0}
                    letterSpacing={{ base: '-1px', md: '-1.5px' }}
                    color='#131316'
                    fontFamily='heading'
                    fontWeight='700'
                    margin={0}
                    css={{
                        fontSize: `${fluidCalc('28px', '36px')}`,
                        lineHeight: `${fluidCalc('36px', '48px')}`,
                    }}
                >
                    {formatMoney(balance, 'USD', true)}
                </Text>
            </Box>
            <Button
                onClick={onWithdraw}
                variant='solid'
                size='md'
                borderRadius='100px'
                bg='#131316'
                color='white'
                fontWeight='600'
                fontSize='16px'
                px='28px'
                py='14px'
                h='auto'
                minW='167px'
                _hover={{
                    bg: '#2a2a2a',
                }}
                transition='all 0.2s ease'
                css={{
                    '@media (max-width: 768px)': {
                        width: '100%',
                    },
                }}
            >
                Withdraw
            </Button>
        </Flex>
    );
};

export default WalletBalance;
