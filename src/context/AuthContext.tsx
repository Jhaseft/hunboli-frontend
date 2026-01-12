'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
    getAuthToken,
    setAuthToken,
    getUserData,
    setUserData,
    clearAuthCookies,
} from '@/lib/cookies';

interface User {
    id: string;
    email: string;
    firstName: string;
    KycStatus: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, userData: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // 1. Cargar sesión al iniciar desde cookies
    useEffect(() => {
        // Migración: Si hay datos en localStorage, migrarlos a cookies
        const oldToken = localStorage.getItem('auth_token');
        const oldUserData = localStorage.getItem('user_data');

        if (oldToken && oldUserData) {
            try {
                const userData = JSON.parse(oldUserData);
                // Guardar en cookies
                setAuthToken(oldToken);
                setUserData(userData);
                // Limpiar localStorage
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user_data');
                console.log('✅ Sesión migrada de localStorage a cookies');
            } catch (error) {
                console.error('Error al migrar datos:', error);
            }
        }

        // Cargar desde cookies
        const storedToken = getAuthToken();
        const storedUser = getUserData<User>();

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(storedUser);
        }

        setIsLoading(false);
    }, []);

    // 2. Login - Guarda en cookies
    const login = (newToken: string, newUser: User) => {
        // Guardar en cookies
        setAuthToken(newToken);
        setUserData(newUser);

        // Actualizar estado
        setToken(newToken);
        setUser(newUser);

        // Redirigir automáticamente al dashboard
        router.push('/dashboard');
    };

    // 3. Logout - Elimina cookies
    const logout = () => {
        // Limpiar todas las cookies de autenticación
        clearAuthCookies();

        // Limpiar estado
        setUser(null);
        setToken(null);

        // Redirigir al login
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
    return context;
}