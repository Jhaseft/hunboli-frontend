'use client';

import { authService } from "@/services/auth.service";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';


export const ResetPasswordFrom = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    console.log('Token from URL:', token);
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
        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            setIsLoading(false);
            return;
        }
        if (newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            setIsLoading(false);
            return;
        }

        try {
            const data = await authService.resetPassword(token, newPassword);
            setMessage('¡Contraseña actualizada con éxito! Redirigiendo...');
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err: any) {
            console.error('Error al restablecer la contraseña:', err);
            setError(
                err.response?.data?.message ||
                'Error al restablecer la contraseña. Inténtalo de nuevo.'
            );
            setIsLoading(false);
        }

    }
    if (!token) {
        return <div className="text-red-500">Error: Enlace inválido. No se encontró el token.</div>;
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
                        Escriba su nueva contraseña a continuación
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded-md">
                            {error}
                        </div>
                    )}
                    {message && <p className="text-green-500 text-sm">{message}</p>}


                    <Input
                        id="password"
                        type="password"
                        label="Contraseña"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                    <Input
                        id="confirmPassword"
                        type="password"
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
