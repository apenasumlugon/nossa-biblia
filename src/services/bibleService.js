// Local Bible Data Service - 100% Offline
// Uses the pt_nvi.json file from thiagobodruk/bible repository

import booksData from '../data/books.json';

// Cache for the full bible data
let fullBibleData = null;

// Helper to load the full bible data only when needed
const ensureBibleLoaded = async () => {
    if (fullBibleData) return fullBibleData;

    try {
        // Dynamic import enables code splitting - this huge JSON won't be in the main bundle
        const module = await import('../data/nvi.json');
        fullBibleData = module.default;
        return fullBibleData;
    } catch (error) {
        console.error("Failed to load Bible data:", error);
        return [];
    }
};

/**
 * Get all books with metadata
 * @returns {Array} List of all books
 */
export const getBooks = () => {
    return booksData;
};

/**
 * Get a specific book by abbreviation
 * @param {string} abbrev - Book abbreviation
 * @returns {Object|null} Book data or null
 */
export const getBookByAbbrev = (abbrev) => {
    const normalizedAbbrev = abbrev.toLowerCase();
    return booksData.find((b) => b.abbrev.pt === normalizedAbbrev) || null;
};

/**
 * Get book name by abbreviation
 * @param {string} abbrev - Book abbreviation
 * @returns {string} Book name
 */
export const getBookName = (abbrev) => {
    if (!abbrev) return '';
    const book = getBookByAbbrev(abbrev);
    return book ? book.name : abbrev;
};

/**
 * Get all verses of a specific chapter
 * @param {string} abbrev - Book abbreviation
 * @param {number} chapter - Chapter number (1-indexed)
 * @returns {Promise<Object|null>} Chapter data with verses
 */
export const getChapter = async (abbrev, chapter) => {
    await ensureBibleLoaded();

    if (!fullBibleData) return null;

    const normalizedAbbrev = abbrev.toLowerCase();
    const book = fullBibleData.find((b) => b.abbrev.toLowerCase() === normalizedAbbrev);

    if (!book) return null;

    const chapterIndex = chapter - 1;
    if (chapterIndex < 0 || chapterIndex >= book.chapters.length) return null;

    const verses = book.chapters[chapterIndex].map((text, index) => ({
        number: index + 1,
        text: text,
    }));

    const metadata = getBookByAbbrev(normalizedAbbrev);

    return {
        book: {
            abbrev: { pt: normalizedAbbrev, en: normalizedAbbrev },
            name: metadata?.name || normalizedAbbrev,
        },
        chapter: {
            number: chapter,
        },
        verses: verses,
    };
};

/**
 * Get a specific verse
 * @param {string} abbrev - Book abbreviation
 * @param {number} chapter - Chapter number
 * @param {number} verse - Verse number
 * @returns {Promise<Object|null>} Verse data
 */
export const getVerse = async (abbrev, chapter, verse) => {
    const chapterData = await getChapter(abbrev, chapter);
    if (!chapterData) return null;

    const verseData = chapterData.verses.find((v) => v.number === verse);
    if (!verseData) return null;

    return {
        book: chapterData.book,
        chapter: chapter,
        number: verse,
        text: verseData.text,
    };
};

/**
 * Search for verses containing a specific term
 * @param {string} term - Search term
 * @returns {Promise<Object>} Search results with verses
 */
export const searchVerses = async (term) => {
    if (!term || term.trim().length < 2) {
        return { verses: [], occurrence: 0 };
    }

    await ensureBibleLoaded();
    if (!fullBibleData) return { verses: [], occurrence: 0 };

    const normalizedTerm = term.toLowerCase().trim();
    const results = [];

    // Use booksData for metadata lookup for speed
    const metadataMap = new Map(booksData.map(b => [b.abbrev.pt, b]));

    for (const book of fullBibleData) {
        const abbrev = book.abbrev.toLowerCase();
        const metadata = metadataMap.get(abbrev) || { name: abbrev };

        for (let chapterIdx = 0; chapterIdx < book.chapters.length; chapterIdx++) {
            const chapter = book.chapters[chapterIdx];

            for (let verseIdx = 0; verseIdx < chapter.length; verseIdx++) {
                const text = chapter[verseIdx];

                if (text.toLowerCase().includes(normalizedTerm)) {
                    results.push({
                        book: {
                            abbrev: { pt: abbrev, en: abbrev },
                            name: metadata.name,
                        },
                        chapter: chapterIdx + 1,
                        number: verseIdx + 1,
                        text: text,
                    });

                    // Limit results to prevent performance issues
                    if (results.length >= 100) {
                        return { verses: results, occurrence: results.length };
                    }
                }
            }
        }
    }

    return { verses: results, occurrence: results.length };
};

/**
 * Get a random verse
 * @returns {Promise<Object>} Random verse data
 */
export const getRandomVerse = async () => {
    // List of inspirational chapters/verses to pick from randomly
    const inspirationalReferences = [
        { abbrev: 'sl', chapter: 23 },
        { abbrev: 'sl', chapter: 91 },
        { abbrev: 'sl', chapter: 121 },
        { abbrev: 'sl', chapter: 139 },
        { abbrev: 'jo', chapter: 3 },
        { abbrev: 'jo', chapter: 14 },
        { abbrev: 'rm', chapter: 8 },
        { abbrev: 'rm', chapter: 12 },
        { abbrev: '1co', chapter: 13 },
        { abbrev: 'fp', chapter: 4 },
        { abbrev: 'is', chapter: 40 },
        { abbrev: 'is', chapter: 41 },
        { abbrev: 'jr', chapter: 29 },
        { abbrev: 'mt', chapter: 5 },
        { abbrev: 'mt', chapter: 6 },
        { abbrev: 'mt', chapter: 11 },
        { abbrev: 'pv', chapter: 3 },
        { abbrev: 'hb', chapter: 11 },
    ];

    // Pick random reference
    const ref = inspirationalReferences[Math.floor(Math.random() * inspirationalReferences.length)];
    const chapterData = await getChapter(ref.abbrev, ref.chapter);

    if (!chapterData || !chapterData.verses.length) {
        // Fallback to a known good verse
        return {
            book: { abbrev: { pt: 'jo', en: 'jo' }, name: 'João' },
            chapter: 3,
            number: 16,
            text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.',
        };
    }

    // Pick random verse from chapter
    const randomVerse = chapterData.verses[Math.floor(Math.random() * chapterData.verses.length)];

    return {
        book: chapterData.book,
        chapter: chapterData.chapter.number,
        number: randomVerse.number,
        text: randomVerse.text,
    };
};

export default {
    getBooks,
    getBookByAbbrev,
    getBookName,
    getChapter,
    getVerse,
    searchVerses,
    getRandomVerse,
};
