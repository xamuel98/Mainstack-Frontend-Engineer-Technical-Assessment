/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest';
import {
    formatMoney,
    formatDate,
    formatTransactionStatus,
} from '@/lib/formatters';

describe('formatMoney', () => {
    describe('Basic Functionality', () => {
        it('should format whole numbers without decimals by default', () => {
            expect(formatMoney(343)).toBe('USD 343');
            expect(formatMoney(1000)).toBe('USD 1,000');
            expect(formatMoney(1234567)).toBe('USD 1,234,567');
        });

        it('should format decimal numbers with decimals', () => {
            expect(formatMoney(434.54)).toBe('USD 434.54');
            expect(formatMoney(1000.5)).toBe('USD 1,000.50');
            expect(formatMoney(0.54)).toBe('USD 0.54');
            expect(formatMoney(123.456)).toBe('USD 123.46'); // Rounds to 2 decimal places
        });

        it('should format zero correctly', () => {
            expect(formatMoney(0)).toBe('USD 0');
            expect(formatMoney(0.0)).toBe('USD 0');
            expect(formatMoney(0, 'USD', true)).toBe('USD 0.00');
        });

        it('should handle negative numbers', () => {
            expect(formatMoney(-100)).toBe('USD -100');
            expect(formatMoney(-100.5)).toBe('USD -100.50');
            expect(formatMoney(-1234.56)).toBe('USD -1,234.56');
        });
    });

    describe('Currency Parameter', () => {
        it('should use custom currency codes', () => {
            expect(formatMoney(100, 'EUR')).toBe('EUR 100');
            expect(formatMoney(100, 'GBP')).toBe('GBP 100');
            expect(formatMoney(100, 'JPY')).toBe('JPY 100');
            expect(formatMoney(100, 'NGN')).toBe('NGN 100');
        });

        it('should handle empty currency string', () => {
            expect(formatMoney(100, '')).toBe(' 100');
        });

        it('should handle undefined currency (uses default)', () => {
            expect(formatMoney(100, undefined as any)).toBe('USD 100');
        });

        it('should handle null currency (uses default)', () => {
            expect(formatMoney(100, null as any)).toBe('USD 100');
        });

        it('should handle special characters in currency', () => {
            expect(formatMoney(100, '$')).toBe('$ 100');
            expect(formatMoney(100, '€')).toBe('€ 100');
            expect(formatMoney(100, '£')).toBe('£ 100');
        });
    });

    describe('showDecimals Parameter', () => {
        it('should show decimals for whole numbers when showDecimals is true', () => {
            expect(formatMoney(100, 'USD', true)).toBe('USD 100.00');
            expect(formatMoney(1000, 'USD', true)).toBe('USD 1,000.00');
            expect(formatMoney(0, 'USD', true)).toBe('USD 0.00');
        });

        it('should always show decimals for decimal numbers regardless of showDecimals', () => {
            expect(formatMoney(100.5, 'USD', false)).toBe('USD 100.50');
            expect(formatMoney(100.5, 'USD', true)).toBe('USD 100.50');
            expect(formatMoney(100.1, 'USD', false)).toBe('USD 100.10');
        });

        it('should handle showDecimals with negative numbers', () => {
            expect(formatMoney(-100, 'USD', true)).toBe('USD -100.00');
            expect(formatMoney(-100.5, 'USD', true)).toBe('USD -100.50');
        });
    });

    describe('Number Formatting and Localization', () => {
        it('should add thousand separators correctly', () => {
            expect(formatMoney(1000)).toBe('USD 1,000');
            expect(formatMoney(10000)).toBe('USD 10,000');
            expect(formatMoney(100000)).toBe('USD 100,000');
            expect(formatMoney(1000000)).toBe('USD 1,000,000');
            expect(formatMoney(1234567890)).toBe('USD 1,234,567,890');
        });

        it('should handle decimal formatting correctly', () => {
            expect(formatMoney(1000.1)).toBe('USD 1,000.10');
            expect(formatMoney(1000.12)).toBe('USD 1,000.12');
            expect(formatMoney(1000.123)).toBe('USD 1,000.12'); // Rounds to 2 decimals
            expect(formatMoney(1000.126)).toBe('USD 1,000.13'); // Rounds up
        });

        it('should handle very small decimal numbers', () => {
            expect(formatMoney(0.01)).toBe('USD 0.01');
            expect(formatMoney(0.001)).toBe('USD 0.00'); // Rounds to 2 decimals
            expect(formatMoney(0.005)).toBe('USD 0.01'); // Rounds up
            expect(formatMoney(0.004)).toBe('USD 0.00'); // Rounds down
        });

        it('should handle very large numbers', () => {
            expect(formatMoney(999999999.99)).toBe('USD 999,999,999.99');
            expect(formatMoney(1000000000)).toBe('USD 1,000,000,000');
            expect(formatMoney(Number.MAX_SAFE_INTEGER)).toContain('USD');
        });
    });

    describe('Edge Cases and Error Handling', () => {
        it('should handle NaN gracefully', () => {
            expect(formatMoney(NaN)).toBe('USD NaN');
        });

        it('should handle Infinity gracefully', () => {
            expect(formatMoney(Infinity)).toBe('USD Infinity');
            expect(formatMoney(-Infinity)).toBe('USD -Infinity');
        });

        it('should handle very precise decimal numbers', () => {
            expect(formatMoney(0.1 + 0.2)).toBe('USD 0.30'); // JavaScript floating point precision
            expect(formatMoney(1.005)).toBe('USD 1.01'); // Rounding behavior
        });

        it('should handle string numbers (should fail gracefully)', () => {
            expect(formatMoney('100' as any)).toBe('USD 100');
            expect(formatMoney('100.50' as any)).toBe('USD 100.5');
        });

        it('should handle null and undefined amounts', () => {
            expect(formatMoney(null as any)).toBe('USD null');
            expect(formatMoney(undefined as any)).toBe('USD undefined');
        });

        it('should handle boolean values', () => {
            expect(formatMoney(true as any)).toBe('USD true');
            expect(formatMoney(false as any)).toBe('USD false');
        });

        it('should handle object values', () => {
            expect(formatMoney({} as any)).toBe('USD [object Object]');
            expect(formatMoney([] as any)).toBe('USD ');
        });
    });

    describe('Precision and Rounding', () => {
        it('should round to 2 decimal places correctly', () => {
            expect(formatMoney(1.234)).toBe('USD 1.23');
            expect(formatMoney(1.235)).toBe('USD 1.24'); // Banker's rounding
            expect(formatMoney(1.236)).toBe('USD 1.24');
            expect(formatMoney(1.999)).toBe('USD 2.00');
        });

        it('should handle negative rounding correctly', () => {
            expect(formatMoney(-1.234)).toBe('USD -1.23');
            expect(formatMoney(-1.235)).toBe('USD -1.24');
            expect(formatMoney(-1.236)).toBe('USD -1.24');
        });

        it('should maintain precision for exact decimal values', () => {
            expect(formatMoney(1.5)).toBe('USD 1.50');
            expect(formatMoney(1.0)).toBe('USD 1');
            expect(formatMoney(1.1)).toBe('USD 1.10');
        });
    });
});

describe('formatDate', () => {
    describe('Basic Functionality', () => {
        it('should format ISO date strings correctly', () => {
            expect(formatDate('2022-04-03')).toBe('Apr 03, 2022');
            expect(formatDate('2023-12-09')).toBe('Dec 09, 2023');
            expect(formatDate('2024-01-15')).toBe('Jan 15, 2024');
        });

        it('should format Date objects correctly', () => {
            const date = new Date('2022-04-03');
            expect(formatDate(date)).toBe('Apr 03, 2022');
        });

        it('should handle ISO datetime strings', () => {
            expect(formatDate('2022-04-03T10:30:00Z')).toBe('Apr 03, 2022');
            expect(formatDate('2023-12-09T15:45:30.123Z')).toBe('Dec 09, 2023');
        });

        it('should handle different date formats', () => {
            expect(formatDate('2022/04/03')).toBe('Apr 03, 2022');
            expect(formatDate('04/03/2022')).toBe('Apr 03, 2022');
            expect(formatDate('April 3, 2022')).toBe('Apr 03, 2022');
        });
    });

    describe('Custom Options', () => {
        it('should respect custom formatting options', () => {
            const options: Intl.DateTimeFormatOptions = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            };
            expect(formatDate('2022-04-03', options)).toBe('April 3, 2022');
        });

        it('should handle different month formats', () => {
            const shortMonth = {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
            } as const;
            const longMonth = {
                year: 'numeric',
                month: 'long',
                day: '2-digit',
            } as const;
            const numericMonth = {
                year: 'numeric',
                month: 'numeric',
                day: '2-digit',
            } as const;

            expect(formatDate('2022-04-03', shortMonth)).toBe('Apr 03, 2022');
            expect(formatDate('2022-04-03', longMonth)).toBe('April 03, 2022');
            expect(formatDate('2022-04-03', numericMonth)).toBe('4/03/2022');
        });

        it('should handle different day formats', () => {
            const numericDay = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            } as const;
            const twoDigitDay = {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
            } as const;

            expect(formatDate('2022-04-03', numericDay)).toBe('Apr 3, 2022');
            expect(formatDate('2022-04-03', twoDigitDay)).toBe('Apr 03, 2022');
        });

        it('should handle different year formats', () => {
            const twoDigitYear = {
                year: '2-digit',
                month: 'short',
                day: '2-digit',
            } as const;
            const numericYear = {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
            } as const;

            expect(formatDate('2022-04-03', twoDigitYear)).toBe('Apr 03, 22');
            expect(formatDate('2022-04-03', numericYear)).toBe('Apr 03, 2022');
        });

        it('should handle time formatting options', () => {
            const withTime = {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            } as const;

            const result = formatDate('2022-04-03T10:30:00Z', withTime);
            expect(result).toContain('Apr 03, 2022');
            expect(result).toContain('10:30');
        });

        it('should handle weekday formatting', () => {
            const withWeekday = {
                weekday: 'long',
                year: 'numeric',
                month: 'short',
                day: '2-digit',
            } as const;

            const result = formatDate('2022-04-03', withWeekday); // Sunday
            expect(result).toContain('Sunday');
            expect(result).toContain('Apr 03, 2022');
        });
    });

    describe('Error Handling', () => {
        it('should handle invalid date strings', () => {
            expect(formatDate('invalid-date')).toBe('Invalid Date');
            expect(formatDate('not-a-date')).toBe('Invalid Date');
            expect(formatDate('2022-13-45')).toBe('Invalid Date');
        });

        it('should handle empty strings', () => {
            expect(formatDate('')).toBe('Invalid Date');
        });

        it('should handle null and undefined', () => {
            expect(formatDate(null as any)).toBe('Invalid Date');
            expect(formatDate(undefined as any)).toBe('Invalid Date');
        });

        it('should handle invalid Date objects', () => {
            const invalidDate = new Date('invalid');
            expect(formatDate(invalidDate)).toBe('Invalid Date');
        });

        it('should handle non-string, non-Date inputs', () => {
            expect(formatDate(123 as any)).toBe('Invalid Date');
            expect(formatDate({} as any)).toBe('Invalid Date');
            expect(formatDate([] as any)).toBe('Invalid Date');
            expect(formatDate(true as any)).toBe('Invalid Date');
        });
    });

    describe('Edge Cases', () => {
        it('should handle leap year dates', () => {
            expect(formatDate('2020-02-29')).toBe('Feb 29, 2020');
            expect(formatDate('2024-02-29')).toBe('Feb 29, 2024');
        });

        it('should handle year boundaries', () => {
            expect(formatDate('2022-12-31')).toBe('Dec 31, 2022');
            expect(formatDate('2023-01-01')).toBe('Jan 01, 2023');
        });

        it('should handle different timezones', () => {
            expect(formatDate('2022-04-03T00:00:00Z')).toBe('Apr 03, 2022');
            expect(formatDate('2022-04-03T23:59:59Z')).toBe('Apr 03, 2022');
        });

        it('should handle very old dates', () => {
            expect(formatDate('1900-01-01')).toBe('Jan 01, 1900');
            expect(formatDate('1000-12-25')).toBe('Dec 25, 1000');
        });

        it('should handle far future dates', () => {
            expect(formatDate('2100-12-31')).toBe('Dec 31, 2100');
            expect(formatDate('3000-01-01')).toBe('Jan 01, 3000');
        });

        it('should handle milliseconds in ISO strings', () => {
            expect(formatDate('2022-04-03T10:30:45.123Z')).toBe('Apr 03, 2022');
            expect(formatDate('2022-04-03T10:30:45.999Z')).toBe('Apr 03, 2022');
        });
    });

    describe('Locale and Internationalization', () => {
        it('should use en-US locale by default', () => {
            // The function uses 'en-US' locale internally
            expect(formatDate('2022-04-03')).toBe('Apr 03, 2022');
        });

        it('should handle different date separators consistently', () => {
            expect(formatDate('2022-04-03')).toBe('Apr 03, 2022');
            expect(formatDate('2022/04/03')).toBe('Apr 03, 2022');
        });
    });
});

describe('formatTransactionStatus', () => {
    describe('Basic Functionality', () => {
        it('should capitalize first letter and lowercase the rest', () => {
            expect(formatTransactionStatus('successful')).toBe('Successful');
            expect(formatTransactionStatus('pending')).toBe('Pending');
            expect(formatTransactionStatus('failed')).toBe('Failed');
            expect(formatTransactionStatus('cancelled')).toBe('Cancelled');
        });

        it('should handle already capitalized strings', () => {
            expect(formatTransactionStatus('SUCCESSFUL')).toBe('Successful');
            expect(formatTransactionStatus('PENDING')).toBe('Pending');
            expect(formatTransactionStatus('FAILED')).toBe('Failed');
        });

        it('should handle mixed case strings', () => {
            expect(formatTransactionStatus('sUcCeSSfUl')).toBe('Successful');
            expect(formatTransactionStatus('PeNdInG')).toBe('Pending');
            expect(formatTransactionStatus('fAiLeD')).toBe('Failed');
        });

        it('should handle single character strings', () => {
            expect(formatTransactionStatus('a')).toBe('A');
            expect(formatTransactionStatus('z')).toBe('Z');
            expect(formatTransactionStatus('1')).toBe('1');
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty strings', () => {
            expect(formatTransactionStatus('')).toBe('');
        });

        it('should handle strings with spaces', () => {
            expect(formatTransactionStatus('in progress')).toBe('In progress');
            expect(formatTransactionStatus('not found')).toBe('Not found');
            expect(formatTransactionStatus('under review')).toBe(
                'Under review'
            );
        });

        it('should handle strings with special characters', () => {
            expect(formatTransactionStatus('failed!')).toBe('Failed!');
            expect(formatTransactionStatus('pending...')).toBe('Pending...');
            expect(formatTransactionStatus('successful?')).toBe('Successful?');
        });

        it('should handle strings with numbers', () => {
            expect(formatTransactionStatus('status1')).toBe('Status1');
            expect(formatTransactionStatus('2pending')).toBe('2pending');
            expect(formatTransactionStatus('failed2')).toBe('Failed2');
        });

        it('should handle strings with hyphens and underscores', () => {
            expect(formatTransactionStatus('in-progress')).toBe('In-progress');
            expect(formatTransactionStatus('under_review')).toBe(
                'Under_review'
            );
            expect(formatTransactionStatus('not-found')).toBe('Not-found');
        });

        it('should handle strings starting with numbers', () => {
            expect(formatTransactionStatus('1successful')).toBe('1successful');
            expect(formatTransactionStatus('2failed')).toBe('2failed');
        });

        it('should handle strings starting with special characters', () => {
            expect(formatTransactionStatus('!important')).toBe('!important');
            expect(formatTransactionStatus('@pending')).toBe('@pending');
            expect(formatTransactionStatus('#failed')).toBe('#failed');
        });
    });

    describe('Unicode and International Characters', () => {
        it('should handle unicode characters', () => {
            expect(formatTransactionStatus('éxito')).toBe('Éxito');
            expect(formatTransactionStatus('ñoño')).toBe('Ñoño');
            expect(formatTransactionStatus('café')).toBe('Café');
        });

        it('should handle non-Latin characters', () => {
            expect(formatTransactionStatus('успешно')).toBe('Успешно'); // Russian
            expect(formatTransactionStatus('成功')).toBe('成功'); // Chinese
            expect(formatTransactionStatus('成功した')).toBe('成功した'); // Japanese
        });

        it('should handle mixed scripts', () => {
            expect(formatTransactionStatus('status成功')).toBe('Status成功');
            expect(formatTransactionStatus('успехful')).toBe('Успехful');
        });
    });

    describe('Type Safety and Error Handling', () => {
        it('should handle null and undefined gracefully', () => {
            expect(formatTransactionStatus(null as any)).toBe('');
            expect(formatTransactionStatus(undefined as any)).toBe('');
        });

        it('should handle non-string inputs by converting to string', () => {
            expect(formatTransactionStatus(123 as any)).toBe('123');
            expect(formatTransactionStatus(true as any)).toBe('True');
            expect(formatTransactionStatus(false as any)).toBe('False');
        });

        it('should handle object inputs', () => {
            expect(formatTransactionStatus({} as any)).toBe('[object object]');
            expect(formatTransactionStatus([] as any)).toBe('');
        });

        it('should handle function inputs', () => {
            const func = () => 'test';
            const result = formatTransactionStatus(func as any);
            expect(result).toContain('Function');
        });
    });

    describe('Real-world Status Values', () => {
        it('should handle common transaction statuses', () => {
            expect(formatTransactionStatus('successful')).toBe('Successful');
            expect(formatTransactionStatus('pending')).toBe('Pending');
            expect(formatTransactionStatus('failed')).toBe('Failed');
            expect(formatTransactionStatus('cancelled')).toBe('Cancelled');
            expect(formatTransactionStatus('refunded')).toBe('Refunded');
            expect(formatTransactionStatus('processing')).toBe('Processing');
            expect(formatTransactionStatus('declined')).toBe('Declined');
            expect(formatTransactionStatus('expired')).toBe('Expired');
        });

        it('should handle compound status values', () => {
            expect(formatTransactionStatus('partially_refunded')).toBe(
                'Partially_refunded'
            );
            expect(formatTransactionStatus('awaiting_confirmation')).toBe(
                'Awaiting_confirmation'
            );
            expect(formatTransactionStatus('under_review')).toBe(
                'Under_review'
            );
        });

        it('should handle status codes', () => {
            expect(formatTransactionStatus('status_200')).toBe('Status_200');
            expect(formatTransactionStatus('error_404')).toBe('Error_404');
            expect(formatTransactionStatus('code_500')).toBe('Code_500');
        });
    });
});
