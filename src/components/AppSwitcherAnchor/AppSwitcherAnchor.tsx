import React from 'react';
import { For, Image } from '@chakra-ui/react';
import { MORE_APPS_NAVIGATION_ITEMS } from '@/utils';
import { Tooltip } from '../ui';
import { AppSwitcherAnchorContainer, AppSwitcherAnchorItem } from './';

const AppSwitcherAnchor = React.memo(() => {
    return (
        <AppSwitcherAnchorContainer>
            <For each={MORE_APPS_NAVIGATION_ITEMS}>
                {item => (
                    <Tooltip
                        positioning={{ placement: 'right-end' }}
                        content={item.title}
                    >
                        <AppSwitcherAnchorItem>
                            <Image
                                src={item.icon}
                                alt={item.title}
                                boxSize={6}
                                aspectRatio={1}
                            />
                        </AppSwitcherAnchorItem>
                    </Tooltip>
                )}
            </For>
        </AppSwitcherAnchorContainer>
    );
});

AppSwitcherAnchor.displayName = 'AppSwitcherAnchor';

export default AppSwitcherAnchor;
