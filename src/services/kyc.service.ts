import api from '@/lib/axios';
import type { KycStatus } from '@/types/auth.types';

export type KycDocumentType = 'ID_FRONT' | 'ID_BACK' | 'LIVENESS_VIDEO';

export interface KycRequestResponse {
  requestId: string | null;
  status: KycStatus;
  missingDocs: KycDocumentType[];
}

export interface KycMeResponse {
  userId: string;
  kycStatus: KycStatus;
  requestActual: {
    id: string;
    status: KycStatus;
    reviewNote?: string | null;
    createdAt: string;
    updatedAt: string;
    reviewedAt?: string | null;
  } | null;
  reviewNote?: string | null;
  missingDocs: KycDocumentType[];
}

export interface KycUploadResponse {
  docType: KycDocumentType;
  publicId: string;
  uploadedAt: string;
}

export const kycService = {
  getMe: async (): Promise<KycMeResponse> => {
    const { data } = await api.get<KycMeResponse>('kyc/me');
    return data;
  },

  createRequest: async (): Promise<KycRequestResponse> => {
    const { data } = await api.post<KycRequestResponse>('kyc/request');
    return data;
  },

  uploadDocument: async (
    requestId: string,
    type: 'id-front' | 'id-back' | 'video',
    file: File,
  ): Promise<KycUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post<KycUploadResponse>(
      `kyc/request/${requestId}/upload/${type}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return data;
  },

  submitRequest: async (requestId: string): Promise<{ requestId: string; status: KycStatus }> => {
    const { data } = await api.post<{ requestId: string; status: KycStatus }>(
      `kyc/request/${requestId}/submit`,
    );
    return data;
  },
};
