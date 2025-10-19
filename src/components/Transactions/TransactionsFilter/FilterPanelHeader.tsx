import React from 'react';
import { motion } from 'framer-motion';
import { MaterialSymbol } from 'react-material-symbols';
import { Button, Text, HStack } from '@chakra-ui/react';
import { contentVariants } from '@/utils';

interface FilterPanelHeaderProps {
    onClose: () => void;
}

const FilterPanelHeader: React.FC<FilterPanelHeaderProps> = ({ onClose }) => {
    return (
        <motion.div variants={contentVariants}>
            <HStack
                justify='space-between'
                align='center'
                p='18px 22px'
                borderBottom='2px solid'
                borderColor='white'
                bg='rgba(255, 255, 255, 0.9)'
                backdropFilter='blur(8px)'
            >
                <Text
                    fontSize='24px'
                    fontWeight={700}
                    lineHeight='29px'
                    color='#131316'
                    fontFamily='heading'
                >
                    Filter
                </Text>
                <Button
                    variant='ghost'
                    size='sm'
                    rounded='full'
                    p='6px'
                    onClick={onClose}
                    _hover={{ bg: 'gray.50' }}
                    transition='all 0.2s ease'
                >
                    <MaterialSymbol
                        icon='close'
                        size={24}
                        weight={200}
                        color='#131316'
                    />
                </Button>
            </HStack>
        </motion.div>
    );
};

export default FilterPanelHeader;
