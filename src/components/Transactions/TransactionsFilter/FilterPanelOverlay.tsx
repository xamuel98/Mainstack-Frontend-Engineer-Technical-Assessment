import React from 'react';
import { motion } from 'framer-motion';
import { Box } from '@chakra-ui/react';
import { overlayVariants } from '@/utils';

interface FilterPanelOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

const FilterPanelOverlay: React.FC<FilterPanelOverlayProps> = ({
    isOpen,
    onClose,
}) => {
    if (!isOpen) return null;

    return (
        <motion.div
            initial='hidden'
            animate='visible'
            exit='exit'
            variants={overlayVariants}
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 999,
                cursor: 'pointer',
            }}
        >
            <Box
                position='absolute'
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg='rgba(0, 0, 0, 0.5)'
            />
        </motion.div>
    );
};

export default FilterPanelOverlay;
