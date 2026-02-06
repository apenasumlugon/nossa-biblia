
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const HighlightsContext = createContext();

const HIGHLIGHTS_STORAGE_KEY = 'bible-reader-highlights';

export function HighlightsProvider({ children }) {
    const [highlights, setHighlights] = useState([]);

    // Load highlights from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(HIGHLIGHTS_STORAGE_KEY);
            if (stored) {
                setHighlights(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Error loading highlights:', error);
        }
    }, []);

    // Save highlights to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(HIGHLIGHTS_STORAGE_KEY, JSON.stringify(highlights));
        } catch (error) {
            console.error('Error saving highlights:', error);
        }
    }, [highlights]);

    /**
     * Add or update a highlight
     */
    const addHighlight = useCallback((bookAbbrev, chapter, verseNumber, color) => {
        const id = `${bookAbbrev}-${chapter}-${verseNumber}`;
        setHighlights((prev) => {
            // Remove existing highlight for this verse if any
            const filtered = prev.filter(h => h.id !== id);
            return [...filtered, {
                id,
                bookAbbrev,
                chapter,
                verseNumber,
                color,
                createdAt: new Date().toISOString()
            }];
        });
    }, []);

    /**
     * Remove a highlight
     */
    const removeHighlight = useCallback((bookAbbrev, chapter, verseNumber) => {
        const id = `${bookAbbrev}-${chapter}-${verseNumber}`;
        setHighlights((prev) => prev.filter(h => h.id !== id));
    }, []);

    /**
     * Get highlight color for a verse
     */
    const getHighlight = useCallback((bookAbbrev, chapter, verseNumber) => {
        const id = `${bookAbbrev}-${chapter}-${verseNumber}`;
        return highlights.find(h => h.id === id);
    }, [highlights]);

    return (
        <HighlightsContext.Provider value={{ highlights, addHighlight, removeHighlight, getHighlight }}>
            {children}
        </HighlightsContext.Provider>
    );
}

export function useHighlights() {
    return useContext(HighlightsContext);
}
