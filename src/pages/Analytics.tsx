import React from 'react';
import { Container, Heading, Text } from '@chakra-ui/react';

const Analytics: React.FC = () => {
    return (
        <Container maxW='4xl' p={8} textAlign='center'>
            <Heading as='h3' size='lg' mb={2} color='gray.700'>
                Analytics Page Coming Soon
            </Heading>
            <Text color='gray.500'>
                This page will contain charts, graphs, and detailed analytics
                about your financial data.
            </Text>
        </Container>
    );
};

export default Analytics;
