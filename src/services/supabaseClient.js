import { createClient } from '@supabase/supabase-js';

// Supabase configuration - você vai substituir esses valores
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/**
 * Check if Supabase is configured
 */
export const isSupabaseConfigured = () => {
    return supabase !== null;
};

/**
 * Generate a random couple code (6 characters)
 */
export const generateCoupleCode = () => {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
};

/**
 * Save couple code to localStorage
 */
export const saveCoupleCode = (code) => {
    localStorage.setItem('bible-couple-code', code.toUpperCase());
};

/**
 * Get couple code from localStorage
 */
export const getCoupleCode = () => {
    return localStorage.getItem('bible-couple-code');
};

/**
 * Remove couple code from localStorage
 */
export const removeCoupleCode = () => {
    localStorage.removeItem('bible-couple-code');
};

/**
 * Check if a couple code exists in the database
 */
export const checkCoupleCodeExists = async (code) => {
    if (!supabase) return { exists: false, error: 'Supabase not configured' };

    try {
        const { data, error } = await supabase
            .from('couples')
            .select('code')
            .eq('code', code.toUpperCase())
            .single();

        if (error && error.code !== 'PGRST116') {
            return { exists: false, error: error.message };
        }

        return { exists: !!data, error: null };
    } catch (err) {
        return { exists: false, error: err.message };
    }
};

/**
 * Create a new couple code in the database
 */
export const createCoupleCode = async (code) => {
    if (!supabase) return { success: false, error: 'Supabase not configured' };

    try {
        const { error } = await supabase
            .from('couples')
            .insert([{ code: code.toUpperCase(), created_at: new Date().toISOString() }]);

        if (error) {
            return { success: false, error: error.message };
        }

        saveCoupleCode(code);
        return { success: true, error: null };
    } catch (err) {
        return { success: false, error: err.message };
    }
};

/**
 * Join an existing couple code
 */
export const joinCoupleCode = async (code) => {
    if (!supabase) return { success: false, error: 'Supabase not configured' };

    const { exists, error } = await checkCoupleCodeExists(code);

    if (error) {
        return { success: false, error };
    }

    if (!exists) {
        return { success: false, error: 'Código não encontrado' };
    }

    saveCoupleCode(code);
    return { success: true, error: null };
};

/**
 * Sync favorites to Supabase
 */
export const syncFavoritesToCloud = async (favorites) => {
    if (!supabase) return { success: false, error: 'Supabase not configured' };

    const coupleCode = getCoupleCode();
    if (!coupleCode) return { success: false, error: 'No couple code set' };

    try {
        // First, delete existing favorites for this couple
        await supabase
            .from('favorites')
            .delete()
            .eq('couple_code', coupleCode);

        // Then insert all current favorites
        if (favorites.length > 0) {
            const favoritesToInsert = favorites.map(fav => ({
                couple_code: coupleCode,
                verse_id: fav.id,
                book_abbrev: fav.bookAbbrev,
                book_name: fav.bookName,
                chapter: fav.chapter,
                verse_number: fav.number,
                text: fav.text,
                added_at: fav.addedAt,
                added_by: localStorage.getItem('bible-user-name') || 'Anônimo'
            }));

            const { error } = await supabase
                .from('favorites')
                .insert(favoritesToInsert);

            if (error) {
                return { success: false, error: error.message };
            }
        }

        return { success: true, error: null };
    } catch (err) {
        return { success: false, error: err.message };
    }
};

/**
 * Fetch favorites from Supabase
 */
export const fetchFavoritesFromCloud = async () => {
    if (!supabase) return { favorites: [], error: 'Supabase not configured' };

    const coupleCode = getCoupleCode();
    if (!coupleCode) return { favorites: [], error: 'No couple code set' };

    try {
        const { data, error } = await supabase
            .from('favorites')
            .select('*')
            .eq('couple_code', coupleCode)
            .order('added_at', { ascending: false });

        if (error) {
            return { favorites: [], error: error.message };
        }

        const favorites = data.map(fav => ({
            id: fav.verse_id,
            bookAbbrev: fav.book_abbrev,
            bookName: fav.book_name,
            chapter: fav.chapter,
            number: fav.verse_number,
            text: fav.text,
            addedAt: fav.added_at,
            addedBy: fav.added_by
        }));

        return { favorites, error: null };
    } catch (err) {
        return { favorites: [], error: err.message };
    }
};

/**
 * Subscribe to real-time favorites changes
 */
export const subscribeToFavorites = (onUpdate) => {
    if (!supabase) return null;

    const coupleCode = getCoupleCode();
    if (!coupleCode) return null;

    const subscription = supabase
        .channel('favorites-changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'favorites',
                filter: `couple_code=eq.${coupleCode}`
            },
            () => {
                // Fetch all favorites when any change occurs
                fetchFavoritesFromCloud().then(({ favorites }) => {
                    onUpdate(favorites);
                });
            }
        )
        .subscribe();

    return subscription;
};

/**
 * Unsubscribe from real-time updates
 */
export const unsubscribeFromFavorites = (subscription) => {
    if (subscription && supabase) {
        supabase.removeChannel(subscription);
    }
};
