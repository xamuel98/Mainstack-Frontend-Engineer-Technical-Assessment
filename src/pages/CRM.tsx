import React from 'react';
import { Container, Heading, Text } from '@chakra-ui/react';

const CRM: React.FC = () => {
    return (
        <Container maxW='4xl' p={8} textAlign='center'>
            <Heading as='h3' size='lg' mb={2} color='gray.700'>
                Coming Soon
            </Heading>
            <Text color='gray.500'>
                This page will contain customer data, user management, and
                relationship tracking features.
            </Text>
        </Container>
    );
};

export default CRM;
