import React from 'react';
import { NavLink } from 'react-router-dom';
import { For, Text } from '@chakra-ui/react';
import { APP_HEADER_NAVIGATION_ITEMS } from '@/utils/routes';
import { AppToolbarContainer } from './AppToolbar.styles';

const AppToolbar = React.memo(() => {
    return (
        <AppToolbarContainer>
            <For each={APP_HEADER_NAVIGATION_ITEMS}>
                {item => (
                    <NavLink
                        key={item.href}
                        to={item.href}
                        className={({ isActive }) =>
                            `ms-app-toolbar__item ${isActive ? 'active' : ''}`
                        }
                    >
                        {item.icon && (
                            <item.icon
                                icon={item.material_icon_name}
                                // fill={routeActive}
                                size={24}
                                weight={200}
                            />
                        )}
                        <Text>{item.name}</Text>
                    </NavLink>
                )}
            </For>
        </AppToolbarContainer>
    );
});

AppToolbar.displayName = 'AppToolbar';

export default AppToolbar;
