'use client'
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Logo } from '../ui/Logo';
import { authService } from '@/services/auth.service';

export const ForgotPasswordForm = () => {
    const [email, setEmail] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await authService.forgotPassword(email);
            setIsEmailSent(true);
        } catch (err: any) {
            console.error('Error en forgot Password:', err);
            setError(
                err.response?.data?.message ||
                'Error al enviar el correo. Verifica tu dirección de correo.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (isEmailSent) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0a1929] via-[#0f1f33] to-[#0a1929] flex items-center justify-center p-4">
                <div className="w-full justify-center max-w-md">
                    <Logo />

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg
                                className="w-8 h-8 text-green-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Correo enviado
                        </h1>
                        <p className="text-gray-400 mb-2">
                            Hemos enviado un enlace de recuperación a:
                        </p>
                        <p className="text-cyan-400 font-medium mb-4">
                            {email}
                        </p>
                        <p className="text-gray-500 text-sm">
                            Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña. Si no lo encuentras, revisa tu carpeta de spam.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Button
                            type="button"
                            className="w-full"
                            onClick={() => router.push('/login')}
                        >
                            Volver al inicio de sesión
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            className="w-full"
                            onClick={() => setIsEmailSent(false)}
                        >
                            Usar otro correo
                        </Button>
                    </div>

                    <p className="text-center text-gray-500 text-xs mt-8">
                        Stable, secure, and transparent digital currency
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a1929] via-[#0f1f33] to-[#0a1929] flex items-center justify-center p-4">
            <div className="w-full justify-center max-w-md">
                <Logo />

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Olvidaste tu contraseña?
                    </h1>
                    <p className="text-gray-400">
                        Escribe tu correo electrónico para restablecer tu contraseña
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <Input
                        id="email"
                        type="email"
                        label="Dirección de correo"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Enviando correo...' : 'Enviar correo'}
                    </Button>

                    <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="secondary"
                            className="flex-1"
                            onClick={() => router.push('/login')}
                            disabled={isLoading}
                        >
                            Volver al login
                        </Button>
                    </div>

                </form>

                <p className="text-center text-gray-500 text-xs mt-8">
                    Stable, secure, and transparent digital currency
                </p>
            </div>
        </div>
    );
}
