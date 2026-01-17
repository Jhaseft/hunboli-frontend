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
        const { data } = await api.get('/users/profile');
        return data;
    },

    forgotPassword: async (email: string) => {
        const { data } = await api.post('/auth/forgot-password', { email });
        return data;
    },

    resetPassword: async (token: string, newPassword: string) => {
        const body = { token, newPassword };
        console.log(body);
        const { data } = await api.post('/auth/reset-password', body);
        return data;
    }
};