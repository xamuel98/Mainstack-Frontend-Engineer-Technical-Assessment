/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Main types export file
 */

export * from './api';

import { MaterialSymbolProps } from 'react-material-symbols';

// Common UI Types
export interface LoadingState {
    isLoading: boolean;
    error: string | null;
}

// Navigation Types
export interface NavItem {
    name: string;
    href: string;
    material_icon_name?: any;
    icon?: React.ComponentType<MaterialSymbolProps>;
}

// Component Props Types
export interface BaseComponentProps {
    className?: string;
    children?: React.ReactNode;
}
