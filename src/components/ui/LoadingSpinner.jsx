import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 'md', text = 'Carregando...' }) {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3 py-12">
            <Loader2 className={`${sizes[size]} text-[var(--color-primary)] animate-spin`} />
            {text && (
                <p className="text-[var(--color-text-secondary)] text-sm font-medium animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );
}
