'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { CountrySelector } from './CountrySelector';
import { TermsCheckbox } from './TermsCheckbox';


export const SignUpForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [country, setCountry] = useState('BOLIVIA');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (!acceptedTerms) {
            alert('Please accept the terms and conditions');
            return;
        }

        // Aquí irá la lógica de sign up
        console.log('Sign Up:', {
            firstName,
            lastName,
            email,
            phoneNumber,
            country,
            password
        });
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
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            id="firstName"
                            type="text"
                            label="Nombre"
                            placeholder="John"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                        <Input
                            id="lastName"
                            type="text"
                            label="Apellido"
                            placeholder="Doe"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
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
                    />

                    <Input
                        id="phoneNumber"
                        type="tel"
                        label="Numero de Telefono (Opcional)"
                        placeholder="+591 12345678"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />

                    <CountrySelector value={country} onChange={setCountry} />

                    <Input
                        id="password"
                        type="password"
                        label="Contraseña"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Input
                        id="confirmPassword"
                        type="password"
                        label="Confirmar Contraseña"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <TermsCheckbox checked={acceptedTerms} onChange={setAcceptedTerms} />

                    <Button type="submit" className="w-full">
                        Registrarse
                    </Button>

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
