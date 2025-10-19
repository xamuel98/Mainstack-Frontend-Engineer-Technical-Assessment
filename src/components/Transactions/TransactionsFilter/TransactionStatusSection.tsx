import React from 'react';
import { motion } from 'framer-motion';
import { Box, Text } from '@chakra-ui/react';
import MultiSelectInput from '@/components/ui/MultiSelectInput';
import { contentVariants } from '@/utils';

interface TransactionStatusOption {
    value: string;
    label: string;
}

interface TransactionStatusSectionProps {
    options: TransactionStatusOption[];
    selectedValues: string[];
    onSelectionChange: (values: string[]) => void;
}

const TransactionStatusSection: React.FC<TransactionStatusSectionProps> = ({
    options,
    selectedValues,
    onSelectionChange,
}) => {
    return (
        <motion.div variants={contentVariants}>
            <Box px='22px' mb={6}>
                <Text
                    fontSize='16px'
                    fontWeight={600}
                    lineHeight='19px'
                    color='#131316'
                    fontFamily='body'
                    mb={3}
                >
                    Transaction Status
                </Text>
                <MultiSelectInput
                    options={options}
                    value={selectedValues}
                    onChange={onSelectionChange}
                    placeholder='Select transaction status'
                />
            </Box>
        </motion.div>
    );
};

export default TransactionStatusSection;
