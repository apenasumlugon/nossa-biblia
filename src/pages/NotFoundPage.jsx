import { Link } from 'react-router-dom';
import { Home, BookOpen } from 'lucide-react';

export default function NotFoundPage() {
    return (
        <div className="text-center py-16 animate-fade-in">
            <div className="w-24 h-24 rounded-full bg-[var(--color-surface)] mx-auto mb-6 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-[var(--color-text-muted)]" />
            </div>

            <h1 className="text-6xl font-bold text-[var(--color-primary)] mb-4">404</h1>

            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">
                Página não encontrada
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-8 max-w-md mx-auto">
                O caminho que você procura não existe. Talvez o versículo esteja em outro lugar.
            </p>

            <Link to="/" className="btn btn-primary">
                <Home className="w-4 h-4" />
                Voltar ao Início
            </Link>
        </div>
    );
}
