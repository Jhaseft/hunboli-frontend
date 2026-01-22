import { ReactNode } from 'react';

interface DropdownItemProps {
  onClick: () => void;
  icon?: ReactNode;
  children: ReactNode;
  variant?: 'default' | 'danger';
  className?: string;
}

export function DropdownItem({
  onClick,
  icon,
  children,
  variant = 'default',
  className = '',
}: DropdownItemProps) {
  const variantClasses = {
    default: 'text-gray-300 hover:bg-gray-800 hover:text-teal-400',
    danger: 'text-red-400 hover:bg-gray-800 hover:text-red-300',
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 transition-colors w-full text-left ${variantClasses[variant]} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
