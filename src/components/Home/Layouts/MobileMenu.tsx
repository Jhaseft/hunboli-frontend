import { Logo } from '@/components/ui/LogoAnimacion';
import Link from 'next/link';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: { label: string; href: string }[];
}

export function MobileMenu({ isOpen, onClose, links }: MobileMenuProps) {
  return (
    <>
      
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      
      <div
        className={`fixed inset-0 bg-gray-950/95 backdrop-blur-xl transform transition-transform duration-300 z-50
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        md:hidden flex flex-col`}
      >
       
        <div className="flex items-center justify-between px-8 py-6 border-b border-teal-400/20 shadow-[0_4px_30px_rgba(45,212,191,0.08)]">
          <Logo />
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-teal-400 transition-colors"
            aria-label="Cerrar menú"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

  
        <div className="flex flex-col px-8 py-10 gap-6 flex-1">
          {links.map((link, index) => (
            <div key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                className="block text-2xl font-semibold text-gray-300 hover:text-teal-400 transition-colors"
              >
                {link.label}
              </Link>

              {index !== links.length - 1 && (
                <div className="mt-6 h-px bg-gradient-to-r from-transparent via-teal-400/30 to-transparent" />
              )}
            </div>
          ))}
        </div>

     
        <div className="px-8 py-8 border-t border-teal-400/20 shadow-[0_-10px_40px_rgba(45,212,191,0.12)]">
          <div className="flex flex-col gap-4">
            <Link
              href="/login"
              onClick={onClose}
              className="text-xl text-gray-300 text-center hover:text-teal-400 transition-colors"
            >
              Iniciar sesión
            </Link>

            <Link
              href="/register"
              onClick={onClose}
              className="text-center py-3 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white rounded-full text-lg shadow-lg shadow-teal-500/20 transition-all"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
