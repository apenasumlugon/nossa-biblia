import { Heart, Github } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-auto border-t border-white/5 bg-[var(--color-surface)]">
            <div className="container py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                        <span>Feito com</span>
                        <Heart className="w-4 h-4 text-[var(--color-primary)] fill-[var(--color-primary)]" />
                        <span>para a glória de Deus</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-[var(--color-text-muted)]">
                        <span>© {currentYear} Leitor Bíblico</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">Dados: ABíbliaDigital</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
