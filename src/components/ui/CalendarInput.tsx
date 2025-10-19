import React, { useState, useEffect } from 'react';
import { MaterialSymbol } from 'react-material-symbols';
import { Calendar } from 'primereact/calendar';
import { locale, addLocale } from 'primereact/api';

interface CalendarInputProps {
    value?: string;
    placeholder?: string;
    onChange?: (date: string) => void;
    isDisabled?: boolean;
}

// Configure custom locale with full day abbreviations
addLocale('en-full', {
    firstDayOfWeek: 1,
    dayNames: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    monthNames: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ],
    monthNamesShort: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ],
    today: 'Today',
    clear: 'Clear',
});

const CalendarInput: React.FC<CalendarInputProps> = ({
    value = '',
    placeholder = 'Select date',
    onChange,
    isDisabled = false,
}) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(
        value ? new Date(value) : null
    );

    // Sync internal state with value prop changes
    useEffect(() => {
        setSelectedDate(value ? new Date(value) : null);
    }, [value]);

    // Set the locale for this component
    React.useEffect(() => {
        locale('en-full');
    }, []);

    const handleDateSelect = (e: { value: Date | null }) => {
        const date = e.value;
        setSelectedDate(date);

        if (date) {
            // Format date in local timezone to avoid timezone offset issues
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            onChange?.(formattedDate);
        } else {
            // When date is cleared, call onChange with empty string
            onChange?.('');
        }
    };

    return (
        <Calendar
            value={selectedDate}
            onChange={handleDateSelect}
            placeholder={placeholder}
            disabled={isDisabled}
            locale='en-full'
            prevIcon={
                <MaterialSymbol icon='chevron_left' size={20} weight={300} />
            }
            nextIcon={
                <MaterialSymbol icon='chevron_right' size={20} weight={300} />
            }
            dateFormat='dd M yy'
            showIcon
            icon={() => <MaterialSymbol icon='expand_more' size={20} />}
            inputStyle={{
                width: '100%',
                background: '#EFF1F6',
                border: '1px solid #EFF1F6',
                borderRadius: '12px',
                padding: '14px 16px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#131316',
                fontFamily: 'inherit',
                letterSpacing: '-0.2px',
                transition: 'all 0.2s ease',
            }}
            panelStyle={{
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'white',
                marginTop: '8px',
            }}
            style={{
                width: '100%',
            }}
        />
    );
};

export default CalendarInput;
