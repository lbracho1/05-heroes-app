import type { PropsWithChildren } from 'react';
import { describe, expect, test, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useHeroSummary } from '@/heroes/hooks/useHeroSummary';
import { getSummaryAction } from '@/heroes/actions/get-summary.action';
import type { SummaryInformationResponse } from '@/heroes/types/summary-information.response';

vi.mock('@/heroes/actions/get-summary.action', () => ({
    getSummaryAction: vi.fn()
}));

const mockGetSummaryAction = vi.mocked(getSummaryAction);

const tanStackCustomProvider = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false
            },
        },
    });

    return ({ children }: PropsWithChildren) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
};

describe('useHeroSummary', () => {
    test('should return the initial state (isLoading)', () => {
        const { result } = renderHook(() => useHeroSummary(), {
            wrapper: tanStackCustomProvider(),
        });

        expect(result.current.isLoading).toBeTruthy();
        expect(result.current.isError).toBeFalsy();
        expect(result.current.data).toBeUndefined();

    });

    test('should return success state with data when API call succeeds', async () => {
        const mockSummaryData = {
            totalHeroes: 20,
            strongestHero: {
                id: '1',
                name: 'SuperMan'
            },
            smartestHero: {
                id: '2',
                name: 'Batman'
            },
            heroCount: 18,
            villainCount: 7,
        } as SummaryInformationResponse;

        mockGetSummaryAction.mockResolvedValue(mockSummaryData);

        const { result } = renderHook(() => useHeroSummary(), {
            wrapper: tanStackCustomProvider(),
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBeTruthy();
        });

        expect(result.current.isError).toBeFalsy();
        expect(mockGetSummaryAction).toHaveBeenCalled();
    });

    test('should return error state when API call fails', async () => {
        const mockError = new Error('Failed to fetch summary');
        mockGetSummaryAction.mockRejectedValue(mockError);

        const { result } = renderHook(() => useHeroSummary(), {
            wrapper: tanStackCustomProvider(),
        });

        await waitFor(() => {
            expect(result.current.isError).toBeTruthy();
        });

        expect(result.current.error).toBeDefined();
        expect(result.current.isLoading).toBeFalsy();
        expect(mockGetSummaryAction).toHaveBeenCalled();
        expect(result.current.error?.message).toBe('Failed to fetch summary')
    });

});