import React from 'react';
import { Container} from '@chakra-ui/react';
import Transactions from '@/components/Transactions/Transactions';

const Revenue: React.FC = () => {
    return (
        <Container>
            <Transactions />
        </Container>
    );
};

export default Revenue;
