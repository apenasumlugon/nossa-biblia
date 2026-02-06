import { createClient } from '@supabase/supabase-js';

// Supabase configuration
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

// --- COUPLE & PROFILE MANAGEMENT ---

/**
 * Get current user profile with partner info
 */
export const getProfile = async (userId) => {
    if (!supabase) return null;
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*, partner:partner_id(*)')
            .eq('id', userId)
            .single();
        if (error) throw error;
        return data;
    } catch (err) {
        console.error('Error fetching profile:', err);
        return null;
    }
};

/**
 * Update user activity (Current Book/Chapter)
 */
export const updateReadingActivity = async (userId, bookAbbrev, chapter) => {
    if (!supabase) return;
    try {
        const { error } = await supabase
            .from('reading_activity')
            .insert({
                user_id: userId,
                book_abbrev: bookAbbrev,
                chapter: chapter
            });
        if (error) throw error;
    } catch (err) {
        console.error('Error updating activity:', err);
    }
};

/**
 * Get Partner's Latest Activity
 */
export const getPartnerActivity = async (partnerId) => {
    if (!supabase || !partnerId) return null;
    try {
        const { data, error } = await supabase
            .from('reading_activity')
            .select('*')
            .eq('user_id', partnerId)
            .order('completed_at', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // Ignore no rows found
        return data;
    } catch (err) {
        console.error('Error getting partner activity:', err);
        return null;
    }
};

/**
 * Create a new couple link
 */
export const createCoupleLink = async (userId) => {
    if (!supabase) return { code: null, error: 'Config missing' };

    // Generate 6-char random code
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));

    try {
        const { error } = await supabase.from('couples').insert({
            user1_id: userId,
            connection_code: code
        });
        if (error) throw error;
        return { code, error: null };
    } catch (err) {
        return { code: null, error: err.message };
    }
};

/**
 * Join an existing couple via code
 */
export const joinCouple = async (userId, code) => {
    if (!supabase) return { success: false, error: 'Config missing' };

    try {
        // Find couple record
        const { data: couple, error: findError } = await supabase
            .from('couples')
            .select('*')
            .eq('connection_code', code.toUpperCase())
            .single();

        if (findError || !couple) throw new Error('Código inválido ou não encontrado.');

        if (couple.user2_id) throw new Error('Este código já foi usado por um casal.');

        // Update couple record
        const { error: updateError } = await supabase
            .from('couples')
            .update({ user2_id: userId })
            .eq('id', couple.id);

        if (updateError) throw updateError;

        // Link profiles reciprocally
        await supabase.from('profiles').update({ partner_id: couple.user1_id }).eq('id', userId);
        await supabase.from('profiles').update({ partner_id: userId }).eq('id', couple.user1_id);

        return { success: true, error: null };
    } catch (err) {
        return { success: false, error: err.message };
    }
}
