/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Avatar, HStack, Portal, Dialog, Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useUser, useUserFullName, useAutoCloseMobileDialog } from '@/hooks';
import MainstackLogo from '@/assets/svgs/mainstack-logo.svg';
import SkeletonBox from '@/components/ui/Skeleton/SkeletonBox';
import {
    headerVariants,
    mainstackAppsDialogContainerVariants,
    contentVariants,
} from '@/utils';
import {
    AppHeaderNavigationLinks,
    AppHeaderMoreApps,
    AppHeaderActions,
    AppHeaderMoreAppsDialog,
    AppHeaderContainer,
    AppHeaderInner,
    AppHeaderLogo,
    AppHeaderLogoLink,
    AppHeaderLogoImage,
    AppHeaderNav,
    AppHeaderNavList,
    UserActionsDropdown,
} from './';

const DialogContent = motion.create(Dialog.Content);

const AppHeader = React.memo(() => {
    const { data: user, isLoading: isLoadingUser } = useUser();
    const userFullName = useUserFullName();

    const [isAppsOpen, setIsAppsOpen] = useState<boolean>(false);
    const [isMobileUserMenuOpen, setIsMobileUserMenuOpen] =
        useState<boolean>(false);

    // Automatically close mobile dialog when window width exceeds 768px
    useAutoCloseMobileDialog({
        isOpen: isMobileUserMenuOpen,
        setIsOpen: setIsMobileUserMenuOpen,
        breakpoint: 768,
    });

    const handleIsAppsOpen = (isOpen: boolean) => {
        setIsAppsOpen(isOpen);
    };

    return (
        <AppHeaderContainer
            initial='hidden'
            animate='show'
            variants={headerVariants}
            layout='position'
        >
            <AppHeaderInner
                initial='hidden'
                animate='show'
                variants={headerVariants}
            >
                <HStack
                    md={{ display: 'none' }}
                    display='flex'
                    gapX={3}
                    alignItems='center'
                >
                    {/* User Avatar */}
                    {isLoadingUser ? (
                        <SkeletonBox
                            width='40px'
                            height='40px'
                            borderRadius='full'
                        />
                    ) : (
                        <Dialog.Root
                            open={isMobileUserMenuOpen}
                            onOpenChange={details =>
                                setIsMobileUserMenuOpen(details.open)
                            }
                            trapFocus={false}
                            placement='bottom'
                            motionPreset='slide-in-bottom'
                        >
                            <Dialog.Trigger asChild>
                                <Avatar.Root
                                    size='lg'
                                    style={{
                                        background:
                                            'linear-gradient(139deg, #5C6670 2.33%, #131316 96.28%)',
                                        color: '#FFFFFF',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <Avatar.Fallback
                                        name={userFullName}
                                        fontWeight={600}
                                        fontSize='lg'
                                    />
                                </Avatar.Root>
                            </Dialog.Trigger>

                            {isMobileUserMenuOpen && (
                                <Portal>
                                    <Dialog.Backdrop />
                                    <Dialog.Positioner>
                                        <DialogContent
                                            variants={
                                                mainstackAppsDialogContainerVariants
                                            }
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
                                            {user && userFullName && (
                                                <UserActionsDropdown
                                                    user={user}
                                                    userFullName={userFullName}
                                                    isMobile={true}
                                                />
                                            )}
                                            <motion.div
                                                initial='hidden'
                                                animate='visible'
                                                variants={contentVariants}
                                                style={{
                                                    width: '100%',
                                                }}
                                            >
                                                <Dialog.ActionTrigger asChild>
                                                    <Button
                                                        variant='subtle'
                                                        bg='gray.50'
                                                        rounded='full'
                                                        marginTop={4}
                                                        width='full'
                                                        height='48px'
                                                        fontSize='16px'
                                                        fontWeight={600}
                                                        fontFamily='body'
                                                    >
                                                        Close
                                                    </Button>
                                                </Dialog.ActionTrigger>
                                            </motion.div>
                                        </DialogContent>
                                    </Dialog.Positioner>
                                </Portal>
                            )}
                        </Dialog.Root>
                    )}

                    {/* Apps Dialog */}
                    <AppHeaderMoreAppsDialog />
                </HStack>

                {/* Logo Section */}
                <AppHeaderLogo>
                    <AppHeaderLogoLink>
                        <NavLink to='/'>
                            <AppHeaderLogoImage
                                src={MainstackLogo}
                                alt='Mainstack Logo'
                            />
                        </NavLink>
                    </AppHeaderLogoLink>
                </AppHeaderLogo>

                {/* Navigation Section */}
                <AppHeaderNav>
                    <AppHeaderNavList as='nav'>
                        {/* Navigation Links */}
                        <AppHeaderNavigationLinks isAppsOpen={isAppsOpen} />

                        {/* More Apps */}
                        <AppHeaderMoreApps onOpenChange={handleIsAppsOpen} />
                    </AppHeaderNavList>
                </AppHeaderNav>

                {/* Actions Section */}
                <AppHeaderActions
                    user={user}
                    userFullName={userFullName}
                    isLoadingUser={isLoadingUser}
                />
            </AppHeaderInner>
        </AppHeaderContainer>
    );
});

AppHeader.displayName = 'AppHeader';

export default AppHeader;
