import React, { useState } from 'react';
import { MaterialSymbol } from 'react-material-symbols';
import { Button, Text, Badge } from '@chakra-ui/react';
import {
    TransactionsHeaderActions,
    TransactionsHeaderContainer,
    TransactionsHeaderSubtitle,
    TransactionsHeaderText,
    TransactionsHeaderTitle,
} from './';
import { FilterPanel } from './TransactionsFilter';
import { FilterState } from '@/utils';

interface TransactionsHeaderProps {
    transactionCount?: number;
    onExport?: () => void;
    onFilterChange?: (filters: FilterState) => void;
    currentFilters?: FilterState;
}

const TransactionsHeader = React.memo<TransactionsHeaderProps>(
    ({ transactionCount = 0, onExport, onFilterChange, currentFilters }) => {
        const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
        const [activeFiltersCount, setActiveFiltersCount] = useState(0);

        const displayCount =
            transactionCount === 1
                ? '1 Transaction'
                : `${transactionCount} Transactions`;

        const calculateActiveFilters = (filters: FilterState): number => {
            let count = 0;

            // Count date range filters (if custom dates are set)
            if (filters.dateFrom && filters.dateTo) {
                count += 1;
            }

            // Count transaction type filters (if not all are selected)
            if (
                filters.transactionType.length > 0 &&
                filters.transactionType.length < 6
            ) {
                count += 1;
            }

            // Count transaction status filters (if not all are selected)
            if (
                filters.transactionStatus.length > 0 &&
                filters.transactionStatus.length < 3
            ) {
                count += 1;
            }

            return count;
        };

        const handleFilterClick = () => {
            setIsFilterPanelOpen(true);
        };

        const handleFilterClose = () => {
            setIsFilterPanelOpen(false);
        };

        const handleFilterApply = (filters: FilterState) => {
            // Handle filter application logic here
            console.log('Applied filters:', filters);
            // Update active filters count based on applied filters
            const count = calculateActiveFilters(filters);
            setActiveFiltersCount(count);
            // Notify parent component about filter changes
            onFilterChange?.(filters);
        };

        const handleFilterClear = () => {
            setActiveFiltersCount(0);
            // Notify parent component about filter clear
            onFilterChange?.({
                dateRange: 'all-time',
                dateFrom: null,
                dateTo: null,
                transactionType: [],
                transactionStatus: [],
            });
        };

        // Generate subtitle based on current filters
        const getFilterSubtitle = (): string => {
            if (!currentFilters || activeFiltersCount === 0) {
                return 'Your transactions for All Time';
            }

            const parts: string[] = [];

            // Add date range info
            if (
                currentFilters.dateRange &&
                currentFilters.dateRange !== 'all-time'
            ) {
                const dateRangeLabels: Record<string, string> = {
                    today: 'Today',
                    'last-7-days': 'Last 7 days',
                    'this-month': 'This month',
                    'last-3-months': 'Last 3 months',
                    'this-year': 'This year',
                    'last-year': 'Last year',
                };
                parts.push(
                    dateRangeLabels[currentFilters.dateRange] || 'Custom period'
                );
            }

            // Add transaction type info
            if (
                currentFilters.transactionType.length > 0 &&
                currentFilters.transactionType.length < 6
            ) {
                if (currentFilters.transactionType.length === 1) {
                    parts.push(
                        `${currentFilters.transactionType[0]} transactions`
                    );
                } else {
                    parts.push(
                        `${currentFilters.transactionType.length} transaction types`
                    );
                }
            }

            // Add status info
            if (
                currentFilters.transactionStatus.length > 0 &&
                currentFilters.transactionStatus.length < 3
            ) {
                if (currentFilters.transactionStatus.length === 1) {
                    parts.push(`${currentFilters.transactionStatus[0]} status`);
                } else {
                    parts.push(
                        `${currentFilters.transactionStatus.length} statuses`
                    );
                }
            }

            return parts.length > 0
                ? `Your transactions for ${parts.join(', ')}`
                : 'Your transactions for All Time';
        };

        return (
            <>
                <TransactionsHeaderContainer>
                    {/* Transactions Header Text */}
                    <TransactionsHeaderText>
                        <TransactionsHeaderTitle>
                            {displayCount}
                        </TransactionsHeaderTitle>
                        <TransactionsHeaderSubtitle>
                            {getFilterSubtitle()}
                        </TransactionsHeaderSubtitle>
                    </TransactionsHeaderText>

                    {/* Transactions Header Actions */}
                    <TransactionsHeaderActions>
                        <Button
                            variant='subtle'
                            bg='gray.50'
                            rounded='full'
                            height={12}
                            gapX={1}
                            paddingBlock={3}
                            paddingInlineStart='30px'
                            paddingInlineEnd={5}
                            fontSize='16px'
                            fontWeight={600}
                            fontFamily='body'
                            onClick={handleFilterClick}
                            transition='all 0.2s ease'
                        >
                            <Text>Filter</Text>
                            {activeFiltersCount > 0 && (
                                <Badge variant='solid' size='sm' rounded='full'>
                                    {activeFiltersCount}
                                </Badge>
                            )}
                            <MaterialSymbol
                                icon='keyboard_arrow_down'
                                color='#131316'
                                size={20}
                            />
                        </Button>
                        <Button
                            variant='subtle'
                            bg='gray.50'
                            rounded='full'
                            height={12}
                            gapX={1}
                            paddingBlock={3}
                            paddingInlineStart='30px'
                            paddingInlineEnd={5}
                            fontSize='16px'
                            fontWeight={600}
                            fontFamily='body'
                            onClick={onExport}
                            transition='all 0.2s ease'
                        >
                            <Text>Export list</Text>
                            <MaterialSymbol
                                icon='download'
                                color='#131316'
                                size={20}
                            />
                        </Button>
                    </TransactionsHeaderActions>
                </TransactionsHeaderContainer>

                {/* Filter Panel */}
                <FilterPanel
                    isOpen={isFilterPanelOpen}
                    onClose={handleFilterClose}
                    onApply={handleFilterApply}
                    onClear={handleFilterClear}
                />
            </>
        );
    }
);

TransactionsHeader.displayName = 'TransactionsHeader';

export default TransactionsHeader;
