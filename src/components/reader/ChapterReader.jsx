import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronRight,
    Settings,
    Minus,
    Plus
} from 'lucide-react';
import { getChapter } from '../../services/bibleService';
import { useBible } from '../../context/BibleContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useHighlights } from '../../context/HighlightsContext';
import SkeletonLoader from '../ui/SkeletonLoader';
import VerseMenu from './VerseMenu';

export default function ChapterReader() {
    const { abbrev, chapter } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { getBookByAbbrev, getBookName } = useBible();
    const { isFavorite, toggleFavorite } = useFavorites();
    const { addHighlight, removeHighlight, getHighlight } = useHighlights();

    const [fontSize, setFontSize] = useState(() => {
        const saved = localStorage.getItem('bible-font-size');
        return saved ? parseInt(saved) : 18;
    });
    const [showSettings, setShowSettings] = useState(false);

    // Verse Menu State
    const [selectedVerse, setSelectedVerse] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const contentRef = useRef(null);
    const highlightVerse = location.state?.highlightVerse;

    const chapterNum = parseInt(chapter);
    const book = getBookByAbbrev(abbrev);

    const [chapterData, setChapterData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch chapter data asynchronously
    useEffect(() => {
        let mounted = true;
        setLoading(true);

        getChapter(abbrev, chapterNum)
            .then((data) => {
                if (mounted) {
                    setChapterData(data);
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.error("Error fetching chapter:", err);
                if (mounted) {
                    setChapterData(null);
                    setLoading(false);
                }
            });

        return () => {
            mounted = false;
        };
    }, [abbrev, chapterNum]);

    // Scroll to highlighted verse
    useEffect(() => {
        if (highlightVerse && !loading && chapterData) {
            setTimeout(() => {
                const verseElement = document.getElementById(`verse-${highlightVerse}`);
                if (verseElement) {
                    verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    verseElement.classList.add('animate-pulse-glow');
                    setTimeout(() => {
                        verseElement.classList.remove('animate-pulse-glow');
                    }, 3000);
                }
            }, 100);
        }
    }, [highlightVerse, loading, chapterData]);

    // Save font size preference
    useEffect(() => {
        localStorage.setItem('bible-font-size', fontSize.toString());
    }, [fontSize]);

    const handlePreviousChapter = () => {
        if (chapterNum > 1) {
            navigate(`/book/${abbrev}/${chapterNum - 1}`);
        } else {
            navigate(`/book/${abbrev}`);
        }
    };

    const handleNextChapter = () => {
        if (book && chapterNum < book.chapters) {
            navigate(`/book/${abbrev}/${chapterNum + 1}`);
        } else {
            navigate(`/book/${abbrev}`);
        }
    };

    const handleVerseClick = (verse) => {
        setSelectedVerse(verse);
        setIsMenuOpen(true);
    };

    const handleHighlight = (color) => {
        if (!selectedVerse) return;

        if (color) {
            addHighlight(abbrev, chapterNum, selectedVerse.number, color);
        } else {
            removeHighlight(abbrev, chapterNum, selectedVerse.number);
        }
    };

    const handleToggleFavorite = () => {
        if (!selectedVerse) return;
        toggleFavorite({
            bookAbbrev: abbrev,
            bookName: getBookName(abbrev),
            chapter: chapterNum,
            number: selectedVerse.number,
            text: selectedVerse.text,
        });
    };

    const adjustFontSize = (delta) => {
        setFontSize((prev) => Math.min(28, Math.max(14, prev + delta)));
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4">
                <SkeletonLoader variant="title" className="mb-6" />
                <div className="space-y-4">
                    <SkeletonLoader variant="verse" count={8} />
                </div>
            </div>
        );
    }

    if (!chapterData) {
        return (
            <div className="max-w-4xl mx-auto text-center py-12 px-4">
                <h2 className="text-xl font-bold text-[var(--color-text)] mb-2">
                    Capítulo não encontrado
                </h2>
                <Link
                    to={`/book/${abbrev}`}
                    className="btn btn-primary inline-flex items-center gap-2"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Voltar para {getBookName(abbrev)}
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-fade-in px-2 sm:px-6">
            {/* Header with Title and Settings */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--color-surface-lighter)]">
                <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)] tracking-tight">
                    {getBookName(abbrev)} {chapterNum}
                </h1>

                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`btn btn-ghost btn-icon ${showSettings ? 'bg-[var(--color-surface)]' : ''}`}
                    title="Configurações de leitura"
                >
                    <Settings className="w-5 h-5" />
                </button>
            </div>

            {/* Settings Panel */}
            {showSettings && (
                <div className="card p-4 mb-8 animate-fade-in">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--color-text-secondary)]">
                            Tamanho da fonte
                        </span>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => adjustFontSize(-2)}
                                className="btn btn-ghost btn-icon"
                                disabled={fontSize <= 14}
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-medium min-w-[30px] text-center">{fontSize}px</span>
                            <button
                                onClick={() => adjustFontSize(2)}
                                className="btn btn-ghost btn-icon"
                                disabled={fontSize >= 28}
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Verses Content - Improved Typography and Spacing */}
            <div
                ref={contentRef}
                className="mb-8"
            >
                <div>
                    {/* 
                       Using a continuous flow but with span wrapping for interactivity 
                       We mimic YouVersion's style where verses flow together but are distinct click targets
                     */}
                    {chapterData?.verses?.map((verse) => {
                        const highlight = getHighlight(abbrev, chapterNum, verse.number);
                        const isFav = isFavorite(abbrev, chapterNum, verse.number);

                        return (
                            <span
                                key={verse.number}
                                id={`verse-${verse.number}`}
                                onClick={() => handleVerseClick(verse)}
                                className="verse-container hover:bg-[var(--color-surface-light)] transition-colors rounded decoration-clone box-decoration-clone px-1 -mx-1"
                                style={{
                                    backgroundColor: highlight ? `var(--highlight-${highlight.color})` : 'transparent',
                                    borderBottom: isFav ? '1px dashed var(--color-primary)' : 'none'
                                }}
                            >
                                <sup
                                    className="verse-number font-bold text-[var(--color-text-muted)] mr-1 select-none"
                                    style={{ fontSize: `${fontSize * 0.6}px` }}
                                >
                                    {verse.number}
                                </sup>
                                <span
                                    className="font-reading text-[var(--color-text)] leading-relaxed"
                                    style={{
                                        fontSize: `${fontSize}px`,
                                        lineHeight: 1.8
                                    }}
                                >
                                    {verse.text}{' '}
                                </span>
                            </span>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-[var(--color-surface-lighter)]">
                <button
                    onClick={handlePreviousChapter}
                    disabled={chapterNum <= 1}
                    className="btn btn-secondary flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed justify-center"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Anterior</span>
                </button>

                <Link
                    to={`/book/${abbrev}`}
                    className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                >
                    Voltar aos Capítulos
                </Link>

                <button
                    onClick={handleNextChapter}
                    disabled={!book || chapterNum >= book.chapters}
                    className="btn btn-primary flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed justify-center"
                >
                    <span className="hidden sm:inline">Próximo</span>
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* Verse Menu Portal */}
            <VerseMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                verse={selectedVerse}
                bookName={getBookName(abbrev)}
                chapterNumber={chapterNum}
                onHighlight={handleHighlight}
                onFavorite={handleToggleFavorite}
                isFavorite={selectedVerse && isFavorite(abbrev, chapterNum, selectedVerse.number)}
            />
        </div>
    );
}
