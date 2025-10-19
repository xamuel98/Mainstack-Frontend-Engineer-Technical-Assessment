import React from 'react';
import { MaterialSymbol } from 'react-material-symbols';
import {
    IconButton,
    Avatar,
    Popover,
    Flex,
    SkeletonCircle,
} from '@chakra-ui/react';
import { User } from '@/types';
import {
    UserActionsDropdown,
    AppHeaderActionGroup,
    AppHeaderActionItem,
    AppHeaderUserAction,
    AppHeaderUserAvatarFallback,
} from './';
import { Tooltip } from '../ui';

interface AppHeaderActionsProps {
    user: User | null;
    userFullName: string | null;
    isLoadingUser: boolean;
}

const AppHeaderActions = React.memo(
    ({ user, userFullName, isLoadingUser }: AppHeaderActionsProps) => {
        return (
            <AppHeaderActionGroup>
                {/* Notifications Action */}
                <AppHeaderActionItem>
                    <Tooltip content='Notifications' aria-label='Notifications'>
                        <IconButton aria-label='Notifications' variant='ghost'>
                            <MaterialSymbol
                                icon='notifications'
                                size={24}
                                weight={300}
                                color='gray.400'
                            />
                        </IconButton>
                    </Tooltip>
                </AppHeaderActionItem>

                {/* Chat Action */}
                <AppHeaderActionItem>
                    <Tooltip content='Chat' aria-label='Chat'>
                        <IconButton aria-label='Chat' variant='ghost'>
                            <MaterialSymbol
                                icon='chat'
                                size={24}
                                weight={300}
                                color='gray.400'
                            />
                        </IconButton>
                    </Tooltip>
                </AppHeaderActionItem>

                {/* User Action */}
                <AppHeaderUserAction>
                    <Popover.Root
                        autoFocus={false}
                        positioning={{
                            offset: { crossAxis: 0, mainAxis: 20 },
                            placement: 'top-end',
                        }}
                    >
                        <Popover.Trigger
                            asChild
                            pointerEvents={isLoadingUser ? 'none' : 'auto'}
                        >
                            <Flex alignItems='center' gapX={2}>
                                {isLoadingUser ? (
                                    <SkeletonCircle size={8} />
                                ) : (
                                    <Avatar.Root
                                        size='xs'
                                        style={{
                                            background:
                                                'linear-gradient(139deg, #5C6670 2.33%, #131316 96.28%)',
                                            color: '#FFFFFF',
                                        }}
                                    >
                                        <AppHeaderUserAvatarFallback
                                            name={userFullName ?? ''}
                                        />
                                    </Avatar.Root>
                                )}
                                <MaterialSymbol
                                    icon='menu'
                                    size={24}
                                    weight={200}
                                    color='gray.400'
                                />
                            </Flex>
                        </Popover.Trigger>

                        {/* User Actions Dropdown */}
                        {!isLoadingUser && user && userFullName && (
                            <UserActionsDropdown
                                user={user}
                                userFullName={userFullName}
                            />
                        )}
                    </Popover.Root>
                </AppHeaderUserAction>
            </AppHeaderActionGroup>
        );
    }
);

AppHeaderActions.displayName = 'AppHeaderActions';

export default AppHeaderActions;
