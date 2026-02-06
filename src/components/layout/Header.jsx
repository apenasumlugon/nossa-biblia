import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Search, X, Book, Heart, Home, Menu, ChevronRight } from 'lucide-react';
import { searchVerses } from '../../services/bibleService';
import { useFavorites } from '../../context/FavoritesContext';

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    const { favoritesCount } = useFavorites();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const searchRef = useRef(null);
    const debounceRef = useRef(null);

    // Close search results when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced search
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (searchQuery.trim().length < 3) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        debounceRef.current = setTimeout(() => {
            setIsSearching(true);
            try {
                // Local search - synchronous, instant
                const results = searchVerses(searchQuery.trim());
                setSearchResults(results.verses?.slice(0, 10) || []);
                setShowResults(true);
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300); // Faster debounce since search is local

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [searchQuery]);

    const handleResultClick = (result) => {
        const bookAbbrev = result.book?.abbrev?.pt || result.book?.abbrev;
        navigate(`/book/${bookAbbrev}/${result.chapter}`, {
            state: { highlightVerse: result.number }
        });
        setSearchQuery('');
        setShowResults(false);
        setShowMobileMenu(false);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setShowResults(false);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="sticky top-0 z-50 glass border-b border-white/5">
            <div className="container">
                <div className="flex items-center justify-between h-16 gap-4">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-2 shrink-0 group"
                    >
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center shadow-lg group-hover:shadow-[var(--shadow-glow)] transition-shadow">
                            <Book className="w-5 h-5 text-[var(--color-background)]" />
                        </div>
                        <span className="font-semibold text-lg hidden sm:block gradient-text">
                            Leitor Bíblico
                        </span>
                    </Link>

                    {/* Search Bar - Desktop */}
                    <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar versículos..."
                                className="input pl-10 pr-10 py-2.5 text-sm bg-[var(--color-surface-light)]"
                            />
                            {searchQuery && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Search Results Dropdown */}
                        {showResults && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-surface)] border border-[var(--color-surface-lighter)] rounded-xl shadow-lg overflow-hidden animate-fade-in">
                                {isSearching ? (
                                    <div className="p-4 text-center text-[var(--color-text-muted)] text-sm">
                                        Buscando...
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <ul className="max-h-80 overflow-y-auto">
                                        {searchResults.map((result, index) => (
                                            <li key={index}>
                                                <button
                                                    onClick={() => handleResultClick(result)}
                                                    className="w-full p-3 text-left hover:bg-[var(--color-surface-light)] transition-colors flex items-start gap-3"
                                                >
                                                    <span className="badge badge-primary shrink-0 mt-0.5">
                                                        {result.book?.abbrev?.pt || result.book?.abbrev} {result.chapter}:{result.number}
                                                    </span>
                                                    <span className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
                                                        {result.text}
                                                    </span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="p-4 text-center text-[var(--color-text-muted)] text-sm">
                                        Nenhum resultado encontrado
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Navigation - Desktop */}
                    <nav className="hidden md:flex items-center gap-1">
                        <Link
                            to="/"
                            className={`btn btn-ghost ${isActive('/') ? 'bg-[var(--color-surface)] text-[var(--color-primary)]' : ''}`}
                        >
                            <Home className="w-4 h-4" />
                            Início
                        </Link>
                        <Link
                            to="/favorites"
                            className={`btn btn-ghost relative ${isActive('/favorites') ? 'bg-[var(--color-surface)] text-[var(--color-primary)]' : ''}`}
                        >
                            <Heart className="w-4 h-4" />
                            Favoritos
                            {favoritesCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-primary)] text-[var(--color-background)] text-xs font-bold rounded-full flex items-center justify-center">
                                    {favoritesCount > 99 ? '99+' : favoritesCount}
                                </span>
                            )}
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="btn btn-ghost btn-icon md:hidden"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>

                {/* Mobile Menu */}
                {showMobileMenu && (
                    <div className="md:hidden pb-4 animate-fade-in">
                        {/* Mobile Search */}
                        <div className="relative mb-3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar versículos..."
                                className="input pl-10 pr-10 py-2.5 text-sm"
                            />
                            {searchQuery && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Mobile Search Results */}
                        {showResults && searchResults.length > 0 && (
                            <ul className="mb-3 bg-[var(--color-surface-light)] rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                                {searchResults.map((result, index) => (
                                    <li key={index}>
                                        <button
                                            onClick={() => handleResultClick(result)}
                                            className="w-full p-3 text-left hover:bg-[var(--color-surface-lighter)] transition-colors flex items-center gap-2"
                                        >
                                            <span className="badge badge-primary shrink-0">
                                                {result.book?.abbrev?.pt} {result.chapter}:{result.number}
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)] ml-auto shrink-0" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Mobile Nav Links */}
                        <nav className="flex flex-col gap-1">
                            <Link
                                to="/"
                                onClick={() => setShowMobileMenu(false)}
                                className={`btn justify-start ${isActive('/') ? 'btn-secondary' : 'btn-ghost'}`}
                            >
                                <Home className="w-4 h-4" />
                                Início
                            </Link>
                            <Link
                                to="/favorites"
                                onClick={() => setShowMobileMenu(false)}
                                className={`btn justify-start relative ${isActive('/favorites') ? 'btn-secondary' : 'btn-ghost'}`}
                            >
                                <Heart className="w-4 h-4" />
                                Meus Favoritos
                                {favoritesCount > 0 && (
                                    <span className="ml-auto badge badge-primary">
                                        {favoritesCount}
                                    </span>
                                )}
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
