
export enum Country {
    BOLIVIA = 'BOLIVIA',
    PERU = 'PERU',
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    country: Country;
    phoneNumber?: string;
}

export type KycStatus =
    | 'UNVERIFIED'
    | 'PENDING'
    | 'NEED_CORRECTION'
    | 'VERIFIED'
    | 'REJECTED'
    | 'BLACKLISTED';

export interface AuthResponse {
    access_token: string;
    user: User;
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string | null;
    country: Country;
    walletAddress: string | null;
    kycStatus: KycStatus;
    role: string;
    createdAt: string;
    updatedAt: string;
    lastLogin: string | null;
    isGoogleAccount: boolean | null;
    isOnboardingCompleted: boolean;
    isVerified: boolean;
}

export interface CompleteProfileDto {
    password: string;
    phoneNumber: string;
    country: Country;
}

export interface VerifyCodeDto {
    email: string;
    code: string;
}

export interface MessageResponse {
    message: string;
}
