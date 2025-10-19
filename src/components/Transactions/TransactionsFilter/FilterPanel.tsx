import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Portal, Box } from '@chakra-ui/react';
import {
    DateRangePills,
    DateRangeSection,
    TransactionTypeSection,
    TransactionStatusSection,
    FilterPanelActions,
    FilterPanelOverlay,
    FilterPanelContent,
    FilterPanelHeader,
} from './';
import { calculateDateRange } from '@/utils';
import {
    dateRangeOptions,
    transactionTypeOptions,
    transactionStatusOptions,
} from '../../../constants/filterOptions';

interface FilterPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: FilterState) => void;
    onClear: () => void;
}

interface FilterState {
    dateRange: string;
    dateFrom: Date | null;
    dateTo: Date | null;
    transactionType: string[];
    transactionStatus: string[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
    isOpen,
    onClose,
    onApply,
    onClear,
}) => {
    const [filters, setFilters] = useState<FilterState>({
        dateRange: 'all-time',
        dateFrom: null,
        dateTo: null,
        transactionType: [],
        transactionStatus: [],
    });

    const [selectedDateRange, setSelectedDateRange] = useState('all-time');

    // Handler for date range pill selection
    const handleDateRangeSelection = (rangeValue: string) => {
        setSelectedDateRange(rangeValue);
        const { startDate, endDate } = calculateDateRange(rangeValue);
        setFilters(prev => ({
            ...prev,
            dateRange: rangeValue,
            dateFrom: startDate,
            dateTo: endDate,
        }));
    };

    const handleApply = () => {
        onApply(filters);
        onClose();
    };

    const handleClear = () => {
        setFilters({
            dateRange: 'all-time',
            dateFrom: null,
            dateTo: null,
            transactionType: [],
            transactionStatus: [],
        });
        setSelectedDateRange('all-time');
        onClear();
    };

    const handleDateFromChange = (date: Date | null) => {
        setFilters(prev => ({ ...prev, dateFrom: date }));
    };

    const handleDateToChange = (date: Date | null) => {
        setFilters(prev => ({ ...prev, dateTo: date }));
    };

    const handleTransactionTypeChange = (selectedTypes: string[]) => {
        setFilters(prev => ({ ...prev, transactionType: selectedTypes }));
    };

    const handleTransactionStatusChange = (selectedStatuses: string[]) => {
        setFilters(prev => ({ ...prev, transactionStatus: selectedStatuses }));
    };

    return (
        <Portal>
            <AnimatePresence>
                <FilterPanelOverlay isOpen={isOpen} onClose={onClose} />
                <FilterPanelContent isOpen={isOpen}>
                    <FilterPanelHeader onClose={onClose} />

                    <DateRangePills
                        options={dateRangeOptions}
                        selectedValue={selectedDateRange}
                        onSelectionChange={handleDateRangeSelection}
                    />

                    <Box flex={1} overflowY='auto'>
                        <DateRangeSection
                            dateFrom={filters.dateFrom}
                            dateTo={filters.dateTo}
                            onDateFromChange={handleDateFromChange}
                            onDateToChange={handleDateToChange}
                        />

                        <TransactionTypeSection
                            options={transactionTypeOptions}
                            selectedValues={filters.transactionType}
                            onSelectionChange={handleTransactionTypeChange}
                        />

                        <TransactionStatusSection
                            options={transactionStatusOptions}
                            selectedValues={filters.transactionStatus}
                            onSelectionChange={handleTransactionStatusChange}
                        />
                    </Box>

                    <FilterPanelActions
                        onClear={handleClear}
                        onApply={handleApply}
                    />
                </FilterPanelContent>
            </AnimatePresence>
        </Portal>
    );
};

export default FilterPanel;
