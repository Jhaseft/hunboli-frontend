import { ReactNode } from 'react';

interface DropdownProps {
  children: ReactNode;
  className?: string;
}

export function Dropdown({ children, className = '' }: DropdownProps) {
  return (
    <div
      className={`absolute right-0 mt-2 w-56 rounded-lg bg-gray-900 border border-gray-700 shadow-xl overflow-hidden z-50 ${className}`}
    >
      <div className="py-1">{children}</div>
    </div>
  );
}
