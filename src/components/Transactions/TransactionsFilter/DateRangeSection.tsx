import React from 'react';
import { motion } from 'framer-motion';
import { Box, Text, VStack, HStack } from '@chakra-ui/react';
import CalendarInput from '@/components/ui/CalendarInput';
import { contentVariants } from '@/utils';

interface DateRangeSectionProps {
    dateFrom: Date | null;
    dateTo: Date | null;
    onDateFromChange: (date: Date | null) => void;
    onDateToChange: (date: Date | null) => void;
}

const DateRangeSection: React.FC<DateRangeSectionProps> = ({
    dateFrom,
    dateTo,
    onDateFromChange,
    onDateToChange,
}) => {
    // Convert Date to string for CalendarInput using local timezone
    const dateFromString = dateFrom
        ? `${dateFrom.getFullYear()}-${String(dateFrom.getMonth() + 1).padStart(2, '0')}-${String(dateFrom.getDate()).padStart(2, '0')}`
        : '';
    const dateToString = dateTo
        ? `${dateTo.getFullYear()}-${String(dateTo.getMonth() + 1).padStart(2, '0')}-${String(dateTo.getDate()).padStart(2, '0')}`
        : '';

    // Handle date changes from CalendarInput (string) to parent (Date)
    const handleDateFromChange = (dateString: string) => {
        if (dateString) {
            // Parse date string in local timezone to avoid timezone offset issues
            const [year, month, day] = dateString.split('-').map(Number);
            const date = new Date(year, month - 1, day); // month is 0-indexed
            onDateFromChange(date);
        } else {
            onDateFromChange(null);
        }
    };

    const handleDateToChange = (dateString: string) => {
        if (dateString) {
            // Parse date string in local timezone to avoid timezone offset issues
            const [year, month, day] = dateString.split('-').map(Number);
            const date = new Date(year, month - 1, day); // month is 0-indexed
            onDateToChange(date);
        } else {
            onDateToChange(null);
        }
    };

    return (
        <motion.div variants={contentVariants}>
            <VStack px='22px' mb={6} align='stretch' gap={3}>
                <Text
                    fontSize='16px'
                    fontWeight={600}
                    color='#131316'
                    fontFamily='body'
                >
                    Date Range
                </Text>
                <HStack gap={2}>
                    <Box flex={1}>
                        <CalendarInput
                            value={dateFromString}
                            onChange={handleDateFromChange}
                            placeholder='Select start date'
                        />
                    </Box>
                    <Box flex={1}>
                        <CalendarInput
                            value={dateToString}
                            onChange={handleDateToChange}
                            placeholder='Select end date'
                        />
                    </Box>
                </HStack>
            </VStack>
        </motion.div>
    );
};

export default DateRangeSection;
