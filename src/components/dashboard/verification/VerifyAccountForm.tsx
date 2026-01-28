'use client';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import { Link } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useState } from "react";


export const VerifyAccountForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const [email, setEmail] = useState('');
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        // Aquí iría la lógica para verificar la cuenta
        setTimeout(() => {
            setIsLoading(false);
            router.push('/dashboard');
        }, 2000);
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a1929] via-[#0f1f33] to-[#0a1929] flex items-center justify-center p-4">
            <div className="w-full justify-center  max-w-md">
                <Logo />

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Verificacion de Cuenta
                    </h1>
                    <p className="text-gray-400">
                        Para completar el proceso de verificación, se debe hacer un deposito de 1000bs.
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
                        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </Button>

                    <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="secondary"
                            className="flex-1"
                            onClick={() => router.push('/dashboard')}
                            disabled={isLoading}
                        >
                            Volver
                        </Button>
                    </div>
                </form>

                <p className="text-center text-gray-500 text-xs mt-8">
                    Stable, secure, and transparent digital currency
                </p>
            </div>
        </div>
    )
}
