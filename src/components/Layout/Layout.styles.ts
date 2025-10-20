import { motion } from 'framer-motion';
import { Box, Flex } from '@chakra-ui/react';
import styled from '@emotion/styled';

const MotionFlex = motion.create(Flex);
const MotionBox = motion.create(Box);

export const LayoutWrapper = styled(Flex)`
    display: flex;
    flex-direction: column;
    min-height: 100svh;
    position: relative;
    background: #ffffff;
`;

export const LayoutContainer = styled(MotionFlex)`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: stretch;
    background: #ffffff;
    overflow-x: hidden;
    overflow-y: auto;
    will-change: opacity;
`;

export const LayoutOutlet = styled(MotionBox)`
    width: 100%;
    height: 100%;
    flex: 1;
    display: block;
    position: relative;
    will-change: opacity;
`;

export const LayoutBox = styled(Box)`
    margin: 5.75rem 0 10rem;
    min-height: calc(100vh - 5.75rem);
    padding: 64px 0.5rem 1.5rem;
    background: #ffffff;

    @media (max-width: 768px) {
        margin-top: 4rem;
        min-height: calc(100vh - 4.5rem);
    }
`;
