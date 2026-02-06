import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Sparkles, ChevronRight } from 'lucide-react';
import { getRandomVerse } from '../services/bibleService';
import { useBible } from '../context/BibleContext';
import BookList from '../components/books/BookList';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function HomePage() {
    const { loading } = useBible();
    const [dailyVerse, setDailyVerse] = useState(null);

    useEffect(() => {
        // Get random verse from local data
        const verse = getRandomVerse();
        setDailyVerse(verse);
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-[var(--color-text-secondary)]">
                    Carregando a Palavra...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <section className="text-center py-8 sm:py-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] mb-6">
                    <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                        Nova Versão Internacional
                    </span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--color-text)] mb-4">
                    Leitor Bíblico
                </h1>
                <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                    Explore a Palavra de Deus com uma experiência de leitura moderna e
                    elegante. Totalmente offline, sem depender de internet.
                </p>
            </section>

            {/* Daily Verse */}
            {dailyVerse && (
                <section className="card card-glass p-6 sm:p-8 text-center max-w-3xl mx-auto">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <BookOpen className="w-5 h-5 text-[var(--color-primary)]" />
                        <h2 className="text-sm font-medium text-[var(--color-primary)] uppercase tracking-wider">
                            Versículo do Dia
                        </h2>
                    </div>
                    <blockquote className="text-xl sm:text-2xl font-reading text-[var(--color-text)] leading-relaxed mb-4">
                        "{dailyVerse.text}"
                    </blockquote>
                    <cite className="text-[var(--color-text-secondary)] not-italic">
                        — {dailyVerse.book.name} {dailyVerse.chapter}:{dailyVerse.number}
                    </cite>
                    <div className="mt-6">
                        <Link
                            to={`/book/${dailyVerse.book.abbrev.pt}/${dailyVerse.chapter}`}
                            state={{ highlightVerse: dailyVerse.number }}
                            className="btn btn-secondary inline-flex items-center gap-2"
                        >
                            Ler Capítulo
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </section>
            )}

            {/* Book List */}
            <BookList />
        </div>
    );
}
