import React from 'react';
import { Container, Heading, Text } from '@chakra-ui/react';

const Revenue: React.FC = () => {
    return (
        <Container maxW='4xl' p={8} textAlign='center'>
            <Heading as='h3' size='lg' mb={2} color='gray.700'>
                Coming Soon
            </Heading>
            <Text color='gray.500'>
                This page will contain revenue reports, income tracking, and
                financial performance data.
            </Text>
        </Container>
    );
};

export default Revenue;
