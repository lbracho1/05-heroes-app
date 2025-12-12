import type { PropsWithChildren } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { usePaginatedHero } from "@/heroes/hooks/usePaginatedHero";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { getHeroesByPageAction } from "@/heroes/actions/get-heroes-by-page.actions";

vi.mock('@/heroes/actions/get-heroes-by-page.actions', () => ({
    getHeroesByPageAction: vi.fn()
}));

const mockGetHeroesByPageAction = vi.mocked(getHeroesByPageAction);
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false
        },
    },
});

const tanStackCustomProvider = () => {

    return ({ children }: PropsWithChildren) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
};

describe('usePaginatedHero', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
    });

    test('should return the initial state (isLoading)', () => {
        const { result } = renderHook(() => usePaginatedHero(1, 6), {
            wrapper: tanStackCustomProvider(),
        });

        expect(result.current.isLoading).toBeTruthy();
        expect(result.current.isError).toBeFalsy();
        expect(result.current.data).toBeUndefined();

    });

    test('should return success state with data when API call succeeds', async () => {
        const mockHeroesData = {
            total: 20,
            pages: 4,
            heroes: [],
        };

        mockGetHeroesByPageAction.mockResolvedValue(mockHeroesData)

        const { result } = renderHook(() => usePaginatedHero(1, 6), {
            wrapper: tanStackCustomProvider(),
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBeTruthy();
        });

        expect(result.current.status).toBe('success');
        expect(mockGetHeroesByPageAction).toHaveBeenCalled();
        expect(mockGetHeroesByPageAction).toHaveBeenCalledWith(1, 6, 'all');

    });

    test('should call getHeroesByPageActions with arguments', async () => {
        const mockHeroesData = {
            total: 20,
            pages: 4,
            heroes: [],
        };

        mockGetHeroesByPageAction.mockResolvedValue(mockHeroesData)

        const { result } = renderHook(() => usePaginatedHero(2, 16, 'heroesABC'), {
            wrapper: tanStackCustomProvider(),
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBeTruthy();
        });

        expect(result.current.status).toBe('success');
        expect(mockGetHeroesByPageAction).toHaveBeenCalled();
        expect(mockGetHeroesByPageAction).toHaveBeenCalledWith(2, 16, 'heroesABC');

    });
});