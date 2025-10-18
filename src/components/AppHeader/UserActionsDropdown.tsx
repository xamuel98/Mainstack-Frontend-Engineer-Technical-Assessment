import React from 'react';
import { MaterialSymbol } from 'react-material-symbols';
import {
    Popover,
    For,
    Portal,
    Text,
    HStack,
    Avatar,
    VStack,
} from '@chakra-ui/react';
import { USER_MENU_ACTIONS_ITEMS } from '@/utils/routes';
import { User } from '@/types';
import { useUserFullName } from '@/hooks';
import {
    UserActionsDropdownSection,
    DropdownItemLink,
    DropdownItemTitle,
    UserDropdownItemButton,
} from './styles';

const UserActionsDropdown = React.memo(({ user }: { user: User }) => {
    const userFullName = useUserFullName();

    return (
        <Portal>
            <Popover.Positioner>
                <UserActionsDropdownSection asChild>
                    <Popover.Content>
                        {/* User Account Section */}
                        <HStack gapX={2.5}>
                            <Avatar.Root
                                size='xl'
                                style={{
                                    background:
                                        'linear-gradient(139deg, #5C6670 2.33%, #131316 96.28%)',
                                    color: '#FFFFFF',
                                }}
                            >
                                <Avatar.Fallback
                                    name={userFullName}
                                    fontWeight={600}
                                    fontSize='xl'
                                />
                            </Avatar.Root>
                            <VStack gapY={1.5} align='flex-start'>
                                <Text
                                    fontSize='xl'
                                    color='gray.800'
                                    fontWeight={600}
                                >
                                    {userFullName}
                                </Text>
                                <Text fontSize='sm' color='gray.400'>
                                    {user.email}
                                </Text>
                            </VStack>
                        </HStack>

                        {/* User Menu Links */}
                        <For each={USER_MENU_ACTIONS_ITEMS}>
                            {item => (
                                <DropdownItemLink key={item.name} to='/'>
                                    {item.icon && (
                                        <item.icon
                                            icon={item.material_icon_name}
                                            size={24}
                                            weight={200}
                                        />
                                    )}
                                    <DropdownItemTitle>
                                        {item.name}
                                    </DropdownItemTitle>
                                </DropdownItemLink>
                            )}
                        </For>

                        {/* Logout Action */}
                        <UserDropdownItemButton>
                            <MaterialSymbol
                                icon='logout'
                                size={24}
                                weight={200}
                            />
                            <DropdownItemTitle>Sign Out</DropdownItemTitle>
                        </UserDropdownItemButton>
                    </Popover.Content>
                </UserActionsDropdownSection>
            </Popover.Positioner>
        </Portal>
    );
});

UserActionsDropdown.displayName = 'UserActionsDropdown';

export default UserActionsDropdown;
