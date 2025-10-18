import styled from '@emotion/styled';
import { Box } from '@chakra-ui/react';

export const AppToolbarContainer = styled(Box)`
    position: fixed;
    display: flex;
    bottom: 0;
    height: 3.75rem;
    background: #ffffff;
    align-items: center;
    z-index: 1030;
    width: 100%;

    @media (min-width: 1024px) {
        display: none;
    }

    /* Prevent subpixel jitter during fade */
    will-change: transform, opacity;
`;
