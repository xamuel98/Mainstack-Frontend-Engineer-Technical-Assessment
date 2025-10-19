import React from 'react';
import { motion } from 'framer-motion';
import { Box, VStack } from '@chakra-ui/react';
import { panelVariants } from '@/utils';

interface FilterPanelContentProps {
    isOpen: boolean;
    children: React.ReactNode;
}

const FilterPanelContent: React.FC<FilterPanelContentProps> = ({
    isOpen,
    children,
}) => {
    if (!isOpen) return null;

    return (
        <motion.div
            initial='hidden'
            animate='visible'
            exit='exit'
            variants={panelVariants}
            style={{
                display: 'flex',
                width: '100vw',
                height: '100dvh',
                position: 'fixed',
                left: '0',
                top: '0',
                zIndex: 1000,
                justifyContent: 'center',
            }}
        >
            <Box
                position='fixed'
                right='0px'
                top='0px'
                bottom='0px'
                width='100%'
                border='2px solid rgb(255, 255, 255)'
                background='rgb(255, 255, 255)'
                borderRadius='20px'
                boxShadow='rgba(219, 222, 229, 0.1) 0px 16px 32px, rgba(219, 222, 230, 0.1) 0px 12px 24px, rgba(188, 196, 204, 0.1) 0px 8px 16px 4px'
                transform='translateX(0%) translateY(0px) translateZ(0px)'
                display='flex'
                flexDirection='column'
                outlineOffset='2px'
                zIndex='1000'
                maxHeight='97%'
                color='inherit'
                backdropFilter='blur(8px)'
                bg='white'
                marginLeft='2%'
                maxWidth='96%'
                minHeight='97%'
                marginTop='16px'
                marginBottom='16px'
                left='4%'
                overflow='hidden'
                css={{
                    '@media (min-width: 768px)': {
                        width: '456px',
                        marginLeft: 'initial',
                        maxWidth: '456px',
                        maxHeight: 'initial',
                        minHeight: 'initial',
                        left: 'initial',
                        marginRight: '16px',
                    },
                    '@media (max-width: 768px)': {
                        left: '0px',
                        maxWidth: '100vw',
                        width: '96%',
                    },
                }}
            >
                <VStack gap={0} align='stretch' h='full'>
                    {children}
                </VStack>
            </Box>
        </motion.div>
    );
};

export default FilterPanelContent;
