import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';
import { Search, X, Book, Heart, Home, Menu, ChevronRight, ChevronDown, User, LogIn } from 'lucide-react';
import { searchVerses, getBookByAbbrev } from '../../services/bibleService';
import { useFavorites } from '../../context/FavoritesContext';
import { supabase } from '../../services/supabaseClient';

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const { abbrev, chapter } = useParams();

    const { favoritesCount } = useFavorites();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showChapterSelect, setShowChapterSelect] = useState(false);
    const [user, setUser] = useState(null);

    const searchRef = useRef(null);
    const debounceRef = useRef(null);
    const chapterSelectRef = useRef(null);

    const currentBook = abbrev ? getBookByAbbrev(abbrev) : null;
    const currentChapter = chapter ? parseInt(chapter) : null;

    const isHome = location.pathname === '/';

    useEffect(() => {
        if (!supabase) return;
        supabase.auth.getUser().then(({ data: { user } }) => setUser(user));

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Close search results and chapter select when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
            if (chapterSelectRef.current && !chapterSelectRef.current.contains(event.target)) {
                setShowChapterSelect(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced search logic (unchanged)
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (searchQuery.trim().length < 3) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }
        debounceRef.current = setTimeout(() => {
            setIsSearching(true);
            try {
                const results = searchVerses(searchQuery.trim());
                setSearchResults(results.verses?.slice(0, 10) || []);
                setShowResults(true);
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
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

    const handleChapterSelect = (newChapter) => {
        navigate(`/book/${abbrev}/${newChapter}`);
        setShowChapterSelect(false);
    }

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setShowResults(false);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className={`sticky top-0 z-50 transition-colors duration-300 ${isHome ? 'bg-[var(--color-background)]/80 backdrop-blur-md border-b-0' : 'glass border-b border-white/5'}`}>
            <div className="container">
                <div className="flex items-center justify-between h-16 gap-4">
                    {/* Left: Logo/Home or Chapter Selector */}
                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            className="flex items-center gap-2 shrink-0 group"
                        >
                            {/* Only show logo icon on home to keep it minimal, or always show if reading */}
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] flex items-center justify-center shadow-lg transition-transform group-active:scale-95 ${isHome ? 'opacity-100' : 'opacity-100'}`}>
                                <Book className="w-4 h-4 text-[#000]" strokeWidth={2.5} />
                            </div>

                            {/* Hide text on home for extreme minimalism if desired, or keep small */}
                            {!isHome && (
                                <span className="font-semibold text-lg hidden sm:block text-[var(--color-text)] tracking-tight">
                                    Leitor
                                </span>
                            )}
                        </Link>

                        {/* Chapter Selector (Reading Mode) */}
                        {currentBook && currentChapter && (
                            <div className="relative ml-0 sm:ml-2" ref={chapterSelectRef}>
                                <button
                                    onClick={() => setShowChapterSelect(!showChapterSelect)}
                                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[var(--color-surface-light)] hover:bg-[var(--color-surface-lighter)] transition-colors text-sm font-semibold text-[var(--color-text)]"
                                >
                                    <span className="truncate max-w-[120px] sm:max-w-none">
                                        {currentBook.name} {currentChapter}
                                    </span>
                                    <ChevronDown className="w-3 h-3 text-[var(--color-text-secondary)]" />
                                </button>

                                {showChapterSelect && (
                                    <div className="absolute top-full left-0 mt-2 w-72 bg-[var(--color-surface)] border border-[var(--color-surface-lighter)] rounded-2xl shadow-2xl p-4 animate-fade-in max-h-96 overflow-y-auto z-50">
                                        <div className="grid grid-cols-5 gap-2">
                                            {Array.from({ length: currentBook.chapters }, (_, i) => i + 1).map(c => (
                                                <button
                                                    key={c}
                                                    onClick={() => handleChapterSelect(c)}
                                                    className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all ${c === currentChapter ? 'bg-[var(--color-primary)] text-[#000] shadow-glow' : 'bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-lighter)] hover:text-[var(--color-text)]'}`}
                                                >
                                                    {c}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Center/Right: Search Bar */}
                    <div ref={searchRef} className="relative flex-1 max-w-sm hidden md:block">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-primary)] transition-colors" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar..."
                                className="input pl-10 pr-10 py-2 text-sm bg-[var(--color-surface-light)] border-transparent focus:bg-[var(--color-surface-lighter)] rounded-full"
                            />
                            {searchQuery && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        {/* Search Results Dropdown (Same as before) */}
                        {showResults && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-surface)] border border-[var(--color-surface-lighter)] rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
                                {isSearching ? (
                                    <div className="p-4 text-center text-[var(--color-text-muted)] text-sm">Buscando...</div>
                                ) : searchResults.length > 0 ? (
                                    <ul className="max-h-80 overflow-y-auto">
                                        {searchResults.map((result, index) => (
                                            <li key={index}>
                                                <button onClick={() => handleResultClick(result)} className="w-full p-3 text-left hover:bg-[var(--color-surface-light)] transition-colors flex items-start gap-3 border-b border-[var(--color-surface-lighter)] last:border-0">
                                                    <span className="text-xs font-bold text-[var(--color-primary)] shrink-0 mt-0.5 uppercase tracking-wide">
                                                        {result.book?.abbrev?.pt} {result.chapter}:{result.number}
                                                    </span>
                                                    <span className="text-sm text-[var(--color-text-secondary)] line-clamp-2">{result.text}</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="p-4 text-center text-[var(--color-text-muted)] text-sm">Nenhum resultado</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right: Navigation - Desktop */}
                    <nav className="hidden md:flex items-center gap-2">
                        <Link to="/favorites" className="btn btn-ghost btn-icon relative group">
                            <Heart className="w-5 h-5 text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] transition-colors" />
                            {favoritesCount > 0 && (
                                <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-primary)] rounded-full"></span>
                            )}
                        </Link>
                        {user ? (
                            <Link to="/profile" className="btn btn-ghost btn-icon relative group">
                                <User className="w-5 h-5 text-[var(--color-primary)]" />
                            </Link>
                        ) : (
                            <Link to="/login" className="btn btn-ghost btn-icon relative group">
                                <LogIn className="w-5 h-5 text-[var(--color-text-secondary)]" />
                            </Link>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="btn btn-ghost btn-icon md:hidden"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                {/* Mobile Menu */}
                {showMobileMenu && (
                    <div className="md:hidden pb-4 animate-fade-in">
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar..."
                                className="input pl-10 rounded-full bg-[var(--color-surface-light)]"
                            />
                        </div>

                        {/* Mobile Search Results (simplified) */}
                        {showResults && searchResults.length > 0 && (
                            <ul className="mb-4 bg-[var(--color-surface)] rounded-2xl overflow-hidden shadow-lg max-h-60 overflow-y-auto border border-[var(--color-surface-lighter)]">
                                {searchResults.map((result, index) => (
                                    <li key={index}>
                                        <button onClick={() => handleResultClick(result)} className="w-full p-4 text-left hover:bg-[var(--color-surface-light)] border-b border-[var(--color-surface-lighter)] last:border-0">
                                            <div className="text-xs font-bold text-[var(--color-primary)] mb-1 uppercase tracking-wide">
                                                {result.book?.abbrev?.pt} {result.chapter}:{result.number}
                                            </div>
                                            <div className="text-sm text-[var(--color-text-secondary)] line-clamp-2">{result.text}</div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <nav className="flex flex-col gap-2">
                            {user ? (
                                <Link to="/profile" onClick={() => setShowMobileMenu(false)} className={`flex items-center gap-3 p-3 rounded-xl ${isActive('/profile') ? 'bg-[var(--color-surface-light)] text-[var(--color-text)]' : 'text-[var(--color-text-secondary)]'}`}>
                                    <User className="w-5 h-5" />
                                    <span className="font-medium">Meu Perfil</span>
                                </Link>
                            ) : (
                                <Link to="/login" onClick={() => setShowMobileMenu(false)} className={`flex items-center gap-3 p-3 rounded-xl ${isActive('/login') ? 'bg-[var(--color-surface-light)] text-[var(--color-text)]' : 'text-[var(--color-text-secondary)]'}`}>
                                    <LogIn className="w-5 h-5" />
                                    <span className="font-medium">Entrar / Conectar</span>
                                </Link>
                            )}
                            <Link to="/" onClick={() => setShowMobileMenu(false)} className={`flex items-center gap-3 p-3 rounded-xl ${isActive('/') ? 'bg-[var(--color-surface-light)] text-[var(--color-text)]' : 'text-[var(--color-text-secondary)]'}`}>
                                <Home className="w-5 h-5" />
                                <span className="font-medium">Início</span>
                            </Link>
                            <Link to="/favorites" onClick={() => setShowMobileMenu(false)} className={`flex items-center gap-3 p-3 rounded-xl ${isActive('/favorites') ? 'bg-[var(--color-surface-light)] text-[var(--color-text)]' : 'text-[var(--color-text-secondary)]'}`}>
                                <Heart className="w-5 h-5" />
                                <span className="font-medium">Meus Favoritos</span>
                                {favoritesCount > 0 && <span className="ml-auto text-xs font-bold bg-[var(--color-surface-lighter)] px-2 py-0.5 rounded-full">{favoritesCount}</span>}
                            </Link>
                            <div className="mt-4 px-3 text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest text-center opacity-50">
                                Versão 2.2 • Offline Ready
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
