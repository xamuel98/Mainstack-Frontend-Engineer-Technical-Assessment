/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Jest test setup file
 * Configures testing environment and global test utilities
 */

import '@testing-library/jest-dom';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
    root = null;
    rootMargin = '';
    thresholds = [];

    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
    takeRecords() {
        return [];
    }
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: jest.fn(),
});

// Suppress console errors during tests (optional)
const originalError = console.error;
beforeAll(() => {
    console.error = (...args: any[]) => {
        if (
            typeof args[0] === 'string' &&
            args[0].includes('Warning: ReactDOM.render is deprecated')
        ) {
            return;
        }
        originalError.call(console, ...args);
    };
});

afterAll(() => {
    console.error = originalError;
});
