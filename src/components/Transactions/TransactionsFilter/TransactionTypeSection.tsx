import React from 'react';
import { motion } from 'framer-motion';
import { Box, Text } from '@chakra-ui/react';
import MultiSelectInput from '@/components/ui/MultiSelectInput';
import { contentVariants } from '@/utils';

interface TransactionTypeOption {
    value: string;
    label: string;
}

interface TransactionTypeSectionProps {
    options: TransactionTypeOption[];
    selectedValues: string[];
    onSelectionChange: (values: string[]) => void;
}

const TransactionTypeSection: React.FC<TransactionTypeSectionProps> = ({
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
                    Transaction Type
                </Text>
                <MultiSelectInput
                    options={options}
                    value={selectedValues}
                    onChange={onSelectionChange}
                    placeholder='Select transaction type'
                />
            </Box>
        </motion.div>
    );
};

export default TransactionTypeSection;
