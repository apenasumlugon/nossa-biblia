import { Link } from 'react-router-dom';
import { ChevronRight, BookOpen, ScrollText } from 'lucide-react';
import { useBible } from '../../context/BibleContext';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';

export default function BookList() {
    const { oldTestament, newTestament, loading, error, refetch } = useBible();

    if (loading) {
        return <LoadingSpinner text="Carregando livros da Bíblia..." />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={refetch} />;
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Old Testament */}
            <section>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center">
                        <ScrollText className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-[var(--color-text)]">
                            Antigo Testamento
                        </h2>
                        <p className="text-sm text-[var(--color-text-muted)]">
                            {oldTestament.length} livros
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {oldTestament.map((book, index) => (
                        <BookCard key={book.abbrev.pt} book={book} index={index} />
                    ))}
                </div>
            </section>

            {/* New Testament */}
            <section>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-[var(--color-text)]">
                            Novo Testamento
                        </h2>
                        <p className="text-sm text-[var(--color-text-muted)]">
                            {newTestament.length} livros
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {newTestament.map((book, index) => (
                        <BookCard key={book.abbrev.pt} book={book} index={index} />
                    ))}
                </div>
            </section>
        </div>
    );
}

function BookCard({ book, index }) {
    return (
        <Link
            to={`/book/${book.abbrev.pt}`}
            className="card p-4 flex items-center gap-3 group animate-fade-in"
            style={{ animationDelay: `${index * 30}ms` }}
        >
            <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-light)] flex items-center justify-center shrink-0 group-hover:bg-[var(--color-primary)]/10 transition-colors">
                <span className="text-sm font-bold text-[var(--color-primary)] uppercase">
                    {book.abbrev.pt.slice(0, 2)}
                </span>
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="font-medium text-[var(--color-text)] truncate group-hover:text-[var(--color-primary)] transition-colors">
                    {book.name}
                </h3>
                <p className="text-xs text-[var(--color-text-muted)]">
                    {book.chapters} {book.chapters === 1 ? 'capítulo' : 'capítulos'}
                </p>
            </div>

            <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] group-hover:translate-x-1 transition-all shrink-0" />
        </Link>
    );
}
