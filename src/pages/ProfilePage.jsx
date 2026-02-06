import { useState, useEffect } from 'react';
import { supabase, getProfile, createCoupleLink, joinCouple } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { LogOut, Heart, User, Copy } from 'lucide-react';

export default function ProfilePage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [coupleCode, setCoupleCode] = useState('');
    const [inputCode, setInputCode] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login');
                return;
            }

            const data = await getProfile(user.id);
            setProfile(data);
            setLoading(false);
        };
        loadProfile();
    }, [navigate]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const handleCreateLink = async () => {
        setLoading(true);
        const { code, error } = await createCoupleLink(profile.id);
        if (error) setError(error);
        else setCoupleCode(code);
        setLoading(false);
    };

    const handleJoinCouple = async () => {
        setLoading(true);
        const { success, error } = await joinCouple(profile.id, inputCode);
        if (error) setError(error);
        else window.location.reload(); // Refresh to see connected state
        setLoading(false);
    };

    if (loading) return <div className="p-8 text-center">Carregando perfil...</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-lg">
            <h1 className="text-2xl font-bold mb-8 text-[var(--color-text)]">Meu Perfil</h1>

            {/* User Info */}
            <div className="card p-6 mb-8 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[var(--color-surface-light)] flex items-center justify-center text-2xl">
                    {profile?.avatar_url ? <img src={profile.avatar_url} className="rounded-full" /> : <User />}
                </div>
                <div>
                    <h2 className="text-xl font-bold">{profile?.full_name || 'Usuário'}</h2>
                    <p className="text-sm text-[var(--color-text-muted)]">{profile?.email}</p>
                </div>
            </div>

            {/* Couple Status */}
            <div className="card p-6 mb-8 border border-[var(--color-primary)]/20">
                <div className="flex items-center gap-2 mb-4 text-[var(--color-primary)]">
                    <Heart className="w-5 h-5 fill-current" />
                    <h3 className="font-bold uppercase tracking-wider text-sm">Status do Relacionamento</h3>
                </div>

                {profile?.partner ? (
                    <div className="text-center py-4">
                        <p className="text-lg mb-2">Conectado com</p>
                        <div className="font-reading text-2xl italic text-[var(--color-text)]">
                            {profile.partner.full_name || 'Seu Amor'}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="text-center p-4 bg-[var(--color-surface-light)] rounded-xl">
                            <p className="mb-4 text-sm">Ainda não conectou seu par?</p>

                            {!coupleCode ? (
                                <button onClick={handleCreateLink} className="btn btn-primary w-full">
                                    Gerar Código de Convite
                                </button>
                            ) : (
                                <div className="animate-fade-in">
                                    <p className="text-xs text-[var(--color-text-muted)] mb-2">Envie este código para seu amor:</p>
                                    <div className="text-3xl font-mono font-bold tracking-widest text-[var(--color-primary)] mb-4 select-all">
                                        {coupleCode}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="text-center">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Já tem um código?"
                                    className="input text-center uppercase font-mono"
                                    maxLength={6}
                                    value={inputCode}
                                    onChange={(e) => setInputCode(e.target.value)}
                                />
                                <button onClick={handleJoinCouple} className="btn btn-secondary">
                                    Conectar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
            </div>

            <button onClick={handleSignOut} className="btn btn-ghost w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
                <LogOut className="w-4 h-4" />
                Sair da Conta
            </button>
        </div>
    );
}
