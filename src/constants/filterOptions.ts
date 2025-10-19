/**
 * @description
 * Filter Options Constants
 * Contains predefined filter options for date ranges, transaction types, and transaction statuses
 * @author Sanni Samuel <samuelakintomiwa98@gmail.com>
 * @date 2025-10-19
 * @lastModified 2025-10-19
 * @version 1.0.0
 */

export interface FilterOption {
    value: string;
    label: string;
}

/**
 * Date range options for the filter panel
 */
export const dateRangeOptions: FilterOption[] = [
    { value: 'today', label: 'Today' },
    { value: 'last-7-days', label: 'Last 7 days' },
    { value: 'this-month', label: 'This month' },
    { value: 'last-3-months', label: 'Last 3 months' },
    { value: 'this-year', label: 'This year' },
    { value: 'last-year', label: 'Last year' },
    { value: 'all-time', label: 'All time' },
];

/**
 * Transaction type options for the filter panel
 */
export const transactionTypeOptions: FilterOption[] = [
    { value: 'store-transactions', label: 'Store Transactions' },
    { value: 'get-tipped', label: 'Get Tipped' },
    { value: 'withdrawals', label: 'Withdrawals' },
    { value: 'chargebacks', label: 'Chargebacks' },
    { value: 'cashbacks', label: 'Cashbacks' },
    { value: 'refer-and-earn', label: 'Refer and Earn' },
];

/**
 * Transaction status options for the filter panel
 */
export const transactionStatusOptions: FilterOption[] = [
    { value: 'successful', label: 'Successful' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
];
