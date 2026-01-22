import { ChevronIcon } from '@/components/common/icons';
import { User } from '@/types';

interface ProfileButtonProps {
  user: User;
  isOpen: boolean;
  onClick: () => void;
  variant?: 'desktop' | 'mobile';
}

export function ProfileButton({
  user,
  isOpen,
  onClick,
  variant = 'desktop',
}: ProfileButtonProps) {
  const userInitial = (user?.firstName?.[0] ?? 'U').toUpperCase();
  const userName = user?.firstName || 'Usuario';

  if (variant === 'mobile') {
    return (
      <button
        onClick={onClick}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-teal-600/20 border border-teal-500/30 text-teal-200 font-semibold hover:bg-teal-600/30 transition"
        aria-label="Perfil"
        title="Perfil"
      >
        <span className="text-sm">{userInitial}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="relative inline-flex items-center gap-2 rounded-full bg-gray-800/40 border border-gray-700 px-3 py-2 text-gray-100 hover:bg-gray-800/70 transition"
      aria-label="Perfil"
      title="Perfil"
    >
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-600/20 border border-teal-500/30 text-teal-200 font-semibold">
        {userInitial}
      </span>
      <span className="text-sm font-medium">{userName}</span>
      <ChevronIcon isOpen={isOpen} />
    </button>
  );
}
