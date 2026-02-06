import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Map, ChevronRight, ChevronLeft, Scroll, Heart } from 'lucide-react';
import { getRandomVerse } from '../services/bibleService';
import { useBible } from '../context/BibleContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { supabase, getProfile, getPartnerActivity } from '../services/supabaseClient';

export default function HomePage() {
    const { oldTestament, newTestament, loading } = useBible();
    const [dailyVerse, setDailyVerse] = useState(null);
    const [view, setView] = useState('HOME'); // 'HOME', 'OLD', 'NEW'

    // Couple State
    const [user, setUser] = useState(null);
    const [partnerProfile, setPartnerProfile] = useState(null);
    const [partnerActivity, setPartnerActivity] = useState(null);

    useEffect(() => {
        let mounted = true;
        getRandomVerse().then(verse => {
            if (mounted) setDailyVerse(verse);
        }).catch(console.error);

        // Load User & Partner Data
        if (supabase) {
            supabase.auth.getUser().then(async ({ data: { user } }) => {
                if (mounted && user) {
                    setUser(user);
                    const profile = await getProfile(user.id);
                    if (profile?.partner) {
                        setPartnerProfile(profile.partner);
                        const activity = await getPartnerActivity(profile.partner.id);
                        if (mounted) setPartnerActivity(activity);
                    }
                }
            });
        }

        return () => { mounted = false; };
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // Logic to render the list of books based on the selected view
    const renderBookList = (books, title) => (
        <div className="animate-slide-up pt-4 pb-12">
            {/* Header for Book List */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => setView('HOME')}
                    className="p-2 -ml-2 rounded-full hover:bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] transition-colors"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-[var(--color-text)] tracking-tight">
                    {title}
                </h2>
            </div>

            {/* List of Books - iOS Style List */}
            <div className="bg-[var(--color-surface)] rounded-3xl overflow-hidden border border-[var(--color-surface-lighter)] shadow-sm">
                {books.map((book, index) => (
                    <Link
                        key={book.abbrev.pt}
                        to={`/book/${book.abbrev.pt}`}
                        className={`
                            flex items-center justify-between p-5 
                            hover:bg-[var(--color-surface-light)] active:bg-[var(--color-surface-lighter)] transition-colors
                            ${index !== books.length - 1 ? 'border-b border-[var(--color-surface-lighter)]' : ''}
                        `}
                    >
                        <div>
                            <span className="text-lg font-medium text-[var(--color-text)]">
                                {book.name}
                            </span>
                            <p className="text-xs text-[var(--color-text-muted)] mt-0.5 font-medium">
                                {book.chapters} Capítulos
                            </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)] opacity-50" />
                    </Link>
                ))}
            </div>
        </div>
    );

    // Main Home View
    return (
        <div className="max-w-xl mx-auto min-h-[85vh] flex flex-col justify-center">

            {view === 'HOME' && (
                <div className="space-y-8 animate-fade-in py-8">

                    {/* Partner Presence Widget (New) */}
                    {partnerProfile && (
                        <div className="flex items-center gap-4 p-4 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-primary)]/20 shadow-glow animate-slide-up">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--color-primary)]">
                                    {partnerProfile.avatar_url ? (
                                        <img src={partnerProfile.avatar_url} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-[var(--color-surface-lighter)] flex items-center justify-center">
                                            <Heart className="w-5 h-5 text-[var(--color-primary)] fill-current" />
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--color-surface)]"></div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-[var(--color-text)]">
                                    {partnerProfile.full_name || 'Seu Amor'}
                                </p>
                                <p className="text-xs text-[var(--color-text-muted)]">
                                    {partnerActivity ? (
                                        <span>Leu {partnerActivity.book_abbrev} {partnerActivity.chapter} hoje</span>
                                    ) : (
                                        <span>Conectado no amor</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Verse of the Day - Premium Card */}
                    {dailyVerse && (
                        <div className="relative overflow-hidden bg-gradient-to-b from-[var(--color-surface-light)] to-[var(--color-surface)] rounded-[2rem] p-8 border border-[var(--color-surface-lighter)] shadow-lg group">
                            {/* Subtle background glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)] opacity-5 blur-[60px] rounded-full pointer-events-none"></div>

                            <div className="flex flex-col items-center text-center space-y-6">
                                <span className="text-xs font-bold tracking-[0.2em] text-[var(--color-primary)] uppercase opacity-80">
                                    Versículo do Dia
                                </span>

                                <Link
                                    to={`/book/${dailyVerse.book.abbrev.pt}/${dailyVerse.chapter}`}
                                    state={{ highlightVerse: dailyVerse.number }}
                                    className="block relative z-10"
                                >
                                    <h2 className="text-xl sm:text-2xl font-reading italic leading-relaxed text-[var(--color-text)] text-balance">
                                        "{dailyVerse.text}"
                                    </h2>
                                </Link>

                                <div className="h-px w-12 bg-[var(--color-primary)] opacity-30"></div>

                                <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                                    {dailyVerse.book.name} {dailyVerse.chapter}:{dailyVerse.number}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Navigation Blocks - Split View */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Old Testament Block */}
                        <button
                            onClick={() => setView('OLD')}
                            className="relative h-48 rounded-[2rem] p-6 flex flex-col justify-between items-start text-left group overflow-hidden transition-transform active:scale-95"
                            style={{
                                background: 'linear-gradient(135deg, #1c1c20 0%, #151518 100%)',
                                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="w-10 h-10 rounded-full bg-[var(--color-surface-light)] border border-white/5 flex items-center justify-center text-amber-500/80">
                                <Scroll className="w-5 h-5" />
                            </div>

                            <div>
                                <span className="block text-2xl font-bold text-[var(--color-text)] mb-1">
                                    Antigo
                                </span>
                                <span className="text-sm text-[var(--color-text-muted)] font-medium">
                                    Testamento
                                </span>
                            </div>
                        </button>

                        {/* New Testament Block */}
                        <button
                            onClick={() => setView('NEW')}
                            className="relative h-48 rounded-[2rem] p-6 flex flex-col justify-between items-start text-left group overflow-hidden transition-transform active:scale-95"
                            style={{
                                background: 'linear-gradient(135deg, #1c1c20 0%, #151518 100%)',
                                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="w-10 h-10 rounded-full bg-[var(--color-surface-light)] border border-white/5 flex items-center justify-center text-indigo-400/80">
                                <BookOpen className="w-5 h-5" />
                            </div>

                            <div>
                                <span className="block text-2xl font-bold text-[var(--color-text)] mb-1">
                                    Novo
                                </span>
                                <span className="text-sm text-[var(--color-text-muted)] font-medium">
                                    Testamento
                                </span>
                            </div>
                        </button>
                    </div>

                    <p className="text-center text-xs text-[var(--color-text-muted)] opacity-40 pt-8">
                        Nova Versão Internacional • Offline Ready
                    </p>
                </div>
            )}

            {view === 'OLD' && renderBookList(oldTestament, 'Antigo Testamento')}
            {view === 'NEW' && renderBookList(newTestament, 'Novo Testamento')}

        </div>
    );
}
