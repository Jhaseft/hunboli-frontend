// src/lib/axios.ts
import axios from 'axios';

// 1. Crear la instancia
const api = axios.create({
    baseURL: process.env.BACKEND_URL || 'http://localhost:4001', // Tu backend NestJS
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Interceptor de Request (Para inyectar el Token automáticamente)
api.interceptors.request.use(
    (config) => {
        // Si guardas el token en localStorage (o cookies)
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

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