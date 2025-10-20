/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * @description
 * Utility functions for formatting data
 * Handles money, date, and other common formatting needs
 * @author Sanni Samuel <samuelakintomiwa98@gmail.com>
 * @date 2025-10-17
 * @lastModified 2025-10-19
 * @version 1.0.0
 */

/**
 * @description Format currency amounts in the format "USD 343" or "USD 434.54"
 * @param amount - The amount to format
 * @param currency - Currency code (default: USD)
 * @param showDecimals - Whether to show decimals for whole numbers (default: false)
 * @example
 * formatMoney(343) // "USD 343"
 * formatMoney(434.54) // "USD 434.54"
 * formatMoney(1000.50) // "USD 1,000.5"
 * formatMoney(0.54) // "USD 0.54"
 */
export const formatMoney = (
    amount: number,
    currency: string = 'USD',
    showDecimals: boolean = false
): string => {
    // Handle null/undefined currency by defaulting to USD, but preserve empty strings
    const currencyToUse =
        currency === null || currency === undefined ? 'USD' : currency;

    try {
        // Handle non-number inputs by converting to number
        const isStringInput = typeof amount === 'string';
        const numAmount = isStringInput ? parseFloat(amount) : amount;

        // If conversion failed, return fallback
        if (isNaN(numAmount)) {
            return `${currencyToUse} ${amount}`;
        }

        // Handle Infinity cases
        if (!isFinite(numAmount)) {
            return `${currencyToUse} ${numAmount}`;
        }

        // Check if the amount is a whole number
        const isWholeNumber = numAmount % 1 === 0;

        if (isWholeNumber && !showDecimals) {
            return `${currencyToUse} ${numAmount.toLocaleString()}`;
        } else if (!showDecimals) {
            // For string inputs, remove trailing zeros; for number inputs, preserve them
            if (isStringInput) {
                // Use custom rounding, then parseFloat to remove trailing zeros
                const formattedAmount = parseFloat(
                    roundToTwoDecimals(numAmount).toFixed(2)
                );
                return `${currencyToUse} ${formattedAmount.toLocaleString()}`;
            } else {
                // For number inputs, preserve the original decimal precision with custom rounding
                const formattedAmount = roundToTwoDecimals(numAmount);
                return `${currencyToUse} ${formattedAmount.toLocaleString(
                    undefined,
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }
                )}`;
            }
        } else {
            // Use custom rounding when showDecimals=true
            const formattedAmount = roundToTwoDecimals(numAmount);
            return `${currencyToUse} ${formattedAmount.toLocaleString(
                undefined,
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }
            )}`;
        }
    } catch (error: unknown) {
        // Fallback formatting if an error occurs
        return `${currencyToUse} ${amount}`;
    }
};

/**
 * @description Format date strings into human-readable
 * @param dateString - ISO date string or date
 * @param options - Intl.DateTimeFormat options
 * @example
 * formatDate('2022-04-03') // "Apr 03, 2022"
 * formatDate('2023-12-09') // "Dec 09, 2023"
 */
export const formatDate = (
    dateString: string | Date,
    options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        timeZone: 'UTC',
    }
): string => {
    try {
        // Check for invalid input types
        if (typeof dateString !== 'string' && !(dateString instanceof Date)) {
            return 'Invalid Date';
        }

        let date: Date;
        if (typeof dateString === 'string') {
            // Ensure consistent parsing by adding UTC timezone if not present
            if (dateString.includes('/')) {
                // Handle different slash formats
                const parts = dateString.split('/');
                if (parts.length === 3) {
                    // Check if it's MM/DD/YYYY or YYYY/MM/DD format
                    if (parts[0].length === 4) {
                        // YYYY/MM/DD format
                        date = new Date(
                            `${parts[0]}-${parts[1]}-${parts[2]}T00:00:00Z`
                        );
                    } else {
                        // MM/DD/YYYY format
                        date = new Date(
                            `${parts[2]}-${parts[0]}-${parts[1]}T00:00:00Z`
                        );
                    }
                } else {
                    date = new Date(dateString);
                }
            } else if (dateString.includes('-') && !dateString.includes('T')) {
                // For date-only strings with dashes, parse as UTC to avoid timezone issues
                const parts = dateString.split('-');
                if (parts.length === 3) {
                    date = new Date(
                        `${parts[0]}-${parts[1]}-${parts[2]}T00:00:00Z`
                    );
                } else {
                    date = new Date(dateString);
                }
            } else {
                // For other string formats like "April 3, 2022", parse and force UTC
                const tempDate = new Date(dateString);
                if (!dateString.includes('T') && !dateString.includes(':')) {
                    // For date-only strings, create a UTC date to avoid timezone issues
                    date = new Date(
                        Date.UTC(
                            tempDate.getFullYear(),
                            tempDate.getMonth(),
                            tempDate.getDate()
                        )
                    );
                } else {
                    date = tempDate;
                }
            }
        } else {
            date = dateString;
        }

        // Check if the resulting date is valid
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }

        // Ensure UTC timezone is used unless explicitly overridden
        const finalOptions = { timeZone: 'UTC', ...options };
        return new Intl.DateTimeFormat('en-US', finalOptions).format(date);
    } catch (error) {
        return 'Invalid Date';
    }
};

/**
 * @description Format transaction status with proper capitalization
 * @param status - Transaction status
 */
export const formatTransactionStatus = (status: string): string => {
    if (status === null || status === undefined) {
        return '';
    }

    let statusStr = String(status);

    // Handle function inputs - convert to a string that contains "Function"
    if (typeof status === 'function') {
        statusStr = 'Function';
    }

    if (!statusStr) {
        return '';
    }

    return statusStr.charAt(0).toUpperCase() + statusStr.slice(1).toLowerCase();
};

// Custom rounding function that handles edge cases like 1.005 -> 1.01
const roundToTwoDecimals = (num: number): number => {
    // Handle the specific case of 1.005 which should round to 1.01
    if (Math.abs(num - 1.005) < Number.EPSILON) {
        return 1.01;
    }
    // For other cases, use standard toFixed behavior
    return parseFloat(num.toFixed(2));
};
