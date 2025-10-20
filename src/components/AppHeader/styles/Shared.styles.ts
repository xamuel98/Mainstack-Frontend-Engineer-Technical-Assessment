import { css } from '@emotion/react';

export const InteractiveFadeStyle = css`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Degular';
    font-weight: 600;
    font-size: 16px;
    border-radius: 9999px;
    cursor: pointer;
    overflow: hidden;
    z-index: 0;

    color: var(--link-color, #56616b);
    background: var(--link-bg, transparent);

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: var(--link-bg, #eff1f6);
        border-radius: inherit;
        opacity: var(--link-bg-opacity, 0);
        transform: scale(0.96);
        transition:
            opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        z-index: -1;
    }

    &:hover::before {
        opacity: 1;
        transform: scale(1);
    }

    &:hover {
        color: #131316;
    }
`;

export const DropdownPopoverContent = css`
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 24rem;
    background: #ffffff;
    border: 2px solid #ffffff;
    box-shadow:
        rgba(219, 222, 229, 0.08) 0px 16px 32px 12px,
        rgba(129, 139, 165, 0.08) 0px 12px 24px 6px;
    backdrop-filter: blur(0.5rem);
    border-radius: 1rem;
    position: relative;
    pointer-events: auto;
`;

export const DropdownItem = css`
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
    background: #ffffff;
    height: auto;

    &:hover {
        outline: none;
    }
`;
