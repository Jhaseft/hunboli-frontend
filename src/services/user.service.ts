// src/services/auth.service.ts
import api from '@/lib/axios';
import { LoginDto, RegisterDto, AuthResponse, CompleteProfileDto } from '@/types/index'; // Tus interfaces

export const userService = {

    //change phone number
    editPhoneNumber: async (phoneNumber: string) => {
        const { data } = await api.patch('/users/edit-phone-number', { phoneNumber });
        return data;
    },

    // Obtener perfil (Ejemplo con GET)
    getProfile: async () => {
        const { data } = await api.get('/users/profile');
        return data;
    },
};