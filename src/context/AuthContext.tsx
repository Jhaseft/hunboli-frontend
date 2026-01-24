'use client';

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useCallback
} from 'react';
import { useRouter, usePathname } from 'next/navigation'; // 👈 Agregamos usePathname
import axios from 'axios'; // 👈 Necesitamos axios para el refreshUser
import {
    getAuthToken,
    setAuthToken,
    getUserData,
    setUserData,
    clearAuthCookies,
} from '@/lib/cookies';
import { User } from '@/types/auth.types';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, userData: User) => void;
    logout: () => void;
    updateWalletAddress: (walletAddress: string) => void;
    refreshUser: () => Promise<void>; // 👈 La nueva función estrella
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// URL del Backend (puedes poner esto en un .env)
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

// Función helper para inicializar el estado desde sessionStorage de forma síncrona
function getInitialUserState(): User | null {
    if (typeof window === 'undefined') return null; // SSR safety
    try {
        const data = sessionStorage.getItem('user_data');
        if (!data) return null;
        return JSON.parse(data) as User;
    } catch (error) {
        console.error('Error parsing initial user data from sessionStorage:', error);
        return null;
    }
}

function getInitialTokenState(): string | null {
    if (typeof window === 'undefined') return null; // SSR safety
    return getAuthToken() || null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    // Inicializar estado de forma síncrona desde sessionStorage (similar a como funcionaba con cookies)
    const [user, setUser] = useState<User | null>(getInitialUserState);
    const [token, setToken] = useState<string | null>(getInitialTokenState);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();
    const pathname = usePathname(); // 👈 Para saber en qué página estamos

    // 3. Logout (definido antes para que refreshUser pueda usarlo)
    const logout = useCallback(() => {
        clearAuthCookies();
        setUser(null);
        setToken(null);
        router.push('/login');
    }, [router]);

    // -------------------------------------------------------------------
    // NUEVA FUNCIÓN: refreshUser
    // Pide los datos más frescos al backend y actualiza el estado.
    // -------------------------------------------------------------------
    const refreshUser = useCallback(async () => {
        const currentToken = getAuthToken();
        if (!currentToken) return;

        try {
            const { data } = await axios.get(`${API_URL}/users/profile`, {
                headers: { Authorization: `Bearer ${currentToken}` }
            });

            // Actualizamos memoria (React)
            setUser(data);
            // Actualizamos caché (sessionStorage) - solo para persistencia temporal durante la sesión
            setUserData(data);

            console.log("🔄 Datos de usuario refrescados", data);
        } catch (error) {
            console.error("Error refrescando usuario:", error);
            // Si el token no sirve (401), cerramos sesión por seguridad
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                logout();
            }
        }
    }, [logout]);

    // 1. Cargar sesión al iniciar
    useEffect(() => {
        const initSession = async () => {
            // Migración legacy (LocalStorage -> Cookies)
            const oldToken = localStorage.getItem('auth_token');
            const oldUserData = localStorage.getItem('user_data');
            if (oldToken && oldUserData) {
                try {
                    const parsedData = JSON.parse(oldUserData);
                    setAuthToken(oldToken);
                    setUserData(parsedData);
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user_data');
                } catch (e) { console.error(e); }
            }

            // Carga normal desde Cookies (solo token)
            const storedToken = getAuthToken();

            if (storedToken) {
                // El token y user ya están inicializados síncronamente arriba
                // Ahora validamos y refrescamos desde el backend
                // SIEMPRE pedimos datos frescos al backend (Fetch on Load)
                // Esto asegura que si cambió algo en la BD, se refleje.
                // También previene que datos obsoletos o manipulados se usen
                try {
                    const { data } = await axios.get(`${API_URL}/users/profile`, {
                        headers: { Authorization: `Bearer ${storedToken}` }
                    });
                    setUser(data);
                    // Actualizamos sessionStorage con datos frescos del backend
                    setUserData(data);
                } catch (error) {
                    // Si falla el perfil, logout
                    clearAuthCookies();
                    setToken(null);
                    setUser(null);
                }
            } else {
                // Si no hay token, limpiamos todo
                setUser(null);
                setToken(null);
            }
            setIsLoading(false);
        };

        initSession();
    }, []);

    // 2. Login
    const login = useCallback((newToken: string, newUser: User) => {
        setAuthToken(newToken);
        setUserData(newUser);
        setToken(newToken);
        setUser(newUser);

        // Redirección inteligente basada en el onboarding
        if (!newUser.isOnboardingCompleted) {
            router.push('/complete-profile');
        } else {
            router.push('/dashboard');
        }
    }, [router]);

    // 4. Update Wallet (Optimista)
    // Actualiza localmente, pero idealmente deberías llamar a refreshUser() después
    const updateWalletAddress = (walletAddress: string) => {
        if (user) {
            const updatedUser = { ...user, walletAddress };
            setUser(updatedUser);
            // Actualizamos sessionStorage con el cambio optimista
            setUserData(updatedUser);
        }
    };

    // -------------------------------------------------------------------
    // GUARDIA DE ONBOARDING 🛡️
    // Vigila que nadie entre al dashboard sin completar perfil
    // -------------------------------------------------------------------
    useEffect(() => {
        if (!isLoading && user && token) {
            // Si NO ha completado onboarding...
            if (!user.isOnboardingCompleted) {
                // Rutas permitidas durante el proceso de onboarding
                const allowedPaths = ['/complete-profile', '/logout', '/auth/callback'];
                const isAllowedPath = allowedPaths.some(path => pathname?.startsWith(path));

                if (!isAllowedPath) {
                    console.log("🚫 Redirigiendo a completar perfil...");
                    router.replace('/complete-profile');
                }
            }
        }
    }, [user?.isOnboardingCompleted, token, isLoading, pathname, router]);

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            updateWalletAddress,
            refreshUser, // 👈 Exportamos esto
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
    return context;
}