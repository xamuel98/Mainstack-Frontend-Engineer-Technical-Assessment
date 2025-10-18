import React from 'react';
import { Button, CloseButton, Dialog, Portal } from '@chakra-ui/react';

const AppHeaderMoreAppsDialog = React.memo(() => {
    return (
        <Dialog.Root placement='bottom' motionPreset='slide-in-bottom'>
            <Dialog.Trigger asChild>
                <Button variant='outline'>Open Dialog</Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content
                        display='flex'
                        flexDirection='column'
                        width='100%'
                        backdropFilter='blur(8px)'
                        shadow='rgba(219, 222, 229, 0.08) 0px 16px 32px 12px, rgba(129, 139, 165, 0.08) 0px 12px 24px 6px'
                        bg='white'
                        border='1px solid'
                        borderColor='white'
                        margin={4}
                        maxWidth='50rem'
                        borderRadius={4}
                        paddingInline={2}
                        paddingTop={5}
                        paddingBottom={2}
                    >
                        <Dialog.Header>
                            <Dialog.Title>Dialog Title</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
                            </p>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant='outline'>Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button>Save</Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size='sm' />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
});

AppHeaderMoreAppsDialog.displayName = 'AppHeaderMoreAppsDialog';

export default AppHeaderMoreAppsDialog;
