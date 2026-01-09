import Link from 'next/link';
import { Logo } from '../ui/LogoAnimacion';

const NAV_LINKS = [
  { label: '¿Por qué Hunboli?', href: '/why' },
  { label: 'Cómo funciona', href: '/how-it-works' },
  { label: 'Transparencia', href: '/transparency' },
  { label: 'Noticias', href: '/news' },
];

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          <Logo />

          <div className="hidden md:flex items-center gap-8 relative">
            {NAV_LINKS.map((link) => (
              <div key={link.href} className="relative">

                <span className="navLinkGlow"></span>

                <Link
                  href={link.href}
                  className="relative text-gray-300 hover:text-teal-400 transition-colors px-3 py-1 rounded-md"
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1">

            <div className="relative">
              <span className="buttonGlow"></span>
              <Link
                href="/login"
                className="relative text-gray-300 hover:text-teal-400 transition-colors px-4 py-2 rounded-md"
              >
                Iniciar sesión
              </Link>
            </div>

            <div className="relative">
              <span className="buttonGlow"></span>
              <Link
                href="/sign-up"
                className="relative  px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-full transition-colors"
              >
                Registrarse
              </Link>
            </div>

          </div>

        </div>
      </div>
    </nav>
  );
}
