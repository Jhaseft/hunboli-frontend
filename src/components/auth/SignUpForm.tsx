'use client';

import { FormEvent, useRef, useState, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { PasswordRequirements, isPasswordValid } from '@/components/ui/PasswordRequirements';
import { PhoneInput } from '@/components/ui/PhoneInput';
import { CountrySelector } from './CountrySelector';
import { TermsCheckbox } from './TermsCheckbox';
import { authService } from '@/services/auth.service';
import { Country } from '@/types/index';
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
    const [step, setStep] = useState<'form' | 'verify'>('form');
    const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
    const [resendCooldown, setResendCooldown] = useState(0);
    const errorRef = useRef<HTMLDivElement>(null);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
    const router = useRouter();
    const { login } = useAuth();

    useEffect(() => {
        if (error && errorRef.current) {
            errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [error]);

    // Cooldown para reenviar código
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    // Focus primer input OTP al entrar a verificación
    useEffect(() => {
        if (step === 'verify') {
            otpRefs.current[0]?.focus();
        }
    }, [step]);

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

        try {
            await authService.signup({
                email, password, firstName, lastName, country: country as Country,
                phoneNumber: phoneNumber || undefined
            });

            // Ir al paso de verificación
            setStep('verify');
            setResendCooldown(60);

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

    const handleOtpChange = (index: number, value: string) => {
        // Solo permitir dígitos
        const digit = value.replace(/\D/g, '').slice(-1);
        const newDigits = [...otpDigits];
        newDigits[index] = digit;
        setOtpDigits(newDigits);

        // Auto-avanzar al siguiente input
        if (digit && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 0) return;
        const newDigits = [...otpDigits];
        for (let i = 0; i < 6; i++) {
            newDigits[i] = pasted[i] || '';
        }
        setOtpDigits(newDigits);
        // Focus en el último dígito pegado o el siguiente vacío
        const focusIndex = Math.min(pasted.length, 5);
        otpRefs.current[focusIndex]?.focus();
    };

    const handleVerify = async () => {
        setIsLoading(true);
        setError('');
        const code = otpDigits.join('');

        if (code.length !== 6) {
            setError('Ingresa el código completo de 6 dígitos');
            setIsLoading(false);
            return;
        }

        try {
            const data = await authService.verifySignupCode({ email, code });
            login(data.access_token, data.user);
            router.push('/dashboard');
        } catch (err: any) {
            console.error('Error en verificación:', err);
            setError(
                err.response?.data?.message ||
                'Código inválido o expirado. Intenta nuevamente.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (resendCooldown > 0) return;
        setError('');

        try {
            await authService.resendCode(email);
            setResendCooldown(60);
            setOtpDigits(['', '', '', '', '', '']);
            otpRefs.current[0]?.focus();
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                'Error al reenviar el código. Intenta nuevamente.'
            );
        }
    };

    // Vista de verificación de código
    if (step === 'verify') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0a1929] via-[#0f1f33] to-[#0a1929] flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <Logo />

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Verifica tu correo
                        </h1>
                        <p className="text-gray-400">
                            Enviamos un código de 6 dígitos a
                        </p>
                        <p className="text-cyan-400 font-medium mt-1">
                            {email}
                        </p>
                    </div>

                    <div className="space-y-5">
                        {error && (
                            <div ref={errorRef} className="bg-red-100 text-red-700 p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        {/* OTP Inputs */}
                        <div className="flex justify-center gap-3">
                            {otpDigits.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { otpRefs.current[index] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                    onPaste={index === 0 ? handleOtpPaste : undefined}
                                    disabled={isLoading}
                                    className="w-12 h-14 text-center text-2xl font-bold text-white bg-[#1a2d45] border border-gray-600 rounded-lg focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors disabled:opacity-50"
                                />
                            ))}
                        </div>

                        <Button
                            type="button"
                            className="w-full"
                            disabled={isLoading || otpDigits.join('').length !== 6}
                            onClick={handleVerify}
                        >
                            {isLoading ? 'Verificando...' : 'Verificar'}
                        </Button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={handleResendCode}
                                disabled={resendCooldown > 0}
                                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors disabled:text-gray-500 disabled:cursor-not-allowed"
                            >
                                {resendCooldown > 0
                                    ? `Reenviar código en ${resendCooldown}s`
                                    : 'Reenviar código'}
                            </button>
                        </div>

                        <Button
                            type="button"
                            variant="secondary"
                            className="w-full"
                            onClick={() => {
                                setStep('form');
                                setOtpDigits(['', '', '', '', '', '']);
                                setError('');
                            }}
                            disabled={isLoading}
                        >
                            Volver al formulario
                        </Button>
                    </div>

                    <p className="text-center text-gray-500 text-xs mt-8">
                        Estable, segura, y moneda transparente y digital
                    </p>
                </div>
            </div>
        );
    }

    // Vista del formulario de registro
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
                        <div ref={errorRef} className="bg-red-100 text-red-700 p-3 rounded-md">
                            {error}
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            id="firstName"
                            type="text"
                            label="Nombre"
                            placeholder="Juan"
                            value={firstName}
                            onChange={(e) => {
                                const filtered = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
                                setFirstName(filtered);
                            }}
                            required
                            minLength={2}
                            maxLength={50}
                            disabled={isLoading}
                        />
                        <Input
                            id="lastName"
                            type="text"
                            label="Apellido"
                            placeholder="Pérez"
                            value={lastName}
                            onChange={(e) => {
                                const filtered = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
                                setLastName(filtered);
                            }}
                            required
                            minLength={2}
                            maxLength={50}
                            disabled={isLoading}
                        />
                    </div>

                    <Input
                        id="email"
                        type="email"
                        label="Correo electrónico"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        maxLength={254}
                        disabled={isLoading}
                    />

                    <PhoneInput
                        id="phoneNumber"
                        label="Numero de Telefono (Opcional)"
                        placeholder="12345678"
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                        minLength={7}
                        maxLength={15}
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
                        maxLength={128}
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
                        maxLength={128}
                        disabled={isLoading}
                    />

                    <TermsCheckbox checked={acceptedTerms} onChange={setAcceptedTerms} />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Enviando...' : 'Registrarse'}
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
