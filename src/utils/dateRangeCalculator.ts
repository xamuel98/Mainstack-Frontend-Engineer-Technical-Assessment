/**
 * @description
 * Date Range Calculator
 * Functions for calculating date ranges based on predefined options
 * @author Sanni Samuel <samuelakintomiwa98@gmail.com>
 * @date 2025-10-19
 * @lastModified 2025-10-19
 * @version 1.0.0
 */

export interface DateRange {
    startDate: Date | null;
    endDate: Date | null;
}

/**
 * Calculates the appropriate start and end dates based on the selected date range value
 * @param rangeValue - The date range identifier (e.g., 'today', 'last-7-days', etc.)
 * @returns An object containing the calculated start and end dates
 */
export const calculateDateRange = (rangeValue: string): DateRange => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    switch (rangeValue) {
        case 'today':
            return { startDate: new Date(today), endDate: new Date(today) };

        case 'last-7-days': {
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 7);
            return { startDate: sevenDaysAgo, endDate: new Date(today) };
        }

        case 'this-month': {
            const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
            return { startDate: firstDayOfMonth, endDate: new Date(today) };
        }

        case 'last-3-months': {
            const threeMonthsAgo = new Date(today);
            threeMonthsAgo.setMonth(today.getMonth() - 3);
            return { startDate: threeMonthsAgo, endDate: new Date(today) };
        }

        case 'this-year': {
            const firstDayOfYear = new Date(currentYear, 0, 1);
            return { startDate: firstDayOfYear, endDate: new Date(today) };
        }

        case 'last-year': {
            const firstDayOfLastYear = new Date(currentYear - 1, 0, 1);
            const lastDayOfLastYear = new Date(currentYear - 1, 11, 31);
            return {
                startDate: firstDayOfLastYear,
                endDate: lastDayOfLastYear,
            };
        }

        case 'all-time':
        default:
            return { startDate: null, endDate: null };
    }
};
