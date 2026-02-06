import { createContext, useContext, useState, useEffect } from 'react';
import { getBooks, getBookByAbbrev as getBookByAbbrevService, getBookName as getBookNameService } from '../services/bibleService';

const BibleContext = createContext();

export function BibleProvider({ children }) {
    const [books, setBooks] = useState([]);
    const [oldTestament, setOldTestament] = useState([]);
    const [newTestament, setNewTestament] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load books from local data - instant, no API needed
        try {
            const allBooks = getBooks();
            setBooks(allBooks);
            setOldTestament(allBooks.filter((book) => book.testament === 'VT'));
            setNewTestament(allBooks.filter((book) => book.testament === 'NT'));
        } catch (err) {
            console.error('Error loading Bible data:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getBookByAbbrev = (abbrev) => {
        return getBookByAbbrevService(abbrev);
    };

    const getBookName = (abbrev) => {
        return getBookNameService(abbrev);
    };

    return (
        <BibleContext.Provider
            value={{
                books,
                oldTestament,
                newTestament,
                loading,
                getBookByAbbrev,
                getBookName,
            }}
        >
            {children}
        </BibleContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBible() {
    const context = useContext(BibleContext);
    if (!context) {
        throw new Error('useBible must be used within a BibleProvider');
    }
    return context;
}
