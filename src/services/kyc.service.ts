import api from '@/lib/axios';
import type { KycStatus } from '@/types/auth.types';

export interface KycMeResponse {
  kycStatus: KycStatus;
  kycSessionId?: string | null;
  kycSessionExpiresAt?: string | null;
}

export interface KycStartResponse {
  status?: 'verified';
  redirect_url?: string;
  expires_at?: string | null;
}

export const kycService = {
  getMe: async (): Promise<KycMeResponse> => {
    const { data } = await api.get<KycMeResponse>('kyc/me');
    return data;
  },

  start: async (): Promise<KycStartResponse> => {
    const { data } = await api.post<KycStartResponse>('kyc/start');
    return data;
  },
};
