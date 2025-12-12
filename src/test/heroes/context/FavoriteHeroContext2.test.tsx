import { use } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { FavoriteHeroContext, FavoriteHeroProvider } from "@/heroes/context/FavoriteHeroContext";
import type { Hero } from "@/heroes/types/hero.interface";

const mockHero = {
    id: '1',
    name: 'batman'
} as Hero;

const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

const TestComponent = () => {
    const { favorite, favoriteCount, isFavorite, toggleFavorite } =
        use(FavoriteHeroContext);

    return (
        <div>
            <div data-testid="favorite-count">{favoriteCount}</div>

            <div data-testid="favorite-list">
                {favorite.map((hero) => (
                    <div key={hero.id} data-testid={`hero-${hero.id}`}>
                        {hero.name}
                    </div>
                ))}
            </div>

            <button data-testid="toggle-favorite"
                onClick={() => toggleFavorite(mockHero)}
            >
                Toggle Favorite
            </button>
            <div data-testid="is-favorite">{isFavorite(mockHero).toString()}</div>
        </div>
    );
};

const renderContexTest = () => {

    return render(
        <FavoriteHeroProvider>
            <TestComponent />
        </FavoriteHeroProvider>
    );
};


describe('FavoriteHeroContext', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should initialize with default values', () => {
        renderContexTest();

        expect(screen.getByTestId('favorite-count').textContent).toBe('0');
        expect(screen.getByTestId('favorite-list').children.length).toBe(0);
    });

    test('should add hero to favorite when toggleFavorite is called with new hero', () => {
        renderContexTest();

        const button = screen.getByTestId('toggle-favorite');

        fireEvent.click(button);

        expect(screen.getByTestId('favorite-count').textContent).toBe('1');
        expect(screen.getByTestId('is-favorite').textContent).toBeTruthy();
        expect(screen.getByTestId('hero-1').textContent).toBe('batman');
        expect(localStorageMock.setItem).toHaveBeenCalled();
        expect(localStorageMock.setItem).toHaveBeenCalledWith('favorites', '[{\"id\":\"1\",\"name\":\"batman\"}]');

    });

    test('should remove hero from favorite when toggleFavorite is called', () => {
        localStorageMock.getItem.mockReturnValue(JSON.stringify([mockHero]));

        renderContexTest();

        expect(localStorage.getItem('favorites')).toBe('[{"id":"1","name":"batman"}]')
        expect(screen.getByTestId('is-favorite').textContent).toBeTruthy();
        expect(screen.getByTestId('favorite-count').textContent).toBe('1');
        expect(screen.getByTestId('hero-1').textContent).toBe('batman');

        const button = screen.getByTestId('toggle-favorite');

        fireEvent.click(button);

        expect(screen.getByTestId('favorite-count').textContent).toBe('0');
        expect(screen.getByTestId('is-favorite').textContent).toBe('false');
        expect(screen.queryByTestId('hero-1')).toBeNull();

        expect(localStorageMock.setItem).toHaveBeenCalled();
        expect(localStorageMock.setItem).toHaveBeenCalledWith('favorites', '[]');
    });
});