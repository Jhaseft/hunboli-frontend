
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
    token: string;
    user: {
        "id": string;
        "email": string;
        "firstName": string;
        "KycStatus": string;

    };
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    KycStatus: string;
}