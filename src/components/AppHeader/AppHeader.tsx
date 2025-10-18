/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Avatar, HStack } from '@chakra-ui/react';
import MainstackLogo from '@/assets/svgs/mainstack-logo.svg';
import { headerVariants } from '@/utils/animationVariants';
import AppHeaderNavigationLinks from './AppHeaderNavigationLinks';
import AppHeaderMoreApps from './AppHeaderMoreApps';
import AppHeaderActions from './AppHeaderActions';
import AppHeaderMoreAppsDialog from './AppHeaderMoreAppsDialog';
import {
    AppHeaderContainer,
    AppHeaderInner,
    AppHeaderLogo,
    AppHeaderLogoLink,
    AppHeaderLogoImage,
    AppHeaderNav,
    AppHeaderNavList,
} from './styles';

const AppHeader = React.memo(() => {
    const [isAppsOpen, setIsAppsOpen] = useState<boolean>(false);

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
                    <Avatar.Root
                        size='lg'
                        style={{
                            background:
                                'linear-gradient(139deg, #5C6670 2.33%, #131316 96.28%)',
                            color: '#FFFFFF',
                        }}
                    >
                        <Avatar.Fallback
                            name={'San Dma'}
                            fontWeight={600}
                            fontSize='lg'
                        />
                    </Avatar.Root>

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
                <AppHeaderActions />
            </AppHeaderInner>
        </AppHeaderContainer>
    );
});

AppHeader.displayName = 'AppHeader';

export default AppHeader;
