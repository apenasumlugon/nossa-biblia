import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';

const FAVORITES_STORAGE_KEY = 'bible-reader-favorites';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load favorites from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setFavorites(Array.isArray(parsed) ? parsed : []);
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
            setFavorites([]);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Save favorites to localStorage whenever they change
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
            } catch (error) {
                console.error('Error saving favorites:', error);
            }
        }
    }, [favorites, isLoaded]);

    /**
     * Generate a unique ID for a verse
     */
    const generateVerseId = useCallback((bookAbbrev, chapter, verseNumber) => {
        return `${bookAbbrev}-${chapter}-${verseNumber}`;
    }, []);

    /**
     * Check if a verse is favorited
     */
    const isFavorite = useCallback((bookAbbrev, chapter, verseNumber) => {
        const id = generateVerseId(bookAbbrev, chapter, verseNumber);
        return favorites.some((fav) => fav.id === id);
    }, [favorites, generateVerseId]);

    /**
     * Add a verse to favorites
     */
    const addFavorite = useCallback((verse) => {
        const id = generateVerseId(verse.bookAbbrev, verse.chapter, verse.number);

        const favoriteVerse = {
            id,
            bookAbbrev: verse.bookAbbrev,
            bookName: verse.bookName,
            chapter: verse.chapter,
            number: verse.number,
            text: verse.text,
            addedAt: new Date().toISOString(),
            // addedBy: removed for now in MVP refactor
        };

        setFavorites((prev) => {
            if (prev.some((fav) => fav.id === id)) {
                return prev;
            }
            return [favoriteVerse, ...prev];
        });
    }, [generateVerseId]);

    /**
     * Remove a verse from favorites
     */
    const removeFavorite = useCallback((bookAbbrev, chapter, verseNumber) => {
        const id = generateVerseId(bookAbbrev, chapter, verseNumber);
        setFavorites((prev) => prev.filter((fav) => fav.id !== id));
    }, [generateVerseId]);

    /**
     * Toggle favorite status
     */
    const toggleFavorite = useCallback((verse) => {
        if (isFavorite(verse.bookAbbrev, verse.chapter, verse.number)) {
            removeFavorite(verse.bookAbbrev, verse.chapter, verse.number);
        } else {
            addFavorite(verse);
        }
    }, [isFavorite, addFavorite, removeFavorite]);

    /**
     * Clear all favorites
     */
    const clearFavorites = useCallback(() => {
        setFavorites([]);
    }, []);

    const value = {
        favorites,
        isLoaded,
        isFavorite,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        clearFavorites,
        favoritesCount: favorites.length
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
}
