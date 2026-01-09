'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Logo } from '../ui/Logo';
import { authService } from '@/services/auth.service';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await authService.login({ email, password });

      // Guardar el token en localStorage
      localStorage.setItem('token', data.token);

      // Opcional: Guardar información del usuario
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirigir al dashboard o página principal
      router.push('/'); // Cambia esto a la ruta que desees

    } catch (err: any) {
      console.error('Error en login:', err);
      setError(
        err.response?.data?.message ||
        'Error al iniciar sesión. Verifica tus credenciales.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1929] via-[#0f1f33] to-[#0a1929] flex items-center justify-center p-4">
      <div className="w-full justify-center  max-w-md">
        <Logo />

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Bienvenido de nuevo
          </h1>
          <p className="text-gray-400">
            Inicia sesión en tu cuenta para continuar
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

          <Input
            id="password"
            type="password"
            label="Contraseña"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>

          <p className="text-center text-gray-400 text-sm">
            Don&apos;t have an account?{' '}
            <Link
              href="/sign-up"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Regístrate
            </Link>
          </p>
        </form>

        <p className="text-center text-gray-500 text-xs mt-8">
          Stable, secure, and transparent digital currency
        </p>
      </div>
    </div>
  );
}
