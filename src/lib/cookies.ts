import Cookies from 'js-cookie';

/**
 * Configuración de cookies seguras
 */
const COOKIE_OPTIONS = {
  expires: 7, // 7 días
  secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
  sameSite: 'strict' as const, // Protección CSRF
  path: '/', // Disponible en toda la app
};

/**
 * Nombres de las cookies
 */
export const COOKIE_NAMES = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
} as const;

/**
 * Guarda el token de autenticación en una cookie
 */
export function setAuthToken(token: string): void {
  Cookies.set(COOKIE_NAMES.AUTH_TOKEN, token, COOKIE_OPTIONS);
}

/**
 * Obtiene el token de autenticación desde la cookie
 */
export function getAuthToken(): string | undefined {
  return Cookies.get(COOKIE_NAMES.AUTH_TOKEN);
}

/**
 * Elimina el token de autenticación
 */
export function removeAuthToken(): void {
  Cookies.remove(COOKIE_NAMES.AUTH_TOKEN, { path: '/' });
}

/**
 * Guarda los datos del usuario en una cookie (como JSON)
 */
export function setUserData(userData: object): void {
  const jsonString = JSON.stringify(userData);
  Cookies.set(COOKIE_NAMES.USER_DATA, jsonString, COOKIE_OPTIONS);
}

/**
 * Obtiene los datos del usuario desde la cookie
 */
export function getUserData<T>(): T | null {
  const data = Cookies.get(COOKIE_NAMES.USER_DATA);
  if (!data) return null;

  try {
    return JSON.parse(data) as T;
  } catch (error) {
    console.error('Error parsing user data from cookie:', error);
    removeUserData();
    return null;
  }
}

/**
 * Elimina los datos del usuario
 */
export function removeUserData(): void {
  Cookies.remove(COOKIE_NAMES.USER_DATA, { path: '/' });
}

/**
 * Limpia todas las cookies de autenticación
 */
export function clearAuthCookies(): void {
  removeAuthToken();
  removeUserData();
}
