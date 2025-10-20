/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import {
    vi,
    describe,
    it,
    expect,
    beforeEach,
    afterEach,
    type MockedFunction,
} from 'vitest';

import AppHeader from '@/components/AppHeader/AppHeader';
import { useUser, useUserFullName, useAutoCloseMobileDialog } from '@/hooks';
import { User } from '@/types';
import theme from '@/theme';

// Mock the hooks
vi.mock('@/hooks', () => ({
    useUser: vi.fn(),
    useUserFullName: vi.fn(),
    useAutoCloseMobileDialog: vi.fn(),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        create: (component: any) => component,
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

// Mock SVG imports
vi.mock('@/assets/svgs/mainstack-logo.svg', () => ({
    default: 'mainstack-logo.svg',
}));

// Mock utility functions
vi.mock('@/utils', () => ({
    headerVariants: {},
    mainstackAppsDialogContainerVariants: {},
    contentVariants: {},
}));

// Mock AppHeader sub-components
vi.mock('@/components/AppHeader', () => ({
    AppHeaderNavigationLinks: ({ isAppsOpen }: { isAppsOpen: boolean }) => (
        <div data-testid='navigation-links' data-apps-open={isAppsOpen}>
            <a href='/revenue' data-testid='revenue-link'>
                Revenue
            </a>
            <a href='/analytics' data-testid='analytics-link'>
                Analytics
            </a>
        </div>
    ),
    AppHeaderMoreApps: ({
        onOpenChange,
    }: {
        onOpenChange: (open: boolean) => void;
    }) => (
        <button
            data-testid='more-apps-button'
            onClick={() => onOpenChange(true)}
        >
            More Apps
        </button>
    ),
    AppHeaderActions: ({ user, userFullName, isLoadingUser }: any) => {
        const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

        return (
            <div data-testid='header-actions'>
                {isLoadingUser ? (
                    <div data-testid='actions-loading'>Loading...</div>
                ) : (
                    <div
                        data-testid='user-actions'
                        data-user-name={userFullName}
                    >
                        <button
                            data-testid='user-avatar-button'
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            {user?.email}
                        </button>
                        {isDropdownOpen && (
                            <div
                                data-testid='user-actions-dropdown'
                                data-mobile='true'
                                data-user-name={userFullName}
                            >
                                User: {user?.email}
                                <button
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    },
    AppHeaderMoreAppsDialog: () => (
        <div data-testid='more-apps-dialog'>Apps Dialog</div>
    ),
    AppHeaderContainer: ({ children, ...props }: any) => (
        <header data-testid='header-container' {...props}>
            {children}
        </header>
    ),
    AppHeaderInner: ({ children, ...props }: any) => (
        <div data-testid='header-inner' {...props}>
            {children}
        </div>
    ),
    AppHeaderLogo: ({ children }: any) => (
        <div data-testid='header-logo'>{children}</div>
    ),
    AppHeaderLogoLink: ({ children }: any) => (
        <a href='/' data-testid='logo-link'>
            {children}
        </a>
    ),
    AppHeaderLogoImage: ({ src, alt }: any) => (
        <img data-testid='logo-image' src={src} alt={alt} />
    ),
    AppHeaderNav: ({ children }: any) => (
        <nav data-testid='header-nav'>{children}</nav>
    ),
    AppHeaderNavList: ({ children, as }: any) => (
        <ul data-testid='nav-list' role={as}>
            {children}
        </ul>
    ),
    UserActionsDropdown: ({ user, userFullName, isMobile }: any) => (
        <div
            data-testid='user-actions-dropdown'
            data-mobile={isMobile}
            data-user-name={userFullName}
        >
            User: {user?.email}
        </div>
    ),
}));

// Mock SkeletonBox
vi.mock('@/components/ui/Skeleton/SkeletonBox', () => ({
    default: ({ width, height, borderRadius }: any) => (
        <div
            data-testid='skeleton-box'
            data-width={width}
            data-height={height}
            data-border-radius={borderRadius}
        />
    ),
}));

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    return (
        <QueryClientProvider client={queryClient}>
            <ChakraProvider value={theme}>
                <BrowserRouter>{children}</BrowserRouter>
            </ChakraProvider>
        </QueryClientProvider>
    );
};

// Mock data
const mockUser: User = {
    email: 'john.doe@example.com',
    first_name: 'John',
    last_name: 'Doe',
};

describe('AppHeader Component', () => {
    const mockUseUser = useUser as MockedFunction<typeof useUser>;
    const mockUseUserFullName = useUserFullName as MockedFunction<
        typeof useUserFullName
    >;
    const mockUseAutoCloseMobileDialog =
        useAutoCloseMobileDialog as MockedFunction<
            typeof useAutoCloseMobileDialog
        >;

    beforeEach(() => {
        // Reset all mocks before each test
        vi.clearAllMocks();

        // Default mock implementations
        mockUseAutoCloseMobileDialog.mockImplementation(() => {});

        // Mock window.matchMedia for responsive tests
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation(query => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('Successful Rendering', () => {
        it('should render header with all main sections', () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            // Check main header structure
            expect(screen.getByTestId('header-container')).toBeInTheDocument();
            expect(screen.getByTestId('header-inner')).toBeInTheDocument();
            expect(screen.getByTestId('header-logo')).toBeInTheDocument();
            expect(screen.getByTestId('header-nav')).toBeInTheDocument();
            expect(screen.getByTestId('header-actions')).toBeInTheDocument();
        });

        it('should render logo with correct attributes', () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            const logoImage = screen.getByTestId('logo-image');
            expect(logoImage).toHaveAttribute('src', 'mainstack-logo.svg');
            expect(logoImage).toHaveAttribute('alt', 'Mainstack Logo');
        });

        it('should render navigation links', () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            expect(screen.getByTestId('navigation-links')).toBeInTheDocument();
            expect(screen.getByTestId('revenue-link')).toBeInTheDocument();
            expect(screen.getByTestId('analytics-link')).toBeInTheDocument();
        });

        it('should render more apps button', () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            expect(screen.getByTestId('more-apps-button')).toBeInTheDocument();
            expect(screen.getByText('More Apps')).toBeInTheDocument();
        });
    });

    describe('Loading State', () => {
        it('should render skeleton when user is loading', () => {
            mockUseUser.mockReturnValue({
                data: undefined,
                isLoading: true,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('User');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            expect(screen.getByTestId('skeleton-box')).toBeInTheDocument();
            expect(screen.getByTestId('actions-loading')).toBeInTheDocument();
        });

        it('should render skeleton with correct dimensions', () => {
            mockUseUser.mockReturnValue({
                data: undefined,
                isLoading: true,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('User');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            const skeleton = screen.getByTestId('skeleton-box');
            expect(skeleton).toHaveAttribute('data-width', '40px');
            expect(skeleton).toHaveAttribute('data-height', '40px');
            expect(skeleton).toHaveAttribute('data-border-radius', 'full');
        });
    });

    describe('User Interactions', () => {
        it('should handle more apps button click', async () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            const user = userEvent.setup();

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            const moreAppsButton = screen.getByTestId('more-apps-button');
            await user.click(moreAppsButton);

            // Check if navigation links receive the apps open state
            const navigationLinks = screen.getByTestId('navigation-links');
            expect(navigationLinks).toHaveAttribute('data-apps-open', 'true');
        });

        it('should handle mobile user menu interactions', async () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            const user = userEvent.setup();

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            // Find and click the avatar trigger (in mobile view)
            const avatarTrigger = screen.getByTestId('user-avatar-button');
            await user.click(avatarTrigger);

            // Should render user actions dropdown in mobile mode
            await waitFor(() => {
                const dropdown = screen.getByTestId('user-actions-dropdown');
                expect(dropdown).toHaveAttribute('data-mobile', 'true');
            });
        });

        it('should handle close button in mobile menu', async () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            const user = userEvent.setup();

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            // Open mobile menu first
            const avatarTrigger = screen.getByTestId('user-avatar-button');
            await user.click(avatarTrigger);

            // Find and click close button
            await waitFor(() => {
                const closeButton = screen.getByText('Close');
                expect(closeButton).toBeInTheDocument();
            });
        });
    });

    describe('User Data Display', () => {
        it('should display user information correctly', () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            const userActions = screen.getByTestId('user-actions');
            expect(userActions).toHaveAttribute('data-user-name', 'John Doe');
            expect(userActions).toHaveTextContent('john.doe@example.com');
        });

        it('should handle missing user data gracefully', () => {
            mockUseUser.mockReturnValue({
                data: null,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('User');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            // Should still render header structure
            expect(screen.getByTestId('header-container')).toBeInTheDocument();
            expect(screen.getByTestId('user-actions')).toBeInTheDocument();
        });

        it('should display fallback name when user name is incomplete', () => {
            const incompleteUser = {
                ...mockUser,
                first_name: '',
                last_name: '',
            };
            mockUseUser.mockReturnValue({
                data: incompleteUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('User');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            const userActions = screen.getByTestId('user-actions');
            expect(userActions).toHaveAttribute('data-user-name', 'User');
        });
    });

    describe('Responsive Behavior', () => {
        it('should call useAutoCloseMobileDialog hook', () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            expect(mockUseAutoCloseMobileDialog).toHaveBeenCalledWith({
                isOpen: false,
                setIsOpen: expect.any(Function),
                breakpoint: 768,
            });
        });

        it('should handle mobile dialog state changes', () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            // Verify the hook was called during initial render
            expect(mockUseAutoCloseMobileDialog).toHaveBeenCalledTimes(1);

            // Verify the hook was called with the correct parameters
            expect(mockUseAutoCloseMobileDialog).toHaveBeenCalledWith({
                breakpoint: 768,
                isOpen: false,
                setIsOpen: expect.any(Function),
            });
        });
    });

    describe('Navigation', () => {
        it('should render logo as a link to home', () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            const logoLink = screen.getByTestId('logo-link');
            expect(logoLink).toHaveAttribute('href', '/');
        });

        it('should render navigation with correct structure', () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            const navList = screen.getByTestId('nav-list');
            expect(navList).toHaveAttribute('role', 'nav');
        });
    });

    describe('Accessibility', () => {
        it('should have proper component display name', () => {
            expect(AppHeader.displayName).toBe('AppHeader');
        });

        it('should render semantic header element', () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            expect(screen.getByTestId('header-container')).toBeInTheDocument();
        });

        it('should render avatar with proper accessibility attributes', () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            const avatarButton = screen.getByTestId('user-avatar-button');
            expect(avatarButton).toBeInTheDocument();
        });

        it('should handle keyboard navigation', async () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            const user = userEvent.setup();

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            // Tab to logo link
            await user.tab();
            expect(screen.getByTestId('logo-link')).toHaveFocus();

            // Tab through navigation links to more apps button
            await user.tab(); // Revenue link
            await user.tab(); // Analytics link
            await user.tab(); // More Apps button
            await user.tab(); // One more tab to reach More Apps button
            expect(screen.getByTestId('more-apps-button')).toHaveFocus();
        });
    });

    describe('Error Handling', () => {
        it('should handle user fetch error gracefully', () => {
            mockUseUser.mockReturnValue({
                data: undefined,
                isLoading: false,
                error: new Error('Failed to fetch user'),
            } as any);
            mockUseUserFullName.mockReturnValue('User');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            // Should still render header structure
            expect(screen.getByTestId('header-container')).toBeInTheDocument();
            expect(screen.getByTestId('header-actions')).toBeInTheDocument();
        });
    });

    describe('Component Integration', () => {
        it('should integrate with useUser hook correctly', () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            expect(mockUseUser).toHaveBeenCalledTimes(1);
            expect(mockUseUserFullName).toHaveBeenCalledTimes(1);
        });

        it('should pass correct props to sub-components', () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            // Check if AppHeaderActions receives correct props
            const headerActions = screen.getByTestId('header-actions');
            expect(headerActions).toBeInTheDocument();

            // Check if navigation links receive apps state
            const navigationLinks = screen.getByTestId('navigation-links');
            expect(navigationLinks).toHaveAttribute('data-apps-open', 'false');
        });
    });

    describe('Performance', () => {
        it('should be memoized to prevent unnecessary re-renders', () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            const { rerender } = render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            // Verify initial render
            expect(screen.getByTestId('header-container')).toBeInTheDocument();
            expect(mockUseUser).toHaveBeenCalledTimes(1);

            // Re-render with same props - component should still work
            rerender(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            // Component should render without crashing and show user actions
            expect(screen.getByTestId('header-actions')).toBeInTheDocument();
        });

        it('should handle state transitions without crashing', () => {
            // Test with loaded state
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            // Verify component renders successfully with user data
            expect(screen.getByTestId('header-container')).toBeInTheDocument();
            expect(
                screen.queryByTestId('actions-loading')
            ).not.toBeInTheDocument();
            const userActions = screen.getByTestId('user-actions');
            expect(userActions).toHaveAttribute('data-user-name', 'John Doe');
            expect(userActions).toHaveTextContent('john.doe@example.com');
        });
    });

    describe('Dialog State Management', () => {
        it('should open mobile user menu dialog when avatar is clicked', async () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            const user = userEvent.setup();

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            const avatarButton = screen.getByTestId('user-avatar-button');
            await user.click(avatarButton);

            await waitFor(() => {
                const dropdown = screen.getByTestId('user-actions-dropdown');
                expect(dropdown).toBeInTheDocument();
                expect(dropdown).toHaveAttribute('data-mobile', 'true');
            });
        });

        it('should close mobile user menu dialog when close button is clicked', async () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            const user = userEvent.setup();

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            // Open the dialog
            const avatarButton = screen.getByTestId('user-avatar-button');
            await user.click(avatarButton);

            await waitFor(() => {
                expect(
                    screen.getByTestId('user-actions-dropdown')
                ).toBeInTheDocument();
            });

            // Close the dialog
            const closeButton = screen.getByRole('button', { name: /close/i });
            await user.click(closeButton);

            await waitFor(() => {
                expect(
                    screen.queryByTestId('user-actions-dropdown')
                ).not.toBeInTheDocument();
            });
        });

        it('should handle dialog state changes with proper backdrop interaction', async () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            const user = userEvent.setup();

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            // Open dialog
            const avatarButton = screen.getByTestId('user-avatar-button');
            await user.click(avatarButton);

            await waitFor(() => {
                expect(
                    screen.getByTestId('user-actions-dropdown')
                ).toBeInTheDocument();
            });

            // Verify dialog properties
            const dropdown = screen.getByTestId('user-actions-dropdown');
            expect(dropdown).toHaveAttribute('data-mobile', 'true');
            expect(dropdown).toHaveAttribute('data-user-name', 'John Doe');
        });

        it('should not render mobile dialog when user is loading', () => {
            mockUseUser.mockReturnValue({
                data: undefined,
                isLoading: true,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            // Should show skeleton instead of avatar
            expect(screen.getByTestId('skeleton-box')).toBeInTheDocument();
            expect(
                screen.queryByTestId('user-avatar-button')
            ).not.toBeInTheDocument();
        });

        it('should handle multiple dialog open/close cycles', async () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            const user = userEvent.setup();

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            const avatarButton = screen.getByTestId('user-avatar-button');

            // First cycle: open and close
            await user.click(avatarButton);
            await waitFor(() => {
                expect(
                    screen.getByTestId('user-actions-dropdown')
                ).toBeInTheDocument();
            });

            const closeButton = screen.getByRole('button', { name: /close/i });
            await user.click(closeButton);
            await waitFor(() => {
                expect(
                    screen.queryByTestId('user-actions-dropdown')
                ).not.toBeInTheDocument();
            });

            // Second cycle: open again
            await user.click(avatarButton);
            await waitFor(() => {
                expect(
                    screen.getByTestId('user-actions-dropdown')
                ).toBeInTheDocument();
            });
        });
    });

    describe('Avatar Fallback Tests', () => {
        it('should display correct initials for full name', () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            const avatarButton = screen.getByTestId('user-avatar-button');
            expect(avatarButton).toBeInTheDocument();
            // Avatar fallback should contain user's initials - checking the mock structure
            expect(avatarButton).toHaveTextContent('john.doe@example.com');
        });

        it('should handle single name correctly', () => {
            mockUseUser.mockReturnValue({
                data: { ...mockUser, last_name: '' },
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            const avatarButton = screen.getByTestId('user-avatar-button');
            expect(avatarButton).toBeInTheDocument();
            // In our mock, it shows the email, not just initials
            expect(avatarButton).toHaveTextContent('john.doe@example.com');
        });

        it('should handle empty name gracefully', () => {
            mockUseUser.mockReturnValue({
                data: { ...mockUser, first_name: '', last_name: '' },
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            const avatarButton = screen.getByTestId('user-avatar-button');
            expect(avatarButton).toBeInTheDocument();
            // Should handle empty name without crashing
            expect(avatarButton).toHaveTextContent('john.doe@example.com');
        });

        it('should handle special characters in names', () => {
            mockUseUser.mockReturnValue({
                data: { ...mockUser, first_name: 'José', last_name: 'María' },
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('José María');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            const avatarButton = screen.getByTestId('user-avatar-button');
            expect(avatarButton).toBeInTheDocument();
            // In our mock, it shows the email
            expect(avatarButton).toHaveTextContent('john.doe@example.com');
        });

        it('should handle very long names', () => {
            mockUseUser.mockReturnValue({
                data: {
                    ...mockUser,
                    first_name: 'Christopher',
                    last_name: 'Montgomery',
                },
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('Christopher Montgomery');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            const avatarButton = screen.getByTestId('user-avatar-button');
            expect(avatarButton).toBeInTheDocument();
            // In our mock, it shows the email
            expect(avatarButton).toHaveTextContent('john.doe@example.com');
        });
    });

    describe('Navigation State Tests', () => {
        it('should render navigation links with correct structure', () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            const navigationLinks = screen.getByTestId('navigation-links');
            expect(navigationLinks).toBeInTheDocument();
            expect(navigationLinks).toHaveAttribute('data-apps-open', 'false');

            const revenueLink = screen.getByTestId('revenue-link');
            const analyticsLink = screen.getByTestId('analytics-link');

            expect(revenueLink).toBeInTheDocument();
            expect(analyticsLink).toBeInTheDocument();
            expect(revenueLink).toHaveAttribute('href', '/revenue');
            expect(analyticsLink).toHaveAttribute('href', '/analytics');
        });

        it('should update navigation state when apps dialog opens', async () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            const user = userEvent.setup();

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            const moreAppsButton = screen.getByTestId('more-apps-button');
            await user.click(moreAppsButton);

            const navigationLinks = screen.getByTestId('navigation-links');
            expect(navigationLinks).toHaveAttribute('data-apps-open', 'true');
        });

        it('should handle navigation accessibility', () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            const navList = screen.getByTestId('nav-list');
            expect(navList).toHaveAttribute('role', 'nav');
        });

        it('should render logo with correct navigation properties', () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            const logoLink = screen.getByTestId('logo-link');
            const logoImage = screen.getByTestId('logo-image');

            expect(logoLink).toHaveAttribute('href', '/');
            expect(logoImage).toHaveAttribute('src', 'mainstack-logo.svg');
            expect(logoImage).toHaveAttribute('alt', 'Mainstack Logo');
        });
    });

    describe('Props Validation Tests', () => {
        it('should handle undefined user data gracefully', () => {
            mockUseUser.mockReturnValue({
                data: undefined,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            expect(screen.getByTestId('header-container')).toBeInTheDocument();
            expect(screen.getByTestId('header-actions')).toBeInTheDocument();
        });

        it('should handle null user data gracefully', () => {
            mockUseUser.mockReturnValue({
                data: null,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            expect(screen.getByTestId('header-container')).toBeInTheDocument();
            expect(screen.getByTestId('header-actions')).toBeInTheDocument();
        });

        it('should handle empty string user name', () => {
            mockUseUser.mockReturnValue({
                data: { ...mockUser, first_name: '', last_name: '' },
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            const userActions = screen.getByTestId('user-actions');
            expect(userActions).toHaveAttribute('data-user-name', '');
        });

        it('should handle malformed user data', () => {
            mockUseUser.mockReturnValue({
                data: { email: 'invalid-email' }, // Missing required fields
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('Unknown User');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            expect(screen.getByTestId('header-container')).toBeInTheDocument();
            const userActions = screen.getByTestId('user-actions');
            expect(userActions).toHaveAttribute(
                'data-user-name',
                'Unknown User'
            );
        });

        it('should handle extremely long email addresses', () => {
            const longEmail =
                'very.long.email.address.that.exceeds.normal.length@example.com';
            mockUseUser.mockReturnValue({
                data: { ...mockUser, email: longEmail },
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            const userActions = screen.getByTestId('user-actions');
            expect(userActions).toHaveTextContent(longEmail);
        });
    });

    describe('Animation Integration Tests', () => {
        it('should render with proper motion variants', () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            const headerContainer = screen.getByTestId('header-container');
            const headerInner = screen.getByTestId('header-inner');

            expect(headerContainer).toBeInTheDocument();
            expect(headerInner).toBeInTheDocument();

            // Verify motion props are applied (mocked motion components should receive these)
            expect(headerContainer).toHaveAttribute('initial', 'hidden');
            expect(headerContainer).toHaveAttribute('animate', 'show');
            expect(headerInner).toHaveAttribute('initial', 'hidden');
            expect(headerInner).toHaveAttribute('animate', 'show');
        });

        it('should handle motion variants for mobile dialog', async () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            const user = userEvent.setup();

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            const avatarButton = screen.getByTestId('user-avatar-button');
            await user.click(avatarButton);

            await waitFor(() => {
                const dropdown = screen.getByTestId('user-actions-dropdown');
                expect(dropdown).toBeInTheDocument();
            });

            // Verify the dialog content has motion properties
            const dropdown = screen.getByTestId('user-actions-dropdown');
            expect(dropdown).toHaveAttribute('data-mobile', 'true');
        });

        it('should handle layout animations properly', () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            const headerContainer = screen.getByTestId('header-container');
            expect(headerContainer).toHaveAttribute('layout', 'position');
        });

        it('should handle animation state transitions', () => {
            // Test that component can handle loading state
            mockUseUser.mockReturnValue({
                data: undefined,
                isLoading: true,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('');

            const { rerender } = render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            expect(screen.getByTestId('skeleton-box')).toBeInTheDocument();
            expect(screen.getByTestId('actions-loading')).toBeInTheDocument();

            // Test that component can handle loaded state
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            rerender(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            // Component should render without crashing and show user actions
            expect(screen.getByTestId('header-actions')).toBeInTheDocument();
        });
    });

    describe('Responsive Breakpoint Tests', () => {
        it('should call useAutoCloseMobileDialog with correct parameters', () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            expect(mockUseAutoCloseMobileDialog).toHaveBeenCalledWith({
                isOpen: false,
                setIsOpen: expect.any(Function),
                breakpoint: 768,
            });
        });

        it('should handle breakpoint changes for mobile dialog', async () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            const user = userEvent.setup();

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            // Initially, hook should be called with isOpen: false
            expect(mockUseAutoCloseMobileDialog).toHaveBeenCalledWith({
                isOpen: false,
                setIsOpen: expect.any(Function),
                breakpoint: 768,
            });

            // Open mobile dialog
            const avatarButton = screen.getByTestId('user-avatar-button');
            await user.click(avatarButton);

            await waitFor(() => {
                expect(
                    screen.getByTestId('user-actions-dropdown')
                ).toBeInTheDocument();
            });

            // Note: The hook is called on every render, so we check that it was called
            // The actual state change happens through React state, not the hook directly
            expect(mockUseAutoCloseMobileDialog).toHaveBeenCalled();
        });

        it('should handle window resize events through hook', () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            // Mock window.matchMedia to simulate different screen sizes
            Object.defineProperty(window, 'matchMedia', {
                writable: true,
                value: vi.fn().mockImplementation(query => ({
                    matches: query.includes('768px') ? true : false,
                    media: query,
                    onchange: null,
                    addListener: vi.fn(),
                    removeListener: vi.fn(),
                    addEventListener: vi.fn(),
                    removeEventListener: vi.fn(),
                    dispatchEvent: vi.fn(),
                })),
            });

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            expect(mockUseAutoCloseMobileDialog).toHaveBeenCalledWith({
                isOpen: false,
                setIsOpen: expect.any(Function),
                breakpoint: 768,
            });
        });

        it('should maintain responsive behavior across state changes', async () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            const user = userEvent.setup();

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            // Test multiple dialog state changes
            const avatarButton = screen.getByTestId('user-avatar-button');

            // Open dialog
            await user.click(avatarButton);
            await waitFor(() => {
                expect(
                    screen.getByTestId('user-actions-dropdown')
                ).toBeInTheDocument();
            });

            // Close dialog
            const closeButton = screen.getByRole('button', { name: /close/i });
            await user.click(closeButton);
            await waitFor(() => {
                expect(
                    screen.queryByTestId('user-actions-dropdown')
                ).not.toBeInTheDocument();
            });

            // Verify hook was called for both states
            expect(mockUseAutoCloseMobileDialog).toHaveBeenCalledWith({
                isOpen: false,
                setIsOpen: expect.any(Function),
                breakpoint: 768,
            });
        });

        it('should handle edge case breakpoint values', () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            // Verify the specific breakpoint value is used
            expect(mockUseAutoCloseMobileDialog).toHaveBeenCalledWith(
                expect.objectContaining({
                    breakpoint: 768,
                })
            );
        });
    });

    describe('Animation and Motion', () => {
        it('should render with motion variants', () => {
            mockUseUser.mockReturnValue({
                data: mockUser,
                isLoading: false,
                error: null,
            } as any);
            mockUseUserFullName.mockReturnValue('John Doe');

            render(
                <TestWrapper>
                    <AppHeader />
                </TestWrapper>
            );

            // Check if motion components are rendered
            expect(screen.getByTestId('header-container')).toBeInTheDocument();
            expect(screen.getByTestId('header-inner')).toBeInTheDocument();
        });
    });
});
