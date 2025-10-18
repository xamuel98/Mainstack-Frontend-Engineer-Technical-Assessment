import React from 'react';
import { Spinner, Flex, Text } from '@chakra-ui/react';

export interface LoaderProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'default' | 'secondary' | 'muted';
    text?: string;
    className?: string;
}

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
    ({ size = 'md', variant = 'default', text, ...props }, ref) => {
        const getSpinnerSize = () => {
            switch (size) {
                case 'sm':
                    return 'sm';
                case 'md':
                    return 'md';
                case 'lg':
                    return 'lg';
                case 'xl':
                    return 'xl';
                default:
                    return 'md';
            }
        };

        const getSpinnerColor = () => {
            switch (variant) {
                case 'secondary':
                    return 'gray.500';
                case 'muted':
                    return 'gray.400';
                default:
                    return 'blue.500';
            }
        };

        return (
            <Flex ref={ref} align='center' justify='center' gap={2} {...props}>
                <Spinner size={getSpinnerSize()} color={getSpinnerColor()} />
                {text && (
                    <Text fontSize='sm' color='gray.600'>
                        {text}
                    </Text>
                )}
            </Flex>
        );
    }
);

Loader.displayName = 'Loader';

// Full page loader component
export interface PageLoaderProps {
    text?: string;
    className?: string;
}

const PageLoader: React.FC<PageLoaderProps> = ({
    text = 'Loading...',
    className,
}) => {
    return (
        <Flex
            minH='100vh'
            align='center'
            justify='center'
            className={className}
        >
            <Loader size='lg' text={text} />
        </Flex>
    );
};

// Inline loader for smaller sections
export interface InlineLoaderProps {
    text?: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const InlineLoader: React.FC<InlineLoaderProps> = ({
    text = 'Loading...',
    className,
    size = 'md',
}) => {
    return (
        <Flex align='center' justify='center' p={4} className={className}>
            <Loader size={size} text={text} />
        </Flex>
    );
};

export { Loader, PageLoader, InlineLoader };
