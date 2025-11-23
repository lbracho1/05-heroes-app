import { createContext, useEffect, useState, type PropsWithChildren } from "react";
import type { Hero } from "../types/hero.interface";

interface FavoriteHeroContext {
    // Statet
    favorite: Hero[];
    favoriteCount: number;

    // Methods
    isFavorite: (hero: Hero) => Boolean;
    toggleFavorite: (hero: Hero) => void;
};

export const FavoriteHeroContext = createContext({} as FavoriteHeroContext);

const getFavoritesFromLocalStorage = (): Hero[] => {
    const favorite = localStorage.getItem('favorites');
    return favorite ? JSON.parse(favorite) : [];
};

export const FavoriteHeroProvider = ({ children }: PropsWithChildren) => {
    const [favorites, setFavorites] = useState<Hero[]>(getFavoritesFromLocalStorage());

    const togglesFavorite = (hero: Hero) => {
        const heroExist = favorites.find(h => h.id === hero.id);

        if (heroExist) {
            const newFavorites = favorites.filter(h => h.id !== hero.id)
            setFavorites(newFavorites);
            return;
        };

        setFavorites([...favorites, hero]);
    };

    const isfavorite = (hero: Hero) => {
        return favorites.some((h) => h.id === hero.id)
    };

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites])

    return (
        <FavoriteHeroContext
            value={{
                // State
                favoriteCount: favorites.length,
                favorite: favorites,

                // Methods
                isFavorite: isfavorite,
                toggleFavorite: togglesFavorite,
            }}
        >
            {children}
        </FavoriteHeroContext>
    );
};
