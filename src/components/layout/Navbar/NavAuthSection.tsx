import { User } from '@/types';
import { AuthButtons } from '@/components/features/auth/AuthButtons';
import { ProfileMenu } from '@/components/features/auth/ProfileMenu';
import { VerificationBadge } from '@/components/features/auth/VerificationBadge';

interface NavAuthSectionProps {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  isDashboard: boolean;
  variant?: 'desktop' | 'mobile';
}

export function NavAuthSection({
  isLoading,
  isAuthenticated,
  user,
  isDashboard,
  variant = 'desktop',
}: NavAuthSectionProps) {
  if (isLoading) {
    return variant === 'desktop' ? (
      <div className="w-24 h-8 bg-gray-800/50 rounded-full animate-pulse" />
    ) : (
      <div className="h-10 w-10 rounded-full bg-gray-800/50 animate-pulse" />
    );
  }

  if (!isAuthenticated) {
    return variant === 'desktop' ? <AuthButtons /> : null;
  }

  return (
    <>
      {variant === 'desktop' && isDashboard && (
        <>
          <div className="flex items-center gap-2 px-3 py-2 text-gray-200">
            <VerificationBadge isVerified={user?.isVerified ?? false} />
          </div>

          <div
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              user?.kycStatus === 'APPROVED'
                ? 'bg-green-600/20 text-green-300 border border-green-500/30'
                : user?.kycStatus === 'REJECTED'
                ? 'bg-red-600/20 text-red-300 border border-red-500/30'
                : 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/30'
            }`}
          >
            {user?.kycStatus === 'APPROVED'
              ? 'KYC Aprobado'
              : user?.kycStatus === 'REJECTED'
              ? 'KYC Rechazado'
              : 'KYC Pendiente'}
          </div>
        </>
      )}

      {variant === 'mobile' && isDashboard && (
        <VerificationBadge isVerified={user?.isVerified ?? false} />
      )}

      <ProfileMenu isDashboard={isDashboard} variant={variant} />
    </>
  );
}
