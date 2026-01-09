'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Si terminó de cargar y NO hay usuario, patada al login
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    // 1. Estado de Carga: Muestra un spinner o nada
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // 2. Si no hay usuario (y ya intentamos redirigir), no renderices nada del contenido secreto
    if (!user) {
        return null;
    }

    // 3. Si todo está bien, muestra la página protegida
    return <>{children}</>;
}