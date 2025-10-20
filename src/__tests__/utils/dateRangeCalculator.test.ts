/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { calculateDateRange } from '@/utils/dateRangeCalculator';

describe('Date Range Calculator', () => {
    let mockDate: Date;
    let originalDate: DateConstructor;

    beforeEach(() => {
        // Mock current date to January 15, 2024, 10:30:00 AM
        mockDate = new Date('2024-01-15T10:30:00Z');
        originalDate = global.Date;

        // Create a proper Date constructor mock
        const MockDate = function (...args: any[]) {
            if (!args || args.length === 0) {
                return new originalDate(mockDate);
            }
            return Reflect.construct(originalDate, args);
        } as any;

        // Copy static methods from original Date
        Object.setPrototypeOf(MockDate, originalDate);
        Object.getOwnPropertyNames(originalDate).forEach(name => {
            if (name !== 'length' && name !== 'name' && name !== 'prototype') {
                MockDate[name] = (originalDate as any)[name];
            }
        });

        MockDate.now = vi.fn(() => mockDate.getTime());
        MockDate.prototype = originalDate.prototype;

        global.Date = MockDate;
    });

    afterEach(() => {
        global.Date = originalDate;
        vi.restoreAllMocks();
    });

    describe('calculateDateRange', () => {
        describe('Today Range', () => {
            it('should return today for "today" range', () => {
                const result = calculateDateRange('today');

                expect(result.startDate).toEqual(mockDate);
                expect(result.endDate).toEqual(mockDate);
            });

            it('should return separate date objects for start and end', () => {
                const result = calculateDateRange('today');

                expect(result.startDate).not.toBe(result.endDate);
                expect(result.startDate).toEqual(result.endDate);
            });
        });

        describe('Last 7 Days Range', () => {
            it('should return correct range for "last-7-days"', () => {
                const result = calculateDateRange('last-7-days');

                const expectedStartDate = new Date(mockDate);
                expectedStartDate.setDate(mockDate.getDate() - 7);

                expect(result.startDate).toEqual(expectedStartDate);
                expect(result.endDate).toEqual(mockDate);
            });

            it('should handle month boundary correctly for last 7 days', () => {
                // Test when current date is early in month
                const earlyMonthDate = new Date('2024-01-03T10:30:00Z');
                global.Date = vi.fn(() => earlyMonthDate) as any;

                const result = calculateDateRange('last-7-days');

                const expectedStartDate = new Date(earlyMonthDate);
                expectedStartDate.setDate(earlyMonthDate.getDate() - 7); // Should go to previous month

                expect(result.startDate).toEqual(expectedStartDate);
                expect(result.endDate).toEqual(earlyMonthDate);
            });
        });

        describe('This Month Range', () => {
            it('should return correct range for "this-month"', () => {
                const result = calculateDateRange('this-month');

                const expectedStartDate = new Date(2024, 0, 1); // January 1, 2024

                expect(result.startDate).toEqual(expectedStartDate);
                expect(result.endDate).toEqual(mockDate);
            });

            it('should handle different months correctly', () => {
                // Test for March
                const marchDate = new Date('2024-03-15T10:30:00Z');
                global.Date = vi.fn(() => marchDate) as any;

                const result = calculateDateRange('this-month');

                const expectedStartDate = new Date(2024, 2, 1); // March 1, 2024

                expect(result.startDate).toEqual(expectedStartDate);
                expect(result.endDate).toEqual(marchDate);
            });

            it('should handle leap year February correctly', () => {
                const febLeapDate = new Date('2024-02-29T10:30:00Z');
                global.Date = vi.fn(() => febLeapDate) as any;

                const result = calculateDateRange('this-month');

                const expectedStartDate = new Date(2024, 1, 1); // February 1, 2024

                expect(result.startDate).toEqual(expectedStartDate);
                expect(result.endDate).toEqual(febLeapDate);
            });
        });

        describe('Last 3 Months Range', () => {
            it('should return correct range for "last-3-months"', () => {
                const result = calculateDateRange('last-3-months');

                const expectedStartDate = new Date(mockDate);
                expectedStartDate.setMonth(mockDate.getMonth() - 3);

                expect(result.startDate).toEqual(expectedStartDate);
                expect(result.endDate).toEqual(mockDate);
            });

            it('should handle year boundary correctly for last 3 months', () => {
                // Test when current date is early in year
                const earlyYearDate = new Date('2024-02-15T10:30:00Z');
                global.Date = vi.fn(() => earlyYearDate) as any;

                const result = calculateDateRange('last-3-months');

                const expectedStartDate = new Date(earlyYearDate);
                expectedStartDate.setMonth(earlyYearDate.getMonth() - 3); // Should go to previous year

                expect(result.startDate).toEqual(expectedStartDate);
                expect(result.endDate).toEqual(earlyYearDate);
            });

            it('should handle month with different day counts', () => {
                // Test from May 31st going back 3 months
                const mayDate = new Date('2024-05-31T10:30:00Z');
                global.Date = vi.fn(() => mayDate) as any;

                const result = calculateDateRange('last-3-months');

                const expectedStartDate = new Date(mayDate);
                expectedStartDate.setMonth(mayDate.getMonth() - 3);

                expect(result.startDate).toEqual(expectedStartDate);
                expect(result.endDate).toEqual(mayDate);
            });
        });

        describe('This Year Range', () => {
            it('should return correct range for "this-year"', () => {
                const result = calculateDateRange('this-year');

                const expectedStartDate = new Date(2024, 0, 1); // January 1, 2024

                expect(result.startDate).toEqual(expectedStartDate);
                expect(result.endDate).toEqual(mockDate);
            });

            it('should handle different years correctly', () => {
                const nextYearDate = new Date('2025-06-15T10:30:00Z');
                global.Date = vi.fn(() => nextYearDate) as any;

                const result = calculateDateRange('this-year');

                const expectedStartDate = new Date(2025, 0, 1); // January 1, 2025

                expect(result.startDate).toEqual(expectedStartDate);
                expect(result.endDate).toEqual(nextYearDate);
            });

            it('should handle leap years correctly', () => {
                const leapYearDate = new Date('2024-12-31T10:30:00Z');
                global.Date = vi.fn(() => leapYearDate) as any;

                const result = calculateDateRange('this-year');

                const expectedStartDate = new Date(2024, 0, 1); // January 1, 2024

                expect(result.startDate).toEqual(expectedStartDate);
                expect(result.endDate).toEqual(leapYearDate);
            });
        });

        describe('Last Year Range', () => {
            it('should return correct range for "last-year"', () => {
                const result = calculateDateRange('last-year');

                const expectedStartDate = new Date(2023, 0, 1); // January 1, 2023
                const expectedEndDate = new Date(2023, 11, 31); // December 31, 2023

                expect(result.startDate).toEqual(expectedStartDate);
                expect(result.endDate).toEqual(expectedEndDate);
            });

            it('should handle different current years correctly', () => {
                const futureDate = new Date('2025-06-15T10:30:00Z');
                global.Date = vi.fn(() => futureDate) as any;

                const result = calculateDateRange('last-year');

                const expectedStartDate = new Date(2024, 0, 1); // January 1, 2024
                const expectedEndDate = new Date(2024, 11, 31); // December 31, 2024

                expect(result.startDate).toEqual(expectedStartDate);
                expect(result.endDate).toEqual(expectedEndDate);
            });

            it('should handle leap year as last year', () => {
                const postLeapDate = new Date('2025-03-15T10:30:00Z');
                global.Date = vi.fn(() => postLeapDate) as any;

                const result = calculateDateRange('last-year');

                const expectedStartDate = new Date(2024, 0, 1); // January 1, 2024 (leap year)
                const expectedEndDate = new Date(2024, 11, 31); // December 31, 2024

                expect(result.startDate).toEqual(expectedStartDate);
                expect(result.endDate).toEqual(expectedEndDate);
            });
        });

        describe('All Time Range', () => {
            it('should return null dates for "all-time"', () => {
                const result = calculateDateRange('all-time');

                expect(result.startDate).toBeNull();
                expect(result.endDate).toBeNull();
            });

            it('should return null dates for default case', () => {
                const result = calculateDateRange('unknown-range');

                expect(result.startDate).toBeNull();
                expect(result.endDate).toBeNull();
            });

            it('should return null dates for empty string', () => {
                const result = calculateDateRange('');

                expect(result.startDate).toBeNull();
                expect(result.endDate).toBeNull();
            });

            it('should return null dates for undefined input', () => {
                const result = calculateDateRange(undefined as any);

                expect(result.startDate).toBeNull();
                expect(result.endDate).toBeNull();
            });
        });

        describe('Edge Cases', () => {
            it('should handle end of month dates correctly', () => {
                // Test from January 31st
                const endOfMonthDate = new Date('2024-01-31T10:30:00Z');
                global.Date = vi.fn(() => endOfMonthDate) as any;

                const result = calculateDateRange('last-3-months');

                const expectedStartDate = new Date(endOfMonthDate);
                expectedStartDate.setMonth(endOfMonthDate.getMonth() - 3);

                expect(result.startDate).toEqual(expectedStartDate);
                expect(result.endDate).toEqual(endOfMonthDate);
            });

            it('should handle February 29th in leap year', () => {
                const leapDay = new Date('2024-02-29T10:30:00Z');
                global.Date = vi.fn(() => leapDay) as any;

                const result = calculateDateRange('this-month');

                const expectedStartDate = new Date(2024, 1, 1); // February 1, 2024

                expect(result.startDate).toEqual(expectedStartDate);
                expect(result.endDate).toEqual(leapDay);
            });

            it('should handle December 31st correctly', () => {
                const yearEnd = new Date('2024-12-31T23:59:59Z');
                global.Date = vi.fn(() => yearEnd) as any;

                const result = calculateDateRange('this-year');

                const expectedStartDate = new Date(2024, 0, 1); // January 1, 2024

                expect(result.startDate).toEqual(expectedStartDate);
                expect(result.endDate).toEqual(yearEnd);
            });

            it('should handle January 1st correctly', () => {
                const yearStart = new Date('2024-01-01T00:00:00Z');
                global.Date = vi.fn(() => yearStart) as any;

                const result = calculateDateRange('last-year');

                const expectedStartDate = new Date(2023, 0, 1); // January 1, 2023
                const expectedEndDate = new Date(2023, 11, 31); // December 31, 2023

                expect(result.startDate).toEqual(expectedStartDate);
                expect(result.endDate).toEqual(expectedEndDate);
            });
        });

        describe('Return Type Validation', () => {
            it('should return DateRange interface with correct structure', () => {
                const result = calculateDateRange('today');

                expect(result).toHaveProperty('startDate');
                expect(result).toHaveProperty('endDate');
                expect(Object.keys(result)).toHaveLength(2);
            });

            it('should return Date objects or null values', () => {
                const todayResult = calculateDateRange('today');
                expect(todayResult.startDate).toBeInstanceOf(Date);
                expect(todayResult.endDate).toBeInstanceOf(Date);

                const allTimeResult = calculateDateRange('all-time');
                expect(allTimeResult.startDate).toBeNull();
                expect(allTimeResult.endDate).toBeNull();
            });

            it('should return new Date objects (not references)', () => {
                const result1 = calculateDateRange('today');
                const result2 = calculateDateRange('today');

                expect(result1.startDate).not.toBe(result2.startDate);
                expect(result1.endDate).not.toBe(result2.endDate);
                expect(result1.startDate).toEqual(result2.startDate);
                expect(result1.endDate).toEqual(result2.endDate);
            });
        });

        describe('Performance and Consistency', () => {
            it('should execute quickly for all range types', () => {
                const rangeTypes = [
                    'today',
                    'last-7-days',
                    'this-month',
                    'last-3-months',
                    'this-year',
                    'last-year',
                    'all-time',
                ];

                rangeTypes.forEach(rangeType => {
                    const startTime = performance.now();
                    calculateDateRange(rangeType);
                    const endTime = performance.now();

                    expect(endTime - startTime).toBeLessThan(10); // Should complete within 10ms
                });
            });

            it('should return consistent results for multiple calls', () => {
                const results = Array.from({ length: 10 }, () =>
                    calculateDateRange('last-7-days')
                );

                results.forEach((result, index) => {
                    if (index > 0) {
                        expect(result.startDate).toEqual(results[0].startDate);
                        expect(result.endDate).toEqual(results[0].endDate);
                    }
                });
            });

            it('should handle rapid successive calls efficiently', () => {
                const startTime = performance.now();

                for (let i = 0; i < 1000; i++) {
                    calculateDateRange('this-month');
                }

                const endTime = performance.now();
                expect(endTime - startTime).toBeLessThan(100); // Should complete 1000 calls within 100ms
            });
        });

        describe('Input Validation', () => {
            it('should handle null input gracefully', () => {
                expect(() => calculateDateRange(null as any)).not.toThrow();
                const result = calculateDateRange(null as any);
                expect(result.startDate).toBeNull();
                expect(result.endDate).toBeNull();
            });

            it('should handle numeric input gracefully', () => {
                expect(() => calculateDateRange(123 as any)).not.toThrow();
                const result = calculateDateRange(123 as any);
                expect(result.startDate).toBeNull();
                expect(result.endDate).toBeNull();
            });

            it('should handle object input gracefully', () => {
                expect(() => calculateDateRange({} as any)).not.toThrow();
                const result = calculateDateRange({} as any);
                expect(result.startDate).toBeNull();
                expect(result.endDate).toBeNull();
            });

            it('should handle array input gracefully', () => {
                expect(() => calculateDateRange([] as any)).not.toThrow();
                const result = calculateDateRange([] as any);
                expect(result.startDate).toBeNull();
                expect(result.endDate).toBeNull();
            });

            it('should be case sensitive', () => {
                const upperCaseResult = calculateDateRange('TODAY');
                const lowerCaseResult = calculateDateRange('today');

                expect(upperCaseResult.startDate).toBeNull();
                expect(upperCaseResult.endDate).toBeNull();
                expect(lowerCaseResult.startDate).toBeInstanceOf(Date);
                expect(lowerCaseResult.endDate).toBeInstanceOf(Date);
            });
        });
    });
});
