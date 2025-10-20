import React from 'react';
import { motion } from 'framer-motion';
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
import { USER_MENU_ACTIONS_ITEMS, contentVariants } from '@/utils';
import { User } from '@/types';
import {
    UserActionsDropdownSection,
    DropdownItemLink,
    DropdownItemTitle,
    UserDropdownItemButton,
} from './';

interface UserActionsDropdownProps {
    user: User;
    userFullName: string | null;
    isMobile?: boolean;
}

const UserActionsDropdown = React.memo(
    ({ user, userFullName, isMobile = false }: UserActionsDropdownProps) => {
        if (isMobile) {
            return (
                <motion.div
                    initial='hidden'
                    animate='visible'
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.1,
                                delayChildren: 0.1,
                            },
                        },
                    }}
                    style={{
                        position: 'relative',
                        width: '100%',
                        background: 'white',
                        padding: '0 0.75rem 1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.75rem',
                        minHeight: '50vh',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                    }}
                >
                    {/* User Account Section */}
                    <motion.div variants={contentVariants}>
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
                                    name={userFullName ?? ''}
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
                                    {userFullName ?? ''}
                                </Text>
                                <Text fontSize='sm' color='gray.400'>
                                    {user?.email ?? ''}
                                </Text>
                            </VStack>
                        </HStack>
                    </motion.div>

                    {/* User Menu Links */}
                    <motion.div
                        variants={contentVariants}
                        style={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.75rem',
                        }}
                    >
                        <For each={USER_MENU_ACTIONS_ITEMS}>
                            {(item, i) => (
                                <DropdownItemLink key={i} to='/'>
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
                    </motion.div>

                    {/* Logout Action */}
                    <motion.div variants={contentVariants}>
                        <UserDropdownItemButton>
                            <MaterialSymbol
                                icon='logout'
                                size={24}
                                weight={200}
                            />
                            <DropdownItemTitle>Sign Out</DropdownItemTitle>
                        </UserDropdownItemButton>
                    </motion.div>
                </motion.div>
            );
        }

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
                                        name={userFullName ?? ''}
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
                                        {userFullName ?? ''}
                                    </Text>
                                    <Text fontSize='sm' color='gray.400'>
                                        {user?.email ?? ''}
                                    </Text>
                                </VStack>
                            </HStack>

                            {/* User Menu Links */}
                            <For each={USER_MENU_ACTIONS_ITEMS}>
                                {(item, i) => (
                                    <DropdownItemLink key={i} to='/'>
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
    }
);

UserActionsDropdown.displayName = 'UserActionsDropdown';

export default UserActionsDropdown;
