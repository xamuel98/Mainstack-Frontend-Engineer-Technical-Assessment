import React from 'react';
import { Button as ChakraButton, Spinner } from '@chakra-ui/react';
import { ButtonProps as ChakraButtonProps } from '@chakra-ui/react';

export interface ButtonProps extends Omit<ChakraButtonProps, 'size'> {
    loading?: boolean;
    variant?: 'solid' | 'outline' | 'ghost' | 'subtle' | 'surface' | 'plain';
    size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            loading = false,
            children,
            disabled,
            variant = 'solid',
            size = 'md',
            ...props
        },
        ref
    ) => {
        return (
            <ChakraButton
                ref={ref}
                disabled={disabled || loading}
                loading={loading}
                loadingText={loading ? children : undefined}
                variant={variant}
                size={size}
                {...props}
            >
                {loading ? <Spinner size='sm' /> : children}
            </ChakraButton>
        );
    }
);
Button.displayName = 'Button';

export { Button };
