import React from 'react';
import { NavLink } from 'react-router-dom';
import { Text, For } from '@chakra-ui/react';
import { APP_HEADER_NAVIGATION_ITEMS } from '@/utils/routes';
import { AppHeaderNavLink } from './styles';
import { motion } from 'framer-motion';
import { linkVariants } from '@/utils/animationVariants';

interface AppHeaderNavigationLinksProps {
    isAppsOpen: boolean;
}

const AppHeaderNavigationLinks = React.memo(
    ({ isAppsOpen }: AppHeaderNavigationLinksProps) => {
        return (
            <For each={APP_HEADER_NAVIGATION_ITEMS}>
                {item => (
                    <motion.div
                        key={item.href}
                        variants={linkVariants}
                        initial='hidden'
                        animate='show'
                    >
                        <NavLink to={item.href} data-router-link>
                            {({
                                isActive: routeActive,
                            }: {
                                isActive: boolean;
                            }) => {
                                // Override router active if Apps dropdown is open
                                const isLinkActive = !isAppsOpen && routeActive;

                                return (
                                    <AppHeaderNavLink isActive={isLinkActive}>
                                        {item.icon && (
                                            <item.icon
                                                icon={item.material_icon_name}
                                                fill={isLinkActive}
                                                size={24}
                                                weight={200}
                                            />
                                        )}
                                        <Text
                                            color={
                                                isLinkActive
                                                    ? 'white'
                                                    : 'inherit'
                                            }
                                        >
                                            {item.name}
                                        </Text>
                                    </AppHeaderNavLink>
                                );
                            }}
                        </NavLink>
                    </motion.div>
                )}
            </For>
        );
    }
);

AppHeaderNavigationLinks.displayName = 'AppHeaderNavigationLinks';

export default AppHeaderNavigationLinks;
