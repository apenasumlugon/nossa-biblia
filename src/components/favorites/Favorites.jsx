import { Link } from 'react-router-dom';
import {
    Heart,
    Trash2,
    BookOpen,
    ChevronRight,
    Sparkles,
    Users
} from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import CoupleSync from '../sync/CoupleSync';

export default function Favorites() {
    const { favorites, removeFavorite, clearFavorites, favoritesCount, coupleCode, isSyncing } = useFavorites();

    if (favoritesCount === 0) {
        return (
            <div className="animate-fade-in">
                {/* Couple Sync Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-[var(--color-primary)]" />
                        <h2 className="text-lg font-semibold text-[var(--color-text)]">
                            Sincronização em Casal
                        </h2>
                    </div>
                    <CoupleSync />
                </div>

                <div className="text-center py-16">
                    <div className="w-20 h-20 rounded-full bg-[var(--color-surface)] mx-auto mb-6 flex items-center justify-center">
                        <Heart className="w-10 h-10 text-[var(--color-text-muted)]" />
                    </div>

                    <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">
                        Nenhum versículo favorito
                    </h2>
                    <p className="text-[var(--color-text-secondary)] mb-6 max-w-md mx-auto">
                        Comece a ler a Bíblia e toque no ícone de coração ao lado dos versículos que você deseja salvar.
                    </p>

                    <Link to="/" className="btn btn-primary">
                        <BookOpen className="w-4 h-4" />
                        Começar a Ler
                    </Link>
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <div className="animate-fade-in">
            {/* Couple Sync Section */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-[var(--color-primary)]" />
                    <h2 className="text-lg font-semibold text-[var(--color-text)]">
                        Sincronização em Casal
                    </h2>
                    {isSyncing && (
                        <span className="text-xs text-[var(--color-text-muted)] ml-2">⏳ Sincronizando...</span>
                    )}
                </div>
                <CoupleSync />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary)]/5 flex items-center justify-center">
                        <Heart className="w-6 h-6 text-[var(--color-primary)]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--color-text)]">
                            {coupleCode ? 'Nossos Favoritos' : 'Meus Favoritos'}
                        </h1>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                            {favoritesCount} {favoritesCount === 1 ? 'versículo salvo' : 'versículos salvos'}
                        </p>
                    </div>
                </div>

                {favoritesCount > 0 && (
                    <button
                        onClick={() => {
                            if (window.confirm('Tem certeza que deseja remover todos os favoritos?')) {
                                clearFavorites();
                            }
                        }}
                        className="btn btn-ghost text-[var(--color-error)] hover:bg-[var(--color-error)]/10"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Limpar tudo</span>
                    </button>
                )}
            </div>

            {/* Favorites List */}
            <div className="space-y-3">
                {favorites.map((favorite, index) => (
                    <div
                        key={favorite.id}
                        className="card p-4 animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className="flex items-start gap-4">
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center flex-wrap gap-2 mb-2">
                                    <span className="badge badge-primary">
                                        {favorite.bookName} {favorite.chapter}:{favorite.number}
                                    </span>
                                    {favorite.addedBy && coupleCode && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                                            💕 {favorite.addedBy}
                                        </span>
                                    )}
                                    <span className="text-xs text-[var(--color-text-muted)]">
                                        {formatDate(favorite.addedAt)}
                                    </span>
                                </div>

                                <p className="font-reading text-[var(--color-text)] leading-relaxed">
                                    "{favorite.text}"
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2 shrink-0">
                                <Link
                                    to={`/book/${favorite.bookAbbrev}/${favorite.chapter}`}
                                    state={{ highlightVerse: favorite.number }}
                                    className="btn btn-ghost btn-icon"
                                    title="Ir para o versículo"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                                <button
                                    onClick={() => removeFavorite(favorite.bookAbbrev, favorite.chapter, favorite.number)}
                                    className="btn btn-ghost btn-icon text-[var(--color-error)] hover:bg-[var(--color-error)]/10"
                                    title="Remover dos favoritos"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tip */}
            <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-primary)]/5 border border-[var(--color-primary)]/20">
                <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-[var(--color-text)] mb-1">
                            {coupleCode ? 'Conectados! 💕' : 'Dica'}
                        </p>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                            {coupleCode
                                ? 'Os versículos favoritos são compartilhados em tempo real entre vocês. Quando um adicionar, aparece para o outro!'
                                : 'Seus versículos favoritos são salvos localmente no seu navegador. Eles estarão disponíveis sempre que você voltar ao Leitor Bíblico.'
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
