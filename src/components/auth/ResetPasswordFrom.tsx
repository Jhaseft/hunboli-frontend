'use client';

import { authService } from "@/services/auth.service";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { PasswordRequirements, isPasswordValid } from '@/components/ui/PasswordRequirements';


export const ResetPasswordFrom = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();
    const [newPassword, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');
        if (!token) {
            setError('Token invalido o faltante');
            setIsLoading(false);
            return;
        }
        if (!isPasswordValid(newPassword)) {
            setError('La contraseña no cumple con los requisitos de seguridad');
            setIsLoading(false);
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            setIsLoading(false);
            return;
        }

        try {
            await authService.resetPassword(token, newPassword);
            setMessage('Contraseña actualizada con exito! Redirigiendo...');
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err: any) {
            console.error('Error al restablecer la contraseña:', err);
            setError(
                err.response?.data?.message ||
                'Error al restablecer la contraseña. Intentalo de nuevo.'
            );
            setIsLoading(false);
        }

    }
    if (!token) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0a1929] via-[#0f1f33] to-[#0a1929] flex items-center justify-center p-4">
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-lg">
                    Error: Enlace invalido. No se encontro el token.
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a1929] via-[#0f1f33] to-[#0a1929] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Logo />

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Reestablecer Contraseña
                    </h1>
                    <p className="text-gray-400">
                        Escriba su nueva contraseña a continuacion
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-lg text-sm">
                            {message}
                        </div>
                    )}

                    <PasswordInput
                        id="password"
                        label="Nueva Contraseña"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />

                    <PasswordRequirements password={newPassword} show={newPassword.length > 0} />

                    <PasswordInput
                        id="confirmPassword"
                        label="Confirmar Contraseña"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Restableciendo...' : 'Restablecer Contraseña'}
                    </Button>
                </form>
                <p className="text-center text-gray-500 text-xs mt-8">
                    Estable, segura, y moneda transparente y digital
                </p>
            </div>
        </div>
    );
}
