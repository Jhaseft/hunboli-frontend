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
export interface VerificationRequest {
    id: string;
    userId: string;
    imageUrl: string;
    cloudinaryPublicId: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    users: Users;
}

export interface Users {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
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
    getPendingRequests: async (): Promise<VerificationRequest[] | null> => {
        const { data } = await api.get<VerificationRequest[]>("verification/requests/PENDING");
        return data;
    },
    getApprovedRequests: async (): Promise<VerificationRequest[] | null> => {
        const { data } = await api.get<VerificationRequest[]>("verification/requests/APPROVED");
        return data;
    },
    getRejectedRequests: async (): Promise<VerificationRequest[] | null> => {
        const { data } = await api.get<VerificationRequest[]>("verification/requests/REJECTED");
        return data;
    },
    approveVerificationRequest: async (requestId: string): Promise<VerificationData | null> => {
        const { data } = await api.patch<VerificationData>("verification/accept", { requestId });
        return data;
    },
    rejectVerificationRequest: async (requestId: string): Promise<VerificationData | null> => {
        const { data } = await api.patch<VerificationData>("verification/reject", { requestId });
        return data;
    }


}

