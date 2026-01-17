// src/services/wallet.service.ts
import api from '@/lib/axios';

export interface LinkWalletDto {
    walletAddress: string;
    password: string;
}

export interface LinkWalletResponse {
    success: boolean;
    message: string;
    walletAddress: string;
}

export const walletService = {
    /**
     * Vincula una wallet address al usuario autenticado
     * Requiere verificación de contraseña para seguridad
     * @param walletAddress - La dirección de la wallet de MetaMask
     * @param password - La contraseña del usuario para verificación
     */
    linkWallet: async (walletAddress: string, password: string): Promise<LinkWalletResponse> => {
        const { data } = await api.patch<LinkWalletResponse>('/users/link-wallet', {
            walletAddress,
            password,
        });
        return data;
    },

    /**
     * Obtiene la wallet vinculada del usuario (opcional - si tienes un endpoint para esto)
     */
    getLinkedWallet: async (): Promise<{ walletAddress: string | null }> => {
        const { data } = await api.get('/users/wallet');
        return data;
    },

    /**
     * Desvincula la wallet del usuario (opcional - si lo implementas en el backend)
     */
    unlinkWallet: async (): Promise<{ success: boolean }> => {
        const { data } = await api.delete('/users/link-wallet');
        return data;
    },
};
