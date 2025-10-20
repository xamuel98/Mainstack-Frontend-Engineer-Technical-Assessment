import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { Box, Flex, Image, HStack, Button, Avatar } from '@chakra-ui/react';
import { InteractiveFadeStyle } from './Shared.styles';

// Create a motion-enabled Chakra Box
const MotionBox = motion.create(Box);
const MotionFlex = motion.create(Flex);
const MotionHStack = motion.create(HStack);

export const AppHeaderContainer = styled(MotionBox)`
    position: fixed;
    z-index: 30;
    width: 100%;
    padding: 0;
    background: #ffffff;

    @media (min-width: 768px) {
        padding: 1rem 1rem 0.75rem;
    }

    /* Prevent subpixel jitter during fade */
    will-change: transform, opacity;
`;

export const AppHeaderInner = styled(MotionFlex)`
    height: 4rem;
    border: 2px solid #ffffff;
    border-radius: 9999px;
    background: #ffffff;
    padding: 0 0.75rem 0 1.5rem;
    box-shadow:
        0 2px 6px rgba(45, 59, 67, 0.06),
        0 2px 4px rgba(45, 59, 67, 0.05);
    backdrop-filter: blur(8px);
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;

    @media (max-width: 768px) {
        height: 4.5rem;
        width: 100%;
        height: 4.5rem;
        border-radius: 0;
        border: none;
        padding: 1rem;
    }
`;

export const AppHeaderLogo = styled(Box)`
    flex: 1;
    display: flex;
    align-items: center;

    @media (max-width: 768px) {
        display: none;
    }
`;

export const AppHeaderLogoLink = styled.div`
    display: inline-flex;
`;

export const AppHeaderLogoImage = styled(Image)`
    width: 2.25rem;
    height: 2.25rem;
`;

export const AppHeaderNav = styled(Box)`
    flex-grow: 1;
    display: none;
    justify-content: center;

    @media (min-width: 1024px) {
        display: flex;
    }
`;

export const AppHeaderNavList = styled(MotionHStack)`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    overflow-wrap: break-word;
    gap: 1rem;
    color: #56616b;

    @media (min-width: 640px) {
        gap: 1.25rem;
    }
`;

export const AppHeaderNavLink = styled.div<{ isActive?: boolean }>`
    ${InteractiveFadeStyle}

    gap: 0.25rem;
    color: ${({ isActive }) => (isActive ? '#ffffff' : '#56616b')};
    padding: 0.5rem 1.125rem 0.5rem 0.875rem;

    &::before {
        background: ${({ isActive }) => (isActive ? '#131316' : '#eff1f6')};
        opacity: ${({ isActive }) => (isActive ? 1 : 0)};
    }

    ${({ isActive }) =>
        isActive &&
        `
        &::before {
        opacity: 1;
        transform: scale(1);
        background: #131316;
        }
        color: #ffffff !important;
    `}
`;

export const AppHeaderNavMoreAction = styled(Button)<{ isActive?: boolean }>`
    ${InteractiveFadeStyle}

    gap: ${({ isActive }) => (isActive ? '0rem' : '0.25rem')};
    color: ${({ isActive }) => (isActive ? '#ffffff' : '#56616b')};
    padding: ${({ isActive }) =>
        isActive ? '0rem' : '0.5rem 1.125rem 0.5rem 0.875rem'};

    ${({ isActive }) =>
        isActive &&
        `
        &::before {
            opacity: 1;
            transform: scale(1);
            background: #131316;
        }
        color: #ffffff !important;
    `}

    &:hover {
        &::before {
            background: ${({ isActive }) => (isActive ? '#131316' : '#eff1f6')};
        }
    }
`;

export const AppHeaderActionGroup = styled(Flex)`
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 1rem;
`;

export const AppHeaderActionItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    font-family:
        'Degular Display',
        'Degular',
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        'Segoe UI',
        Roboto,
        sans-serif;
    font-weight: 600;
    font-size: 17px;
    color: #56616b;
    transition: all 300ms cubic-bezier(0, 0, 0.58, 1);
    border-radius: 9999px;
    padding: 0.125rem;
    cursor: pointer;
    background: transparent;

    &:hover {
        background: #eff1f6 !important;
    }

    > button {
        background: transparent !important;
    }
`;

export const AppHeaderUserAction = styled(Box)`
    display: flex;
    padding: 0.25rem 0.75rem 0.25rem 0.3125rem;
    align-items: center;
    gap: 0.5rem;
    border-radius: 9999px;
    background: #eff1f6;
    cursor: pointer;

    @media (max-width: 768px) {
        display: none;
    }
`;

export const AppHeaderUserAvatarFallback = styled(Avatar.Fallback)<{
    name: string;
}>`
    font-family: 'Degular Display', 'Degular', system-ui, sans-serif;
    font-weight: 600;
    font-size: 14px;
`;
