'use client';

import Link from 'next/link';

export default function NavLink({ href, children, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="relative hover:text-black transition-colors duration-300 group"
    >
      <span className="relative z-10">{children}</span>

      <span
        className="absolute bottom-0 left-0 w-0 h-0.5 bg-black
                   group-hover:w-full transition-all duration-300"
      />
    </Link>
  );
}
