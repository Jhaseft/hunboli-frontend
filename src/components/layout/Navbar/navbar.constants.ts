import { ROUTES } from '@/constants/routes';

/**
 * Enlaces de navegación principal
 */
export const NAV_LINKS = [
  { label: '¿Por qué Hunboli?', href: ROUTES.WHY },
  { label: 'Cómo funciona', href: ROUTES.HOW_IT_WORKS },
  { label: 'Transparencia', href: ROUTES.TRANSPARENCY },
  { label: 'Noticias', href: ROUTES.NEWS },
] as const;

/**
 * Rutas donde el Navbar debe estar oculto
 */
export const HIDDEN_NAVBAR_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.SIGN_UP,
  ROUTES.RESET_PASSWORD,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.DASHBOARD_SETTINGS,
  ROUTES.DASHBOARD_VERIFY_ACCOUNT,
  ROUTES.COMPLETE_PROFILE,
  '/admin',
] as const;

/**
 * Verifica si el Navbar debe estar oculto en una ruta específica
 */
export function shouldHideNavbar(pathname: string): boolean {
  return HIDDEN_NAVBAR_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}
