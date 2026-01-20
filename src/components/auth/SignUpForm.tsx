'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { PasswordRequirements, isPasswordValid } from '@/components/ui/PasswordRequirements';
import { CountrySelector } from './CountrySelector';
import { TermsCheckbox } from './TermsCheckbox';
import { authService } from '@/services/auth.service';
import { AuthResponse, Country } from '@/types/index';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { GoogleButton } from './GoogleButton';

export const SignUpForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [country, setCountry] = useState<string>(Country.BOLIVIA);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        setIsLoading(true);
        setError('');
        e.preventDefault();

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

        if (!acceptedTerms) {
            setError('Debes aceptar los terminos y condiciones');
            setIsLoading(false);
            return;
        }

        // Aquí irá la lógica de sign up
        try {
            const data: AuthResponse = await authService.signup({
                email, password, firstName, lastName, country: country as Country,
                phoneNumber: phoneNumber || undefined
            })

            // Usar el contexto de autenticación para guardar el token y usuario
            login(data.access_token, data.user);

            // Redirigir al dashboard
            router.push('/dashboard');

        } catch (err: any) {
            console.error('Error en sign up:', err);
            setError(
                err.response?.data?.message ||
                'Error al crear la cuenta. Intenta nuevamente.'
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
                        Crear Cuenta
                    </h1>
                    <p className="text-gray-400">
                        Unete a HUNBOLI!!!
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded-md">
                            {error}
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            id="firstName"
                            type="text"
                            label="Nombre"
                            placeholder="John"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                        <Input
                            id="lastName"
                            type="text"
                            label="Apellido"
                            placeholder="Doe"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <Input
                        id="email"
                        type="email"
                        label="Email Address"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                    />

                    <Input
                        id="phoneNumber"
                        type="tel"
                        label="Numero de Telefono (Opcional)"
                        placeholder="+591 12345678"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        disabled={isLoading}
                    />

                    <CountrySelector value={country} onChange={setCountry} />

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

                    <TermsCheckbox checked={acceptedTerms} onChange={setAcceptedTerms} />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        Registrarse
                    </Button>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[#0f1f33] text-gray-400">o</span>
                        </div>
                    </div>

                    <GoogleButton />

                    <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="secondary"
                            className="flex-1"
                            onClick={() => router.push('/')}
                            disabled={isLoading}
                        >
                            Volver
                        </Button>
                    </div>

                    <p className="text-center text-gray-400 text-sm">
                        Ya tienes una cuenta?{' '}
                        <Link
                            href="/login"
                            className="text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                            Iniciar Sesion
                        </Link>
                    </p>
                </form>

                <p className="text-center text-gray-500 text-xs mt-8">
                    Estable, segura, y moneda transparente y digital
                </p>
            </div>
        </div>
    );
}
