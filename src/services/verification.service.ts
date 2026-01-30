import api from '@/lib/axios';

export interface VerificationData {
    id: string;
    userId: string;
    imageUrl: string;
    cloudinaryPublicId: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export const verificationService = {

    uploadVerificationFile: async (file: File): Promise<VerificationData> => {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await api.post<VerificationData>("verification/upload", formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    },

    getVerificationStatus: async (): Promise<VerificationData | null> => {
        try {
            const { data } = await api.get<VerificationData>("verification/status");
            return data;
        } catch {
            return null;
        }
    },
    getPendingRequests: async (): Promise<VerificationData[] | null> => {
        const { data } = await api.get<VerificationData[]>("verification");
        return data;
    },
    getApprovedRequests: async (): Promise<VerificationData[] | null> => {
        const { data } = await api.get<VerificationData[]>("verification");
        return data;
    }

}