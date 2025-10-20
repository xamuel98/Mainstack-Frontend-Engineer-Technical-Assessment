import { fluidCalc } from '@/utils';
import styled from '@emotion/styled';

export const WalletStatsContainer = styled.div`
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    width: 271px;
    height: 360px;
    gap: 32px;

    @media (max-width: 768px) {
        width: 100%;
        height: auto;
        gap: 24px;
    }

    @media (max-width: 480px) {
        gap: 20px;
    }
`;

export const WalletStatItem = styled.div`
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    align-items: flex-start;
    align-self: stretch;
    gap: 8px;
`;

export const WalletStatHeader = styled.div`
    display: flex;
    flex-shrink: 0;
    align-items: center;
    align-self: stretch;
    gap: 8px;
`;

export const WalletStatLabel = styled.p`
    flex-grow: 1;
    line-height: 16px;
    letter-spacing: -0.2px;
    color: #56616b;
    font-family: 'Degular', Arial, Helvetica, sans-serif;
    font-size: 14px;
    font-weight: 500;
    margin: 0;
`;

export const WalletStatIcon = styled.div`
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #56616b;
    transition: color 0.2s ease;

    &:hover {
        color: #131316;
    }

    svg {
        width: 20px;
        height: 20px;
    }
`;

export const WalletStatValue = styled.p`
    flex-shrink: 0;
    align-self: stretch;
    line-height: 38px;
    letter-spacing: -0.6px;
    color: #131316;
    font-family: 'Degular', Arial, Helvetica, sans-serif;
    font-size: ${fluidCalc('24px', '28px')};
    font-weight: 700;
    margin: 0;

    @media (max-width: 480px) {
        line-height: 32px;
        letter-spacing: -0.5px;
    }
`;
