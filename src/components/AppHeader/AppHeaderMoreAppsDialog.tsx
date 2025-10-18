import React, { useState } from 'react';
import { MaterialSymbol } from 'react-material-symbols';
import { motion } from 'framer-motion';
import { Button, Dialog, For, Text, Portal } from '@chakra-ui/react';
import { MORE_APPS_NAVIGATION_ITEMS } from '@/utils/routes';
import {
    DropdownItemArrow,
    DropdownItemContent,
    DropdownItemDescription,
    DropdownItemIcon,
    DropdownItemLabel,
    DropdownItemTitle,
    MoreAppsDropdownItemButton,
} from './styles';
import {
    mainstackAppsDialogContainerVariants,
    mainstackAppsDialogItemVariants,
    mainstackAppsDialogTitleVariants,
} from '@/utils/animationVariants';

const DialogTitle = motion.create(Text);
const DialogContent = motion.create(Dialog.Content);

const AppHeaderMoreAppsDialog = React.memo(() => {
    const [selectedApp, setSelectedApp] = useState<string>('Link in Bio');
    const [isMoreAppsDialogOpen, setIsMoreAppsDialogOpen] =
        useState<boolean>(false);

    const onSelectApp = (app: string) => {
        setSelectedApp(app);
        setIsMoreAppsDialogOpen(false);
    };

    return (
        <Dialog.Root
            open={isMoreAppsDialogOpen}
            onOpenChange={details => setIsMoreAppsDialogOpen(details.open)}
            closeOnInteractOutside={false}
            placement='bottom'
            motionPreset='slide-in-bottom'
        >
            <Dialog.Trigger asChild>
                <Button
                    variant='solid'
                    padding='0.5rem 0.875rem'
                    fontSize='16px'
                    lineHeight='24px'
                    fontWeight={600}
                    rounded='full'
                >
                    {selectedApp}
                    <MaterialSymbol icon='keyboard_arrow_down' size={20} />
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <DialogContent
                        variants={mainstackAppsDialogContainerVariants}
                        initial='hidden'
                        animate='visible'
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
                        borderRadius='16px'
                        paddingInline={2}
                        paddingTop={5}
                        paddingBottom={2}
                    >
                        <DialogTitle
                            padding={3}
                            color='gray.400'
                            fontSize='14px'
                            fontWeight={500}
                            fontFamily={
                                '"Degular", "Degular Display" system-ui'
                            }
                            variants={mainstackAppsDialogTitleVariants}
                            initial='hidden'
                            animate='visible'
                            exit='hidden'
                        >
                            MAINSTACK APPS
                        </DialogTitle>
                        <For each={MORE_APPS_NAVIGATION_ITEMS}>
                            {(item, i) => (
                                <MoreAppsDropdownItemButton
                                    key={item.title}
                                    custom={i}
                                    onClick={() => onSelectApp(item.title)}
                                    variants={mainstackAppsDialogItemVariants}
                                    initial='hidden'
                                    animate='visible'
                                    exit='hidden'
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <DropdownItemContent>
                                        <DropdownItemIcon></DropdownItemIcon>
                                        <DropdownItemLabel>
                                            <DropdownItemTitle>
                                                {item.title}
                                            </DropdownItemTitle>
                                            <DropdownItemDescription>
                                                {item.description}
                                            </DropdownItemDescription>
                                        </DropdownItemLabel>
                                    </DropdownItemContent>
                                    <DropdownItemArrow>
                                        <MaterialSymbol
                                            icon='keyboard_arrow_right'
                                            color='#131316'
                                            size={20}
                                        />
                                    </DropdownItemArrow>
                                </MoreAppsDropdownItemButton>
                            )}
                        </For>
                        <Dialog.ActionTrigger asChild>
                            <Button
                                variant='subtle'
                                bg='gray.50'
                                rounded='999px'
                                marginTop={4}
                                fontSize='16px'
                                fontWeight={600}
                                fontFamily={
                                    '"Degular", "Degular Display" system-ui'
                                }
                            >
                                Close
                            </Button>
                        </Dialog.ActionTrigger>
                    </DialogContent>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
});

AppHeaderMoreAppsDialog.displayName = 'AppHeaderMoreAppsDialog';

export default AppHeaderMoreAppsDialog;
