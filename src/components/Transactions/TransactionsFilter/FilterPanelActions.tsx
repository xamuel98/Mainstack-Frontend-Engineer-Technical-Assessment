import React from 'react';
import { motion } from 'framer-motion';
import { Box, Button, HStack } from '@chakra-ui/react';
import { contentVariants } from '@/utils';

interface FilterPanelActionsProps {
    onClear: () => void;
    onApply: () => void;
}

const FilterPanelActions: React.FC<FilterPanelActionsProps> = ({
    onClear,
    onApply,
}) => {
    return (
        <motion.div variants={contentVariants}>
            <Box
                p='18px 22px'
                borderTop='2px solid'
                borderColor='white'
                bg='rgba(255, 255, 255, 0.9)'
                backdropFilter='blur(8px)'
            >
                <HStack gap={3}>
                    <Button
                        flex={1}
                        variant='outline'
                        borderColor='#EFF1F6'
                        rounded='full'
                        color='#131316'
                        bg='white'
                        fontFamily='body'
                        fontSize='16px'
                        fontWeight={600}
                        h='48px'
                        onClick={onClear}
                        _hover={{
                            bg: 'gray.50',
                            borderColor: '#D0D5DD',
                        }}
                        transition='all 0.2s ease'
                    >
                        Clear
                    </Button>
                    <Button
                        flex={1}
                        bg='#131316'
                        color='white'
                        rounded='full'
                        fontFamily='body'
                        fontSize='16px'
                        fontWeight={600}
                        h='48px'
                        onClick={onApply}
                        _hover={{
                            bg: '#2D2D30',
                        }}
                        transition='all 0.2s ease'
                    >
                        Apply
                    </Button>
                </HStack>
            </Box>
        </motion.div>
    );
};

export default FilterPanelActions;
