// src/lib/axios.ts
import axios from 'axios';
import { getAuthToken } from './cookies';

// 1. Crear la instancia
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // Tu backend NestJS
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Interceptor de Request (Para inyectar el Token automáticamente desde cookies)
api.interceptors.request.use(
    (config) => {
        // Obtener el token desde las cookies
        const token = typeof window !== 'undefined' ? getAuthToken() : null;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 3. Interceptor de Response (Para manejar errores globales, como 401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Opcional: Redirigir al login o limpiar token
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;