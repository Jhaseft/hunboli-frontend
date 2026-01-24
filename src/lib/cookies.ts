import Cookies from 'js-cookie';

/**
 * Configuración de cookies seguras
 */
const COOKIE_OPTIONS = {
  expires: 7, // 7 días
  secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
  sameSite: 'lax' as const, // 'lax' permite navegación normal, 'strict' puede causar problemas con redirecciones
  path: '/', // Disponible en toda la app
};

/**
 * Nombres de las cookies
 */
export const COOKIE_NAMES = {
  AUTH_TOKEN: 'auth_token',
  // USER_DATA removido por seguridad - no guardar datos sensibles en cookies
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
 * ⚠️ SEGURIDAD: No guardar datos del usuario en cookies
 * 
 * Los datos del usuario contienen información sensible (email, nombre, teléfono, 
 * dirección de billetera, estado KYC) que no debe almacenarse en cookies en texto plano.
 * 
 * En su lugar:
 * - Mantener los datos solo en el estado de React durante la sesión
 * - Usar sessionStorage si se necesita persistencia temporal (se limpia al cerrar la pestaña)
 * - Siempre obtener datos frescos del backend cuando sea necesario
 */

/**
 * Guarda los datos del usuario en sessionStorage (solo durante la sesión del navegador)
 * Esto es más seguro que cookies porque:
 * - No se envía automáticamente en cada request HTTP
 * - Se limpia automáticamente al cerrar la pestaña
 * - Solo accesible desde JavaScript en el mismo origen
 */
export function setUserData(userData: object): void {
  if (typeof window === 'undefined') return; // SSR safety
  try {
    const jsonString = JSON.stringify(userData);
    sessionStorage.setItem('user_data', jsonString);
  } catch (error) {
    console.error('Error saving user data to sessionStorage:', error);
  }
}

/**
 * Obtiene los datos del usuario desde sessionStorage
 */
export function getUserData<T>(): T | null {
  if (typeof window === 'undefined') return null; // SSR safety
  try {
    const data = sessionStorage.getItem('user_data');
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch (error) {
    console.error('Error parsing user data from sessionStorage:', error);
    removeUserData();
    return null;
  }
}

/**
 * Elimina los datos del usuario de sessionStorage
 */
export function removeUserData(): void {
  if (typeof window === 'undefined') return; // SSR safety
  try {
    sessionStorage.removeItem('user_data');
  } catch (error) {
    console.error('Error removing user data from sessionStorage:', error);
  }
}

/**
 * Limpia todas las cookies de autenticación y datos de sesión
 */
export function clearAuthCookies(): void {
  removeAuthToken();
  removeUserData();
}
