import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronRight,
    Heart,
    BookOpen,
    Share2,
    Settings,
    Minus,
    Plus
} from 'lucide-react';
import { getChapter } from '../../services/bibleService';
import { useBible } from '../../context/BibleContext';
import { useFavorites } from '../../context/FavoritesContext';
import SkeletonLoader from '../ui/SkeletonLoader';

export default function ChapterReader() {
    const { abbrev, chapter } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { getBookByAbbrev, getBookName } = useBible();
    const { isFavorite, toggleFavorite } = useFavorites();

    const [fontSize, setFontSize] = useState(() => {
        const saved = localStorage.getItem('bible-font-size');
        return saved ? parseInt(saved) : 18;
    });
    const [showSettings, setShowSettings] = useState(false);

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

    const handleToggleFavorite = (verse) => {
        toggleFavorite({
            bookAbbrev: abbrev,
            bookName: getBookName(abbrev),
            chapter: chapterNum,
            number: verse.number,
            text: verse.text,
        });
    };

    const handleShare = async () => {
        const url = window.location.href;
        const text = `${getBookName(abbrev)} ${chapterNum} - Leitor Bíblico`;

        if (navigator.share) {
            try {
                await navigator.share({ title: text, url });
            } catch {
                // User cancelled or error
            }
        } else {
            navigator.clipboard.writeText(url);
            alert('Link copiado para a área de transferência!');
        }
    };

    const adjustFontSize = (delta) => {
        setFontSize((prev) => Math.min(28, Math.max(14, prev + delta)));
    };

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto">
                <SkeletonLoader variant="title" className="mb-6" />
                <div className="space-y-4">
                    <SkeletonLoader variant="verse" count={8} />
                </div>
            </div>
        );
    }

    if (!chapterData) {
        return (
            <div className="max-w-3xl mx-auto text-center py-12">
                <BookOpen className="w-16 h-16 text-[var(--color-text-muted)] mx-auto mb-4" />
                <h2 className="text-xl font-bold text-[var(--color-text)] mb-2">
                    Capítulo não encontrado
                </h2>
                <p className="text-[var(--color-text-secondary)] mb-6">
                    O capítulo {chapterNum} de {getBookName(abbrev)} não foi encontrado.
                </p>
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
        <div className="max-w-3xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <Link
                    to={`/book/${abbrev}`}
                    className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-sm hidden sm:inline">Capítulos</span>
                </Link>

                <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[var(--color-primary)]" />
                    <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text)]">
                        {getBookName(abbrev)} {chapterNum}
                    </h1>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={`btn btn-ghost btn-icon ${showSettings ? 'bg-[var(--color-surface)]' : ''}`}
                        title="Configurações de leitura"
                    >
                        <Settings className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleShare}
                        className="btn btn-ghost btn-icon"
                        title="Compartilhar"
                    >
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
                <div className="card p-4 mb-6 animate-fade-in">
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
                            <span className="text-sm font-medium w-8 text-center">{fontSize}</span>
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

            {/* Verses Content */}
            <div
                ref={contentRef}
                className="card p-6 sm:p-8 mb-6"
            >
                <div className="space-y-1">
                    {chapterData?.verses?.map((verse) => (
                        <div
                            key={verse.number}
                            id={`verse-${verse.number}`}
                            className="group relative py-2 px-1 -mx-1 rounded-lg hover:bg-[var(--color-surface-light)] transition-colors"
                        >
                            <span
                                className="font-reading leading-relaxed text-[var(--color-text)]"
                                style={{ fontSize: `${fontSize}px`, lineHeight: 1.9 }}
                            >
                                <sup className="verse-number">{verse.number}</sup>
                                {verse.text}
                            </span>

                            {/* Actions container */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-[var(--color-surface)]/80 backdrop-blur-sm pl-2 pr-1 rounded-full py-1">
                                {/* Favorite Button */}
                                <button
                                    onClick={() => handleToggleFavorite(verse)}
                                    className={`p-1.5 rounded-full transition-colors ${isFavorite(abbrev, chapterNum, verse.number)
                                        ? 'text-[var(--color-primary)]'
                                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)]'
                                        }`}
                                    title={isFavorite(abbrev, chapterNum, verse.number) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                                >
                                    <Heart
                                        className="w-5 h-5"
                                        fill={isFavorite(abbrev, chapterNum, verse.number) ? 'currentColor' : 'none'}
                                    />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4">
                <button
                    onClick={handlePreviousChapter}
                    disabled={chapterNum <= 1}
                    className="btn btn-secondary flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Capítulo</span> Anterior
                </button>

                <span className="text-sm text-[var(--color-text-muted)]">
                    {chapterNum} / {book?.chapters || '?'}
                </span>

                <button
                    onClick={handleNextChapter}
                    disabled={!book || chapterNum >= book.chapters}
                    className="btn btn-primary flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Próximo <span className="hidden sm:inline">Capítulo</span>
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
