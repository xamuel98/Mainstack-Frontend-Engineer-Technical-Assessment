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
    try {
        // Check if the amount is a whole number
        const isWholeNumber = amount % 1 === 0;

        if (isWholeNumber && !showDecimals) {
            return `${currency} ${amount.toLocaleString()}`;
        } else {
            const formattedAmount = parseFloat(amount.toFixed(2));
            return `${currency} ${formattedAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`;
        }
    } catch (error: unknown) {
        // Fallback formatting if an error occurs
        return `${currency} ${amount}`;
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
    }
): string => {
    try {
        const date =
            typeof dateString === 'string' ? new Date(dateString) : dateString;
        return new Intl.DateTimeFormat('en-US', options).format(date);
    } catch (error) {
        return 'Invalid Date';
    }
};

/**
 * @description Format transaction status with proper capitalization
 * @param status - Transaction status
 */
export const formatTransactionStatus = (status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};
