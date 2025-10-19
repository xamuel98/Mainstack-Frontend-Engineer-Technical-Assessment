import styled from '@emotion/styled';
import { Button, VStack } from '@chakra-ui/react';

export const AppSwitcherAnchorContainer = styled(VStack)`
    position: fixed;
    display: none;
    flex-direction: column;
    align-items: flex-start;
    left: 1rem;
    height: auto;
    z-index: 1000;
    padding: 0.25rem;
    row-gap: 0.5rem;
    border-radius: 999px;
    background: #ffffff;
    box-shadow:
        0 4px 8px 0 rgba(92, 115, 131, 0.08),
        0 6px 12px 0 rgba(92, 115, 131, 0.08);
    backdrop-filter: blur(8px);

    @media (min-width: 768px) {
        top: 310px;
        display: flex;
    }
`;

export const AppSwitcherAnchorItem = styled(Button)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    padding: 0.5rem;
    gap: 0.25rem;
    border-radius: 999px;
    border: 1px solid transparent;
    background: transparent;
    box-shadow: 0 8px 16px 4px rgba(188, 196, 204, 0.12);
    outline: none;

    transition:
        background 0.25s cubic-bezier(0.16, 1, 0.3, 1),
        transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
        box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1),
        border-color 0.25s ease;

    &:hover {
        border-color: #eff1f6;
        background: #eff1f6;
    }

    img {
        width: 24px;
        height: 24px;
        display: block;
        object-fit: contain;

        filter: grayscale(1) brightness(0.8);
        transition: filter 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    &:hover img {
        filter: grayscale(0) brightness(1);
    }
`;
