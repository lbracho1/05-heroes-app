import { MemoryRouter } from "react-router";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, test, vi } from "vitest";
import SearchPage from "@/heroes/pages/search/SearchPage";
import { searchHeroesAction } from "@/heroes/actions/search-heros.action";
import type { Hero } from "@/heroes/types/hero.interface";

vi.mock('@/heroes/actions/search-heros.action');
const mockSearchHeroesAction = vi.mocked(searchHeroesAction);

vi.mock('@/components/custom/CustomJumbotron', () => ({
    CustomJumbotron: () => <div data-testid="custom-jumbotron"></div>
}));

vi.mock('@/heroes/pages/search/ui/SearchControls', () => ({
    SearchControls: () => <div data-testid="search-control"></div>
}));

vi.mock('@/heroes/components/HeroGrid', () => ({
    HeroGrid: ({ heroes }: { heroes: Hero[] }) => (
        <div data-testid="hero-grid">
            {heroes.map((hero) => (
                <div key={hero.id}>{hero.name}</div>
            ))
            }
        </div>)
}));
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false
        }
    }
});

const renderSearchPage = (initialEntries: string[] = ['/']) => {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <QueryClientProvider client={queryClient}>
                <SearchPage />
            </QueryClientProvider>
        </MemoryRouter>
    )
};

describe('SearchPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    });

    test('should render SearchPage with default values', () => {
        const { container } = renderSearchPage();

        expect(mockSearchHeroesAction).toHaveBeenCalledWith({
            name: undefined,
            strength: undefined
        });

        expect(container).toMatchSnapshot();
    });

    test('should call search action with name parameter', () => {
        const { container } = renderSearchPage(['/search?name=superman']);

        expect(mockSearchHeroesAction).toHaveBeenCalledWith({
            name: 'superman',
            strength: undefined
        });

        expect(container).toMatchSnapshot();
    });

    test('should call search action with strength parameter', () => {
        const { container } = renderSearchPage(['/search?strength=6']);

        expect(mockSearchHeroesAction).toHaveBeenCalledWith({
            name: undefined,
            strength: '6'
        });

        expect(container).toMatchSnapshot();
    });

    test('should call search action with strength and name parameter', () => {
        const { container } = renderSearchPage(['/search?strength=8&name=batman']);

        expect(mockSearchHeroesAction).toHaveBeenCalledWith({
            name: 'batman',
            strength: '8'
        });

        expect(container).toMatchSnapshot();
    });

    test('should render HeroGrid search results', async () => {

        const mockHeros = [
            { id: '1', name: 'Clark Kent' } as unknown as Hero,
            { id: '2', name: 'Bruce Wayne' } as unknown as Hero
        ]

        mockSearchHeroesAction.mockResolvedValue(mockHeros);

        renderSearchPage();

        await waitFor(() => {
            expect(screen.getByText('Clark Kent')).toBeDefined();
            expect(screen.getByText('Bruce Wayne')).toBeDefined();
        });
    });
});