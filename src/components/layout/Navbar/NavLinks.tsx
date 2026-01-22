import Link from 'next/link';
import { NAV_LINKS } from './navbar.constants';

export function NavLinks() {
  return (
    <div className="hidden! md:flex! items-center gap-8 relative">
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
  );
}
