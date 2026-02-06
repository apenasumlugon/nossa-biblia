import { useState, useEffect, useCallback } from 'react';
import { Sparkles, X, Heart, MessageCircle, Copy, Share2 } from 'lucide-react';
import { explainVerse } from '../../services/aiService';
import './AiModal.css';

function AiModal({ isOpen, onClose, verse }) {
    const [loading, setLoading] = useState(false);
    const [explanation, setExplanation] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && verse) {
            handleExplain();
        }
    }, [isOpen, verse, handleExplain]);

    const handleExplain = useCallback(async () => {
        setLoading(true);
        setError('');
        setExplanation('');
        try {
            const text = await explainVerse(verse.text, verse.bookName, verse.chapter, verse.number);
            setExplanation(text);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [verse]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(explanation);
        alert('Copiado para a área de transferência!');
    };

    if (!isOpen) return null;

    return (
        <div className="ai-modal-overlay">
            <div className="ai-modal-content animate-pop-in">
                <div className="ai-modal-header">
                    <div className="header-title">
                        <Sparkles className="icon-sparkles" />
                        <h3>Insight IA</h3>
                    </div>
                    <button onClick={onClose} className="btn-close">
                        <X size={20} />
                    </button>
                </div>

                <div className="ai-modal-body">
                    <div className="verse-preview">
                        <span className="verse-ref">{verse?.bookName} {verse?.chapter}:{verse?.number}</span>
                        <p>"{verse?.text}"</p>
                    </div>

                    <div className="ai-response-container">
                        {loading ? (
                            <div className="ai-loading">
                                <div className="pulse-dots">
                                    <div></div><div></div><div></div>
                                </div>
                                <p>O mestre está escrevendo uma reflexão para vocês...</p>
                            </div>
                        ) : error ? (
                            <div className="ai-error">
                                <p>⚠️ {error}</p>
                                <button onClick={handleExplain} className="btn-retry">Tentar novamente</button>
                            </div>
                        ) : (
                            <div className="ai-text">
                                {explanation.split('\n').map((para, i) => (
                                    <p key={i}>{para}</p>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {!loading && !error && explanation && (
                    <div className="ai-modal-footer">
                        <button onClick={copyToClipboard} className="btn-footer-action">
                            <Copy size={16} /> Copiar
                        </button>
                        <button onClick={onClose} className="btn-footer-action primary">
                            💕 Amém
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AiModal;
