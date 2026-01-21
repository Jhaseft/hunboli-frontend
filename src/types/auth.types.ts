
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

export interface AuthResponse {
    access_token: string;
    user: User;
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    country?: string | null;
    phoneNumber?: string | null;
    kycStatus: string;
    role: string;
    walletAddress: string | null;
    isOnboardingCompleted: boolean;
    hasPassword?: boolean;
}

export interface CompleteProfileDto {
    password: string;
    phoneNumber: string;
    country: Country;
}