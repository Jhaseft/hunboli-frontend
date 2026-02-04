import api from '@/lib/axios';
import type { KycStatus } from '@/types/auth.types';
import type { KycDocumentType } from './kyc.service';

export interface AdminKycListItem {
  requestId: string;
  status: KycStatus;
  createdAt: string;
  reviewedAt: string | null;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  missingDocs: KycDocumentType[];
}

export interface AdminKycListResponse {
  items: AdminKycListItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminKycDetailResponse {
  request: {
    id: string;
    status: KycStatus;
    reviewNote: string | null;
    createdAt: string;
    reviewedAt: string | null;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    };
  };
  documents: Array<{
    docType: KycDocumentType;
    publicId: string;
    mimeType: string | null;
    bytes: number | null;
    uploadedAt: string | null;
    resourceType: 'image' | 'video' | 'raw';
    signedUrl: string;
  }>;
}

export const adminKycService = {
  list: async (params?: {
    status?: KycStatus;
    page?: number;
    limit?: number;
  }): Promise<AdminKycListResponse> => {
    const { data } = await api.get<AdminKycListResponse>('admin/kyc', {
      params: {
        status: params?.status,
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
      },
    });
    return data;
  },

  getOne: async (id: string): Promise<AdminKycDetailResponse> => {
    const { data } = await api.get<AdminKycDetailResponse>(`admin/kyc/${id}`);
    return data;
  },

  approve: async (id: string, note?: string) => {
    const { data } = await api.patch<{ requestId: string; status: KycStatus }>(
      `admin/kyc/${id}/approve`,
      { note },
    );
    return data;
  },

  requestCorrection: async (id: string, reviewNote: string) => {
    const { data } = await api.patch<{ requestId: string; status: KycStatus }>(
      `admin/kyc/${id}/request-correction`,
      { reviewNote },
    );
    return data;
  },

  reject: async (id: string, reviewNote?: string) => {
    const { data } = await api.patch<{ requestId: string; status: KycStatus }>(
      `admin/kyc/${id}/reject`,
      { reviewNote },
    );
    return data;
  },

  getPendingCount: async (): Promise<number> => {
    const { data } = await api.get<AdminKycListResponse>('admin/kyc', {
      params: { status: 'PENDING', page: 1, limit: 1 },
    });
    return data.total ?? 0;
  },
};
