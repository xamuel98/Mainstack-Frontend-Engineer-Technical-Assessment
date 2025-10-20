import React from 'react';
import { motion } from 'framer-motion';
import { Box, Button, HStack } from '@chakra-ui/react';
import { contentVariants } from '@/utils';

interface DateRangeOption {
    value: string;
    label: string;
}

interface DateRangePillsProps {
    options: DateRangeOption[];
    selectedValue: string;
    onSelectionChange: (value: string) => void;
}

const DateRangePills: React.FC<DateRangePillsProps> = ({
    options,
    selectedValue,
    onSelectionChange,
}) => {
    return (
        <motion.div variants={contentVariants}>
            <Box px='22px' mb={4.5}>
                <Box
                    mx='-22px'
                    px='22px'
                    overflowX='auto'
                    pb={1}
                    css={{
                        '&::-webkit-scrollbar': { display: 'none' },
                        scrollbarWidth: 'none',
                        scrollSnapType: 'x mandatory',
                    }}
                >
                    <HStack gapX={3} minW='max-content'>
                        {options.map((option, i) => (
                            <Button
                                key={i}
                                size='sm'
                                variant={
                                    selectedValue === option.value
                                        ? 'solid'
                                        : 'outline'
                                }
                                bg={
                                    selectedValue === option.value
                                        ? '#131316'
                                        : 'white'
                                }
                                color={
                                    selectedValue === option.value
                                        ? 'white'
                                        : '#131316'
                                }
                                borderColor='#EFF1F6'
                                borderRadius='100px'
                                px={4}
                                py={2}
                                fontFamily='body'
                                fontSize='14px'
                                fontWeight={600}
                                whiteSpace='nowrap'
                                onClick={() => onSelectionChange(option.value)}
                                transition='all 0.2s ease'
                            >
                                {option.label}
                            </Button>
                        ))}
                    </HStack>
                </Box>
            </Box>
        </motion.div>
    );
};

export default DateRangePills;
