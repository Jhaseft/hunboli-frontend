/**
 * Rutas de la aplicación centralizadas
 */
export const ROUTES = {
  // Páginas públicas
  HOME: '/',
  WHY: '/why',
  HOW_IT_WORKS: '/how-it-works',
  TRANSPARENCY: '/transparency',
  NEWS: '/news',

  // Autenticación
  LOGIN: '/login',
  SIGN_UP: '/sign-up',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Dashboard
  DASHBOARD: '/dashboard',
  DASHBOARD_SETTINGS: '/dashboard/settings',
  DASHBOARD_KYC: '/dashboard/kyc',
  DASHBOARD_DEPOSITS: '/dashboard/deposits',
  DASHBOARD_VERIFY_ACCOUNT: '/dashboard/verify-account',

  // Admin
  ADMIN_DEPOSITS: '/admin/deposits',
  ADMIN_MINTS: '/admin/mints',

  // Onboarding
  COMPLETE_PROFILE: '/complete-profile',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteValue = typeof ROUTES[RouteKey];
