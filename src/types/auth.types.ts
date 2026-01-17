
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
}

export interface AuthResponse {
    access_token: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        kycStatus: string;
        walletAddress: string | null;
    };
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    kycStatus: string;
    walletAddress: string | null;
}