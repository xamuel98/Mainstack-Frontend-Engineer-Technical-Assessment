import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
    Box,
    Flex,
    Text,
    Button,
    VStack,
    Icon,
    Center,
} from '@chakra-ui/react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo,
        });
    }

    handleRetry = () => {
        this.setState({
            hasError: false,
            error: undefined,
            errorInfo: undefined,
        });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <Flex minH='100vh' align='center' justify='center' bg='gray.50'>
                    <Box
                        w='full'
                        maxW='md'
                        bg='white'
                        p={6}
                        borderRadius='lg'
                        boxShadow='lg'
                    >
                        <Center>
                            <Flex
                                w={12}
                                h={12}
                                align='center'
                                justify='center'
                                borderRadius='full'
                                bg='red.100'
                            >
                                <Icon
                                    w={6}
                                    h={6}
                                    color='red.600'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    stroke='currentColor'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                                    />
                                </Icon>
                            </Flex>
                        </Center>
                        <VStack mt={4} gap={4} textAlign='center'>
                            <Text
                                fontSize='lg'
                                fontWeight='medium'
                                color='gray.900'
                            >
                                Something went wrong
                            </Text>
                            <Text fontSize='sm' color='gray.500'>
                                An unexpected error occurred. Please try again.
                            </Text>
                            {process.env.NODE_ENV === 'development' &&
                                this.state.error && (
                                    <Box mt={4} textAlign='left' w='full'>
                                        <details>
                                            <summary
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <Text
                                                    as='span'
                                                    fontSize='sm'
                                                    fontWeight='medium'
                                                    color='gray.700'
                                                >
                                                    Error Details
                                                </Text>
                                            </summary>
                                            <Box
                                                as='pre'
                                                mt={2}
                                                p={2}
                                                bg='red.50'
                                                color='red.600'
                                                fontSize='xs'
                                                borderRadius='md'
                                                overflow='auto'
                                            >
                                                {this.state.error.toString()}
                                                {
                                                    this.state.errorInfo
                                                        ?.componentStack
                                                }
                                            </Box>
                                        </details>
                                    </Box>
                                )}
                            <Button
                                onClick={this.handleRetry}
                                colorScheme='blue'
                                w='full'
                                size='md'
                            >
                                Try again
                            </Button>
                        </VStack>
                    </Box>
                </Flex>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
