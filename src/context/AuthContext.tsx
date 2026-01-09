'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation'; // 👈 Importamos el router

interface User {
    id: string;
    email: string;
    firstName: string;
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
    const router = useRouter(); // 👈 Instancia del router

    // 1. Cargar sesión al iniciar
    useEffect(() => {
        // NOTA: useEffect solo corre en el cliente, así que localStorage es seguro aquí.
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user_data');

        if (storedToken && storedUser) {
            setToken(storedToken);
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('user_data');
            }
        }
        setIsLoading(false);
    }, []);

    // 2. Login
    const login = (newToken: string, newUser: User) => {
        localStorage.setItem('auth_token', newToken);
        localStorage.setItem('user_data', JSON.stringify(newUser));

        setToken(newToken);
        setUser(newUser);

        // 👇 Redirigir automáticamente al dashboard
        router.push('/dashboard');
    };

    // 3. Logout
    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        setUser(null);
        setToken(null);

        // 👇 Redirigir al login
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