import React from 'react';
import { Box, Container, Heading, Text } from '@chakra-ui/react';

const CRM: React.FC = () => {
    return (
        <Box minH='100vh' bg='gray.50' p={6}>
            <Container maxW='4xl' p={8} textAlign='center'>
                <Heading as='h3' size='lg' mb={2} color='gray.700'>
                    Coming Soon
                </Heading>
                <Text color='gray.500'>
                    This page will contain customer data, user management, and
                    relationship tracking features.
                </Text>
            </Container>
        </Box>
    );
};

export default CRM;
