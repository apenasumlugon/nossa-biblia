// Local Bible Data Service - 100% Offline
// Uses the pt_nvi.json file from thiagobodruk/bible repository

import bibleData from '../data/nvi.json';

// Book metadata with Portuguese names and additional info
const bookMetadata = {
    gn: { name: "Gênesis", testament: "VT", author: "Moisés", group: "Pentateuco" },
    ex: { name: "Êxodo", testament: "VT", author: "Moisés", group: "Pentateuco" },
    lv: { name: "Levítico", testament: "VT", author: "Moisés", group: "Pentateuco" },
    nm: { name: "Números", testament: "VT", author: "Moisés", group: "Pentateuco" },
    dt: { name: "Deuteronômio", testament: "VT", author: "Moisés", group: "Pentateuco" },
    js: { name: "Josué", testament: "VT", author: "Josué", group: "Históricos" },
    jz: { name: "Juízes", testament: "VT", author: "Samuel", group: "Históricos" },
    rt: { name: "Rute", testament: "VT", author: "Samuel", group: "Históricos" },
    "1sm": { name: "1 Samuel", testament: "VT", author: "Samuel", group: "Históricos" },
    "2sm": { name: "2 Samuel", testament: "VT", author: "Samuel", group: "Históricos" },
    "1rs": { name: "1 Reis", testament: "VT", author: "Jeremias", group: "Históricos" },
    "2rs": { name: "2 Reis", testament: "VT", author: "Jeremias", group: "Históricos" },
    "1cr": { name: "1 Crônicas", testament: "VT", author: "Esdras", group: "Históricos" },
    "2cr": { name: "2 Crônicas", testament: "VT", author: "Esdras", group: "Históricos" },
    ed: { name: "Esdras", testament: "VT", author: "Esdras", group: "Históricos" },
    ne: { name: "Neemias", testament: "VT", author: "Neemias", group: "Históricos" },
    et: { name: "Ester", testament: "VT", author: "Desconhecido", group: "Históricos" },
    jó: { name: "Jó", testament: "VT", author: "Desconhecido", group: "Poéticos" },
    job: { name: "Jó", testament: "VT", author: "Desconhecido", group: "Poéticos" },
    sl: { name: "Salmos", testament: "VT", author: "Davi e outros", group: "Poéticos" },
    pv: { name: "Provérbios", testament: "VT", author: "Salomão", group: "Poéticos" },
    ec: { name: "Eclesiastes", testament: "VT", author: "Salomão", group: "Poéticos" },
    ct: { name: "Cânticos", testament: "VT", author: "Salomão", group: "Poéticos" },
    is: { name: "Isaías", testament: "VT", author: "Isaías", group: "Profetas Maiores" },
    jr: { name: "Jeremias", testament: "VT", author: "Jeremias", group: "Profetas Maiores" },
    lm: { name: "Lamentações", testament: "VT", author: "Jeremias", group: "Profetas Maiores" },
    ez: { name: "Ezequiel", testament: "VT", author: "Ezequiel", group: "Profetas Maiores" },
    dn: { name: "Daniel", testament: "VT", author: "Daniel", group: "Profetas Maiores" },
    os: { name: "Oséias", testament: "VT", author: "Oséias", group: "Profetas Menores" },
    jl: { name: "Joel", testament: "VT", author: "Joel", group: "Profetas Menores" },
    am: { name: "Amós", testament: "VT", author: "Amós", group: "Profetas Menores" },
    ob: { name: "Obadias", testament: "VT", author: "Obadias", group: "Profetas Menores" },
    jn: { name: "Jonas", testament: "VT", author: "Jonas", group: "Profetas Menores" },
    mq: { name: "Miqueias", testament: "VT", author: "Miqueias", group: "Profetas Menores" },
    na: { name: "Naum", testament: "VT", author: "Naum", group: "Profetas Menores" },
    hc: { name: "Habacuque", testament: "VT", author: "Habacuque", group: "Profetas Menores" },
    sf: { name: "Sofonias", testament: "VT", author: "Sofonias", group: "Profetas Menores" },
    ag: { name: "Ageu", testament: "VT", author: "Ageu", group: "Profetas Menores" },
    zc: { name: "Zacarias", testament: "VT", author: "Zacarias", group: "Profetas Menores" },
    ml: { name: "Malaquias", testament: "VT", author: "Malaquias", group: "Profetas Menores" },
    mt: { name: "Mateus", testament: "NT", author: "Mateus", group: "Evangelhos" },
    mc: { name: "Marcos", testament: "NT", author: "Marcos", group: "Evangelhos" },
    lc: { name: "Lucas", testament: "NT", author: "Lucas", group: "Evangelhos" },
    jo: { name: "João", testament: "NT", author: "João", group: "Evangelhos" },
    at: { name: "Atos", testament: "NT", author: "Lucas", group: "Histórico" },
    rm: { name: "Romanos", testament: "NT", author: "Paulo", group: "Cartas Paulinas" },
    "1co": { name: "1 Coríntios", testament: "NT", author: "Paulo", group: "Cartas Paulinas" },
    "2co": { name: "2 Coríntios", testament: "NT", author: "Paulo", group: "Cartas Paulinas" },
    gl: { name: "Gálatas", testament: "NT", author: "Paulo", group: "Cartas Paulinas" },
    ef: { name: "Efésios", testament: "NT", author: "Paulo", group: "Cartas Paulinas" },
    fp: { name: "Filipenses", testament: "NT", author: "Paulo", group: "Cartas Paulinas" },
    cl: { name: "Colossenses", testament: "NT", author: "Paulo", group: "Cartas Paulinas" },
    "1ts": { name: "1 Tessalonicenses", testament: "NT", author: "Paulo", group: "Cartas Paulinas" },
    "2ts": { name: "2 Tessalonicenses", testament: "NT", author: "Paulo", group: "Cartas Paulinas" },
    "1tm": { name: "1 Timóteo", testament: "NT", author: "Paulo", group: "Cartas Paulinas" },
    "2tm": { name: "2 Timóteo", testament: "NT", author: "Paulo", group: "Cartas Paulinas" },
    tt: { name: "Tito", testament: "NT", author: "Paulo", group: "Cartas Paulinas" },
    fm: { name: "Filemom", testament: "NT", author: "Paulo", group: "Cartas Paulinas" },
    hb: { name: "Hebreus", testament: "NT", author: "Desconhecido", group: "Cartas Gerais" },
    tg: { name: "Tiago", testament: "NT", author: "Tiago", group: "Cartas Gerais" },
    "1pe": { name: "1 Pedro", testament: "NT", author: "Pedro", group: "Cartas Gerais" },
    "2pe": { name: "2 Pedro", testament: "NT", author: "Pedro", group: "Cartas Gerais" },
    "1jo": { name: "1 João", testament: "NT", author: "João", group: "Cartas Gerais" },
    "2jo": { name: "2 João", testament: "NT", author: "João", group: "Cartas Gerais" },
    "3jo": { name: "3 João", testament: "NT", author: "João", group: "Cartas Gerais" },
    jd: { name: "Judas", testament: "NT", author: "Judas", group: "Cartas Gerais" },
    ap: { name: "Apocalipse", testament: "NT", author: "João", group: "Profético" },
};

/**
 * Get all books with metadata
 * @returns {Array} List of all books
 */
export const getBooks = () => {
    return bibleData.map((book) => {
        const abbrev = book.abbrev.toLowerCase();
        const metadata = bookMetadata[abbrev] || {
            name: book.name || abbrev,
            testament: "VT",
            author: "Desconhecido",
            group: "Outros"
        };

        return {
            abbrev: { pt: abbrev, en: abbrev },
            name: metadata.name,
            chapters: book.chapters.length,
            testament: metadata.testament,
            author: metadata.author,
            group: metadata.group,
        };
    });
};

/**
 * Get a specific book by abbreviation
 * @param {string} abbrev - Book abbreviation
 * @returns {Object|null} Book data or null
 */
export const getBookByAbbrev = (abbrev) => {
    const normalizedAbbrev = abbrev.toLowerCase();
    const book = bibleData.find((b) => b.abbrev.toLowerCase() === normalizedAbbrev);

    if (!book) return null;

    const metadata = bookMetadata[normalizedAbbrev] || {
        name: book.name || normalizedAbbrev,
        testament: "VT",
        author: "Desconhecido",
        group: "Outros"
    };

    return {
        abbrev: { pt: normalizedAbbrev, en: normalizedAbbrev },
        name: metadata.name,
        chapters: book.chapters.length,
        testament: metadata.testament,
        author: metadata.author,
        group: metadata.group,
    };
};

/**
 * Get book name by abbreviation
 * @param {string} abbrev - Book abbreviation
 * @returns {string} Book name
 */
export const getBookName = (abbrev) => {
    if (!abbrev) return '';
    const normalizedAbbrev = abbrev.toLowerCase();
    const metadata = bookMetadata[normalizedAbbrev];
    return metadata?.name || abbrev;
};

/**
 * Get all verses of a specific chapter
 * @param {string} abbrev - Book abbreviation
 * @param {number} chapter - Chapter number (1-indexed)
 * @returns {Object|null} Chapter data with verses
 */
export const getChapter = (abbrev, chapter) => {
    const normalizedAbbrev = abbrev.toLowerCase();
    const book = bibleData.find((b) => b.abbrev.toLowerCase() === normalizedAbbrev);

    if (!book) return null;

    const chapterIndex = chapter - 1;
    if (chapterIndex < 0 || chapterIndex >= book.chapters.length) return null;

    const verses = book.chapters[chapterIndex].map((text, index) => ({
        number: index + 1,
        text: text,
    }));

    const metadata = bookMetadata[normalizedAbbrev] || { name: normalizedAbbrev };

    return {
        book: {
            abbrev: { pt: normalizedAbbrev, en: normalizedAbbrev },
            name: metadata.name,
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
 * @returns {Object|null} Verse data
 */
export const getVerse = (abbrev, chapter, verse) => {
    const chapterData = getChapter(abbrev, chapter);
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
 * @returns {Object} Search results with verses
 */
export const searchVerses = (term) => {
    if (!term || term.trim().length < 2) {
        return { verses: [], occurrence: 0 };
    }

    const normalizedTerm = term.toLowerCase().trim();
    const results = [];

    for (const book of bibleData) {
        const abbrev = book.abbrev.toLowerCase();
        const metadata = bookMetadata[abbrev] || { name: abbrev };

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
 * @returns {Object} Random verse data
 */
export const getRandomVerse = () => {
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
    const chapterData = getChapter(ref.abbrev, ref.chapter);

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
