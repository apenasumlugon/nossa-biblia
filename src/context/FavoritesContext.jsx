import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
    isSupabaseConfigured,
    getCoupleCode,
    saveCoupleCode,
    removeCoupleCode,
    generateCoupleCode,
    createCoupleCode,
    joinCoupleCode,
    syncFavoritesToCloud,
    fetchFavoritesFromCloud,
    subscribeToFavorites,
    unsubscribeFromFavorites
} from '../services/supabaseClient';

const FAVORITES_STORAGE_KEY = 'bible-reader-favorites';
const USER_NAME_KEY = 'bible-user-name';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [coupleCode, setCoupleCode] = useState(getCoupleCode());
    const [userName, setUserName] = useState(localStorage.getItem(USER_NAME_KEY) || '');
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncError, setSyncError] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

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

    // Subscribe to real-time updates when connected
    useEffect(() => {
        if (!coupleCode || !isSupabaseConfigured()) return;

        const subscription = subscribeToFavorites((cloudFavorites) => {
            setFavorites(cloudFavorites);
        });

        setIsConnected(true);

        return () => {
            if (subscription) {
                unsubscribeFromFavorites(subscription);
            }
        };
    }, [coupleCode]);

    // Sync to cloud when favorites change and connected
    useEffect(() => {
        if (!isLoaded || !coupleCode || !isSupabaseConfigured()) return;

        const syncTimeout = setTimeout(() => {
            syncFavoritesToCloud(favorites).then(({ success, error }) => {
                if (!success && error) {
                    setSyncError(error);
                } else {
                    setSyncError(null);
                }
            });
        }, 1000); // Debounce sync

        return () => clearTimeout(syncTimeout);
    }, [favorites, isLoaded, coupleCode]);

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
            addedBy: userName || 'Anônimo'
        };

        setFavorites((prev) => {
            if (prev.some((fav) => fav.id === id)) {
                return prev;
            }
            return [favoriteVerse, ...prev];
        });
    }, [generateVerseId, userName]);

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

    /**
     * Create a new couple connection
     */
    const createConnection = useCallback(async (name) => {
        setIsSyncing(true);
        setSyncError(null);

        try {
            const code = generateCoupleCode();
            const { success, error } = await createCoupleCode(code);

            if (success) {
                setCoupleCode(code);
                setUserName(name);
                localStorage.setItem(USER_NAME_KEY, name);

                // Sync existing favorites to cloud
                await syncFavoritesToCloud(favorites);

                return { success: true, code, error: null };
            } else {
                return { success: false, code: null, error };
            }
        } catch (err) {
            return { success: false, code: null, error: err.message };
        } finally {
            setIsSyncing(false);
        }
    }, [favorites]);

    /**
     * Join an existing couple connection
     */
    const joinConnection = useCallback(async (code, name) => {
        setIsSyncing(true);
        setSyncError(null);

        try {
            const { success, error } = await joinCoupleCode(code);

            if (success) {
                setCoupleCode(code.toUpperCase());
                setUserName(name);
                localStorage.setItem(USER_NAME_KEY, name);

                // Fetch favorites from cloud
                const { favorites: cloudFavorites } = await fetchFavoritesFromCloud();
                if (cloudFavorites.length > 0) {
                    setFavorites(cloudFavorites);
                }

                return { success: true, error: null };
            } else {
                return { success: false, error };
            }
        } catch (err) {
            return { success: false, error: err.message };
        } finally {
            setIsSyncing(false);
        }
    }, []);

    /**
     * Disconnect from couple sync
     */
    const disconnect = useCallback(() => {
        removeCoupleCode();
        setCoupleCode(null);
        setIsConnected(false);
        setSyncError(null);
    }, []);

    /**
     * Manually refresh from cloud
     */
    const refreshFromCloud = useCallback(async () => {
        if (!coupleCode) return;

        setIsSyncing(true);
        try {
            const { favorites: cloudFavorites, error } = await fetchFavoritesFromCloud();
            if (!error) {
                setFavorites(cloudFavorites);
            } else {
                setSyncError(error);
            }
        } finally {
            setIsSyncing(false);
        }
    }, [coupleCode]);

    const value = {
        favorites,
        isLoaded,
        isFavorite,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        clearFavorites,
        favoritesCount: favorites.length,
        // Sync related
        coupleCode,
        userName,
        isSyncing,
        syncError,
        isConnected,
        isSupabaseReady: isSupabaseConfigured(),
        createConnection,
        joinConnection,
        disconnect,
        refreshFromCloud
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
}

export default FavoritesContext;
