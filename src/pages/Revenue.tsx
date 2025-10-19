import React, { useState } from 'react';
import { Container } from '@chakra-ui/react';
import Transactions from '@/components/Transactions/Transactions';
import { FilterState } from '@/utils';

const Revenue: React.FC = () => {
    const [filterState, setFilterState] = useState<FilterState>({
        dateRange: 'all-time',
        dateFrom: null,
        dateTo: null,
        transactionType: [],
        transactionStatus: [],
    });

    const handleFilterChange = (newFilters: FilterState) => {
        setFilterState(newFilters);
    };

    return (
        <Container>
            <Transactions
                filterState={filterState}
                onFilterChange={handleFilterChange}
            />
        </Container>
    );
};

export default Revenue;
