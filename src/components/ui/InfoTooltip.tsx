import { Popover, Portal, Button, VStack, Text } from '@chakra-ui/react';
import * as React from 'react';

export interface InfoTooltipAction {
    label: string;
    onClick: () => void;
    variant?: 'solid' | 'outline' | 'ghost';
}

export interface InfoTooltipProps extends Omit<Popover.RootProps, 'content'> {
    title: string;
    description?: string;
    action?: InfoTooltipAction;
    showArrow?: boolean;
    portalled?: boolean;
    portalRef?: React.RefObject<HTMLElement | null>;
    contentProps?: Popover.ContentProps;
    disabled?: boolean;
    maxWidth?: string;
}

export const InfoTooltip = React.forwardRef<HTMLDivElement, InfoTooltipProps>(
    function InfoTooltip(props, ref) {
        const {
            children,
            title,
            description,
            action,
            showArrow = true,
            disabled,
            portalled = true,
            portalRef,
            contentProps,
            maxWidth = '320px',
            ...rest
        } = props;

        const [isOpen, setIsOpen] = React.useState(false);

        const handleOpenChange = (details: { open: boolean }) => {
            setIsOpen(details.open);
        };

        const handleActionClick = () => {
            if (action?.onClick) {
                action.onClick();
            }
            setIsOpen(false);
        };

        if (disabled) return children;

        return (
            <Popover.Root
                open={isOpen}
                onOpenChange={handleOpenChange}
                {...rest}
            >
                <Popover.Trigger asChild>{children}</Popover.Trigger>
                <Portal disabled={!portalled} container={portalRef}>
                    <Popover.Positioner>
                        <Popover.Content
                            ref={ref}
                            {...contentProps}
                            padding='20px'
                            fontSize='md'
                            borderRadius='16px'
                            backgroundColor='#1a1a1a'
                            color='white'
                            maxWidth={maxWidth}
                            minWidth='280px'
                            boxShadow='0 10px 40px rgba(0, 0, 0, 0.3)'
                            border='1px solid rgba(255, 255, 255, 0.1)'
                            position='relative'
                        >
                            {showArrow && (
                                <Popover.Arrow>
                                    <Popover.ArrowTip
                                        background='#1a1a1a !important'
                                        borderColor='rgba(255, 255, 255, 0.1)'
                                    />
                                </Popover.Arrow>
                            )}

                            <VStack gap={4} align='stretch'>
                                <VStack gap={2} align='stretch'>
                                    <Text
                                        fontSize='xl'
                                        fontWeight='bold'
                                        color='white'
                                        lineHeight='1.3'
                                    >
                                        {title}
                                    </Text>
                                    {description && (
                                        <Text
                                            fontSize='md'
                                            color='rgba(255, 255, 255, 0.8)'
                                            lineHeight='1.5'
                                        >
                                            {description}
                                        </Text>
                                    )}
                                </VStack>
                                {action && (
                                    <Button
                                        onClick={handleActionClick}
                                        variant={action.variant || 'solid'}
                                        backgroundColor='white'
                                        color='#1a1a1a'
                                        rounded='full'
                                        fontWeight='semibold'
                                        fontSize='md'
                                        height='48px'
                                        _hover={{
                                            backgroundColor:
                                                'rgba(255, 255, 255, 0.9)',
                                        }}
                                        transition='all 0.2s ease'
                                    >
                                        {action.label}
                                    </Button>
                                )}
                            </VStack>
                        </Popover.Content>
                    </Popover.Positioner>
                </Portal>
            </Popover.Root>
        );
    }
);
