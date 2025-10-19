import styled from '@emotion/styled';
import { Box } from '@chakra-ui/react';
import { css } from '@emotion/react';

export const AppToolbarItem = css`
    display: flex;
    flex: 1 1 0%;
    flex-direction: column;
    align-items: center;
    width: 100%;
    cursor: pointer;
    gap: 0.25rem;
    padding: 0.5rem 0.375rem;
    background: #ffffff;
    text-decoration: none;
    color: #56616b;

    p {
        font-size: 0.875rem;
        font-weight: 600;
        font-family:
            'Degular Display',
            'Degular',
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            'Segoe UI',
            Roboto,
            sans-serif;
        color: inherit;
        transition: color 0.25s ease;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
    }

    &:hover,
    &.active {
        color: #131316;
    }
`;

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

    .ms-app-toolbar__item {
        ${AppToolbarItem};
    }
`;
