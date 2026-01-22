// src/services/auth.service.ts
import api from '@/lib/axios';
import { LoginDto, RegisterDto, AuthResponse, CompleteProfileDto } from '@/types/index'; // Tus interfaces

export const userService = {

    //change phone number
    editPhoneNumber: async (phoneNumber: string) => {
        const { data } = await api.patch('/users/edit-phone-number', { phoneNumber });
        return data;
    },

    //change password
    editPassword: async (oldPassword: string, newPassword: string) => {
        const { data } = await api.patch('/users/edit-password', { oldPassword, newPassword });
        return data;
    },

    // Obtener perfil (Ejemplo con GET)
    getProfile: async () => {
        const { data } = await api.get('/users/profile');
        return data;
    },
};