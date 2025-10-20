import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Popover, VStack, Text, Button } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { DropdownItem, DropdownPopoverContent } from './Shared.styles';

const MotionButton = motion.create(Button);
const MotionPopoverContent = motion.create(Popover.Content);

export const MoreAppsDropdownSection = styled(MotionPopoverContent)`
    ${DropdownPopoverContent};

    row-gap: 0.125rem;
    padding: 0.5rem;
`;

export const UserActionsDropdownSection = styled(MotionPopoverContent)`
    ${DropdownPopoverContent};

    row-gap: 1.75rem;
    padding: 1.5rem 1.25rem 1.25rem;
`;

export const DropdownItemArrow = styled(Box)`
    display: none;
`;

export const MoreAppsDropdownItemButton = styled(MotionButton)`
    ${DropdownItem};

    z-index: 0;
    justify-content: space-between;
    padding: 0.75rem;
    border-radius: 1rem;
    border: 1px solid transparent;
    transition:
        border-color 220ms cubic-bezier(0.22, 1, 0.36, 1),
        box-shadow 220ms cubic-bezier(0.22, 1, 0.36, 1),
        transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
    will-change: border-color, box-shadow, transform;

    &:hover {
        z-index: 1;
        border-color: #eff1f6;
        box-shadow: 0 6px 18px rgba(19, 19, 22, 0.06);
        // transform: translateY(-1px);
        outline: none;
    }

    &:hover ${DropdownItemArrow} {
        display: block;
    }
`;

export const DropdownItemLink = styled(Link)`
    ${DropdownItem};

    justify-content: flex-start;
    padding: 0;
    column-gap: 0.75rem;
    border-radius: 0.5rem;
    text-decoration: none;
    transition:
        box-shadow 220ms cubic-bezier(0.22, 1, 0.36, 1),
        transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
    will-change: box-shadow, transform;
`;

export const UserDropdownItemButton = styled(MotionButton)`
    ${DropdownItem};

    justify-content: flex-start;
    padding: 0;
    column-gap: 0.75rem;
    border-radius: 0.5rem;
    text-decoration: none;
    color: #131316;
    transition:
        box-shadow 220ms cubic-bezier(0.22, 1, 0.36, 1),
        transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
    will-change: box-shadow, transform;
`;

export const DropdownItemContent = styled(Box)`
    display: flex;
    align-items: center;
    column-gap: 0.75rem;
`;

export const DropdownItemIcon = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    border: 1px solid rgb(239, 241, 246);
    box-shadow: rgba(188, 196, 204, 0.12) 0px 12px 24px 8px;
    border-radius: 0.75rem;
    background: #ffffff;
`;

export const DropdownItemLabel = styled(VStack)`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 0.125rem;
`;

export const DropdownItemTitle = styled(Text)`
    color: #131316;
    font-family: 'Degular';
    font-weight: 600;
    font-size: 1rem;
    font-style: normal;
    line-height: 1.5rem;
    margin: 0px;
`;

export const DropdownItemDescription = styled(Text)`
    color: #4a5568;
    font-family: 'Degular';
    font-size: 0.875rem;
    font-weight: 500;
    font-style: normal;
    line-height: 1.25rem;
    margin: 0px;
`;
