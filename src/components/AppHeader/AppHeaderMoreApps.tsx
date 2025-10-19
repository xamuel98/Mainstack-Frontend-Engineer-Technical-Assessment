import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MaterialSymbol } from 'react-material-symbols';
import { Text, Flex, Popover } from '@chakra-ui/react';
import { linkVariants } from '@/utils/animationVariants';
import { AppHeaderNavMoreAction } from './styles';
import MoreAppsDropdown from './MoreAppsDropdown';

interface AppHeaderMoreAppsProps {
    onOpenChange: (isOpen: boolean) => void;
}

const AppHeaderMoreApps = React.memo(
    ({ onOpenChange }: AppHeaderMoreAppsProps) => {
        const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
        const [selectedApp, setSelectedApp] = useState<string>('Link in Bio');

        const handleOpenChange = (details: { open: boolean }) => {
            setIsDropdownOpen(details.open);
            onOpenChange(details.open);
        };

        const handleSelectApp = (app: string) => {
            setSelectedApp(app);
            // Leave dropdown open when app options are clicked.
            // So the selected app can show on the App menu button
            // setIsDropdownOpen(false);
            onOpenChange(false);
        };

        return (
            <Popover.Root
                open={isDropdownOpen}
                onOpenChange={handleOpenChange}
                autoFocus={false}
                positioning={{
                    offset: { crossAxis: 0, mainAxis: 15 },
                    placement: 'top-start',
                }}
            >
                <Popover.Trigger asChild>
                    <motion.div
                        variants={linkVariants}
                        initial='hidden'
                        animate='show'
                    >
                        <AppHeaderNavMoreAction
                            isActive={isDropdownOpen}
                            onClick={() =>
                                handleOpenChange({ open: !isDropdownOpen })
                            }
                        >
                            <Flex
                                gap='1'
                                align='center'
                                style={
                                    isDropdownOpen
                                        ? {
                                              padding:
                                                  '0.5rem 1.125rem 0.5rem 0.875rem',
                                              borderRight: '1px solid #262628',
                                          }
                                        : {}
                                }
                            >
                                <MaterialSymbol
                                    icon='widgets'
                                    fill={isDropdownOpen}
                                    size={24}
                                    weight={200}
                                />
                                <Text>Apps</Text>
                            </Flex>

                            {isDropdownOpen && (
                                <Flex
                                    gap='1'
                                    align='center'
                                    style={{
                                        padding: '0.5rem 0.875rem',
                                    }}
                                >
                                    <Text>{selectedApp}</Text>
                                    <MaterialSymbol
                                        icon='keyboard_arrow_down'
                                        fill={isDropdownOpen}
                                        size={24}
                                    />
                                </Flex>
                            )}
                        </AppHeaderNavMoreAction>
                    </motion.div>
                </Popover.Trigger>

                <MoreAppsDropdown onSelectApp={handleSelectApp} />
            </Popover.Root>
        );
    }
);

AppHeaderMoreApps.displayName = 'AppHeaderMoreApps';

export default AppHeaderMoreApps;
