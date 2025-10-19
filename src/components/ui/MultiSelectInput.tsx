import React from 'react';
import { MaterialSymbol } from 'react-material-symbols';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/primereact.min.css';

interface Option {
    value: string;
    label: string;
}

interface MultiSelectInputProps {
    options: Option[];
    value: string[];
    placeholder?: string;
    onChange: (value: string[]) => void;
    isDisabled?: boolean;
    maxSelectedLabels?: number;
}

const MultiSelectInput: React.FC<MultiSelectInputProps> = ({
    options = [],
    value = [],
    placeholder = 'Select options',
    onChange,
    isDisabled = false,
    maxSelectedLabels = 5,
}) => {
    const handleSelectionChange = (e: MultiSelectChangeEvent) => {
        onChange(e.value as string[]);
    };

    const customDropdownIcon = () => (
        <MaterialSymbol
            icon='expand_more'
            size={20}
            style={{
                color: '#131316',
                transition: 'transform 0.2s ease',
            }}
        />
    );

    return (
        <MultiSelect
            value={value}
            options={options}
            optionLabel='label'
            optionValue='value'
            onChange={handleSelectionChange}
            dropdownIcon={customDropdownIcon}
            placeholder={placeholder}
            disabled={isDisabled}
            maxSelectedLabels={maxSelectedLabels}
            showSelectAll={false}
            display='comma'
            style={{
                width: '100%',
                fontFamily: 'inherit',
            }}
        />
    );
};

export default MultiSelectInput;
