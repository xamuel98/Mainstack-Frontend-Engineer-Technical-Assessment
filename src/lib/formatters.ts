/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * @description
 * Utility functions for formatting data
 * Handles money, date, and other common formatting needs
 * @author Sanni Samuel <samuelakintomiwa98@gmail.com>
 * @date 2025-10-17
 * @lastModified 2025-10-17
 * @version 1.0.0
 */

/**
 * Format currency amounts with proper locale and currency symbol
 * @param amount - The amount to format
 * @param currency - Currency code (default: USD)
 * @param locale - Locale for formatting (default: en-US)
 */
export const formatMoney = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error: unknown) {
    // Fallback formatting if Intl.NumberFormat fails
    return `$${amount.toFixed(2)}`;
  }
};

/**
 * Format date strings into human-readable format
 * @param dateString - ISO date string or date
 * @param options - Intl.DateTimeFormat options
 */
export const formatDate = (
  dateString: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
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
 * Format transaction status with proper capitalization
 * @param status - Transaction status
 */
export const formatTransactionStatus = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

/**
 * Format transaction type with proper capitalization
 * @param type - Transaction type
 */
export const formatTransactionType = (type: string): string => {
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
};
