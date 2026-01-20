'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { PasswordRequirements, isPasswordValid } from '@/components/ui/PasswordRequirements';
import { CountrySelector } from './CountrySelector';
import { authService } from '@/services/auth.service';
import { Country } from '@/types/index';
import { useAuth } from '@/context/AuthContext';
import { setAuthToken, setUserData } from '@/lib/cookies';

export function CompleteProfileForm() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [country, setCountry] = useState<string>(Country.BOLIVIA);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { user, refreshUser } = useAuth();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!isPasswordValid(password)) {
            setError('La contraseña no cumple con los requisitos de seguridad');
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            setIsLoading(false);
            return;
        }

        try {
            const response = await authService.completeProfile({
                password,
                phoneNumber: phoneNumber || '',
                country: country as Country,
            });

            // Si el backend devuelve un nuevo token, actualizarlo
            if (response.accessToken) {
                setAuthToken(response.accessToken);
            }

            // Si devuelve el usuario actualizado, guardarlo directamente
            if (response.user) {
                setUserData(response.user);
            }

            // Intentar actualizar el estado del contexto
            // Si falla, igual redirigimos porque ya guardamos las cookies
            try {
                await refreshUser();
            } catch {
                // Ignorar error - las cookies ya están guardadas
            }

            // Usar window.location para forzar un hard reload
            window.location.href = '/dashboard';
        } catch (err: any) {
            console.error('Error al completar perfil:', err);
            setError(
                err.response?.data?.message ||
                'Error al completar el perfil. Intenta nuevamente.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a1929] via-[#0f1f33] to-[#0a1929] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Logo />

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Completa tu Perfil
                    </h1>
                    <p className="text-gray-400">
                        {user?.email ? `Hola ${user.firstName}, configura tu contraseña para continuar` : 'Configura tu cuenta para continuar'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <PasswordInput
                        id="password"
                        label="Contraseña"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />

                    <PasswordRequirements password={password} show={password.length > 0} />

                    <PasswordInput
                        id="confirmPassword"
                        label="Confirmar Contraseña"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />

                    <CountrySelector value={country} onChange={setCountry} />

                    <Input
                        id="phoneNumber"
                        type="tel"
                        label="Numero de Telefono (Opcional)"
                        placeholder="+591 12345678"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        disabled={isLoading}
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Guardando...' : 'Completar Perfil'}
                    </Button>
                </form>

                <p className="text-center text-gray-500 text-xs mt-8">
                    Estable, segura, y moneda transparente y digital
                </p>
            </div>
        </div>
    );
}
