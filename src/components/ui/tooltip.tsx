import { Tooltip as ChakraTooltip, Portal } from '@chakra-ui/react';
import * as React from 'react';

export interface TooltipProps extends ChakraTooltip.RootProps {
    showArrow?: boolean;
    portalled?: boolean;
    portalRef?: React.RefObject<HTMLElement | null>;
    content: React.ReactNode;
    contentProps?: ChakraTooltip.ContentProps;
    disabled?: boolean;
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
    function Tooltip(props, ref) {
        const {
            showArrow = true,
            children,
            disabled,
            portalled = true,
            content,
            contentProps,
            portalRef,
            ...rest
        } = props;

        if (disabled) return children;

        return (
            <ChakraTooltip.Root {...rest}>
                <ChakraTooltip.Trigger asChild>
                    {children}
                </ChakraTooltip.Trigger>
                <Portal disabled={!portalled} container={portalRef}>
                    <ChakraTooltip.Positioner>
                        <ChakraTooltip.Content
                            ref={ref}
                            {...contentProps}
                            padding='10px 16px'
                            fontSize='md'
                            borderRadius='8px'
                        >
                            {showArrow && (
                                <ChakraTooltip.Arrow>
                                    <ChakraTooltip.ArrowTip />
                                </ChakraTooltip.Arrow>
                            )}
                            {content}
                        </ChakraTooltip.Content>
                    </ChakraTooltip.Positioner>
                </Portal>
            </ChakraTooltip.Root>
        );
    }
);
