/**
 * Main types export file
 */

export * from './api';

// Common UI Types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Navigation Types
export interface NavItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}