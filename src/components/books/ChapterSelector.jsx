import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, BookOpen } from 'lucide-react';
import { useBible } from '../../context/BibleContext';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';

export default function ChapterSelector() {
    const { abbrev } = useParams();
    const navigate = useNavigate();
    const { getBookByAbbrev, loading, error } = useBible();

    // Derive book directly from context/params to avoid useEffect state updates
    const book = getBookByAbbrev(abbrev);

    useEffect(() => {
        if (!book && !loading && !error) {
            // Book not found, redirect to home
            navigate('/', { replace: true });
        }
    }, [book, loading, error, navigate]);

    if (loading) {
        return <LoadingSpinner text="Carregando..." />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    if (!book) {
        return <LoadingSpinner text="Carregando livro..." />;
    }

    const chapters = Array.from({ length: book.chapters }, (_, i) => i + 1);

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="mb-6">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors mb-4"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-sm">Voltar aos livros</span>
                </Link>

                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary)]/5 flex items-center justify-center">
                        <BookOpen className="w-7 h-7 text-[var(--color-primary)]" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)]">
                            {book.name}
                        </h1>
                        <p className="text-[var(--color-text-secondary)]">
                            Selecione um capítulo para ler
                        </p>
                    </div>
                </div>
            </div>

            {/* Book Info */}
            <div className="card p-4 mb-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold text-[var(--color-primary)]">{book.chapters}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">Capítulos</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-[var(--color-text)]">
                            {book.testament === 'VT' ? 'Antigo' : 'Novo'}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">Testamento</p>
                    </div>
                    <div className="col-span-2 sm:col-span-2">
                        <p className="text-lg font-medium text-[var(--color-text-secondary)]">
                            {book.author || 'Autor desconhecido'}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">Autor</p>
                    </div>
                </div>
            </div>

            {/* Chapter Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                {chapters.map((chapter, index) => (
                    <Link
                        key={chapter}
                        to={`/book/${abbrev}/${chapter}`}
                        className="aspect-square rounded-xl bg-[var(--color-surface)] border border-[var(--color-surface-lighter)] flex items-center justify-center font-medium text-[var(--color-text)] hover:bg-[var(--color-primary)] hover:text-[var(--color-background)] hover:border-[var(--color-primary)] transition-all hover:scale-105 hover:shadow-lg animate-fade-in"
                        style={{ animationDelay: `${index * 20}ms` }}
                    >
                        {chapter}
                    </Link>
                ))}
            </div>
        </div>
    );
}
