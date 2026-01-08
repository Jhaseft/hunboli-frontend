// src/lib/api.js
import axios from 'axios';

// 1. Crear una instancia básica de Axios
const api = axios.create({
    baseURL: process.env.BACKEND_URL, // La URL de tu backend NestJS
});

// 2. Configurar el INTERCEPTOR (El portero)
// Esto se ejecuta ANTES de que salga cualquier petición
api.interceptors.request.use((config) => {

    // Verificamos si estamos en el navegador (para evitar errores en el servidor de Next.js)
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token'); // O como hayas nombrado la clave

        if (token) {
            // Si hay token, lo pegamos en el header
            config.headers.Authorization = `Bearer ${token}`;
        }
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;