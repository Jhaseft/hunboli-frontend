'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/auth.service';

export default function AuthCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleCallback = async () => {
            const token = searchParams.get('token');

            if (!token) {
                setError('No se recibió el token de autenticación');
                return;
            }

            try {
                // Guardar el token temporalmente para que el interceptor de axios lo use
                const { setAuthToken } = await import('@/lib/cookies');
                setAuthToken(token);

                // Obtener el perfil del usuario con el token
                const userProfile = await authService.getProfile();

                // Guardar en el contexto de autenticación
                login(token, userProfile);

                // Redirigir al dashboard
                window.location.href = '/dashboard';
            } catch (err: any) {
                console.error('Error al procesar el callback de Google:', err);
                setError(
                    err.response?.data?.message ||
                    'Error al autenticar con Google. Por favor, intenta nuevamente.'
                );
            }
        };

        handleCallback();
    }, [searchParams, login, router]);

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0a1929] via-[#0f1f33] to-[#0a1929] flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center">
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-lg mb-6">
                        {error}
                    </div>
                    <button
                        onClick={() => router.push('/login')}
                        className="text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                        Volver al inicio de sesión
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a1929] via-[#0f1f33] to-[#0a1929] flex items-center justify-center p-4">
            <div className="w-full max-w-md text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                <p className="text-gray-400">Autenticando con Google...</p>
            </div>
        </div>
    );
}
