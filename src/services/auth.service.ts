// src/services/auth.service.ts
import api from '@/lib/axios';
import { LoginDto, RegisterDto, AuthResponse } from '@/types/index'; // Tus interfaces

export const authService = {
    // Login
    login: async (credentials: LoginDto) => {
        const { data } = await api.post<AuthResponse>('/auth/login', credentials);
        return data;
    },

    // Signup
    signup: async (userData: RegisterDto) => {
        const { data } = await api.post<AuthResponse>('/auth/signup', userData);
        return data;
    },

    // Obtener perfil (Ejemplo con GET)
    getProfile: async () => {
        const { data } = await api.get('/auth/profile');
        return data;
    }
};