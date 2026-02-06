import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({ message, onRetry }) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-12 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--color-error)]/10 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-[var(--color-error)]" />
            </div>

            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-[var(--color-text)]">
                    Ops! Algo deu errado
                </h3>
                <p className="text-[var(--color-text-secondary)] text-sm max-w-md">
                    {message || 'Não foi possível carregar os dados. Verifique sua conexão e tente novamente.'}
                </p>
            </div>

            {onRetry && (
                <button
                    onClick={onRetry}
                    className="btn btn-secondary mt-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Tentar novamente
                </button>
            )}
        </div>
    );
}
