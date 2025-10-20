/**
 * @description
 * CSV Export Utilities
 * Functions for converting data to CSV format and triggering downloads
 * @author Sanni Samuel <samuelakintomiwa98@gmail.com>
 * @date 2025-10-19
 * @lastModified 2025-10-19
 * @version 1.0.0
 */

import { Transaction } from '../types/api';
import { formatMoney, formatDate } from './formatters';
import { toaster } from '@/components/ui/Toaster';

/**
 * @description Converts an array of transactions to CSV format
 * @param transactions - Array of transaction objects
 * @returns CSV string
 */
export const convertTransactionsToCSV = (
    transactions: Transaction[]
): string => {
    // Define CSV headers
    const headers = [
        'Date',
        'Type',
        'Status',
        'Description',
        'Amount',
        'Payment Reference',
    ];

    // Create CSV header row
    const csvHeaders = headers.join(',');

    // Convert transactions to CSV rows
    const csvRows = transactions.map(transaction => {
        const { date, type, status, metadata, amount, payment_reference } =
            transaction;

        // Format the data for CSV
        const formattedDate = formatDate(date);
        const formattedType = type.charAt(0).toUpperCase() + type.slice(1);
        const formattedStatus =
            status.charAt(0).toUpperCase() + status.slice(1);
        const description = metadata?.product_name || metadata?.name || 'N/A';
        const formattedAmount = formatMoney(amount);
        const paymentRef = payment_reference || 'N/A';

        return [
            escapeCSVValue(formattedDate),
            escapeCSVValue(formattedType),
            escapeCSVValue(formattedStatus),
            escapeCSVValue(description),
            escapeCSVValue(formattedAmount),
            escapeCSVValue(paymentRef),
        ].join(',');
    });

    // Combine headers and rows
    return [csvHeaders, ...csvRows].join('\n');
};

/**
 * @description Escapes CSV field values to handle special characters e.g. commas, quotes, and newlines
 * @param value - The field value to escape
 * @returns Escaped field value
 */
const escapeCSVValue = (value: string): string => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
};

/**
 * @description Downloads a CSV file with the given content
 * @param csvContent - The CSV content as a string
 * @param filename - The filename for the download (default: 'transactions.csv')
 */
export const downloadCSV = (
    csvContent: string,
    filename: string = 'transactions.csv'
): void => {
    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a temporary URL for the blob
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element for download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL
    URL.revokeObjectURL(url);
};

/**
 * @description Simulates a download process with a Promise and delay
 * @param csvContent - The CSV content to "download"
 * @param filename - The filename for the download
 * @returns Promise that resolves after 2-3 seconds
 */
const simulateDownload = (
    csvContent: string,
    filename: string
): Promise<void> => {
    return new Promise((resolve, reject) => {
        // Simulate a 2-3 second delay
        const delay = Math.random() * 1000 + 2000; // 2000-3000ms

        setTimeout(() => {
            try {
                // Actually perform the download
                downloadCSV(csvContent, filename);
                resolve();
            } catch (error) {
                reject(error);
            }
        }, delay);
    });
};

/**
 * @description Exports transactions to CSV with toast notifications for download states
 * @param transactions - Array of transaction objects
 * @param filename - Optional filename (default: 'transactions.csv')
 */
export const exportTransactionsToCSV = async (
    transactions: Transaction[],
    filename?: string
): Promise<void> => {
    // Check if there are transactions to export
    if (!transactions || transactions.length === 0) {
        toaster.create({
            title: 'No transactions to export',
            description:
                'There are no transaction records available to export.',
            type: 'warning',
            duration: 4000,
            closable: true,
        });
        return;
    }

    const csvContent = convertTransactionsToCSV(transactions);
    const defaultFilename = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    const finalFilename = filename || defaultFilename;

    // Use toaster.promise to handle loading, success, and error states
    await toaster.promise(simulateDownload(csvContent, finalFilename), {
        loading: {
            title: 'Preparing export...',
            description:
                'Your transaction data is being prepared for download.',
        },
        success: {
            title: 'Export completed!',
            description:
                'Your transaction data has been successfully downloaded.',
        },
        error: {
            title: 'Export failed. Please try again.',
            description: 'There was an error while preparing your export.',
        },
    });
};
