import styled from '@emotion/styled';
import { fluidCalc } from '@/utils';

export const TransactionsHeaderContainer = styled.div`
    display: flex;
    align-items: flex-start;
    background: #ffffff;
    width: 100%;
    padding-bottom: 1.5rem;
    column-gap: 1.5rem;
    border-bottom: 1px solid #eff1f6;

    @media (max-width: 480px) {
        flex-direction: column;
        row-gap: 1rem;
    }
`;

export const TransactionsHeaderText = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex: 1 0 0%;
`;

export const TransactionsHeaderTitle = styled.h2`
    font-family:
        'Degular',
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        'Segoe UI',
        Roboto,
        sans-serif;
    color: #131316;
    white-space: nowrap;
    font-size: ${fluidCalc('1.25rem', '1.5rem')};
    font-style: normal;
    font-weight: 700;
    line-height: ${fluidCalc('1.5rem', '2rem')};
    letter-spacing: -0.0375rem;
    text-transform: capitalize;
`;

export const TransactionsHeaderSubtitle = styled.p`
    align-self: stretch;
    font-family:
        'Degular',
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        'Segoe UI',
        Roboto,
        sans-serif;
    white-space: nowrap;
    color: #56616b;
    text-align: left;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1rem;
    letter-spacing: -0.0125rem;
`;

export const TransactionsHeaderActions = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.75rem;

    @media (max-width: 480px) {
        width: 100%;
        justify-content: flex-start;
    }
`;

export const TransactionList = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
    width: 100%;
`;

export const TransactionRecord = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    column-gap: 1rem;
    width: 100%;
    background: #ffffff;
    transition:
        background 0.25s ease,
        transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    cursor: pointer;
    will-change: transform;
`;

export const TransactionBody = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    column-gap: 0.875rem;
    flex: 1 0 0%;
`;

export const TransactionIcon = styled.div<{
    type: 'deposit' | 'withdrawal';
}>`
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${fluidCalc('2.25rem', '3rem')};
    height: ${fluidCalc('2.25rem', '3rem')};
    border-radius: 999px;
    color: ${({ type }) =>
        type === 'deposit'
            ? '#075132'
            : type === 'withdrawal'
              ? '#961100'
              : '#56616B'};
    background: ${({ type }) =>
        type === 'deposit'
            ? '#E3FCF2'
            : type === 'withdrawal'
              ? '#F9E3E0'
              : '#EFF1F6'};
    flex-shrink: 0;
`;

export const TransactionIconSymbol = styled.div`
    width: 1.25rem;
    height: 1.25rem;
`;

export const TransactionDetails = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex: 1 0 0%;
`;

export const TransactionDetailTitle = styled.h6`
    font-family:
        'Degular',
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        'Segoe UI',
        Roboto,
        sans-serif;
    color: #131316;
    white-space: nowrap;
    font-size: 1rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.5rem;
    letter-spacing: -0.025rem;
`;

export const TransactionDetailSubtitle = styled.p<{
    status?: 'successful' | 'pending' | 'failed';
}>`
    font-family:
        'Degular',
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        'Segoe UI',
        Roboto,
        sans-serif;
    color: ${({ status }) =>
        status === 'successful'
            ? '#0EA163'
            : status === 'pending'
              ? '#A77A07'
              : status === 'failed'
                ? '#FF3333'
                : '#56616B'};
    white-space: nowrap;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1rem;
    letter-spacing: -0.0125rem;
`;

export const TransactionMeta = styled.div`
    display: inline-flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    column-gap: 0.25rem;
`;

export const TransactionMetaAmount = styled.div`
    font-family:
        'Degular',
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        'Segoe UI',
        Roboto,
        sans-serif;
    color: #131316;
    text-align: right;
    white-space: nowrap;
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1.5rem;
    letter-spacing: -0.025rem;
`;

export const TransactionMetaDate = styled.div`
    font-family:
        'Degular',
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        'Segoe UI',
        Roboto,
        sans-serif;
    color: #56616b;
    text-align: right;
    white-space: nowrap;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1rem;
    letter-spacing: -0.0125rem;
`;
