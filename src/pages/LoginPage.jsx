import { useState, useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const navigate = useNavigate();
    const [session, setSession] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) navigate('/profile');
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) navigate('/profile');
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    if (!supabase) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4 text-center">
                <p className="text-[var(--color-error)]">
                    Supabase não configurado. Verifique as variáveis de ambiente.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-background)]">
            <div className="w-full max-w-md bg-[var(--color-surface)] p-8 rounded-3xl shadow-2xl border border-[var(--color-surface-lighter)]">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">Bem-vindo</h1>
                    <p className="text-sm text-[var(--color-text-muted)]">Entre para sincronizar com seu amor</p>
                </div>

                <Auth
                    supabaseClient={supabase}
                    appearance={{
                        theme: ThemeSupa,
                        variables: {
                            default: {
                                colors: {
                                    brand: '#bf953f',
                                    brandAccent: '#d4af37',
                                    inputBackground: '#1c1c22',
                                    inputText: '#e4e4e7',
                                    inputBorder: '#27272e',
                                }
                            }
                        },
                        className: {
                            container: 'auth-container',
                            button: 'auth-button',
                            input: 'auth-input'
                        }
                    }}
                    localization={{
                        variables: {
                            sign_in: {
                                email_label: 'Email',
                                password_label: 'Senha',
                                button_label: 'Entrar',
                            },
                        },
                    }}
                    providers={[]}
                    theme="dark"
                />
            </div>
        </div>
    );
}
