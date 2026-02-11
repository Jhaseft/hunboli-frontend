import { ROUTES } from '@/constants/routes';
import {
  HomeIcon,
  DashboardIcon,
  SettingsIcon,
  LogoutIcon,
  WalletIcon,
  ShieldIcon,
} from '@/components/common/icons';

/**
 * Tipo para los items del menú de perfil
 */
export type ProfileMenuItemType = 'home' | 'dashboard' | 'settings' | 'deposits' | 'admin-deposits' | 'logout' | 'retiros';

export interface ProfileMenuItem {
  id: ProfileMenuItemType;
  label: string;
  icon: typeof HomeIcon;
  href?: string;
  variant?: 'default' | 'danger';
  requiresAuth?: boolean;
  showInDashboard?: boolean;
  showOutsideDashboard?: boolean;
  requiredRole?: 'admin'; // Solo visible para este rol
  excludedRoles?: string[]; // No visible para estos roles
}

/**
 * Configuración de items del menú de perfil
 */
export const PROFILE_MENU_ITEMS: ProfileMenuItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: HomeIcon,
    href: ROUTES.HOME,
    variant: 'default',
    requiresAuth: true,
    showInDashboard: true,
    showOutsideDashboard: false,
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: DashboardIcon,
    href: ROUTES.DASHBOARD,
    variant: 'default',
    requiresAuth: true,
    showInDashboard: false,
    showOutsideDashboard: true,
  },
  {
    id: 'settings',
    label: 'Configuración',
    icon: SettingsIcon,
    href: ROUTES.DASHBOARD_SETTINGS,
    variant: 'default',
    requiresAuth: true,
    showInDashboard: true,
    showOutsideDashboard: true,
  },
  {
    id: 'deposits',
    label: 'Mis Depósitos',
    icon: WalletIcon,
    href: ROUTES.DASHBOARD_DEPOSITS,
    variant: 'default',
    requiresAuth: true,
    showInDashboard: true,
    showOutsideDashboard: false,
    excludedRoles: ['admin'], // No mostrar a admins
  },
  {
    id: 'retiros',
    label: 'Mis Retiros',
    icon: WalletIcon,
    href: ROUTES.DASHBOARD_WITHDRAWALS,
    variant: 'default',
    requiresAuth: true,
    showInDashboard: true,
    showOutsideDashboard: false,
    excludedRoles: ['admin'], // No mostrar a admins
  },
  {
    id: 'admin-deposits',
    label: 'Admin Depósitos',
    icon: ShieldIcon,
    href: ROUTES.ADMIN_DEPOSITS,
    variant: 'default',
    requiresAuth: true,
    showInDashboard: true,
    showOutsideDashboard: true,
    requiredRole: 'admin',
  },
  {
    id: 'logout',
    label: 'Cerrar sesión',
    icon: LogoutIcon,
    variant: 'danger',
    requiresAuth: true,
    showInDashboard: true,
    showOutsideDashboard: true,
  },
];

/**
 * Filtra los items del menú según el contexto y rol del usuario
 */
export function getProfileMenuItems(isDashboard: boolean, userRole?: string): ProfileMenuItem[] {
  const normalizedUserRole = userRole?.toLowerCase();

  return PROFILE_MENU_ITEMS.filter((item) => {
    // Filtrar por contexto (dashboard o no)
    const contextMatch = isDashboard ? item.showInDashboard : item.showOutsideDashboard;

    // Filtrar por rol si el item requiere uno específico
    const roleMatch = !item.requiredRole || normalizedUserRole === item.requiredRole;

    // Excluir si el rol del usuario está en la lista de excluidos
    const notExcluded =
      !item.excludedRoles || !normalizedUserRole || !item.excludedRoles.includes(normalizedUserRole);

    return contextMatch && roleMatch && notExcluded;
  });
}
