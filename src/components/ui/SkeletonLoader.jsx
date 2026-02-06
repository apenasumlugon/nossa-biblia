export default function SkeletonLoader({ variant = 'text', count = 1, className = '' }) {
    const variants = {
        text: 'h-4 rounded',
        title: 'h-8 rounded-lg w-3/4',
        verse: 'h-20 rounded-lg',
        card: 'h-24 rounded-xl',
        button: 'h-10 w-24 rounded-lg',
        circle: 'h-10 w-10 rounded-full',
    };

    return (
        <div className={`space-y-3 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={`skeleton ${variants[variant]} ${variant === 'text' ? 'w-full' : ''}`}
                    style={{
                        animationDelay: `${i * 100}ms`,
                        width: variant === 'text' ? `${Math.random() * 40 + 60}%` : undefined
                    }}
                />
            ))}
        </div>
    );
}
