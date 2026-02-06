import { useState } from 'react';
import { useFavorites } from '../../context/FavoritesContext';
import './CoupleSync.css';

function CoupleSync() {
    const {
        coupleCode,
        userName,
        isSyncing,
        syncError,
        isConnected,
        isSupabaseReady,
        createConnection,
        joinConnection,
        disconnect,
        refreshFromCloud
    } = useFavorites();

    const [mode, setMode] = useState(null); // 'create' | 'join' | null
    const [inputCode, setInputCode] = useState('');
    const [inputName, setInputName] = useState('');
    const [error, setError] = useState('');
    const [newCode, setNewCode] = useState('');

    const handleCreate = async () => {
        if (!inputName.trim()) {
            setError('Digite seu nome');
            return;
        }

        setError('');
        const result = await createConnection(inputName.trim());

        if (result.success) {
            setNewCode(result.code);
            setMode(null);
        } else {
            setError(result.error || 'Erro ao criar código');
        }
    };

    const handleJoin = async () => {
        if (!inputName.trim()) {
            setError('Digite seu nome');
            return;
        }
        if (!inputCode.trim() || inputCode.length !== 6) {
            setError('Digite o código de 6 caracteres');
            return;
        }

        setError('');
        const result = await joinConnection(inputCode.trim(), inputName.trim());

        if (result.success) {
            setMode(null);
            setInputCode('');
            setInputName('');
        } else {
            setError(result.error || 'Código não encontrado');
        }
    };

    const handleDisconnect = () => {
        if (window.confirm('Deseja desconectar? Seus favoritos locais serão mantidos.')) {
            disconnect();
            setNewCode('');
        }
    };

    const copyCode = () => {
        navigator.clipboard.writeText(coupleCode || newCode);
    };

    // Not configured - show setup instructions
    if (!isSupabaseReady) {
        return (
            <div className="couple-sync">
                <div className="sync-card setup-needed">
                    <div className="sync-icon">🔗</div>
                    <h3>Sincronização em Casal</h3>
                    <p className="sync-description">
                        Para sincronizar favoritos entre dois celulares, é necessário configurar o Supabase.
                    </p>
                    <div className="setup-instructions">
                        <p><strong>Instruções:</strong></p>
                        <ol>
                            <li>Crie uma conta grátis em <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">supabase.com</a></li>
                            <li>Crie um novo projeto</li>
                            <li>Copie a URL e a chave anon</li>
                            <li>Adicione no arquivo <code>.env</code></li>
                        </ol>
                    </div>
                </div>
            </div>
        );
    }

    // Connected - show status
    if (coupleCode) {
        return (
            <div className="couple-sync">
                <div className="sync-card connected">
                    <div className="sync-status">
                        <span className={`status-dot ${isConnected ? 'online' : 'offline'}`}></span>
                        <span>{isConnected ? 'Conectado' : 'Offline'}</span>
                    </div>

                    <div className="connection-info">
                        <div className="user-info">
                            <span className="user-label">Você:</span>
                            <span className="user-name">{userName}</span>
                        </div>

                        <div className="code-display">
                            <span className="code-label">Código do Casal:</span>
                            <div className="code-value">
                                <span>{coupleCode}</span>
                                <button onClick={copyCode} className="copy-btn" title="Copiar código">
                                    📋
                                </button>
                            </div>
                        </div>
                    </div>

                    {syncError && (
                        <div className="sync-error">
                            <span>⚠️ {syncError}</span>
                        </div>
                    )}

                    <div className="sync-actions">
                        <button
                            onClick={refreshFromCloud}
                            disabled={isSyncing}
                            className="btn-refresh"
                        >
                            {isSyncing ? '⏳ Sincronizando...' : '🔄 Atualizar'}
                        </button>
                        <button onClick={handleDisconnect} className="btn-disconnect">
                            Desconectar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Show new code after creation
    if (newCode) {
        return (
            <div className="couple-sync">
                <div className="sync-card success">
                    <div className="sync-icon">✅</div>
                    <h3>Código Criado!</h3>
                    <p className="sync-description">
                        Compartilhe este código com seu amor para conectar vocês:
                    </p>
                    <div className="new-code-display">
                        <span className="big-code">{newCode}</span>
                        <button onClick={copyCode} className="copy-btn-large">
                            📋 Copiar
                        </button>
                    </div>
                    <p className="code-hint">
                        A outra pessoa deve clicar em "Entrar com Código" e digitar este código.
                    </p>
                </div>
            </div>
        );
    }

    // Not connected - show options
    return (
        <div className="couple-sync">
            <div className="sync-card">
                <div className="sync-icon">💕</div>
                <h3>Sincronização em Casal</h3>
                <p className="sync-description">
                    Conecte-se com seu amor para compartilhar versículos favoritos em tempo real!
                </p>

                {mode === null && (
                    <div className="sync-options">
                        <button onClick={() => setMode('create')} className="btn-create">
                            ✨ Criar Novo Código
                        </button>
                        <button onClick={() => setMode('join')} className="btn-join">
                            🔗 Entrar com Código
                        </button>
                    </div>
                )}

                {mode === 'create' && (
                    <div className="sync-form">
                        <input
                            type="text"
                            placeholder="Seu nome (ex: João)"
                            value={inputName}
                            onChange={(e) => setInputName(e.target.value)}
                            className="sync-input"
                            maxLength={20}
                        />
                        {error && <span className="form-error">{error}</span>}
                        <div className="form-actions">
                            <button onClick={() => setMode(null)} className="btn-cancel">
                                Voltar
                            </button>
                            <button onClick={handleCreate} disabled={isSyncing} className="btn-confirm">
                                {isSyncing ? 'Criando...' : 'Criar Código'}
                            </button>
                        </div>
                    </div>
                )}

                {mode === 'join' && (
                    <div className="sync-form">
                        <input
                            type="text"
                            placeholder="Seu nome (ex: Maria)"
                            value={inputName}
                            onChange={(e) => setInputName(e.target.value)}
                            className="sync-input"
                            maxLength={20}
                        />
                        <input
                            type="text"
                            placeholder="Código do casal (6 letras)"
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                            className="sync-input code-input"
                            maxLength={6}
                        />
                        {error && <span className="form-error">{error}</span>}
                        <div className="form-actions">
                            <button onClick={() => setMode(null)} className="btn-cancel">
                                Voltar
                            </button>
                            <button onClick={handleJoin} disabled={isSyncing} className="btn-confirm">
                                {isSyncing ? 'Conectando...' : 'Conectar'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CoupleSync;
