'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/LogoAnimacion';
import { MobileMenu } from '@/components/Home/Layouts/MobileMenu';
import { useAuth } from '@/context/AuthContext';
import { NavLinks } from './NavLinks';
import { NavAuthSection } from './NavAuthSection';
import { MobileMenuButton } from './MobileMenuButton';
import { shouldHideNavbar, NAV_LINKS } from './navbar.constants';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, token, logout, isLoading } = useAuth();

  const hideNavbar = shouldHideNavbar(pathname);
  const isDashboard = pathname.startsWith('/dashboard');
  const isAuthenticated = !isLoading && !!token && !!user;
  const showDashboardUI = isDashboard;

  if (hideNavbar) return null;

  return (
    <>
      <nav
        className={`${
          showDashboardUI
            ? 'relative bg-gray-950'
            : 'fixed top-0 left-0 right-0 bg-gray-950/80 backdrop-blur-lg'
        } z-50 border-b border-gray-800`}
      >
        <div className="max-w-7xl mx-auto px-6 py-1 relative">
          <div className="flex items-center justify-between">
            <Logo disableLink={showDashboardUI} />

            {!showDashboardUI && <NavLinks />}

            {/* Desktop: botones de auth o perfil - oculto en mobile, visible en md+ */}
            <div className="hidden! md:flex! items-center gap-1">
              <NavAuthSection
                isLoading={isLoading}
                isAuthenticated={isAuthenticated}
                user={user}
                isDashboard={isDashboard}
                variant="desktop"
              />
            </div>

            {/* Mobile: perfil y hamburguesa - visible en mobile, oculto en md+ */}
            <div className="flex md:hidden! items-center gap-3">
              <NavAuthSection
                isLoading={isLoading}
                isAuthenticated={isAuthenticated}
                user={user}
                isDashboard={isDashboard}
                variant="mobile"
              />

              {/* Hamburguesa (solo cuando NO está en dashboard) */}
              {!showDashboardUI && (
                <MobileMenuButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
              )}
            </div>
          </div>
        </div>
      </nav>

      {!showDashboardUI && (
        <MobileMenu
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          links={[...NAV_LINKS]}
          isAuthenticated={isAuthenticated}
          onLogout={logout}
        />
      )}
    </>
  );
}
