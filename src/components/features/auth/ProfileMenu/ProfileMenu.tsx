'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToggle } from '@/hooks/useToggle';
import { useClickOutside } from '@/hooks/useClickOutside';
import { ProfileButton } from './ProfileButton';
import { ProfileDropdown } from './ProfileDropdown';

interface ProfileMenuProps {
  isDashboard: boolean;
  variant?: 'desktop' | 'mobile';
}

export function ProfileMenu({ isDashboard, variant = 'desktop' }: ProfileMenuProps) {
  const [isOpen, toggle, , close] = useToggle(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  useClickOutside(menuRef, close, isOpen);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    close();
    router.push('/');
  };

  const handleNavigation = (href: string) => {
    close();
    router.push(href);
  };

  return (
    <div className="relative" ref={menuRef}>
      <ProfileButton user={user} isOpen={isOpen} onClick={toggle} variant={variant} />

      {isOpen && (
        <ProfileDropdown
          isDashboard={isDashboard}
          userRole={user.role}
          onNavigate={handleNavigation}
          onLogout={handleLogout}
          variant={variant}
        />
      )}
    </div>
  );
}
