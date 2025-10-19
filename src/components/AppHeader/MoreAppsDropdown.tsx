import React from 'react';
import { MaterialSymbol } from 'react-material-symbols';
import { Popover, For, Image, Portal } from '@chakra-ui/react';
import { MORE_APPS_NAVIGATION_ITEMS } from '@/utils/routes';
import { itemVariants } from '@/utils/animationVariants';
import {
    DropdownItemArrow,
    DropdownItemContent,
    DropdownItemDescription,
    DropdownItemIcon,
    DropdownItemLabel,
    MoreAppsDropdownItemButton,
    DropdownItemTitle,
    MoreAppsDropdownSection,
} from './styles';

interface MoreAppsDropdownProps {
    onSelectApp: (title: string) => void;
}

const MoreAppsDropdown = React.memo(
    ({ onSelectApp }: MoreAppsDropdownProps) => {
        return (
            <Portal>
                <Popover.Positioner>
                    <MoreAppsDropdownSection asChild>
                        <Popover.Content>
                            <For each={MORE_APPS_NAVIGATION_ITEMS}>
                                {(item, index) => (
                                    <MoreAppsDropdownItemButton
                                        key={item.title}
                                        custom={index}
                                        onClick={() => onSelectApp(item.title)}
                                        variants={itemVariants}
                                        initial='hidden'
                                        animate='visible'
                                        exit='hidden'
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        <DropdownItemContent>
                                            <DropdownItemIcon>
                                                <Image
                                                    src={item.icon}
                                                    alt={item.title}
                                                    boxSize={6}
                                                    aspectRatio={1}
                                                />
                                            </DropdownItemIcon>
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
                        </Popover.Content>
                    </MoreAppsDropdownSection>
                </Popover.Positioner>
            </Portal>
        );
    }
);

MoreAppsDropdown.displayName = 'MoreAppsDropdown';

export default MoreAppsDropdown;
