// src/services/auth.service.ts
import api from '@/lib/axios';
import { LoginDto, RegisterDto, AuthResponse, CompleteProfileDto, MessageResponse, VerifyCodeDto } from '@/types/index';

export const authService = {
    // Login
    login: async (credentials: LoginDto) => {
        const { data } = await api.post<AuthResponse>('/auth/login', credentials);
        return data;
    },

    // Signup - envía código de verificación al email
    signup: async (userData: RegisterDto) => {
        const { data } = await api.post<MessageResponse>('/auth/signup', userData);
        return data;
    },

    // Verificar código y crear cuenta
    verifySignupCode: async (verifyData: VerifyCodeDto) => {
        const { data } = await api.post<AuthResponse>('/auth/verify-signup', verifyData);
        return data;
    },

    // Reenviar código de verificación
    resendCode: async (email: string) => {
        const { data } = await api.post<MessageResponse>('/auth/resend-code', { email });
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
    },
    completeProfile: async (completeProfileData: CompleteProfileDto) => {
        const { data } = await api.patch('/users/complete-profile', completeProfileData);
        return data;
    }
};