import { ROUTES } from '@/constants/routes';
import {
  HomeIcon,
  DashboardIcon,
  SettingsIcon,
  DocumentIcon,
  LogoutIcon,
} from '@/components/common/icons';

/**
 * Tipo para los items del menú de perfil
 */
export type ProfileMenuItemType = 'home' | 'dashboard' | 'settings' | 'kyc' | 'logout';

export interface ProfileMenuItem {
  id: ProfileMenuItemType;
  label: string;
  icon: typeof HomeIcon;
  href?: string;
  variant?: 'default' | 'danger';
  requiresAuth?: boolean;
  showInDashboard?: boolean;
  showOutsideDashboard?: boolean;
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
    id: 'kyc',
    label: 'KYC',
    icon: DocumentIcon,
    href: ROUTES.DASHBOARD_KYC,
    variant: 'default',
    requiresAuth: true,
    showInDashboard: true,
    showOutsideDashboard: true,
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
 * Filtra los items del menú según el contexto
 */
export function getProfileMenuItems(isDashboard: boolean): ProfileMenuItem[] {
  return PROFILE_MENU_ITEMS.filter((item) =>
    isDashboard ? item.showInDashboard : item.showOutsideDashboard
  );
}
