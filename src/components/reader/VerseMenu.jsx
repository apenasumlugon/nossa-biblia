import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Heart, Copy, Share2, X } from 'lucide-react';

export default function VerseMenu({ isOpen, onClose, verse, bookName, chapterNumber, onHighlight, onFavorite, isFavorite }) {
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !verse) return null;

    const colors = [
        { name: 'yellow', value: 'var(--highlight-yellow)', bg: '#FFEB3B' },
        { name: 'green', value: 'var(--highlight-green)', bg: '#4CAF50' },
        { name: 'blue', value: 'var(--highlight-blue)', bg: '#2196F3' },
        { name: 'pink', value: 'var(--highlight-pink)', bg: '#E91E63' },
    ];

    const MenuContent = (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:bg-black/50 animate-fade-in">
            <div
                ref={menuRef}
                className="w-full sm:w-auto sm:min-w-[400px] bg-[var(--color-surface)] border-t sm:border border-[var(--color-surface-lighter)] sm:rounded-2xl shadow-2xl p-6 pb-8 sm:pb-6 animate-slide-in-bottom"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-[var(--color-text)]">
                            {bookName} {chapterNumber}:{verse.number}
                        </h3>
                        <p className="text-sm text-[var(--color-text-secondary)] mt-1 line-clamp-1">
                            Selecione uma ação
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="btn btn-ghost btn-icon -mr-2"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Highlight Options */}
                <div className="mb-6">
                    <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3 block">
                        Destaque
                    </label>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { onHighlight(null); onClose(); }}
                            className="w-10 h-10 rounded-full border border-[var(--color-text-muted)] flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-surface-light)]"
                            title="Remover destaque"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        {colors.map((color) => (
                            <button
                                key={color.name}
                                onClick={() => { onHighlight(color.name); onClose(); }}
                                className="w-10 h-10 rounded-full transition-transform hover:scale-110 active:scale-95"
                                style={{ backgroundColor: color.bg }}
                                title={`Destacar em ${color.name}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-3 gap-3">
                    <button
                        onClick={() => { onFavorite(); onClose(); }}
                        className={`btn flex-col gap-2 h-auto py-3 ${isFavorite ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10' : 'btn-secondary'}`}
                    >
                        <Heart className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} />
                        <span className="text-xs">Favoritar</span>
                    </button>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(`${verse.text} - ${bookName} ${chapterNumber}:${verse.number}`);
                            onClose();
                            alert('Versículo copiado!');
                        }}
                        className="btn btn-secondary flex-col gap-2 h-auto py-3"
                    >
                        <Copy className="w-5 h-5" />
                        <span className="text-xs">Copiar</span>
                    </button>
                    <button
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: 'Versículo Bíblico',
                                    text: `"${verse.text}" - ${bookName} ${chapterNumber}:${verse.number}`,
                                    url: window.location.href
                                }).catch(() => { });
                            } else {
                                alert('Compartilhamento não suportado neste navegador.');
                            }
                            onClose();
                        }}
                        className="btn btn-secondary flex-col gap-2 h-auto py-3"
                    >
                        <Share2 className="w-5 h-5" />
                        <span className="text-xs">Compartilhar</span>
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(MenuContent, document.body);
}
