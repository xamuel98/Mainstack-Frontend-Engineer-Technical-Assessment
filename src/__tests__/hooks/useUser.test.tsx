import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
    vi,
    describe,
    it,
    expect,
    beforeEach,
    afterEach,
    type MockedFunction,
} from 'vitest';
import React from 'react';

import { useUser, useUserFullName, USER_QUERY_KEY } from '@/hooks/useUser';
import { fetchUser } from '@/lib';
import { User, ApiError } from '@/types';

// Mock the API function
vi.mock('@/lib', () => ({
    fetchUser: vi.fn(),
}));

// Test wrapper component
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                gcTime: 0,
            },
        },
    });

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

// Mock user data
const mockUser: User = {
    email: 'john.doe@example.com',
    first_name: 'John',
    last_name: 'Doe',
};

const mockUserWithoutLastName: User = {
    email: 'jane@example.com',
    first_name: 'Jane',
    last_name: '',
};

const mockUserWithoutFirstName: User = {
    email: 'smith@example.com',
    first_name: '',
    last_name: 'Smith',
};

const mockUserWithoutNames: User = {
    email: 'noname@example.com',
    first_name: '',
    last_name: '',
};

describe('useUser Hook', () => {
    const mockFetchUser = fetchUser as MockedFunction<typeof fetchUser>;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('Successful Data Fetching', () => {
        it('should fetch user data successfully', async () => {
            mockFetchUser.mockResolvedValue(mockUser);

            const { result } = renderHook(() => useUser(), {
                wrapper: createWrapper(),
            });

            // Initially loading
            expect(result.current.isLoading).toBe(true);
            expect(result.current.data).toBeUndefined();

            // Wait for data to load
            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.data).toEqual(mockUser);
            expect(result.current.error).toBeNull();
            expect(mockFetchUser).toHaveBeenCalledTimes(1);
        });

        it('should use correct query key', async () => {
            mockFetchUser.mockResolvedValue(mockUser);

            const { result } = renderHook(() => useUser(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            // Verify the query key is exported correctly
            expect(USER_QUERY_KEY).toEqual(['user']);
        });

        it('should handle user data with empty optional fields', async () => {
            const userWithEmptyFields: User = {
                ...mockUser,
                email: '',
                first_name: '',
            };
            mockFetchUser.mockResolvedValue(userWithEmptyFields);

            const { result } = renderHook(() => useUser(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.data).toEqual(userWithEmptyFields);
            expect(result.current.error).toBeNull();
        });

        it('should handle user data with null optional fields', async () => {
            const userWithNullFields: User = {
                ...mockUser,
                email: null,
                first_name: null,
            };
            mockFetchUser.mockResolvedValue(userWithNullFields);

            const { result } = renderHook(() => useUser(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.data).toEqual(userWithNullFields);
            expect(result.current.error).toBeNull();
        });
    });

    describe('Error Handling', () => {
        it('should handle fetch errors correctly', async () => {
            const mockError = new Error(
                'Failed to fetch user data'
            ) as unknown as ApiError;
            mockFetchUser.mockRejectedValue(mockError);

            const { result } = renderHook(() => useUser(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.data).toBeUndefined();
            expect(result.current.error).toEqual(mockError);
            expect(mockFetchUser).toHaveBeenCalledTimes(1);
        });

        it('should handle network errors', async () => {
            const networkError = new Error(
                'Network error'
            ) as unknown as ApiError;
            mockFetchUser.mockRejectedValue(networkError);

            const { result } = renderHook(() => useUser(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.error).toEqual(networkError);
        });

        it('should handle API errors with status codes', async () => {
            const apiError = {
                message: 'Unauthorized',
                status: 401,
            } as ApiError;
            mockFetchUser.mockRejectedValue(apiError);

            const { result } = renderHook(() => useUser(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.error).toEqual(apiError);
        });

        it('should handle 404 errors for non-existent users', async () => {
            const notFoundError = {
                message: 'User not found',
                status: 404,
            } as ApiError;
            mockFetchUser.mockRejectedValue(notFoundError);

            const { result } = renderHook(() => useUser(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.error).toEqual(notFoundError);
        });
    });

    describe('Loading States', () => {
        it('should show loading state initially', () => {
            mockFetchUser.mockImplementation(() => new Promise(() => {})); // Never resolves

            const { result } = renderHook(() => useUser(), {
                wrapper: createWrapper(),
            });

            expect(result.current.isLoading).toBe(true);
            expect(result.current.data).toBeUndefined();
            expect(result.current.error).toBeNull();
        });

        it('should transition from loading to success', async () => {
            mockFetchUser.mockResolvedValue(mockUser);

            const { result } = renderHook(() => useUser(), {
                wrapper: createWrapper(),
            });

            // Initially loading
            expect(result.current.isLoading).toBe(true);

            // After data loads
            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
                expect(result.current.data).toEqual(mockUser);
            });
        });
    });

    describe('Caching Behavior', () => {
        it('should cache user data between renders', async () => {
            mockFetchUser.mockResolvedValue(mockUser);

            const { result, rerender } = renderHook(() => useUser(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            // Rerender the hook
            rerender();

            // Should not fetch again due to caching
            expect(mockFetchUser).toHaveBeenCalledTimes(1);
            expect(result.current.data).toEqual(mockUser);
        });

        it('should share cache between multiple hook instances', async () => {
            mockFetchUser.mockResolvedValue(mockUser);

            // Create a shared QueryClient for cache sharing
            const sharedQueryClient = new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: false,
                        gcTime: 0,
                    },
                },
            });

            const SharedWrapper = ({
                children,
            }: {
                children: React.ReactNode;
            }) => (
                <QueryClientProvider client={sharedQueryClient}>
                    {children}
                </QueryClientProvider>
            );

            const { result: result1 } = renderHook(() => useUser(), {
                wrapper: SharedWrapper,
            });

            const { result: result2 } = renderHook(() => useUser(), {
                wrapper: SharedWrapper,
            });

            await waitFor(() => {
                expect(result1.current.isLoading).toBe(false);
                expect(result2.current.isLoading).toBe(false);
            });

            // Should share cache between hook instances
            expect(mockFetchUser).toHaveBeenCalledTimes(1);
            expect(result1.current.data).toEqual(mockUser);
            expect(result2.current.data).toEqual(mockUser);
        });
    });

    describe('Data Validation', () => {
        it('should handle user data with special characters in names', async () => {
            const userWithSpecialChars: User = {
                ...mockUser,
                first_name: 'José',
                last_name: "O'Connor",
            };
            mockFetchUser.mockResolvedValue(userWithSpecialChars);

            const { result } = renderHook(() => useUser(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.data).toEqual(userWithSpecialChars);
        });

        it('should handle user data with very long names', async () => {
            const userWithLongNames: User = {
                ...mockUser,
                first_name: 'A'.repeat(100),
                last_name: 'B'.repeat(100),
            };
            mockFetchUser.mockResolvedValue(userWithLongNames);

            const { result } = renderHook(() => useUser(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.data).toEqual(userWithLongNames);
        });

        it('should handle user data with whitespace in names', async () => {
            const userWithWhitespace: User = {
                ...mockUser,
                first_name: '  John  ',
                last_name: '  Doe  ',
            };
            mockFetchUser.mockResolvedValue(userWithWhitespace);

            const { result } = renderHook(() => useUser(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.data).toEqual(userWithWhitespace);
        });
    });
});

describe('useUserFullName Hook', () => {
    const mockFetchUser = fetchUser as MockedFunction<typeof fetchUser>;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('Name Formatting', () => {
        it('should format full name correctly with both first and last name', async () => {
            mockFetchUser.mockResolvedValue(mockUser);

            const { result } = renderHook(() => useUserFullName(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current).toBe('John Doe');
            });
        });

        it('should handle user with only first name', async () => {
            mockFetchUser.mockResolvedValue(mockUserWithoutLastName);

            const { result } = renderHook(() => useUserFullName(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current).toBe('Jane');
            });
        });

        it('should handle user with only last name', async () => {
            mockFetchUser.mockResolvedValue(mockUserWithoutFirstName);

            const { result } = renderHook(() => useUserFullName(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current).toBe('Smith');
            });
        });

        it('should handle user with no names', async () => {
            mockFetchUser.mockResolvedValue(mockUserWithoutNames);

            const { result } = renderHook(() => useUserFullName(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current).toBe('');
            });
        });

        it('should handle user with null names', async () => {
            const userWithNullNames: User = {
                ...mockUser,
                first_name: null,
                last_name: null,
            };
            mockFetchUser.mockResolvedValue(userWithNullNames);

            const { result } = renderHook(() => useUserFullName(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current).toBe('');
            });
        });

        it('should handle user with undefined names', async () => {
            const userWithUndefinedNames: User = {
                ...mockUser,
                first_name: undefined,
                last_name: undefined,
            };
            mockFetchUser.mockResolvedValue(userWithUndefinedNames);

            const { result } = renderHook(() => useUserFullName(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current).toBe('');
            });
        });

        it('should trim whitespace from names', async () => {
            const userWithWhitespace: User = {
                ...mockUser,
                first_name: '  John  ',
                last_name: '  Doe  ',
            };
            mockFetchUser.mockResolvedValue(userWithWhitespace);

            const { result } = renderHook(() => useUserFullName(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current).toBe('John Doe');
            });
        });

        it('should handle names with special characters', async () => {
            const userWithSpecialChars: User = {
                ...mockUser,
                first_name: 'José',
                last_name: "O'Connor-Smith",
            };
            mockFetchUser.mockResolvedValue(userWithSpecialChars);

            const { result } = renderHook(() => useUserFullName(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current).toBe("José O'Connor-Smith");
            });
        });

        it('should handle names with numbers', async () => {
            const userWithNumbers: User = {
                ...mockUser,
                first_name: 'John2',
                last_name: 'Doe3',
            };
            mockFetchUser.mockResolvedValue(userWithNumbers);

            const { result } = renderHook(() => useUserFullName(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current).toBe('John2 Doe3');
            });
        });

        it('should handle very long names', async () => {
            const userWithLongNames: User = {
                ...mockUser,
                first_name: 'A'.repeat(50),
                last_name: 'B'.repeat(50),
            };
            mockFetchUser.mockResolvedValue(userWithLongNames);

            const { result } = renderHook(() => useUserFullName(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current).toBe(
                    'A'.repeat(50) + ' ' + 'B'.repeat(50)
                );
            });
        });

        it('should handle single character names', async () => {
            const userWithSingleChars: User = {
                ...mockUser,
                first_name: 'J',
                last_name: 'D',
            };
            mockFetchUser.mockResolvedValue(userWithSingleChars);

            const { result } = renderHook(() => useUserFullName(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current).toBe('J D');
            });
        });
    });

    describe('Error Handling', () => {
        it('should return empty string when user fetch fails', async () => {
            const mockError = new Error(
                'Failed to fetch user'
            ) as unknown as ApiError;
            mockFetchUser.mockRejectedValue(mockError);

            const { result } = renderHook(() => useUserFullName(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current).toBe('');
            });
        });

        it('should return empty string when user data is undefined', async () => {
            const mockError: ApiError = {
                message: 'User data not found',
                status: 404,
            };
            mockFetchUser.mockRejectedValue(mockError);

            const { result } = renderHook(() => useUserFullName(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current).toBe('');
            });
        });

        it('should return empty string when user data is null', async () => {
            const mockError: ApiError = {
                message: 'User data is null',
                status: 404,
            };
            mockFetchUser.mockRejectedValue(mockError);

            const { result } = renderHook(() => useUserFullName(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current).toBe('');
            });
        });
    });

    describe('Loading States', () => {
        it('should return empty string during loading', () => {
            mockFetchUser.mockImplementation(() => new Promise(() => {})); // Never resolves

            const { result } = renderHook(() => useUserFullName(), {
                wrapper: createWrapper(),
            });

            expect(result.current).toBe('');
        });

        it('should transition from empty string to formatted name', async () => {
            mockFetchUser.mockResolvedValue(mockUser);

            const { result } = renderHook(() => useUserFullName(), {
                wrapper: createWrapper(),
            });

            // Initially empty
            expect(result.current).toBe('');

            // After data loads
            await waitFor(() => {
                expect(result.current).toBe('John Doe');
            });
        });
    });

    describe('Performance and Optimization', () => {
        it('should not refetch data unnecessarily', async () => {
            mockFetchUser.mockResolvedValue(mockUser);

            const { result, rerender } = renderHook(() => useUserFullName(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current).toBe('John Doe');
            });

            // Rerender multiple times
            rerender();
            rerender();
            rerender();

            // Should only fetch once due to React Query caching
            expect(mockFetchUser).toHaveBeenCalledTimes(1);
            expect(result.current).toBe('John Doe');
        });

        it('should share cache with useUser hook', async () => {
            mockFetchUser.mockResolvedValue(mockUser);

            // Create a shared QueryClient for cache sharing
            const sharedQueryClient = new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: false,
                        gcTime: 0,
                    },
                },
            });

            const SharedWrapper = ({
                children,
            }: {
                children: React.ReactNode;
            }) => (
                <QueryClientProvider client={sharedQueryClient}>
                    {children}
                </QueryClientProvider>
            );

            const { result: userResult } = renderHook(() => useUser(), {
                wrapper: SharedWrapper,
            });

            const { result: nameResult } = renderHook(() => useUserFullName(), {
                wrapper: SharedWrapper,
            });

            await waitFor(() => {
                expect(userResult.current.data).toEqual(mockUser);
                expect(nameResult.current).toBe('John Doe');
            });

            // Should only fetch once due to shared cache
            expect(mockFetchUser).toHaveBeenCalledTimes(1);
        });

        it('should handle rapid successive calls efficiently', async () => {
            mockFetchUser.mockResolvedValue(mockUser);

            // Create a shared QueryClient for cache sharing
            const sharedQueryClient = new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: false,
                        gcTime: 0,
                    },
                },
            });

            const SharedWrapper = ({
                children,
            }: {
                children: React.ReactNode;
            }) => (
                <QueryClientProvider client={sharedQueryClient}>
                    {children}
                </QueryClientProvider>
            );

            const { result: result1 } = renderHook(() => useUserFullName(), {
                wrapper: SharedWrapper,
            });

            const { result: result2 } = renderHook(() => useUserFullName(), {
                wrapper: SharedWrapper,
            });

            const { result: result3 } = renderHook(() => useUserFullName(), {
                wrapper: SharedWrapper,
            });

            await waitFor(() => {
                expect(result1.current).toBe('John Doe');
                expect(result2.current).toBe('John Doe');
                expect(result3.current).toBe('John Doe');
            });

            // Should share cache between all instances
            expect(mockFetchUser).toHaveBeenCalledTimes(1);
        });
    });

    describe('Data Consistency', () => {
        it('should maintain consistency with useUser hook data', async () => {
            mockFetchUser.mockResolvedValue(mockUser);

            const { result: userResult } = renderHook(() => useUser(), {
                wrapper: createWrapper(),
            });

            const { result: nameResult } = renderHook(() => useUserFullName(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(userResult.current.data).toEqual(mockUser);
                expect(nameResult.current).toBe('John Doe');
            });

            // Verify consistency
            const userData = userResult.current.data;
            const expectedName = userData
                ? `${userData.first_name} ${userData.last_name}`.trim()
                : '';
            expect(nameResult.current).toBe(expectedName);
        });

        it('should update when user data changes', async () => {
            mockFetchUser.mockResolvedValue(mockUser);

            const { result } = renderHook(() => useUserFullName(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current).toBe('John Doe');
            });

            // Update mock data
            const updatedUser: User = {
                ...mockUser,
                first_name: 'Jane',
                last_name: 'Smith',
            };
            mockFetchUser.mockResolvedValue(updatedUser);

            // Force refetch by creating new wrapper
            const { result: newResult } = renderHook(() => useUserFullName(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(newResult.current).toBe('Jane Smith');
            });
        });
    });

    describe('Edge Cases and Boundary Conditions', () => {
        it('should handle empty string names correctly', async () => {
            const userWithEmptyStrings: User = {
                ...mockUser,
                first_name: '',
                last_name: '',
            };
            mockFetchUser.mockResolvedValue(userWithEmptyStrings);

            const { result } = renderHook(() => useUserFullName(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current).toBe('');
            });
        });

        it('should handle names with only whitespace', async () => {
            const userWithWhitespaceOnly: User = {
                ...mockUser,
                first_name: '   ',
                last_name: '   ',
            };
            mockFetchUser.mockResolvedValue(userWithWhitespaceOnly);

            const { result } = renderHook(() => useUserFullName(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current).toBe('');
            });
        });

        it('should handle mixed whitespace and empty names', async () => {
            const userWithMixedEmpty: User = {
                ...mockUser,
                first_name: '  John  ',
                last_name: '',
            };
            mockFetchUser.mockResolvedValue(userWithMixedEmpty);

            const { result } = renderHook(() => useUserFullName(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current).toBe('John');
            });
        });

        it('should handle names with line breaks and tabs', async () => {
            const userWithSpecialWhitespace: User = {
                ...mockUser,
                first_name: 'John\n\t',
                last_name: '\t\nDoe',
            };
            mockFetchUser.mockResolvedValue(userWithSpecialWhitespace);

            const { result } = renderHook(() => useUserFullName(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => {
                expect(result.current).toBe('John Doe');
            });
        });
    });
});
